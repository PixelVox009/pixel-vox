import { genai } from "@/utils/genai";
import { settingService } from "../api/setting";

// Lấy tỉ lệ token trên phút
export async function fetchMinuteToTokenRate() {
  const { data: setting } = await settingService.getSettings(
    "minuteToTokenRate"
  );

  return +setting[0].value;
}

// Ước tính số ký tự đọc được mỗi phút
export async function estimateCharsPerMinute(title: string) {
  const resData = await genai.genContent(
    `Dựa trên tiêu đề sau: '${title}', xác định ngôn ngữ của nó và ước tính số ký tự có thể đọc được trong một phút theo tốc độ xử lý/ngôn ngữ tự nhiên của chính ChatGPT. Chỉ trả về một con số (ký tự mỗi phút), không thêm bất kỳ văn bản nào khác.`
  );
  return parseInt(resData ?? "0");
}
