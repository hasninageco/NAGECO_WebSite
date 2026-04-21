import { promises as fs } from "node:fs";
import path from "node:path";
import type { ContactFeedbackRecord } from "@/lib/contact-feedback-types";

const feedbackFile = path.join(process.cwd(), "storage", "contact-feedback", "submissions.ndjson");

export async function getContactFeedbackRecords(): Promise<ContactFeedbackRecord[]> {
  try {
    const raw = await fs.readFile(feedbackFile, "utf8");

    return raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line) as ContactFeedbackRecord;
        } catch {
          return null;
        }
      })
      .filter((item): item is ContactFeedbackRecord => item !== null)
      .sort((a, b) => +new Date(b.submittedAt) - +new Date(a.submittedAt));
  } catch {
    return [];
  }
}

