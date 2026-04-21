import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireApiRole } from "@/lib/api-auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const auth = await requireApiRole(["ADMIN", "EDITOR"]);
  if (auth.error) return auth.error;

  const formData = await request.formData();
  const files = formData
    .getAll("files")
    .filter((entry): entry is File => entry instanceof File);

  if (files.length === 0) {
    const singleFile = formData.get("file");
    if (singleFile instanceof File) {
      files.push(singleFile);
    }
  }

  if (files.length === 0) {
    return NextResponse.json({ error: "Image file is required" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "partner-logos");
  await fs.mkdir(uploadDir, { recursive: true });

  const uploadedUrls: string[] = [];

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Each file must be 5MB or smaller" }, { status: 400 });
    }

    const extension = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase() : ".png";
    const fileName = `${Date.now()}-${randomUUID()}${extension}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(uploadDir, fileName), buffer);
    uploadedUrls.push(`/uploads/partner-logos/${fileName}`);
  }

  return NextResponse.json({ urls: uploadedUrls, url: uploadedUrls[0] }, { status: 201 });
}
