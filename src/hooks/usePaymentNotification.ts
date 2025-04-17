import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { paymentService } from "@/lib/api/payment";


export const usePaymentNotification = (userId: string) => {
    const [transactionId, setTransactionId] = useState<string>(`QRPAY${Date.now()}`);
    useEffect(() => {
        setTransactionId(`QRPAY${Date.now()}`);
    }, []);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["paymentStatus", transactionId],
        queryFn: () => paymentService.verifyPayment(transactionId),
        enabled: !!userId && !!transactionId,
        refetchInterval: 10000, 
        refetchOnWindowFocus: true
    });

    const resetTransaction = () => {
        setTransactionId(`QRPAY${Date.now()}`);
    };

    return {
        transactionId,
        paymentStatus: data?.status,
        isLoading,
        refetch,
        resetTransaction
    };
};