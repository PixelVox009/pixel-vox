import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentTransactionsProps } from "@/types/dashboard";
import { formatDate } from "@/utils/format";
import { ArrowDown, ChevronRight, Clock, RefreshCw } from "lucide-react";
import Link from "next/link";

export function RecentTransactions({ transactions, isLoading, vndToUsdRate, formatVndToUsd }: RecentTransactionsProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg dark:text-gray-200">Recent transactions</CardTitle>
            <CardDescription className="dark:text-gray-400">6 most recent deposits</CardDescription>
          </div>
          <Link href="/admin/payment">
            {" "}
            <Button variant="ghost" size="sm" className="text-sm gap-1 dark:text-gray-300 dark:hover:bg-gray-700">
              See all
              <ChevronRight size={16} />
            </Button>
          </Link>
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
                      {formatDate(transaction.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-600 dark:text-green-400">
                    +{formatVndToUsd(transaction.amount, vndToUsdRate)} $
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">({transaction.tokensEarned} credits)</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-400 dark:text-gray-500">No recent transactions</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
