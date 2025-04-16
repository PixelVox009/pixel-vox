import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatTime } from "@/utils/format";
import { formatVndToUsd } from "@/utils/formatVndUseDola";
import { Activity, ArrowDownLeft, Calendar, Clock, CreditCard, Gift, Wallet } from "lucide-react";
import { ReactNode } from "react";

interface TransactionsListProps {
  transactions?: Transaction[] | undefined;
  isLoading: boolean;
  formatDate: (date: string) => string;
  formatTime: (date: string) => string;
  vndToUsdRate: number;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export const TransactionsList = ({
  transactions,
  isLoading,
  vndToUsdRate,
  hasMore,
  onLoadMore,
}: TransactionsListProps) => {
  const getTransactionTypeIcon = (type: string, status: string): ReactNode => {
    if (status === "failed") return <Activity className="text-red-500" />;

    switch (type) {
      case "bank":
        return <CreditCard className="text-blue-500" />;
      case "token_usage":
        return <ArrowDownLeft className="text-red-500" />;
      case "bonus":
        return <Gift className="text-purple-500" />;
      default:
        return <Wallet className="text-gray-500" />;
    }
  };

  // Function to format transaction type label
  const getTransactionTypeLabel = (type: string): string => {
    switch (type) {
      case "bank":
        return "Bank Payment";
      case "token_usage":
        return "Token Usage";
      case "bonus":
        return "Bonus";
      default:
        return type.replace("_", " ").charAt(0).toUpperCase() + type.replace("_", " ").slice(1);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">No transactions found for the selected filters.</div>;
  }

  return (
    <>
      <div className="divide-y">
        {transactions.map((transaction) => (
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
                  {transaction.type === "token_usage" && transaction.tokensEarned ? (
                    <div className="font-medium text-red-600">-{transaction.tokensEarned}</div>
                  ) : transaction.type !== "token_usage" && transaction.tokensEarned ? (
                    <div className="font-medium text-green-600">+{transaction.tokensEarned}</div>
                  ) : transaction.tokensUsed ? (
                    <div className="font-medium text-red-600">-{transaction.tokensUsed}</div>
                  ) : (
                    <div className="font-medium">0</div>
                  )}

                  {transaction.amount > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {formatVndToUsd(transaction.amount, vndToUsdRate)} $
                    </div>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  <div>
                    ID: <span className="font-mono text-xs">{transaction.transaction.substring(0, 10)}...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="p-4 flex justify-center">
          <Button variant="outline" onClick={onLoadMore} className="w-full md:w-auto">
            Load More
          </Button>
        </div>
      )}
    </>
  );
};
