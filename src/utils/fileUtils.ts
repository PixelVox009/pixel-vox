"use server";

import axios from "axios";
import fs from "fs";
import path from "path";

// Hàm tải xuống file từ URL
export async function downloadFile(url: string, outputPath: string) {
  try {
    const dir = path.dirname(outputPath);

    // Tạo thư mục cha nếu chưa có
    await fs.promises.mkdir(dir, { recursive: true });

    const response = await axios.get(url, { responseType: "stream" });

    const writer = fs.createWriteStream(outputPath);

    return new Promise((resolve, reject) => {
      response.data.pipe(writer);

      writer.on("finish", () => {
        resolve(outputPath);
      });

      writer.on("error", (err) => {
        console.error(`Lỗi khi tải xuống: ${err.message}`);
        reject(err);
      });
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Lỗi khi tải file từ ${url}: ${error.message}`);
    } else {
      console.error(`Lỗi khi tải file từ ${url}: Không xác định`);
    }
    throw error;
  }
}
