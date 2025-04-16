import { userService } from "@/lib/api/user";
import { useTokenStore } from "@/lib/store";
import { TokenBalance } from "@/types/payment";
import { useQuery } from "@tanstack/react-query";

export interface CreditsDetails {
    remaining: number;
    membership: number;
    topup: number;
    bonus: number;
}

export const useTokenData = (activeTransactionTab: string = "all") => {
    // Lấy state từ token store
    const { tokenBalance } = useTokenStore();

    // Query token balance
    const {
        data: balanceData,
        isLoading: isBalanceLoading,
    } = useQuery<TokenBalance>({
        queryKey: ["tokenBalance"],
        queryFn: userService.getTokenBalance,
        refetchOnWindowFocus: false,
        staleTime: 60000, // 1 minute
    });

    // Query transaction history
    const {
        data: transactionHistory = [],
        isLoading: isHistoryLoading,
    } = useQuery<Transaction[]>({
        queryKey: ["transactionHistory", activeTransactionTab],
        queryFn: () => userService.getTransactionHistory(activeTransactionTab),
        refetchOnWindowFocus: false,
        staleTime: 60000,
    });

    // Tính toán credits details
    const creditsDetails: CreditsDetails | null = balanceData
        ? {
            remaining: balanceData.balance || 0,
            membership: 0,
            topup: balanceData.totalRecharged || 0,
            bonus: Math.max(0, (balanceData.balance || 0) - (balanceData.totalRecharged || 0)),
        }
        : null;

    return {
        tokenBalance,
        balanceData,
        isBalanceLoading,
        transactionHistory,
        isHistoryLoading,
        creditsDetails,
        isLoading: isBalanceLoading || isHistoryLoading,
    };
};
