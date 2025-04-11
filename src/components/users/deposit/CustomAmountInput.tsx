import React, { useState } from "react";

interface CustomAmountInputProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  tokenEstimate: number;
  minAmount?: number;
}

const CustomAmountInput: React.FC<CustomAmountInputProps> = ({ value, onChange, tokenEstimate, minAmount = 25000 }) => {
  const [error, setError] = useState<string>("");

  // Tỷ giá chuyển đổi
  const VND_TO_USD_RATE = 25000; // 25,000 VND = 1 USD = 1 token

  // Tính số tiền USD tương đương
  const usdAmount = value ? (Number(value) / VND_TO_USD_RATE).toFixed(2) : "0.00";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Chỉ chấp nhận số
    const numericValue = e.target.value.replace(/\D/g, "");
    const numAmount = Number(numericValue);

    // Kiểm tra điều kiện tối thiểu
    if (numAmount > 0 && numAmount < minAmount) {
      setError(`Số tiền tối thiểu là $1 (${minAmount.toLocaleString("vi-VN")} VND)`);
      onChange(numericValue, false);
    } else {
      setError("");
      onChange(numericValue, true);
    }
  };

  return (
    <div className="mt-6">
      <label htmlFor="customAmount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        Hoặc nhập số tiền tùy chỉnh
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
            } bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg shadow-sm`}
            placeholder="Nhập số tiền VND"
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
            value={`$${usdAmount}`}
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
            Bạn sẽ nhận được <span className="font-semibold text-blue-600 dark:text-blue-400">{tokenEstimate}</span>{" "}
            tokens
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span className="italic">1 token = $1 = {VND_TO_USD_RATE.toLocaleString("vi-VN")} VND</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomAmountInput;
