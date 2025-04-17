import { PaymentCheckResponse } from "@/types/payment";
import { api } from "@/utils/axios";

export const paymentService = {
    getExchangeRates: async () => {
        try {
            const { data } = await api.get("/settings/exchange-rates");
            return data;
        } catch (error) {
            console.error("Error fetching exchange rates:", error);
            throw error;
        }
    },

    createBankTransfer: async (payload: {
        amount: number;
        transferContent: string;
        userId: string;
        transactionId: string;
    }) => {
        try {
            const { data } = await api.post("/payments/bank-transfer", payload);
            return data;
        } catch (error) {
            console.error("Error creating bank transfer:", error);
            throw error;
        }
    },

    verifyPayment: async (transactionId: string) => {
        try {
            const { data } = await api.get(`/payments/verify/${transactionId}`);
            return data;
        } catch (error) {
            console.error("Error verifying payment:", error);
            throw error;
        }
    },

    getPaymentList: async (params?: Record<string, unknown>) => {
        try {
            const { data } = await api.get("/admin/payments", { params });
            return data;
        } catch (error) {
            console.error("Error fetching payments:", error);
            throw error;
        }
    },
    
    checkPaymentStatus: async (userId: string): Promise<PaymentCheckResponse> => {
        try {
            const { data } = await api.get(`/credits/check-payment?userId=${userId}`);
            return data;
        } catch (error) {
            console.error("Error checking payment status:", error);
            throw error;
        }
    },
};