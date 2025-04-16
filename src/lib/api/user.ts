import { TokenBalance } from "@/types/payment";
import { UserData, UsersResponse } from "@/types/users";
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
  fetchUsers: async (page = 1, limit = 10, search = "", role = ""): Promise<UsersResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) params.append("search", search);
    if (role) params.append("role", role);

    const response = await api.get(`/admin/users?${params.toString()}`);
    return response.data;
  },

  getUserById: async (userId: string): Promise<UserData> => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },
  giftTokensToUser: async (
    userId: string,
    walletId: string,
    tokens: number,
    description: string
  ): Promise<{ success: boolean }> => {
    const response = await api.post("/admin/payments/gift", {
      customer: userId,
      wallet: walletId,
      tokensEarned: tokens,
      description,
      type: "bonus",
      status: "success",
    });
    return response.data;
  },
  getTransactionHistory: async (type: string = "all", limit: number = 20): Promise<Transaction[]> => {
    try {
      const { data } = await api.get(`/user/transaction-history`, {
        params: { type, limit }
      });
      return data.transactions || [];
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      throw error;
    }
  },
  getTokenBalance: async (): Promise<TokenBalance> => {
    try {
      const { data } = await api.get("/user/token");
      return data;
    } catch (error) {
      console.error("Error fetching token balance:", error);
      throw error;
    }
  },
};
