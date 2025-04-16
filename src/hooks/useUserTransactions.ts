
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useTransactions } from "@/hooks/useTransactions";
import { useTransactionStats } from "@/hooks/useTransactionStats";
import { transactionsService } from "@/lib/api/transactions";

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
    const handleDateRangeChange = (range: DateRange | undefined) => {
        setDateRange(range);
        if (range?.from) setStartDate(range.from);
        if (range?.to) setEndDate(range.to);
    };
    const formattedStartDate = startDate ? format(startDate, "yyyy-MM-dd") : undefined;
    const formattedEndDate = endDate ? format(endDate, "yyyy-MM-dd") : undefined;
    const {
        statsData,
        isLoading: isStatsLoading,
        applyFilters
    } = useTransactionStats(
        formattedStartDate || format(addDays(new Date(), -30), "yyyy-MM-dd"),
        formattedEndDate || format(new Date(), "yyyy-MM-dd")
    );
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
        applyFilters();
    };

    // Function để load thêm transactions
    const handleLoadMore = () => {
        const newPage = Math.ceil((transactionsData?.transactions?.length || 0) / 20) + 1;
        setPage(newPage);
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
        hasMore: transactionsData?.hasMore || false
    };
};