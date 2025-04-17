import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionStats } from "@/types/month";
import { Activity, ArrowDownLeft, ArrowUpRight, Star } from "lucide-react";

interface StatsCardsProps {
  stats: TransactionStats | undefined;
  isLoading: boolean;
}

export const StatsCards = ({ stats, isLoading }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-background/60 backdrop-blur-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            Total Credits
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div className="text-2xl font-bold">{stats?.totalTokens || 0}</div>
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
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div className="text-2xl font-bold text-green-600">{stats?.totalEarned || 0}</div>
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
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div className="text-2xl font-bold text-red-600">{stats?.totalSpent || 0}</div>
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
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div className="text-2xl font-bold">{stats?.totalTransactions || 0}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
