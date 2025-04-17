import { ExchangeRates } from "@/types/month";
import { api } from "@/utils/axios";

export const settingsService = {
    getExchangeRates: async (): Promise<ExchangeRates> => {
        const response = await api.get("/admin/settings");
        const data = response.data;
        return data.success
            ? {
                usdToTokenRate: parseFloat(data.data.usdToTokenRate),
                vndToUsdRate: parseFloat(data.data.vndToUsdRate),
                imageToTokenRate: parseFloat(data.data.imageToTokenRate || "5"),
                minuteToTokenRate: parseFloat(data.data.minuteToTokenRate || "30"),
            }
            : {
                usdToTokenRate: parseFloat(data.usdToTokenRate),
                vndToUsdRate: parseFloat(data.vndToUsdRate),
                imageToTokenRate: parseFloat(data.imageToTokenRate || "5"),
                minuteToTokenRate: parseFloat(data.minuteToTokenRate || "30"),
            };
    },

    updateExchangeRates: async (rates: ExchangeRates): Promise<{ success: boolean }> => {
        const response = await api.put("/admin/settings", rates);
        return response.data;
    },
};