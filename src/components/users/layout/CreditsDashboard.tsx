"use client";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTokenData } from "@/hooks/useHeader";
import { useExchangeRates } from "@/utils/formatVndUseDola";
import CreditsSummary from "./CreditsSummary";
import TransactionList from "./TransactionList";
import TransactionTabs from "./TransactionTabs";

interface CreditsDashboardProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onBuyCredits: () => void;
}

export default function CreditsDashboard({ activeTab, onTabChange, onBuyCredits }: CreditsDashboardProps) {
  const { rates } = useExchangeRates();
  const { creditsDetails, transactionHistory, isHistoryLoading } = useTokenData(activeTab);

  return (
    <DialogContent className="sm:max-w-xl md:max-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-xl">Credits Dashboard</DialogTitle>
      </DialogHeader>
      {creditsDetails && (
        <div className="space-y-6">
          {/* Credits Summary */}
          <CreditsSummary creditsDetails={creditsDetails} rates={rates} />

          {/* Transaction Tabs */}
          <TransactionTabs activeTab={activeTab} onTabChange={onTabChange} />

          {/* Transaction History List */}
          <TransactionList transactions={transactionHistory} isLoading={isHistoryLoading} />

          {/* USD Conversion Note */}
          <div className="text-xs text-gray-500 text-center">
            <p>
              {rates.usdToTokenRate} credit = $1 = {rates.vndToUsdRate} VND
            </p>
          </div>
          <div className="flex justify-end pt-4">
            <DialogClose asChild>
              <Button onClick={onBuyCredits} className="bg-purple-600 hover:bg-purple-700">
                Buy Credits
              </Button>
            </DialogClose>
          </div>
        </div>
      )}
    </DialogContent>
  );
}
