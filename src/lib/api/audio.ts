import { api } from "@/utils/axios";

export const audioService = {
  getAudioList: async ({
    page = 1,
    limit = 10,
  }: {
    page: number;
    limit?: number;
  }) => {
    try {
      const { data } = await api.get("/audio", {
        params: {
          page,
          limit,
        },
      });
      return data;
    } catch (error) {
      console.error("Error fetching audio:", error);
      throw error;
    }
  },
  generateAudio: async ({
    textContent,
    voice,
  }: {
    textContent: string;
    voice: string;
  }) => {
    try {
      const { data } = await api.post("/audio/generate", {
        textContent,
        voice,
      });
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
