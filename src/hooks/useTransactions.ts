"use client"
import { paymentService } from "@/lib/api/payment";
import { useExchangeRates } from "@/utils/formatVndUseDola";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import { useState } from "react";

export function useTransactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const { rates } = useExchangeRates();
  const formattedStartDate = startDate ? format(startDate, "yyyy-MM-dd") : undefined;
  const formattedEndDate = endDate ? format(endDate, "yyyy-MM-dd") : undefined;

  const queryKey = [
    "transactions",
    { page, limit, searchTerm, selectedType, formattedStartDate, formattedEndDate },
  ];

  // Hàm fetch với xử lý lỗi tốt hơn
  const fetchTransactions = async () => {
    try {
      const params: Record<string, unknown> = {
        page,
        limit,
      };

      if (searchTerm) params.search = searchTerm;
      if (selectedType !== "all") params.type = selectedType;
      if (formattedStartDate) params.startDate = formattedStartDate;
      if (formattedEndDate) params.endDate = formattedEndDate;
      const response = await paymentService.getPaymentList(params);
      return response;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  };

  const {
    data,
    isLoading: loading,
    refetch,
    error
  } = useQuery({
    queryKey,
    queryFn: fetchTransactions,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  if (error) {
    console.error("Query error:", error);
  }
  const transactions = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalTransactions = data?.total || 0;

  // Các hàm xử lý
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSearch = () => {
    setPage(1);
    refetch();
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      params.append("limit", "1000");
      if (selectedType !== "all") params.append("type", selectedType);
      if (formattedStartDate) params.append("startDate", formattedStartDate);
      if (formattedEndDate) params.append("endDate", formattedEndDate);
      if (searchTerm) params.append("search", searchTerm);
      params.append("export", "true");
      window.open(`/api/user/payments/activities/export?${params.toString()}`, "_blank");
    } catch (error) {
      console.error("Error exporting transactions:", error);
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    transactions,
    loading,
    page,
    setPage,
    totalPages,
    limit,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    totalTransactions,
    rates,
    handlePageChange,
    handleSearch,
    handleExport,
    refetch,
    error,
  };
}