import { paymentService } from "@/lib/api/payment";
import { useQuery } from "@tanstack/react-query";


export const useExchangeRates = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["exchangeRates"],
        queryFn: paymentService.getExchangeRates,
        staleTime: 1000 * 60 * 60, // 1 hour
        refetchOnWindowFocus: false,
        select: (data) => ({
            vndToUsdRate: data.vndToUsdRate || 25000,
            usdToTokenRate: data.usdToTokenRate || 10,
        })
    });

    return {
        rates: data || {
            vndToUsdRate: 25000,
            usdToTokenRate: 10,
        },
        isLoading,
        error
    };
};