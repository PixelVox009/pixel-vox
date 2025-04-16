import { api } from "@/utils/axios";

export const settingService = {
  getSettings: async (...keys: string[]) => {
    try {
      const { data } = await api.get("/settings", {
        params: {
          key: keys.join(","),
        },
      });
      return data;
    } catch (error) {
      console.error("Error fetching settings:", error);
      throw error;
    }
  },
};
