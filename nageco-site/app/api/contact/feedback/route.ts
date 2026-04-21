import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

type FeedbackPayload = {
  fullName?: string;
  email?: string;
  company?: string;
  topic?: string;
  message?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as FeedbackPayload | null;
    const fullName = String(body?.fullName ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const company = String(body?.company ?? "").trim();
    const topic = String(body?.topic ?? "General Inquiry").trim();
    const message = String(body?.message ?? "").trim();

    if (!fullName || !email || !message) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    const submissionsDir = path.join(process.cwd(), "storage", "contact-feedback");
    await fs.mkdir(submissionsDir, { recursive: true });

    const record = {
      id: randomUUID(),
      submittedAt: new Date().toISOString(),
      fullName,
      email,
      company,
      topic,
      message
    };

    await fs.appendFile(path.join(submissionsDir, "submissions.ndjson"), `${JSON.stringify(record)}\n`, "utf8");

    return NextResponse.json({ message: "Thanks for contacting NAGECO. We will get back to you soon." }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unexpected server error while sending your message." }, { status: 500 });
  }
}

