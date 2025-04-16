import { dashboardService } from "@/lib/api/dashboard";
import { useQuery } from "@tanstack/react-query";


export const useRecentTransactions = () => {
    const {
        data: recentTransactions,
        isLoading
    } = useQuery({
        queryKey: ["recent-transactions"],
        queryFn: dashboardService.getRecentTransactions,
    });

    return {
        recentTransactions,
        isLoading
    };
};