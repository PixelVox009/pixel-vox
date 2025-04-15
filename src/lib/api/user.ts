import { api } from "@/utils/axios";

export const userService = {
  useToken: async (tokenNumber: number) => {
    try {
      const { data } = await api.post("/user/use-token", { tokenNumber });
      return data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },
};
