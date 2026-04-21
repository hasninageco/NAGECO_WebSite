import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireApiRole } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const auth = await requireApiRole(["ADMIN", "EDITOR"]);
  if (auth.error) return auth.error;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : "";
  const uniqueFileName = `${Date.now()}-${randomUUID()}${extension}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, uniqueFileName), buffer);

  const url = `/uploads/${uniqueFileName}`;
  const media = await prisma.media.create({
    data: {
      fileName: uniqueFileName,
      url,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      uploadedById: auth.user.id
    }
  });

  return NextResponse.json(media, { status: 201 });
}