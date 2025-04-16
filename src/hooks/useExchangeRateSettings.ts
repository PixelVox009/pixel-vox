import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ExchangeRates } from "@/types/month";
import { dashboardService } from "@/lib/api/dashboard";
import { settingsService } from "@/lib/api/settings";


export const useExchangeRateSettings = () => {
    const [newExchangeRates, setNewExchangeRates] = useState<ExchangeRates>({
        usdToTokenRate: 0,
        vndToUsdRate: 0,
        imageToTokenRate: 5,
        minuteToTokenRate: 30,
    });

    const queryClient = useQueryClient();

    // Fetch exchange rate settings
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
        }),
    });

    // Mutation for updating
    const updateRatesMutation = useMutation({
        mutationFn: settingsService.updateExchangeRates,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["exchange-rates"] });
            toast.success("Cập nhật tỉ giá thành công!");
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