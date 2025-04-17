import { getTokenChange, getTokenColor, getTransactionTitle } from "@/lib/helpers/transactionhelpers";
import { Transaction } from "@/types/month";
import { formatDate } from "@/utils/format";

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export default function TransactionList({ transactions, isLoading }: TransactionListProps) {
  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {isLoading ? (
        <div className="text-center py-4 text-gray-500">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No transactions found</div>
      ) : (
        transactions.map((transaction) => (
          <div key={transaction._id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{getTransactionTitle(transaction)}</div>
                <div className="text-xs text-gray-500">{formatDate(transaction?.createdAt ?? "")}</div>
              </div>
              <div className={`font-semibold ${getTokenColor(transaction)}`}>{getTokenChange(transaction)} credits</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
