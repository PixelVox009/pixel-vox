"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { BankConfig, ExchangeRates } from "@/types/month";
import { formatVndToUsd, useExchangeRates } from "@/utils/formatVndUseDola";
import { BankInfoCard } from "./BankInfoCard";
import { ExchangeRateSettings } from "./ExchangeRateSettings";
import { RecentTransactions } from "./RecentTransactions";
import { StatsOverview } from "./StatsOverview";
import { TransactionChart } from "./TransactionChart";
import UserContactsCard from "./UserInfo";

// Thông tin ngân hàng cố định
const BANK_CONFIG: BankConfig = {
  bankName: "ACB",
  accountNumber: "6959741",
  accountName: "CA VAN QUE",
  prefixCode: "TB",
  suffixCode: "AI",
};

export default function DashboardComponent() {
  // State for filters
  const [startDate, setStartDate] = useState("2025-04-11");
  const [endDate, setEndDate] = useState("2025-05-09");

  // Exchange rates
  const { rates } = useExchangeRates();
  const [newExchangeRates, setNewExchangeRates] = useState<ExchangeRates>({
    usdToTokenRate: 0,
    vndToUsdRate: 0,
  });

  // QueryClient to invalidate queries
  const queryClient = useQueryClient();

  // Fetch transaction stats with React Query
  const {
    data: statsData,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["transaction-stats", startDate, endDate],
    queryFn: async () => {
      const response = await fetch(`/api/admin/transactions?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        throw new Error("Lỗi khi lấy dữ liệu thống kê");
      }
      return response.json();
    },
  });

  // Fetch 5 recent transactions with React Query
  const { data: recentTransactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["recent-transactions"],
    queryFn: async () => {
      const response = await fetch("/api/admin/transactions?type=recent");
      if (!response.ok) {
        throw new Error("Lỗi khi lấy giao dịch gần đây");
      }
      const data = await response.json();
      return data.success ? data.data : [];
    },
  });

  // Fetch exchange rate settings with React Query
  const { data: exchangeRates, isLoading: ratesLoading } = useQuery({
    queryKey: ["exchange-rates"],
    queryFn: async () => {
      const response = await fetch("/api/admin/settings");
      if (!response.ok) {
        throw new Error("Lỗi khi lấy cài đặt tỉ giá");
      }
      const data = await response.json();
      console.log("🚀 ~ queryFn: ~ data:", data);

      // Chuyển đổi dữ liệu từ string sang number
      return data.success
        ? {
            usdToTokenRate: parseFloat(data.data.usdToTokenRate),
            vndToUsdRate: parseFloat(data.data.vndToUsdRate),
          }
        : {
            usdToTokenRate: parseFloat(data.usdToTokenRate),
            vndToUsdRate: parseFloat(data.vndToUsdRate),
          };
    },
    // Thêm select để đảm bảo kiểu dữ liệu
    select: (data) => ({
      usdToTokenRate: data.usdToTokenRate || 0,
      vndToUsdRate: data.vndToUsdRate || 0,
    }),
  });

  useEffect(() => {
    console.log("Exchange Rates:", exchangeRates);
  }, [exchangeRates]);

  // Thêm useEffect để đồng bộ newExchangeRates với exchangeRates khi dữ liệu được tải
  useEffect(() => {
    if (exchangeRates) {
      setNewExchangeRates({
        usdToTokenRate: exchangeRates.usdToTokenRate,
        vndToUsdRate: exchangeRates.vndToUsdRate,
      });
    }
  }, [exchangeRates]);

  // Mutation for updating exchange rates
  const updateRatesMutation = useMutation({
    mutationFn: async (rates: ExchangeRates) => {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rates),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi cập nhật tỉ giá");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exchange-rates"] });
      toast.success("Cập nhật tỉ giá thành công!");
    },
    onError: (error: Error) => {
      toast.error("Lỗi khi cập nhật tỉ giá: " + error.message);
    },
  });

  // Apply filters
  const applyFilters = () => {
    refetchStats();
  };

  // Format currency
  const formatCurrency = (amount?: number) => {
    return amount?.toLocaleString("vi-VN") || "0";
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  return (
    <div className="p-6 ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* COL 1-2: Stats and chart */}
        <div className="md:col-span-2 space-y-4">
          {/* Stats overview */}
          <StatsOverview
            stats={statsData?.data?.stats}
            isLoading={statsLoading}
            vndToUsdRate={rates.vndToUsdRate}
            formatVndToUsd={formatVndToUsd}
          />

          {/* Transaction chart */}
          <TransactionChart
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={(e) => setStartDate(e.target.value)}
            onEndDateChange={(e) => setEndDate(e.target.value)}
            onApplyFilters={applyFilters}
            isLoading={statsLoading}
            monthlyData={statsData?.data?.monthlyData}
            vndToUsdRate={rates.vndToUsdRate}
            formatVndToUsd={formatVndToUsd}
          />

          {/* Recent transactions */}
          <RecentTransactions
            transactions={recentTransactions}
            isLoading={transactionsLoading}
            formatDate={formatDate}
            vndToUsdRate={rates.vndToUsdRate}
            formatVndToUsd={formatVndToUsd}
          />
        </div>

        {/* COL 3: Bank info and settings */}
        <div className="space-y-4">
          {/* Bank information */}
          <BankInfoCard bankConfig={BANK_CONFIG} />

          {/* Exchange rate settings */}
          <ExchangeRateSettings
            exchangeRates={exchangeRates}
            newExchangeRates={newExchangeRates}
            onExchangeRatesChange={setNewExchangeRates}
            onUpdateRates={() => updateRatesMutation.mutate(newExchangeRates)}
            isUpdating={updateRatesMutation.isPending}
            isLoading={ratesLoading}
            formatCurrency={formatCurrency}
          />

          {/* User contacts */}
          <UserContactsCard />
        </div>
      </div>
    </div>
  );
}
