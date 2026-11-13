const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8081").replace(/\/$/, "");

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
  mobileNumber: string;
  email?: string;
  role: CandidateRole;
  town: string;
  consent: boolean;
}

export interface GrievancePayload {
  name: string;
  contact: string;
  topic: (typeof grievanceTopics)[number];
  message: string;
  consent: boolean;
}

async function post(path: string, payload: unknown) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json();
}

export const registerCandidate = (payload: CandidatePayload) => post("/api/job-fair/register", payload);

export const submitGrievance = (payload: GrievancePayload) => post("/api/grievances", payload);
