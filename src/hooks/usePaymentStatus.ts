import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Payment } from "@/types/payment";
import { ExchangeRates } from "@/types/month";
import { paymentService } from "@/lib/api/payment";

export const usePaymentStatus = (userId: string) => {
    const [latestPayment, setLatestPayment] = useState<Payment | null>(null);
    const [showNotification, setShowNotification] = useState(false);
    const [checkCount, setCheckCount] = useState(0);
    const { data: exchangeRates = { vndToUsdRate: 25000, usdToTokenRate: 10 } } = useQuery({
        queryKey: ["exchangeRates"],
        queryFn: paymentService.getExchangeRates,
        staleTime: 1000 * 60 * 60, 
        refetchOnWindowFocus: false,
    });

    // Query trạng thái thanh toán
    const { data, error, isLoading } = useQuery({
        queryKey: ["paymentStatus", userId],
        queryFn: () => paymentService.checkPaymentStatus(userId),
        refetchInterval: 30000,
        refetchOnWindowFocus: false,
        staleTime: 10000,
        enabled: !!userId,
    });

    useEffect(() => {
        if (data?.recentPayments && data.recentPayments.length > 0) {
            const mostRecentPayment = data.recentPayments.sort(
                (a: Payment, b: Payment) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )[0];

            if (!latestPayment || mostRecentPayment._id !== latestPayment._id) {
                setLatestPayment(mostRecentPayment);
                setShowNotification(true);
                const hideTimer = setTimeout(() => {
                    setShowNotification(false);
                }, 30000);
                return () => clearTimeout(hideTimer);
            }
        }

        if (!isLoading) {
            setCheckCount((prev) => prev + 1);
        }
    }, [data, latestPayment, isLoading]);

    useEffect(() => {
        const stopRefetchTimeout = setTimeout(() => {
        }, 10 * 60 * 1000);

        return () => clearTimeout(stopRefetchTimeout);
    }, []);

    const formatVndToUsd = (vndAmount: number) => {
        const rate = exchangeRates?.vndToUsdRate ?? 25000;
        const usdAmount = vndAmount / rate;
        return usdAmount.toFixed(2);
    };

    const hideNotification = () => {
        setShowNotification(false);
    };

    return {
        latestPayment,
        showNotification,
        checkCount,
        exchangeRates,
        error,
        isLoading,
        formatVndToUsd,
        hideNotification
    };
};