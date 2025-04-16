import { useCallback, useEffect, useState } from "react";
import { subDays } from "date-fns";
import { useExchangeRates } from "@/utils/formatVndUseDola";

export const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "bank", label: "Bank Payment" },
  { value: "bonus", label: "Bonus" },
  { value: "token_usage", label: "Token Usage" },
];

export function useTransactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(25);
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [totalTransactions, setTotalTransactions] = useState(0);
  const { rates } = useExchangeRates();

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      if (searchTerm) params.append("search", searchTerm);
      if (selectedType !== "all") params.append("type", selectedType);
      if (startDate) params.append("startDate", startDate.toISOString());
      if (endDate) params.append("endDate", endDate.toISOString());

      const response = await fetch(`/api/admin/payments?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch transactions");

      const data: TransactionResponse = await response.json();
      setTransactions(data.data);
      setTotalPages(data?.pagination?.totalPages);
      setTotalTransactions(data.pagination.total);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, selectedType, startDate, endDate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handlePageChange = (newPage: number) => setPage(newPage);

  const handleSearch = () => {
    setPage(1);
    fetchTransactions();
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      params.append("limit", "1000");
      if (selectedType !== "all") params.append("type", selectedType);
      if (startDate) params.append("startDate", startDate.toISOString());
      if (endDate) params.append("endDate", endDate.toISOString());
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
    fetchTransactions,
  };
}