// export const runtime = "nodejs";

import { downloadFile } from "@/utils/fileUtils";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  console.log("🚀 ~ POST ~ url:", url);
  const savedPath = await downloadFile(
    url,
    "c:/Users/hoant/Downloads/image.jpg"
  );

  return Response.json({ path: savedPath });
}
