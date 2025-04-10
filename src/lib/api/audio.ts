export const audioService = {
  getAudioList: async (page: number = 1, limit: number = 12): Promise<any> => {
    try {
      const { data } = await api.get("/api/audio", {
        params: { page, limit },
      });
      return data;
    } catch (error) {
      console.error("Error fetching audios:", error);
      throw error;
    }
  },
};
