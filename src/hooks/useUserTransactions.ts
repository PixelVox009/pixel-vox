import { useTransactions } from "@/hooks/useTransactions";
import { transactionsService } from "@/lib/api/transactions";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";

export const useUserTransactions = (userId: string) => {
    const {
        searchTerm: searchQuery,
        setSearchTerm: setSearchQuery,
        selectedType: transactionType,
        setSelectedType: setTransactionType,
        loading: isGeneralLoading,
        startDate,
        endDate,
        setStartDate,
        setEndDate,
        limit,
        setPage,
    } = useTransactions();

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: startDate,
        to: endDate,
    });

    const [page, setCurrentPage] = useState(1);

    const handleDateRangeChange = (range: DateRange | undefined) => {
        if (range) {
            setDateRange(range);
            if (range.from) setStartDate(range.from);
            if (range.to) setEndDate(range.to);
        }
    };

    const formattedStartDate = startDate ? format(startDate, "yyyy-MM-dd") : undefined;
    const formattedEndDate = endDate ? format(endDate, "yyyy-MM-dd") : undefined;

    // Thay thế useTransactionStats bằng API getUserTransactions
    const {
        data: statsData,
        isLoading: isStatsLoading,
        refetch: refetchStats,
    } = useQuery({
        queryKey: ["userTransactionStats", userId, page, limit],
        queryFn: () => transactionsService.getUserTransactionStats(
            userId,
            formattedStartDate,
            formattedEndDate,
        ),
        enabled: !!userId,
    });
    console.log(statsData)
    const {
        data: transactionsData,
        isLoading: isTransactionsLoading,
        refetch: refetchTransactions,
    } = useQuery({
        queryKey: ["userTransactions", userId, transactionType, formattedStartDate, formattedEndDate, searchQuery, limit],
        queryFn: () => transactionsService.fetchUserTransactions(
            userId,
            transactionType === "all" ? undefined : transactionType,
            formattedStartDate,
            formattedEndDate,
            searchQuery,
            limit
        ),
        enabled: !!userId,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        refetchTransactions();
        refetchStats(); // Gọi refetch cho API thống kê mới
    };

    // Function để load thêm transactions
    const handleLoadMore = () => {
        const newPage = Math.ceil((transactionsData?.transactions?.length || 0) / 20) + 1;
        setPage(newPage);
        setCurrentPage(newPage);
    };

    return {
        transactionsData,
        statsData,
        isLoading: isTransactionsLoading || isGeneralLoading,
        isStatsLoading,
        transactionType,
        setTransactionType,
        searchQuery,
        setSearchQuery,
        dateRange,
        setDateRange: handleDateRangeChange,
        limit,
        handleSearch,
        handleLoadMore,
        hasMore: transactionsData?.hasMore ?? false
    };
};