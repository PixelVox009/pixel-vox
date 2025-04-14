"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatVndToUsd, useExchangeRates } from "@/utils/formatVndUseDola";
import { format, subDays } from "date-fns";
import { ArrowDown, Calendar as CalendarIcon, CreditCard, Download, Gift, RefreshCcw, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// Định nghĩa kiểu dữ liệu cho giao dịch
interface Transaction {
  _id: string;
  transaction: string;
  oldBalance: number;
  newBalance: number;
  customer: string;
  wallet: string;
  amount: number;
  type: string;
  status: string;
  description: string;
  depositDiscountPercent: number;
  tokensEarned: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Interface cho response API
interface TransactionResponse {
  data: Transaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function TransactionHistory() {
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
  // Tùy chọn lọc type
  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "bank", label: "Bank Payment" },
    { value: "bonus", label: "Bonus" },
    { value: "token_usage", label: "Token Usage" },
  ];

  // Hàm lấy dữ liệu từ API
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      if (selectedType !== "all") {
        params.append("type", selectedType);
      }

      if (startDate) {
        params.append("startDate", startDate.toISOString());
      }

      if (endDate) {
        params.append("endDate", endDate.toISOString());
      }

      const response = await fetch(`/api/admin/payments?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

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
  // Hook để gọi API khi các bộ lọc thay đổi
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Thay đổi trang
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handle tìm kiếm
  const handleSearch = () => {
    setPage(1); // Reset về trang đầu tiên khi tìm kiếm
    fetchTransactions();
  };

  // Handle export
  const handleExport = async () => {
    try {
      // Tạo query params cho export (thường là tất cả dữ liệu)
      const params = new URLSearchParams();

      // Giữ các bộ lọc nhưng lấy tất cả dữ liệu
      params.append("limit", "1000"); // Số lượng lớn hoặc có thể có endpoint riêng cho export

      if (selectedType !== "all") {
        params.append("type", selectedType);
      }

      if (startDate) {
        params.append("startDate", startDate.toISOString());
      }

      if (endDate) {
        params.append("endDate", endDate.toISOString());
      }

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      params.append("export", "true");

      // Gọi API export
      window.open(`/api/user/payments/activities/export?${params.toString()}`, "_blank");
    } catch (error) {
      console.error("Error exporting transactions:", error);
    }
  };

  // Định dạng ngày tháng cho hiển thị
  const formatDateRange = () => {
    if (!startDate || !endDate) {
      return "Select date range";
    }
    return `${format(startDate, "dd/MM/yyyy")} - ${format(endDate, "dd/MM/yyyy")}`;
  };

  // Lấy icon cho loại giao dịch
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "bank":
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case "bonus":
        return <Gift className="h-5 w-5 text-purple-500" />;
      case "token_usage":
        return <ArrowDown className="h-5 w-5 text-red-500" />;
      default:
        return <RefreshCcw className="h-5 w-5 text-gray-500" />;
    }
  };

  // Lấy màu cho trạng thái
  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format thời gian
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: format(date, "dd/MM/yyyy"),
      time: format(date, "HH:mm:ss"),
    };
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Payment History</h2>
        <p className="text-muted-foreground">View your payment history and token transactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Transaction Type */}
        <div className="md:col-span-3">
          <label htmlFor="type" className="block text-sm font-medium mb-2">
            Transaction Type
          </label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger id="type" className="w-full">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {typeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="md:col-span-5">
          <label className="block text-sm font-medium mb-2">Date Range</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDateRange()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={{
                  from: startDate,
                  to: endDate,
                }}
                onSelect={(range) => {
                  setStartDate(range?.from || subDays(new Date(), 30));
                  setEndDate(range?.to || new Date());
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Search */}
        <div className="md:col-span-4 flex items-end">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transaction..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button type="button" onClick={handleSearch} className="bg-slate-900">
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="hidden lg:table-cell">Tokens</TableHead>
              <TableHead className="hidden lg:table-cell">Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading transactions...
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => {
                const dateTime = formatDateTime(transaction.createdAt);
                return (
                  <TableRow key={transaction._id}>
                    <TableCell className=" text-sm">{transaction.transaction}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <div className="font-medium truncate max-w-xs">{transaction.description}</div>
                          <div className="text-sm text-muted-foreground md:hidden">
                            {dateTime.date} {dateTime.time}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div>{dateTime.date}</div>
                      <div className="text-sm text-muted-foreground">{dateTime.time}</div>
                    </TableCell>
                    <TableCell className={transaction.tokensEarned > 0 ? "text-green-600" : "text-red-600"}>
                      {transaction.tokensEarned > 0 ? `+${transaction.tokensEarned}` : transaction.tokensEarned}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {" "}
                      {formatVndToUsd(transaction.amount, rates.vndToUsdRate)} $
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing page {page} of {totalPages} ({totalTransactions} transactions)
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || loading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages || loading}
          >
            Next
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}
