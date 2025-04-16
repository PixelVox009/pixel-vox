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
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handleSearch = () => {
    setPage(1);
    fetchTransactions();
  };
  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      params.append("limit", "1000");
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
    } catch (error) {
      console.error("Error exporting transactions:", error);
    }
  };
  const formatDateRange = () => {
    if (!startDate || !endDate) {
      return "Select date range";
    }
    return `${format(startDate, "dd/MM/yyyy")} - ${format(endDate, "dd/MM/yyyy")}`;
  };

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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: format(date, "dd/MM/yyyy"),
      time: format(date, "HH:mm:ss"),
    };
  };
  const formatTokens = (transaction: Transaction) => {
    if (transaction.type === "token_usage") {
      const tokenValue = Math.abs(transaction.tokensEarned);
      return `-${tokenValue}`;
    } else {
      return `+${transaction.tokensEarned}`;
    }
  };
  const getTokenColor = (transaction: Transaction) => {
    return transaction.type === "token_usage" ? "text-red-600 font-medium" : "text-green-600 font-medium";
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Payment History</h2>
        <p className="text-muted-foreground">View your payment history and credits transactions</p>
      </div>

      {/* Filter section */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Transaction Type */}
          <div>
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
          <div>
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

          {/* Export button - desktop */}
          <div className="hidden lg:flex items-end">
            <Button variant="outline" size="default" className="w-full flex items-center gap-2" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Search row */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transaction..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button type="button" onClick={handleSearch} className="bg-slate-900 min-w-[100px]">
            Search
          </Button>

          {/* Export button - mobile */}
          <Button
            variant="outline"
            size="default"
            className="lg:hidden flex items-center justify-center gap-2"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px]">Transaction</TableHead>
              <TableHead className="min-w-[250px]">Description</TableHead>
              <TableHead className="hidden md:table-cell min-w-[100px]">Type</TableHead>
              <TableHead className="min-w-[120px]">Date</TableHead>
              <TableHead className="hidden lg:table-cell min-w-[80px]">Tokens</TableHead>
              <TableHead className="hidden lg:table-cell min-w-[100px]">Amount</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
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
                    <TableCell className="text-sm font-medium">{transaction.transaction}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate max-w-[200px] md:max-w-xs">
                            {transaction.description}
                          </div>
                          <div className="text-sm text-muted-foreground md:hidden">
                            {dateTime.date} {dateTime.time}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell capitalize">
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell whitespace-nowrap">
                      <div>{dateTime.date}</div>
                      <div className="text-sm text-muted-foreground">{dateTime.time}</div>
                    </TableCell>
                    <TableCell className={`hidden lg:table-cell ${getTokenColor(transaction)}`}>
                      {formatTokens(transaction)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell font-medium">
                      {formatVndToUsd(transaction.amount, rates.vndToUsdRate)} $
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(transaction.status)} whitespace-nowrap`}>
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
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground order-2 sm:order-1">
          Showing page {page} of {totalPages} ({totalTransactions} transactions)
        </div>
        <div className="flex items-center space-x-2 order-1 sm:order-2">
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
        </div>
      </div>
    </div>
  );
}
