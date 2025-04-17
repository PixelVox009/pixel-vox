import { dashboardService } from "@/lib/api/dashboard";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";


export const useTransactionStats = (initialStartDate: string, initialEndDate: string) => {
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);

    const {
        data: statsData,
        isLoading,
        refetch
    } = useQuery({
        queryKey: ["transaction-stats", startDate, endDate],
        queryFn: () => dashboardService.getTransactionStats(startDate, endDate),
    });
    const applyFilters = () => {
        refetch();
    };

    return {
        startDate,
        endDate,
        setStartDate,
        setEndDate,
        statsData: statsData?.data,
        isLoading,
        applyFilters
    };
};