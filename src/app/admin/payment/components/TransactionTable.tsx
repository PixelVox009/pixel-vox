import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDown, CreditCard, Gift, RefreshCcw } from "lucide-react";
import { formatVndToUsd } from "@/utils/formatVndUseDola";
import { format } from "date-fns";

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
  rates: { vndToUsdRate: number };
}

function getTransactionIcon(type: string) {
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
}

function getStatusColor(status: string) {
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
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  return {
    date: format(date, "dd/MM/yyyy"),
    time: format(date, "HH:mm:ss"),
  };
}

function formatTokens(transaction: Transaction) {
  if (transaction.type === "token_usage") {
    const tokenValue = Math.abs(transaction.tokensEarned);
    return `-${tokenValue}`;
  } else {
    return `+${transaction.tokensEarned}`;
  }
}

function getTokenColor(transaction: Transaction) {
  return transaction.type === "token_usage" ? "text-red-600 font-medium" : "text-green-600 font-medium";
}

export function TransactionTable({ transactions, loading, rates }: TransactionTableProps) {
  return (
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
  );
}