"use client";

import { useTokenData } from "@/hooks/useHeader";
import { useExchangeRates } from "@/utils/formatVndUseDola";
import CreditsSummary from "./CreditsSummary";
import TransactionList from "./TransactionList";
import TransactionTabs from "./TransactionTabs";

interface CreditsDashboardProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function CreditsDashboard({ activeTab, onTabChange }: CreditsDashboardProps) {
  const { rates } = useExchangeRates();
  const { creditsDetails, transactionHistory, isHistoryLoading } = useTokenData(activeTab);

  return (
    <div className="w-full mx-auto px-4 py-6">
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Credits History</h3>
      {creditsDetails && (
        <div className="space-y-6">
          <CreditsSummary creditsDetails={creditsDetails} rates={rates} />
          <TransactionTabs activeTab={activeTab} onTabChange={onTabChange} />
          <TransactionList transactions={transactionHistory} isLoading={isHistoryLoading} />
          <div className="text-xs text-gray-500 text-center">
            <p>
              {rates.usdToTokenRate} credit = $1 = {rates.vndToUsdRate} VND
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
