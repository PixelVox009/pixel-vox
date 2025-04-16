import { useState } from "react";
import { subDays } from "date-fns";
import { useExchangeRates } from "@/utils/formatVndUseDola";
import { paymentService } from "@/lib/api/payment";
import { useQuery } from "@tanstack/react-query";

export const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "bank", label: "Bank Payment" },
  { value: "bonus", label: "Bonus" },
  { value: "token_usage", label: "Token Usage" },
];

export function useTransactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const { rates } = useExchangeRates();

  // Tạo key duy nhất cho query dựa trên các filter
  const queryKey = [
    "transactions",
    { page, limit, searchTerm, selectedType, startDate, endDate },
  ];

  // Hàm fetch
  const fetchTransactions = async () => {
    const params: Record<string, unknown> = {
      page,
      limit,
    };
    if (searchTerm) params.search = searchTerm;
    if (selectedType !== "all") params.type = selectedType;
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();

    const response = await paymentService.getPaymentList(params);
    if (!response.ok) throw new Error("Failed to fetch transactions");
    const data: TransactionResponse = await response.json();
    return data;
  };

  // Sử dụng useQuery
  const {
    data,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: fetchTransactions,
  });

  // Lấy dữ liệu từ data
  const transactions = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;
  const totalTransactions = data?.pagination?.total ?? 0;

  // Các hàm xử lý
  const handlePageChange = (newPage: number) => setPage(newPage);

  const handleSearch = () => {
    setPage(1);
    refetch();
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
    refetch, // dùng để refetch nếu cần
  };
}