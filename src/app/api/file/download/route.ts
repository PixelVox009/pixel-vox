import { NextRequest, NextResponse } from "next/server";
import mime from "mime-types";
import slugify from "slugify";

import path from "path";
import fs from "fs/promises";
import { downloadFile } from "@/utils/fileUtils";

export async function POST(req: NextRequest) {
  const { url, title } = await req.json();

  const ext = path.extname(url) || ".jpg";
  const fileName = `${
    slugify(title, { lower: true }) || "default-filename"
  }${ext}`;
  const uploadsPath = path.join(process.cwd(), "public", "uploads");
  const savePath = path.join(uploadsPath, fileName);

  // Tải về
  await downloadFile(url, savePath);

  // Đọc file
  const fileBuffer = await fs.readFile(savePath);
  const mimeType = mime.lookup(savePath) || "application/octet-stream";

  await fs.rm(uploadsPath, { recursive: true, force: true });

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": mimeType,
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Length": fileBuffer.length.toString(),
      "X-File-Name": fileName,
    },
  });
}
