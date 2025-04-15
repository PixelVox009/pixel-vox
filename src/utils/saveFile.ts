import { api } from "./axios";
import { transliterate } from "transliteration";

export const saveFile = async (url: string, title: string) => {
  const response = await api.post(
    "/file/download",
    { url, title: transliterate(title) },
    {
      responseType: "blob",
      headers: { "Content-Type": "application/json" },
    }
  );
  const fileName =
    typeof response.headers.get === "function"
      ? response.headers.get("X-File-Name")
      : null;

  const blob = response.data;
  const blobUrl = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = fileName as string;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(blobUrl);
};
