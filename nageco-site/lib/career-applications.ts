import { promises as fs } from "node:fs";
import path from "node:path";

export type CareerApplicationRecord = {
  id: string;
  submittedAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  positionAppliedFor: string;
  department?: string;
  yearsOfExperience?: string;
  currentLocation?: string;
  portfolioUrl?: string;
  message?: string;
  cvFileName: string;
  cvOriginalName: string;
  cvMimeType?: string;
  cvSize?: number;
};

const submissionsFile = path.join(process.cwd(), "storage", "career-applications", "submissions.ndjson");

export async function getCareerApplications(): Promise<CareerApplicationRecord[]> {
  try {
    const raw = await fs.readFile(submissionsFile, "utf8");

    return raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line) as CareerApplicationRecord;
        } catch {
          return null;
        }
      })
      .filter((item): item is CareerApplicationRecord => item !== null)
      .sort((a, b) => +new Date(b.submittedAt) - +new Date(a.submittedAt));
  } catch {
    return [];
  }
}
