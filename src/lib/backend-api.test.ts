import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  SubmissionApiError,
  submitGrievance,
  submitResume,
  type CandidatePayload,
  type GrievancePayload,
} from "./backend-api";

const successResponse = () =>
  ({
    ok: true,
    status: 200,
    json: async () => ({ id: "submission-id", status: "submitted" }),
  }) as Response;

describe("submission API", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(successResponse()));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("posts grievance JSON with the fresh Turnstile token", async () => {
    const payload: GrievancePayload = {
      name: "Example",
      phone: " 9876543210 ",
      email: " example@example.com ",
      topic: "roads_infrastructure",
      message: "Please repair the road",
      consent: true,
    };

    await submitGrievance(payload, "turnstile-token");

    const [url, options] = vi.mocked(fetch).mock.calls[0] ?? [];
    expect(url).toBe("https://omraje-email-backend.onrender.com/api/grievances");
    expect(options?.method).toBe("POST");
    expect(new Headers(options?.headers).get("Content-Type")).toBe("application/json");
    expect(new Headers(options?.headers).get("X-Turnstile-Token")).toBe("turnstile-token");
    expect(JSON.parse(options?.body as string)).toEqual({
      ...payload,
      phone: "9876543210",
      email: "example@example.com",
      consentTextVersion: "v1",
    });
  });

  it("submits a grievance without an email address", async () => {
    await submitGrievance(
      {
        name: "Example",
        phone: "9876543210",
        email: "",
        topic: "other",
        message: "Help!",
        consent: true,
      },
      "turnstile-token",
    );

    const body = vi.mocked(fetch).mock.calls[0]?.[1]?.body;
    expect(JSON.parse(body as string)).toMatchObject({ phone: "9876543210", email: "" });
  });

  it("posts resume data and an optional file without setting multipart Content-Type", async () => {
    const payload: CandidatePayload = {
      name: "Example Candidate",
      phone: "9876543210",
      email: "candidate@example.com",
      role: "job_seeker",
      town: "Dharashiv",
      consent: true,
    };
    const file = new File(["resume"], "resume.pdf", { type: "application/pdf" });

    await submitResume(payload, "turnstile-token", file);

    const [url, options] = vi.mocked(fetch).mock.calls[0] ?? [];
    expect(url).toBe("https://omraje-email-backend.onrender.com/api/applications");
    expect(new Headers(options?.headers).get("X-Turnstile-Token")).toBe("turnstile-token");
    expect(new Headers(options?.headers).has("Content-Type")).toBe(false);
    expect(options?.body).toBeInstanceOf(FormData);

    if (!(options?.body instanceof FormData)) throw new Error("Resume body must be FormData.");
    expect(options.body.get("data")).toBeInstanceOf(Blob);
    expect((options.body.get("data") as Blob).type).toBe("application/json");
    expect((options.body.get("file") as File).name).toBe("resume.pdf");
  });

  it("preserves separate email outcomes and treats missing statuses as unconfirmed", async () => {
    const payload: CandidatePayload = {
      name: "Candidate",
      phone: "9876543210",
      email: "candidate@example.com",
      role: "job_seeker",
      town: "Dharashiv",
      consent: true,
    };
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: "application-id",
        status: "submitted",
        emailStatus: "sent",
        resumeEmailStatus: "failed",
      }),
    } as Response);
    await expect(submitResume(payload, "token")).resolves.toMatchObject({
      id: "application-id",
      emailStatus: "sent",
      resumeEmailStatus: "failed",
    });
    await expect(submitResume(payload, "token")).resolves.toMatchObject({
      emailStatus: undefined,
      resumeEmailStatus: undefined,
    });
  });

  it("surfaces non-success HTTP statuses without assuming an error body", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({}),
    } as Response);

    await expect(
      submitGrievance(
        {
          name: "Example",
          phone: "9876543210",
          email: "",
          topic: "roads_infrastructure",
          message: "Please repair the road",
          consent: true,
        },
        "invalid-token",
      ),
    ).rejects.toBeInstanceOf(SubmissionApiError);
  });

  it("uses the configured HTTPS backend for submissions", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://api.example.com");
    const api = await import("./backend-api");

    await api.submitGrievance(
      {
        name: "Example",
        phone: "9876543210",
        email: "",
        topic: "other",
        message: "Help",
        consent: true,
      },
      "turnstile-token",
    );

    expect(vi.mocked(fetch).mock.calls[0]?.[0]).toBe("https://api.example.com/api/grievances");
  });

  it.each(["http://localhost:8081", "https://localhost", "https://127.0.0.1", "https://[::1]"])(
    "rejects a local backend URL: %s",
    async (url) => {
      vi.stubEnv("VITE_API_BASE_URL", url);
      const api = await import("./backend-api");

      await expect(
        api.submitGrievance(
          {
            name: "Example",
            phone: "9876543210",
            email: "",
            topic: "other",
            message: "Help",
            consent: true,
          },
          "turnstile-token",
        ),
      ).rejects.toThrow("VITE_API_BASE_URL");
      expect(fetch).not.toHaveBeenCalled();
    },
  );
});
