import { ArrowDown, DollarSign } from "lucide-react";
import { StatCard } from "./StatCard";
import { TransactionStats } from "@/types/month";


interface StatsOverviewProps {
  stats?: TransactionStats;
  isLoading: boolean;
  vndToUsdRate: number;
  formatVndToUsd: (amount: number, rate: number) => string;
}

export function StatsOverview({ stats, isLoading, vndToUsdRate, formatVndToUsd }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        icon={<DollarSign className="h-6 w-6" />}
        title="Tổng tiền nạp"
        value={`${formatVndToUsd(stats?.totalAmount || 0, vndToUsdRate)} $`}
        iconBgColor="bg-emerald-100"
        iconColor="text-emerald-600"
        isLoading={isLoading}
      />

      <StatCard
        icon={<ArrowDown className="h-6 w-6" />}
        title="Số giao dịch"
        value={stats?.totalTransactions || 0}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
        isLoading={isLoading}
      />

      <StatCard
        icon={<DollarSign className="h-6 w-6" />}
        title="Tổng token"
        value={stats?.totalTokens || 0}
        iconBgColor="bg-amber-100"
        iconColor="text-amber-600"
        isLoading={isLoading}
      />
    </div>
  );
}
