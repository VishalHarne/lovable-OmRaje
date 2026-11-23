import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { forwardRef, useEffect, useImperativeHandle, type AnchorHTMLAttributes } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    Link: ({ to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) => (
      <a href={to} {...props} />
    ),
  };
});

vi.mock("@/components/turnstile-widget", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components/turnstile-widget")>();
  return {
    ...actual,
    TurnstileWidget: forwardRef(function TestTurnstile(
      { onStatusChange }: { onStatusChange: (status: "ready") => void },
      ref,
    ) {
      useImperativeHandle(ref, () => ({ execute: async () => "token", reset: () => {} }));
      useEffect(() => onStatusChange("ready"), [onStatusChange]);
      return null;
    }),
  };
});

vi.mock("@/lib/backend-api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/backend-api")>();
  return { ...actual, submitResume: vi.fn() };
});

import { submitResume } from "@/lib/backend-api";
import { HomePage } from "@/routes/index";

describe("application email outcomes", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.resetAllMocks();
  });

  function mockAttachedFile() {
    const original = FormData.prototype.get;
    vi.spyOn(FormData.prototype, "get").mockImplementation(function (this: FormData, name: string) {
      return name === "file" ? new File(["resume"], "resume.pdf") : original.call(this, name);
    });
  }

  it.each([
    ["failed", "sent"],
    [undefined, undefined],
  ] as const)("warns without encouraging resubmission when email status is %s", async (resumeEmailStatus, emailStatus) => {
    vi.mocked(submitResume).mockResolvedValue({
      id: "application-id",
      status: "submitted",
      resumeEmailStatus,
      emailStatus,
    });
    mockAttachedFile();
    const { container } = render(<HomePage />);
    fireEvent.click(screen.getByRole("button", { name: "English" }));
    const form = container.querySelector<HTMLFormElement>("#register form");
    if (!form) throw new Error("Application form not found");
    const role = form.querySelector<HTMLSelectElement>('[name="role"]');
    const file = form.querySelector<HTMLInputElement>('[name="file"]');
    if (!role || !file) throw new Error("Application fields not found");
    fireEvent.change(role, { target: { value: "job_seeker" } });
    fireEvent.change(file, { target: { files: [new File(["resume"], "resume.pdf")] } });
    fireEvent.submit(form);

    await waitFor(() => expect(screen.getByText(/Application ID: application-id/)).toBeInTheDocument());
    expect(screen.getByRole("alert")).toHaveTextContent("delivery of your résumé to our team could not be confirmed");
    expect(screen.getByRole("alert")).toHaveTextContent("Please do not resubmit");
    expect(submitResume).toHaveBeenCalledOnce();
  });

  it("does not warn when both emails were accepted", async () => {
    vi.mocked(submitResume).mockResolvedValue({
      id: "application-id",
      status: "submitted",
      resumeEmailStatus: "sent",
      emailStatus: "sent",
    });
    mockAttachedFile();
    const { container } = render(<HomePage />);
    fireEvent.click(screen.getByRole("button", { name: "English" }));
    const form = container.querySelector<HTMLFormElement>("#register form");
    const role = form?.querySelector<HTMLSelectElement>('[name="role"]');
    const file = form?.querySelector<HTMLInputElement>('[name="file"]');
    if (!form || !role || !file) throw new Error("Application form not found");
    fireEvent.change(role, { target: { value: "job_seeker" } });
    fireEvent.change(file, { target: { files: [new File(["resume"], "resume.pdf")] } });
    fireEvent.submit(form);
    await waitFor(() => expect(screen.getByText(/Application ID: application-id/)).toBeInTheDocument());
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
