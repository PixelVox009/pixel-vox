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
                AUDIO_SERVER_URL: data.data.AUDIO_SERVER_URL || "",
                AUDIO_SERVER_KEY: data.data.AUDIO_SERVER_KEY || "",
                IMAGE_SERVER_URL: data.data.IMAGE_SERVER_URL || "",
                IMAGE_SERVER_KEY: data.data.IMAGE_SERVER_KEY || ""
            }
            : {
                usdToTokenRate: parseFloat(data.usdToTokenRate),
                vndToUsdRate: parseFloat(data.vndToUsdRate),
                imageToTokenRate: parseFloat(data.imageToTokenRate || "5"),
                minuteToTokenRate: parseFloat(data.minuteToTokenRate || "30"),
                AUDIO_SERVER_URL: data.AUDIO_SERVER_URL || "",
                AUDIO_SERVER_KEY: data.AUDIO_SERVER_KEY || "",
                IMAGE_SERVER_URL: data.IMAGE_SERVER_URL || "",
                IMAGE_SERVER_KEY: data.IMAGE_SERVER_KEY || ""
            };
    },

    updateExchangeRates: async (rates: ExchangeRates): Promise<{ success: boolean }> => {
        const response = await api.put("/admin/settings", rates);
        return response.data;
    },

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