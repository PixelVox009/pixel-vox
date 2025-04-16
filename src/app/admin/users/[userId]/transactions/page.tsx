"use client";

import { StatsCards } from "@/components/admin/user-detail/StatsCards";
import { TransactionHeader } from "@/components/admin/user-detail/TransactionHeader";
import { TransactionsCard } from "@/components/admin/user-detail/TransactionsCard";
import { UserInfoCard } from "@/components/admin/user-detail/UserInfoCard";
import { useUserDetails } from "@/hooks/useUserDetails";
import { useUserTransactions } from "@/hooks/useUserTransactions";
import { useExchangeRates } from "@/utils/formatVndUseDola";
import { useParams } from "next/navigation";

export default function UserTransactionHistoryPage() {
  const params = useParams();
  const userId = params.userId as string;
  const { rates } = useExchangeRates();
  const { userData, isLoading: isUserLoading, getInitials } = useUserDetails(userId);
  const {
    transactionsData,
    statsData,
    isLoading,
    isStatsLoading,
    transactionType,
    setTransactionType,
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    handleSearch,
    handleLoadMore,
    hasMore,
  } = useUserTransactions(userId);

  return (
    <div className="p-6 space-y-8">
      {/* Breadcrumb and Header */}
      <TransactionHeader />

      {/* User Info Card */}
      <UserInfoCard
        userData={userData}
        isLoading={isUserLoading}
        getInitials={getInitials}
        vndToUsdRate={rates.vndToUsdRate}
      />
      {/* Stats Cards */}
      <StatsCards stats={statsData?.stats} isLoading={isStatsLoading} />
      {/* Transactions Card */}
      <TransactionsCard
        transactions={transactionsData?.transactions}
        isLoading={isLoading}
        transactionType={transactionType}
        setTransactionType={setTransactionType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dateRange={dateRange}
        setDateRange={setDateRange}
        handleSearch={handleSearch}
        vndToUsdRate={rates.vndToUsdRate}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
