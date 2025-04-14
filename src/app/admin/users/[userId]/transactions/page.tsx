"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  Clock,
  CreditCard,
  Download,
  Gift,
  Info,
  Search,
  Star,
  TimerReset,
  Trophy,
  Wallet,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatVndToUsd, useExchangeRates } from "@/utils/formatVndUseDola";

// Date range picker component
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays, format } from "date-fns";
import Link from "next/link";
import { DateRange } from "react-day-picker";

// Types
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
  tokensEarned?: number;
  tokensUsed?: number;
  depositDiscountPercent?: number;
  createdAt: string;
  updatedAt: string;
}

// API functions
const fetchUserDetails = async (userId: string) => {
  const response = await fetch(`/api/admin/users/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user details");
  }
  return response.json();
};

const fetchUserTransactions = async (
  userId: string,
  type: string = "all",
  startDate?: string,
  endDate?: string,
  search: string = "",
  limit: number = 20
) => {
  const params = new URLSearchParams();
  params.append("limit", limit.toString());
  if (type !== "all") params.append("type", type);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (search) params.append("search", search);

  const response = await fetch(`/api/admin/users/${userId}/transactions?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }
  return response.json();
};

const fetchTransactionStats = async (userId: string, startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const response = await fetch(`/api/admin/users/${userId}/transaction-stats?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch transaction stats");
  }
  return response.json();
};

export default function UserTransactionHistoryPage() {
  const params = useParams();
  const userId = params.userId as string;

  // State
  const [transactionType, setTransactionType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { rates } = useExchangeRates();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [limit, setLimit] = useState<number>(20);

  // Format date range for query
  const startDate = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined;
  const endDate = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined;

  // Fetch user details
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserDetails(userId),
    enabled: !!userId,
  });

  // Fetch transactions
  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    refetch: refetchTransactions,
  } = useQuery({
    queryKey: ["transactions", userId, transactionType, startDate, endDate, searchQuery, limit],
    queryFn: () => fetchUserTransactions(userId, transactionType, startDate, endDate, searchQuery, limit),
    enabled: !!userId,
  });

  // Fetch transaction stats
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ["transactionStats", userId, startDate, endDate],
    queryFn: () => fetchTransactionStats(userId, startDate, endDate),
    enabled: !!userId,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetchTransactions();
  };

  // Function to get transaction type icon
  const getTransactionTypeIcon = (type: string, status: string) => {
    if (status === "failed") return <Activity className="text-red-500" />;

    switch (type) {
      case "bank":
        return <CreditCard className="text-blue-500" />;
      case "token_usage":
        return <ArrowDownLeft className="text-red-500" />;
      case "bonus":
        return <Gift className="text-purple-500" />;
      case "refund":
        return <TimerReset className="text-amber-500" />;
      case "reward":
        return <Trophy className="text-yellow-500" />;
      default:
        return <Wallet className="text-gray-500" />;
    }
  };

  // Function to format transaction type label
  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case "bank":
        return "Bank Payment";
      case "token_usage":
        return "Token Usage";
      case "bonus":
        return "Bonus";
      case "refund":
        return "Refund";
      case "reward":
        return "Reward";
      default:
        return type.replace("_", " ").charAt(0).toUpperCase() + type.replace("_", " ").slice(1);
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Breadcrumb and Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/admin/users" className="hover:text-primary">
              <Button variant="link" className="p-0">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Users
              </Button>
            </Link>
            <span>/</span>
            <span>Transaction History</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View all transaction details and history</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* User Info Card */}
      <Card className="border border-border/40 bg-background/60 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {isUserLoading ? (
              <Skeleton className="h-20 w-20 rounded-full" />
            ) : (
              <Avatar className="h-20 w-20 border-4 border-background">
                <AvatarImage src={userData?.avatar} alt={userData?.name} />
                <AvatarFallback className="text-lg bg-primary/10 text-primary">
                  {getInitials(userData?.name)}
                </AvatarFallback>
              </Avatar>
            )}

            <div className="space-y-1 flex-1">
              {isUserLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">{userData?.name}</h2>
                    {userData?.role === "admin" && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        Admin
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{userData?.email}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Payment Code: {userData?.paymentCode || "N/A"}</span>
                    <span>•</span>
                    <span>Joined {userData?.createdAt ? formatDate(userData.createdAt) : "N/A"}</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Card className="shadow-none border-border/40 min-w-[140px]">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {isUserLoading ? (
                    <Skeleton className="h-6 w-20" />
                  ) : (
                    <div className="text-2xl font-bold">
                      {userData?.wallet?.balance || 0}{" "}
                      <span className="text-sm font-normal text-muted-foreground">tokens</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-none border-border/40 min-w-[140px]">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Recharged</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {isUserLoading ? (
                    <Skeleton className="h-6 w-20" />
                  ) : (
                    <div className="text-2xl font-bold">
                      {formatVndToUsd(userData?.wallet?.totalRecharged || 0, rates.vndToUsdRate)}
                      <span className="text-sm font-normal text-muted-foreground"> USD</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-background/60 backdrop-blur-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              Total Tokens
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {isStatsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{statsData?.totalTokens || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-background/60 backdrop-blur-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              Total Earned
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {isStatsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-green-600">{statsData?.totalEarned || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-background/60 backdrop-blur-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ArrowDownLeft className="h-4 w-4 text-red-500" />
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {isStatsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-red-600">{statsData?.totalSpent || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-background/60 backdrop-blur-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {isStatsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{statsData?.totalTransactions || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters and Transactions */}
      <Card className="border border-border/40 bg-background/60 backdrop-blur-sm">
        <CardHeader className="p-6 pb-4">
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View all transactions for this user</CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {/* Filters */}
          <div className="px-6 pb-4 flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="type" className="text-sm font-medium block mb-2">
                  Transaction Type
                </label>
                <Select value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="bank">Bank Payment</SelectItem>
                    <SelectItem value="token_usage">Token Usage</SelectItem>
                    <SelectItem value="bonus">Bonus</SelectItem>
                    <SelectItem value="refund">Refund</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="text-sm font-medium block mb-2">Date Range</label>
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              </div>
            </div>

            <div className="w-full md:w-auto">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transaction..."
                    className="pl-9 w-full md:w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="border-t">
            <div className="relative overflow-x-auto">
              {isTransactionsLoading ? (
                <div className="p-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              ) : transactionsData?.transactions?.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No transactions found for the selected filters.
                </div>
              ) : (
                <div className="divide-y">
                  {transactionsData?.transactions?.map((transaction: Transaction) => (
                    <div key={transaction._id} className="p-4 md:px-6 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            {getTransactionTypeIcon(transaction.type, transaction.status)}
                          </div>

                          <div>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-sm text-muted-foreground">
                              {getTransactionTypeLabel(transaction.type)}
                              {transaction.status !== "success" && (
                                <Badge variant="outline" className="ml-2 text-xs bg-red-50 text-red-500 border-red-200">
                                  {transaction.status}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 ml-14 md:ml-0">
                          <div className="text-sm text-right">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {formatDate(transaction.createdAt)}
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatTime(transaction.createdAt)}
                            </div>
                          </div>

                          <div className="text-right min-w-[100px]">
                            {transaction.tokensEarned ? (
                              <div className="font-medium text-green-600">+{transaction.tokensEarned}</div>
                            ) : transaction.tokensUsed ? (
                              <div className="font-medium text-red-600">-{transaction.tokensUsed}</div>
                            ) : (
                              <div className="font-medium">0</div>
                            )}

                            {transaction.amount > 0 && (
                              <div className="text-xs text-muted-foreground">
                                {formatVndToUsd(transaction.amount, rates.vndToUsdRate)} $
                              </div>
                            )}
                          </div>

                          <div className="text-sm text-muted-foreground">
                            <div>
                              ID:{" "}
                              <span className="font-mono text-xs">{transaction.transaction.substring(0, 10)}...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Load More Button */}
          {transactionsData?.hasMore && (
            <div className="p-4 flex justify-center">
              <Button variant="outline" onClick={() => setLimit((prev) => prev + 20)} className="w-full md:w-auto">
                Load More
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
