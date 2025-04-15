import { api } from "@/utils/axios";

export const imageService = {
  getImageList: async () => {
    try {
      const { data } = await api.get("/image", {});
      return data;
    } catch (error) {
      console.error("Error fetching images:", error);
      throw error;
    }
  },
  generateImage: async ({
    title,
    textContent,
  }: {
    title: string;
    textContent: string;
  }) => {
    try {
      const { data } = await api.post("/image/generate", {
        title,
        textContent,
      });
      return data;
    } catch (error) {
      console.error("Error fetching images:", error);
      throw error;
    }
  },
  deleteImage: async (id: string) => {
    try {
      const { data } = await api.delete("/image/" + id);
      return data;
    } catch (error) {
      console.error("Error fetching images:", error);
      throw error;
    }
  },
};
