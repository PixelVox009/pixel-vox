// services/transactions.service.ts

import { Transaction, TransactionResponse, TransactionStats } from "@/types/month";
import { UserData } from "@/types/users";
import { api } from "@/utils/axios";


export const transactionsService = {
    getTransactions: async (
        page = 1,
        limit = 10,
        userId?: string,
        startDate?: string,
        endDate?: string,
        type?: string
    ): Promise<TransactionResponse> => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (userId) params.append("userId", userId);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        if (type) params.append("type", type);

        const response = await api.get(`/admin/transactions?${params.toString()}`);
        return response.data;
    },

    getRecentTransactions: async (): Promise<Transaction[]> => {
        const response = await api.get("/admin/transactions?type=recent");
        return response.data.success ? response.data.data : [];
    },
    getUserTransactions: async (
        userId: string,
        page = 1,
        limit = 10
    ): Promise<TransactionResponse> => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        const response = await api.get(`/admin/users/${userId}/transactions?${params.toString()}`);
        return response.data;
    },
    getUserTransactionStats: async (
        userId: string,
        startDate?: string,
        endDate?: string
    ): Promise<TransactionStats> => {
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        const response = await api.get(`/admin/users/${userId}/transaction-stats?${params.toString()}`);
        return response.data;
    },
    fetchUserDetails: async (userId: string): Promise<UserData> => {
        const response = await api.get(`/admin/users/${userId}`);
        return response.data;
    },

    fetchUserTransactions: async (
        userId: string,
        type: string = "all",
        startDate?: string,
        endDate?: string,
        search: string = "",
        limit: number = 20
    ): Promise<TransactionResponse> => {
        const params = new URLSearchParams();
        params.append("limit", limit.toString());
        if (type !== "all") params.append("type", type);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        if (search) params.append("search", search);

        const { data } = await api.get(`/admin/users/${userId}/transactions?${params.toString()}`);
        if (data.hasMore === undefined) {
            data.hasMore = (data.transactions?.length || 0) >= limit;
        }
        console.log(data)
        return data;
    }
};