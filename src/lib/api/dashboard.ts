import { RecentTransaction, StatsResponse } from "@/types/dashboard";
import { api } from "@/utils/axios";


export const dashboardService = {
    getTransactionStats: async (startDate: string, endDate: string): Promise<{ data: StatsResponse }> => {
        const response = await api.get(`/admin/transactions?startDate=${startDate}&endDate=${endDate}`);
        return response.data;
    },

    getRecentTransactions: async (): Promise<RecentTransaction[]> => {
        const response = await api.get("/admin/transactions?type=recent");
        return response.data.success ? response.data.data : [];
    },
};