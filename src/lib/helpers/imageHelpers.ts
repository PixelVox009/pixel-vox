import { settingsService } from "../api/settings";


// Lấy tỉ lệ token ảnh
export async function fetchImageToTokenRate() {
  const { data: setting } = await settingsService.getSettings(
    "imageToTokenRate"
  );

  return +setting[0].value;
}
