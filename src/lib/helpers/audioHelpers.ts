import { genai } from "@/utils/genai";
import { settingsService } from "../api/settings";


// Lấy tỉ lệ token trên phút
export async function fetchMinuteToTokenRate() {
  const { data: setting } = await settingsService.getSettings(
    "minuteToTokenRate"
  );

  return +setting[0].value;
}

// Ước tính số ký tự đọc được mỗi phút
export async function estimateCharsPerMinute(title: string) {
  try {
    const resData = await genai.genContent(
      `Phân tích tiêu đề sau: '${title}' và xác định ngôn ngữ của nó. Dựa trên ngôn ngữ đã xác định, hãy trả về số ký tự trung bình mà một người đọc với tốc độ bình thường có thể đọc trong một phút.
      Tham khảo:
      - Tiếng Việt: khoảng 800-1000 ký tự/phút
      - Tiếng Anh: khoảng 900-1100 ký tự/phút
      - Tiếng Trung: khoảng 260-300 ký tự/phút
      - Tiếng Nhật: khoảng 400-500 ký tự/phút
      Nếu là ngôn ngữ khác, hãy ước tính dựa trên độ phức tạp của ngôn ngữ.
      CHỈ TRẢ VỀ MỘT CON SỐ duy nhất (không kèm chữ hay ký tự khác). Ví dụ: "900" hoặc "350" hoặc "1000".`
    );
    const parsedValue = parseInt(resData || "0");
    return isNaN(parsedValue) || parsedValue < 0 ? 0 : parsedValue;
  } catch (error) {
    console.error("Error estimating chars per minute:", error);
    return 0;
  }
}
