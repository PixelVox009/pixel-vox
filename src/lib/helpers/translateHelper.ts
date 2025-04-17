import { genai } from "@/utils/genai";

// Dịch text sang tiếng anh
export async function translateEnglish(text: string) {
  const resData = await genai.genContent(
    `Translate this to English: "${text}"`
  );
  return resData;
}
