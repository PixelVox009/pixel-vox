import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types/month";
import { ArrowDown, ChevronRight, Clock, RefreshCw } from "lucide-react";


interface RecentTransactionsProps {
  transactions?: Transaction[];
  isLoading: boolean;
  formatDate: (dateString: string) => string;
  vndToUsdRate: number;
  formatVndToUsd: (amount: number, rate: number) => string;
}

export function RecentTransactions({
  transactions,
  isLoading,
  formatDate,
  vndToUsdRate,
  formatVndToUsd,
}: RecentTransactionsProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg dark:text-gray-200">Giao dịch gần đây</CardTitle>
            <CardDescription className="dark:text-gray-400">5 giao dịch nạp tiền gần nhất</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-sm gap-1 dark:text-gray-300 dark:hover:bg-gray-700">
            Xem tất cả
            <ChevronRight size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400 dark:text-gray-500" />
            </div>
          ) : transactions && transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 dark:bg-green-900">
                    <ArrowDown size={16} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">
                      {transaction.transaction || "Nạp tiền"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Clock size={12} />
                      {formatDate(transaction.createAt)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-600 dark:text-green-400">
                    +{formatVndToUsd(transaction.amount, vndToUsdRate)} $
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">({transaction.tokensEarned} token)</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-400 dark:text-gray-500">Không có giao dịch gần đây</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
