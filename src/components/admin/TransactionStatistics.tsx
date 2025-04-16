"use client";

import { useTransactionStats } from "@/hooks/useTransactionStats";
import { useRecentTransactions } from "@/hooks/useRecentTransactions";
import { useExchangeRateSettings } from "@/hooks/useExchangeRateSettings";
import { useExchangeRates } from "@/utils/formatVndUseDola";

import { formatVndToUsd } from "@/utils/formatVndUseDola";
import { StatsOverview } from "./StatsOverview";
import { TransactionChart } from "./TransactionChart";
import { RecentTransactions } from "./RecentTransactions";
import { BankInfoCard } from "./BankInfoCard";
import { ExchangeRateSettings } from "./ExchangeRateSettings";
import UserContactsCard from "./UserInfo";

// Thông tin ngân hàng cố định
const BANK_CONFIG = {
  bankName: "ACB",
  accountNumber: "6959741",
  accountName: "CA VAN QUE",
  prefixCode: "TB",
  suffixCode: "AI",
};

export default function DashboardComponent() {
  // Sử dụng các hooks
  const { rates } = useExchangeRates();

  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    statsData,
    isLoading: statsLoading,
    applyFilters,
  } = useTransactionStats("2025-04-11", "2025-05-09");

  const { recentTransactions, isLoading: transactionsLoading } = useRecentTransactions();

  const {
    exchangeRates,
    newExchangeRates,
    setNewExchangeRates,
    updateRates,
    isUpdating,
    isLoading: ratesLoading,
    formatCurrency,
  } = useExchangeRateSettings();

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* COL 1-2: Stats and chart */}
        <div className="md:col-span-2 space-y-4">
          {/* Stats overview */}
          <StatsOverview
            stats={statsData?.stats}
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
            monthlyData={statsData?.monthlyData}
            vndToUsdRate={rates.vndToUsdRate}
            formatVndToUsd={formatVndToUsd}
          />

          {/* Recent transactions */}
          <RecentTransactions
            transactions={recentTransactions}
            isLoading={transactionsLoading}
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
            onUpdateRates={updateRates}
            isUpdating={isUpdating}
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
