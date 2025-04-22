import { useExchangeRates } from "@/hooks/useExchangeRates";
import { useFirstRecharge } from "@/hooks/useFirstRecharge";
import React from "react";

interface TokenPackage {
  tokens: number;
  amount: number;
  bonusTokens?: number;
  totalTokens?: number;
}

interface TokenPackagesProps {
  packages: TokenPackage[];
  activePackage: number;
  onSelectPackage: (index: number, amount: number) => void;
  formatCurrency: (value: number) => string;
  isCustom?: boolean;
  calculatedTokens?: {
    baseTokens: number;
    bonusTokens: number;
    totalTokens: number;
    bonusPercent: number;
    usdAmount: number;
  };
}

const TokenPackages: React.FC<TokenPackagesProps> = ({ packages, activePackage, onSelectPackage, formatCurrency }) => {
  const { rates } = useExchangeRates();
  const { isFirstRecharge, isLoading } = useFirstRecharge();

  const calculateBonus = (usdAmount: number, isCustomInput: boolean = false) => {
    if (isCustomInput) return 0;

    if (isFirstRecharge) return 50;
    if (usdAmount >= 100) return 15;
    if (usdAmount >= 50) return 10;
    if (usdAmount >= 20) return 5;
    return 0;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 animate-pulse">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-2 w-2/3 mx-auto"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto mt-2"></div>
          </div>
        ))}
      </div>
    );
  }

  const getBonusStyle = (bonusPercent: number) => {
    if (isFirstRecharge) {
      return {
        gradient: "bg-gradient-to-r from-pink-500 to-purple-500",
        animation: "animate-pulse",
        pingColor: "rgba(216, 27, 96, 0.2)",
        textColor: "text-pink-600 dark:text-pink-400",
        borderColor: "border-pink-200 dark:border-pink-800",
        bgColor: "bg-pink-50 dark:bg-pink-900/10",
      };
    }
    if (bonusPercent === 20) {
      return {
        gradient: "bg-gradient-to-r from-orange-500 to-red-500",
        animation: "",
        pingColor: "rgba(249, 115, 22, 0.2)",
        textColor: "text-orange-600 dark:text-orange-400",
        borderColor: "border-orange-200 dark:border-orange-800",
        bgColor: "bg-orange-50 dark:bg-orange-900/10",
      };
    }
    if (bonusPercent === 15) {
      return {
        gradient: "bg-gradient-to-r from-yellow-400 to-yellow-600",
        animation: "",
        pingColor: "rgba(234, 179, 8, 0.2)",
        textColor: "text-yellow-600 dark:text-yellow-400",
        borderColor: "border-yellow-200 dark:border-yellow-800",
        bgColor: "bg-yellow-50 dark:bg-yellow-900/10",
      };
    }
    if (bonusPercent === 10) {
      return {
        gradient: "bg-gradient-to-r from-teal-400 to-cyan-600",
        animation: "",
        pingColor: "rgba(20, 184, 166, 0.2)",
        textColor: "text-teal-600 dark:text-teal-400",
        borderColor: "border-teal-200 dark:border-teal-800",
        bgColor: "bg-teal-50 dark:bg-teal-900/10",
      };
    }
    return {
      gradient: "bg-gradient-to-r from-emerald-400 to-green-600",
      animation: "",
      pingColor: "rgba(16, 185, 129, 0.2)",
      textColor: "text-emerald-600 dark:text-emerald-400",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/10",
    };
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {packages.map((pkg, index) => {
        const usdAmount = Number((pkg.amount / rates.vndToUsdRate).toFixed(2));
        const baseTokenAmount = pkg.tokens;
        const bonusPercent = calculateBonus(usdAmount);
        const bonusTokens = pkg.bonusTokens || Math.floor(baseTokenAmount * (bonusPercent / 100));
        const totalTokens = pkg.totalTokens || baseTokenAmount + bonusTokens;
        const bonusStyle = getBonusStyle(bonusPercent);
        return (
          <button
            key={index}
            onClick={() => onSelectPackage(index, pkg.amount)}
            className={`relative overflow-hidden rounded-xl p-4 text-center transition-all hover:shadow-md
              ${
                activePackage === index
                  ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700"
              }
              ${bonusPercent > 0 ? bonusStyle.bgColor : ""}
            `}
          >
            {/* Badge khuyến mãi */}
            {bonusPercent > 0 && (
              <div className="absolute -top-1 -left-1 z-10">
                <div
                  className={`${bonusStyle.gradient} ${bonusStyle.animation} flex items-center gap-1 text-white text-xs font-bold px-3 py-3 rounded-lg shadow-md`}
                >
                  {isFirstRecharge ? "First deposit +50%" : `+${bonusPercent}%`}
                </div>
                <div
                  className="absolute inset-0 rounded-lg animate-ping opacity-75"
                  style={{ backgroundColor: bonusStyle.pingColor }}
                ></div>
              </div>
            )}
            {/* Nội dung gói */}
            <div className="pt-6 pb-2">
              {/* Hiển thị credit */}
              <div className="mb-2">
                {bonusTokens > 0 ? (
                  <div className="flex flex-col items-center">
                    <div className="text-sm text-slate-500 dark:text-slate-400 line-through mb-1">
                      {baseTokenAmount} credits
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white flex items-center justify-center">
                      {totalTokens}
                      <span className="text-base ml-1">credits</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-slate-800 dark:text-white">
                    {baseTokenAmount} <span className="text-base">credits</span>
                  </div>
                )}
              </div>
              {/* Hiển thị giá */}
              <div className="text-lg font-medium text-blue-600 dark:text-blue-400">${usdAmount.toFixed(2)}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{formatCurrency(pkg.amount)}</div>
              {/* Thông báo tiết kiệm */}
              {bonusTokens > 0 && (
                <div
                  className={`mt-2 text-xs font-semibold ${bonusStyle.textColor} py-1 px-2 rounded-full inline-block ${bonusStyle.borderColor} border`}
                >
                  Save +{bonusTokens} credits
                </div>
              )}
            </div>
            {/* Dấu tích khi được chọn */}
            {activePackage === index && (
              <div className="absolute bottom-2 right-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TokenPackages;
