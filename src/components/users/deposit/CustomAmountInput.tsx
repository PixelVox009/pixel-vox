import { useExchangeRates } from "@/hooks/useExchangeRates";
import React, { useState } from "react";

interface CustomAmountInputProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

const CustomAmountInput: React.FC<CustomAmountInputProps> = ({ value, onChange }) => {
  const [error, setError] = useState<string>("");
  const { rates } = useExchangeRates();
  const usdAmount = value ? (Number(value.replace(/[,.]/g, "")) / rates.vndToUsdRate).toFixed(2) : "0.00";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Chỉ chấp nhận số và dấu phân cách
    const inputValue = e.target.value;

    // Lọc chỉ giữ lại số và dấu phân cách
    if (inputValue === "" || /^[0-9,\.]+$/.test(inputValue)) {
      // Loại bỏ tất cả dấu phân cách để tính toán
      const numericValue = inputValue.replace(/[,.]/g, "");
      const numAmount = Number(numericValue);

      // Format lại số với dấu phân cách hàng nghìn
      const formattedValue = numAmount > 0 ? new Intl.NumberFormat("vi-VN").format(numAmount) : inputValue;

      // Kiểm tra điều kiện tối thiểu
      if (numAmount > 0 && numAmount < rates.vndToUsdRate) {
        setError(`Số tiền tối thiểu là $1 (${rates.vndToUsdRate.toLocaleString("vi-VN")} VND)`);
        onChange(formattedValue, false);
      } else {
        setError("");
        onChange(formattedValue, true);
      }
    }
  };

  // Tính số token sẽ nhận được dựa trên tỷ giá
  const calculatedTokens = value
    ? Math.floor((Number(value.replace(/[,.]/g, "")) / rates.vndToUsdRate) * rates.usdToTokenRate)
    : 0;

  return (
    <div className="mt-6">
      <label htmlFor="customAmount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        Or enter a custom amount
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        {/* Input số tiền VND */}
        <div className="relative">
          <input
            type="text"
            name="customAmount"
            id="customAmount"
            value={value}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 ${
              error
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-slate-200 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600"
            } bg-white dark:bg-black text-slate-900 dark:text-white rounded-lg shadow-sm`}
            placeholder="Enter the amount in VND"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <span className="text-slate-500 dark:text-slate-400 font-medium">VND</span>
          </div>
        </div>

        {/* Hiển thị số tiền quy đổi USD */}
        <div className="relative">
          <input
            type="text"
            disabled
            value={`${usdAmount}`}
            className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg shadow-sm cursor-not-allowed"
            placeholder="Số tiền USD"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <span className="text-slate-400 dark:text-slate-500 font-medium">USD</span>
          </div>
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="mt-3 flex items-center">
        <div className="flex-shrink-0">
          <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600 dark:text-blue-300"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
        <div className="ml-3">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            You will receive <span className="font-semibold text-blue-600 dark:text-blue-400">{calculatedTokens}</span>{" "}
            credits
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span className="italic">
              1 USD = {rates.usdToTokenRate} credits = {rates.vndToUsdRate.toLocaleString("vi-VN")} VND
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomAmountInput;
