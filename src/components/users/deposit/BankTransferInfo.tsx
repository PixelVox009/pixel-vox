import React, { useEffect, useState } from "react";

interface BankConfig {
  bankName: string;
  accountNumber: string;
  accountName: string;
  prefixCode: string;
  suffixCode: string;
}

interface BankTransferInfoProps {
  bankConfig: BankConfig;
  amount: number;
  transferContent: string;
  onCopy: (text: string) => void;
  copied: boolean;
  formatCurrency: (value: number) => string;
}

const BankTransferInfo: React.FC<BankTransferInfoProps> = ({
  bankConfig,
  amount,
  transferContent,
  onCopy,
  copied,
  formatCurrency,
}) => {
  const [exchangeRates, setExchangeRates] = useState({
    vndToUsdRate: 25000,
    usdToTokenRate: 10,
  });

  // Lấy tỷ giá từ API
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch("/api/settings/exchange-rates");
        if (response.ok) {
          const data = await response.json();
          setExchangeRates({
            vndToUsdRate: data.vndToUsdRate || 25000,
            usdToTokenRate: data.usdToTokenRate || 10,
          });
        }
      } catch (error) {
        console.error("Lỗi khi lấy tỷ giá:", error);
      }
    };

    fetchExchangeRates();
  }, []);

  const usdAmount = (amount / exchangeRates.vndToUsdRate).toFixed(2);
  const tokenAmount = Math.floor(Number(usdAmount) * exchangeRates.usdToTokenRate);

  return (
    <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Transfer information</h2>

      <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Bank</h3>
                <p className="text-lg font-semibold text-slate-800 dark:text-white">{bankConfig.bankName}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Account number</h3>
                <div className="flex items-center space-x-2">
                  <p className="text-lg font-semibold text-slate-800 dark:text-white">{bankConfig.accountNumber}</p>
                  <button
                    onClick={() => onCopy(bankConfig.accountNumber)}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm">Copy</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Account owner</h3>
                <p className="text-lg font-semibold text-slate-800 dark:text-white">{bankConfig.accountName}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Amount</h3>
                <div className="flex items-center space-x-2">
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">{formatCurrency(amount)}</p>
                  <button
                    onClick={() => onCopy(amount.toString())}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm">Copy</span>
                  </button>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  ≈ ${usdAmount} ({tokenAmount} credits)
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Transfer content</h3>
                <div className="flex flex-wrap items-center space-x-2">
                  <p className="font-mono text-lg font-bold bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 px-3 py-2 rounded-lg">
                    {transferContent}
                  </p>
                  <button
                    onClick={() => onCopy(transferContent)}
                    className="mt-2 sm:mt-0 inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm">{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <p className="mt-2 text-sm font-medium text-red-500 dark:text-red-400">
                  * Please enter the transfer content correctly
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            <span className="italic">
              1 USD = {exchangeRates.usdToTokenRate} credits = {exchangeRates.vndToUsdRate.toLocaleString("vi-VN")} VND
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BankTransferInfo;
