const DEFAULT_API_BASE_URL = "https://omraje-email-backend.onrender.com";
const configuredApiBaseUrl = import.meta.env["VITE_API_BASE_URL"]?.trim();
const API_BASE_URL = configuredApiBaseUrl || DEFAULT_API_BASE_URL;

export const grievanceTopics = [
  "roads_infrastructure",
  "water_agriculture",
  "public_services",
  "employment",
  "other",
] as const;

export type CandidateRole = "job_seeker" | "employer";

export interface CandidatePayload {
  name: string;
  phone: string;
  email: string;
  role: CandidateRole;
  town: string;
  consent: boolean;
}

export interface GrievancePayload {
  name: string;
  phone: string;
  email: string;
  topic: (typeof grievanceTopics)[number];
  message: string;
  consent: boolean;
}

export interface SubmissionResponse {
  id: string;
  status: "received" | "submitted";
}

export class SubmissionApiError extends Error {
  constructor(readonly status: number) {
    super(`Submission request failed with status ${status}`);
    this.name = "SubmissionApiError";
  }
}

function getApiUrl(path: string) {
  let baseUrl: URL;
  try {
    baseUrl = new URL(API_BASE_URL);
  } catch {
    throw new Error("VITE_API_BASE_URL must be a valid HTTPS URL.");
  }

  if (baseUrl.protocol !== "https:") {
    throw new Error("VITE_API_BASE_URL must use HTTPS.");
  }
  if (
    baseUrl.hostname === "localhost" ||
    baseUrl.hostname.endsWith(".localhost") ||
    baseUrl.hostname.startsWith("127.") ||
    baseUrl.hostname === "[::1]"
  ) {
    throw new Error("VITE_API_BASE_URL must not point to localhost.");
  }

  return new URL(path, `${baseUrl.toString().replace(/\/+$/, "")}/`).toString();
}

function isSubmissionResponse(value: unknown): value is SubmissionResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "status" in value &&
    (value.status === "received" || value.status === "submitted")
  );
}

async function submit(path: string, token: string, body: BodyInit, contentType?: string) {
  if (!token.trim()) throw new Error("A fresh Turnstile token is required.");

  const headers = new Headers({
    Accept: "application/json",
    "X-Turnstile-Token": token,
  });
  if (contentType) headers.set("Content-Type", contentType);

  const response = await fetch(getApiUrl(path), {
    method: "POST",
    headers,
    body,
  });

  if (!response.ok) throw new SubmissionApiError(response.status);

  const result: unknown = await response.json();
  if (!isSubmissionResponse(result)) {
    throw new Error("The submission API returned an unexpected response.");
  }
  return result;
}

const CONSENT_TEXT_VERSION = import.meta.env["VITE_CONSENT_TEXT_VERSION"]?.trim() || "v1";

export const submitGrievance = (payload: GrievancePayload, token: string) => {
  const body = {
    ...payload,
    phone: payload.phone.trim(),
    email: payload.email.trim(),
    consentTextVersion: CONSENT_TEXT_VERSION,
  };
  return submit("/api/grievances", token, JSON.stringify(body), "application/json");
};

export const submitResume = (payload: CandidatePayload, token: string, file?: File) => {
  const body = new FormData();
  body.append(
    "data",
    new Blob([JSON.stringify({ ...payload, consentTextVersion: CONSENT_TEXT_VERSION })], {
      type: "application/json",
    }),
  );
  if (file) body.append("file", file);

  return submit("/api/applications", token, body);
};
