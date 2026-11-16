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
    json: async () => ({ id: "submission-id", status: "sent" }),
  }) as Response;

describe("submission API", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(successResponse()));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts grievance JSON with the fresh Turnstile token", async () => {
    const payload: GrievancePayload = {
      name: "Example",
      contact: "example@example.com",
      topic: "roads_infrastructure",
      message: "Please repair the road",
      consent: true,
    };

    await submitGrievance(payload, "turnstile-token");

    const [url, options] = vi.mocked(fetch).mock.calls[0] ?? [];
    expect(url).toBe("https://omraje-email-backend.onrender.com/submitgrievances");
    expect(options?.method).toBe("POST");
    expect(new Headers(options?.headers).get("Content-Type")).toBe("application/json");
    expect(new Headers(options?.headers).get("X-Turnstile-Token")).toBe("turnstile-token");
    expect(options?.body).toBe(JSON.stringify(payload));
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
    expect(url).toBe("https://omraje-email-backend.onrender.com/submitResume");
    expect(new Headers(options?.headers).get("X-Turnstile-Token")).toBe("turnstile-token");
    expect(new Headers(options?.headers).has("Content-Type")).toBe(false);
    expect(options?.body).toBeInstanceOf(FormData);

    if (!(options?.body instanceof FormData)) throw new Error("Resume body must be FormData.");
    expect(options.body.get("data")).toBeInstanceOf(Blob);
    expect((options.body.get("data") as Blob).type).toBe("application/json");
    expect((options.body.get("file") as File).name).toBe("resume.pdf");
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
          contact: "example@example.com",
          topic: "roads_infrastructure",
          message: "Please repair the road",
          consent: true,
        },
        "invalid-token",
      ),
    ).rejects.toBeInstanceOf(SubmissionApiError);
  });
});
