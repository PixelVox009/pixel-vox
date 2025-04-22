import { settingsService } from "@/lib/api/settings";
import { ExchangeRates } from "@/types/month";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";


export const useExchangeRateSettings = () => {
    const [newExchangeRates, setNewExchangeRates] = useState<ExchangeRates>({
        usdToTokenRate: 0,
        vndToUsdRate: 0,
        imageToTokenRate: 5,
        minuteToTokenRate: 30,
        AUDIO_SERVER_URL: "",
        AUDIO_SERVER_KEY: "",
        IMAGE_SERVER_URL: "",
        IMAGE_SERVER_KEY: "",
    });

    const queryClient = useQueryClient();

    const {
        data: exchangeRates,
        isLoading
    } = useQuery({
        queryKey: ["exchange-rates"],
        queryFn: settingsService.getExchangeRates,
        select: (data) => ({
            usdToTokenRate: data.usdToTokenRate || 0,
            vndToUsdRate: data.vndToUsdRate || 0,
            imageToTokenRate: data.imageToTokenRate || 5,
            minuteToTokenRate: data.minuteToTokenRate || 30,
            AUDIO_SERVER_URL: data.AUDIO_SERVER_URL || "",
            AUDIO_SERVER_KEY: data.AUDIO_SERVER_KEY || "",
            IMAGE_SERVER_URL: data.IMAGE_SERVER_URL || "",
            IMAGE_SERVER_KEY: data.IMAGE_SERVER_KEY || "",
        }),
    });

    // Mutation for updating
    const updateRatesMutation = useMutation({
        mutationFn: settingsService.updateExchangeRates,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["exchange-rates"] });
            toast.success("Cập nhật thành công!");
        },
        onError: (error: Error) => {
            toast.error("Lỗi khi cập nhật tỉ giá: " + error.message);
        },
    });

    // Sync newExchangeRates with fetched data
    useEffect(() => {
        if (exchangeRates) {
            setNewExchangeRates({
                usdToTokenRate: exchangeRates.usdToTokenRate,
                vndToUsdRate: exchangeRates.vndToUsdRate,
                imageToTokenRate: exchangeRates.imageToTokenRate,
                minuteToTokenRate: exchangeRates.minuteToTokenRate,
                AUDIO_SERVER_URL: exchangeRates.AUDIO_SERVER_URL,
                AUDIO_SERVER_KEY: exchangeRates.AUDIO_SERVER_KEY,
                IMAGE_SERVER_URL: exchangeRates.IMAGE_SERVER_URL,
                IMAGE_SERVER_KEY: exchangeRates.IMAGE_SERVER_KEY
            });
        }
    }, [exchangeRates]);

    const formatCurrency = (amount?: number) => {
        return amount?.toLocaleString("vi-VN") || "0";
    };

    return {
        exchangeRates,
        newExchangeRates,
        setNewExchangeRates,
        updateRates: () => updateRatesMutation.mutate(newExchangeRates),
        isUpdating: updateRatesMutation.isPending,
        isLoading,
        formatCurrency
    };
};