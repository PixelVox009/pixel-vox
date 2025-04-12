import { api } from "@/utils/axios";

export const audioService = {
  getAudioList: async () => {
    try {
      const { data } = await api.get("/audio", {});
      return data;
    } catch (error) {
      console.error("Error fetching audio:", error);
      throw error;
    }
  },
  generateAudio: async (textContent: string) => {
    try {
      const { data } = await api.post("/audio/generate", { textContent });
      return data;
    } catch (error) {
      console.error("Error fetching audio:", error);
      throw error;
    }
  },
  deleteAudio: async (id: string) => {
    try {
      const { data } = await api.delete("/audio/" + id);
      return data;
    } catch (error) {
      console.error("Error fetching audio:", error);
      throw error;
    }
  },
};
