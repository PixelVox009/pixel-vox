import { transactionsService } from "@/lib/api/transactions";
import { useQuery } from "@tanstack/react-query";


export const useUserDetails = (userId: string) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["user", userId],
        queryFn: () => transactionsService.fetchUserDetails(userId),
        enabled: !!userId,
    });

    const getInitials = (name: string) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((part) => part.charAt(0))
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };
    return {
        userData: data,
        isLoading,
        error,
        getInitials,
    };
};