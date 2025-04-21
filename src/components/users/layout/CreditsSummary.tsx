import { CreditsDetails } from "@/hooks/useHeader";
import { formatVndToUsd } from "@/utils/formatVndUseDola";

interface CreditsSummaryProps {
  creditsDetails: CreditsDetails;
  rates: {
    vndToUsdRate: number;
  };
}

export default function CreditsSummary({ creditsDetails, rates }: CreditsSummaryProps) {
  return (
    <div className="grid grid-cols-7 gap-2 text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <div className="col-span-2 text-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">Remaining Credits</div>
        <div className="text-xl font-semibold text-purple-500">{creditsDetails.remaining.toLocaleString()}</div>
      </div>
      <div className="col-span-1 flex items-center justify-center">=</div>
      <div className="col-span-1">
        <div className="text-sm text-gray-500 dark:text-gray-400">Membership Credits</div>
        <div className="font-medium">{creditsDetails.membership.toLocaleString()}</div>
      </div>
      <div className="col-span-1 flex items-center justify-center">+</div>
      <div className="col-span-1">
        <div className="text-sm text-gray-500 dark:text-gray-400">Top-up Credits</div>
        <div className="font-medium">{formatVndToUsd(creditsDetails.topup, rates.vndToUsdRate)}$</div>
      </div>
    </div>
  );
}
