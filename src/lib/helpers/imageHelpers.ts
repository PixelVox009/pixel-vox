import { settingService } from "../api/setting";

// Lấy tỉ lệ token ảnh
export async function fetchImageToTokenRate() {
  const { data: setting } = await settingService.getSettings(
    "imageToTokenRate"
  );

  return +setting[0].value;
}
