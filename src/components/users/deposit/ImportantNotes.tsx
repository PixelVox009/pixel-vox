import { useExchangeRates } from "@/hooks/useExchangeRates";
import React from "react";

const ImportantNotes: React.FC = () => {
  const { rates } = useExchangeRates();
  const minUsdAmount = rates.vndToUsdRate;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800/50">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-600 dark:text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">Important Note:</h3>
          <ul className="space-y-2 text-blue-700 dark:text-blue-300">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Credits will be automatically added to your account after the system confirms the transaction (5-15
                minutes)
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Please fill in the transfer content correctly for automatic confirmation by the system.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                The minimum amount to receive 1 credit is{" "}
                {Math.ceil(minUsdAmount / rates.usdToTokenRate).toLocaleString("vi-VN")} VND
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                1 USD = {rates.usdToTokenRate} credits = {rates.vndToUsdRate.toLocaleString("vi-VN")} VND
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>If you need support, please contact hotline: 0967747745</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImportantNotes;
