import { promises as fs } from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/api-auth";

const allowedExtensions = new Set([".pdf", ".doc", ".docx"]);

const mimeByExtension: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
};

export async function GET(request: NextRequest) {
  const auth = await requireApiRole(["ADMIN", "EDITOR", "VIEWER"]);
  if (auth.error) return auth.error;

  const fileName = request.nextUrl.searchParams.get("file") || "";
  const safeFileName = path.basename(fileName);

  if (!safeFileName || safeFileName !== fileName) {
    return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
  }

  const extension = path.extname(safeFileName).toLowerCase();
  if (!allowedExtensions.has(extension)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "storage", "career-applications", "cv", safeFileName);

  try {
    const fileBuffer = await fs.readFile(filePath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": mimeByExtension[extension] ?? "application/octet-stream",
        "Content-Disposition": `attachment; filename="${safeFileName}"`,
        "Cache-Control": "private, no-store"
      }
    });
  } catch {
    return NextResponse.json({ error: "CV file not found" }, { status: 404 });
  }
}
