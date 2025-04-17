import React, { useEffect, useState } from "react";

interface TokenPackage {
  tokens: number;
  amount: number;
}

interface TokenPackagesProps {
  packages: TokenPackage[];
  activePackage: number;
  onSelectPackage: (index: number, amount: number) => void;
  formatCurrency: (value: number) => string;
}

const TokenPackages: React.FC<TokenPackagesProps> = ({ packages, activePackage, onSelectPackage, formatCurrency }) => {
  const [exchangeRate, setExchangeRate] = useState<number>(25000);
  const [usdToTokenRate, setUsdToTokenRate] = useState<number>(10);

  // Lấy tỷ giá từ server
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch("/api/settings/exchange-rates");
        if (response.ok) {
          const data = await response.json();
          setExchangeRate(data.vndToUsdRate || 25000);
          setUsdToTokenRate(data.usdToTokenRate || 10);
        }
      } catch (error) {
        console.error("Lỗi khi lấy tỷ giá:", error);
        // Sử dụng giá trị mặc định nếu có lỗi
      }
    };

    fetchExchangeRates();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {packages.map((pkg, index) => {
        // Tính số USD tương đương
        const usdAmount = (pkg.amount / exchangeRate).toFixed(2);

        // Tính số token tương đương với USD
        const tokenAmount = Math.floor(Number(usdAmount) * usdToTokenRate);

        return (
          <button
            key={index}
            onClick={() => onSelectPackage(index, pkg.amount)}
            className={`relative overflow-hidden border-2 rounded-xl p-4 text-center transition-all ${
              activePackage === index
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            {activePackage === index && (
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[24px] border-r-[24px] border-t-blue-500 border-r-transparent transform rotate-90"></div>
            )}
            <div className="font-bold text-xl mb-1">{tokenAmount} credits</div>
            <div className="text-base text-blue-600 dark:text-blue-400 font-medium">${usdAmount}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{formatCurrency(pkg.amount)}</div>
          </button>
        );
      })}
    </div>
  );
};

export default TokenPackages;
