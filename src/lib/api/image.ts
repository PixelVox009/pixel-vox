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
};
