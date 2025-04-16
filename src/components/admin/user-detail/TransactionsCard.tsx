import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types/month";
import { DateRange } from "react-day-picker";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionsList } from "./TransactionsList";

interface TransactionsCardProps {
  transactions: Transaction[] | undefined;
  isLoading: boolean;
  transactionType: string;
  setTransactionType: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: (value: DateRange | undefined) => void;
  handleSearch: (e: React.FormEvent) => void;
  formatDate: (date: string) => string;
  formatTime: (date: string) => string;
  vndToUsdRate: number;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export const TransactionsCard = ({
  transactions,
  isLoading,
  transactionType,
  setTransactionType,
  searchQuery,
  setSearchQuery,
  dateRange,
  setDateRange,
  handleSearch,
  vndToUsdRate,
  hasMore,
  onLoadMore,
}: TransactionsCardProps) => {
  return (
    <Card className="border border-border/40 bg-background/60 backdrop-blur-sm">
      <CardHeader className="p-6 pb-4">
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>View all transactions for this user</CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {/* Filters */}
        <TransactionFilters
          transactionType={transactionType}
          setTransactionType={setTransactionType}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          dateRange={dateRange}
          setDateRange={setDateRange}
          handleSearch={handleSearch}
        />

        {/* Transactions Table */}
        <div className="border-t">
          <div className="relative overflow-x-auto">
            <TransactionsList
              transactions={transactions}
              isLoading={isLoading}
              vndToUsdRate={vndToUsdRate}
              hasMore={hasMore}
              onLoadMore={onLoadMore}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
