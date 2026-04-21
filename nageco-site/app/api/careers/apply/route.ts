import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

const ACCEPTED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

const ACCEPTED_EXTENSIONS = new Set([".pdf", ".doc", ".docx"]);
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function hasAcceptedCvType(file: File) {
  const extension = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase() : "";
  return ACCEPTED_MIME_TYPES.has(file.type) || ACCEPTED_EXTENSIONS.has(extension);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const firstName = String(formData.get("firstName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phoneNumber = String(formData.get("phoneNumber") || "").trim();
    const positionAppliedFor = String(formData.get("positionAppliedFor") || "").trim();
    const department = String(formData.get("department") || "").trim();
    const yearsOfExperience = String(formData.get("yearsOfExperience") || "").trim();
    const currentLocation = String(formData.get("currentLocation") || "").trim();
    const portfolioUrl = String(formData.get("portfolioUrl") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const consent = String(formData.get("consent") || "false") === "true";

    const cv = formData.get("cv");

    if (!firstName || !lastName || !email || !phoneNumber || !positionAppliedFor) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    if (!consent) {
      return NextResponse.json({ error: "Consent is required before submitting." }, { status: 400 });
    }

    if (!(cv instanceof File)) {
      return NextResponse.json({ error: "CV file is required." }, { status: 400 });
    }

    if (!hasAcceptedCvType(cv)) {
      return NextResponse.json({ error: "CV must be .pdf, .doc, or .docx." }, { status: 400 });
    }

    if (cv.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "CV file must be 5MB or smaller." }, { status: 400 });
    }

    const extension = cv.name.includes(".") ? cv.name.slice(cv.name.lastIndexOf(".")).toLowerCase() : "";
    const uniqueName = `${Date.now()}-${randomUUID()}${extension}`;

    const uploadDir = path.join(process.cwd(), "storage", "career-applications", "cv");
    await fs.mkdir(uploadDir, { recursive: true });

    const cvBuffer = Buffer.from(await cv.arrayBuffer());
    const cvPath = path.join(uploadDir, uniqueName);
    await fs.writeFile(cvPath, cvBuffer);

    const submissionsDir = path.join(process.cwd(), "storage", "career-applications");
    await fs.mkdir(submissionsDir, { recursive: true });

    const submissionRecord = {
      id: randomUUID(),
      submittedAt: new Date().toISOString(),
      firstName,
      lastName,
      email,
      phoneNumber,
      positionAppliedFor,
      department,
      yearsOfExperience,
      currentLocation,
      portfolioUrl,
      message,
      cvFileName: uniqueName,
      cvOriginalName: cv.name,
      cvMimeType: cv.type,
      cvSize: cv.size
    };

    await fs.appendFile(path.join(submissionsDir, "submissions.ndjson"), `${JSON.stringify(submissionRecord)}\n`, "utf8");

    return NextResponse.json({ message: "Your application has been submitted successfully." }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unexpected server error while submitting application." }, { status: 500 });
  }
}
