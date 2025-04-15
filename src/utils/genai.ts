import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyCVow2f9OcpR_GRse_T5KR3RtyUjP04zB4",
});

const genContent = async (content: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: content,
  });

  return response.text;
};

export const genai = { genContent };
