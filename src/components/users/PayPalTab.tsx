import CustomAmountInput from "@/components/users/deposit/CustomAmountInput";
import TokenPackages from "@/components/users/deposit/TokenPackages";
import { useUserData } from "@/hooks/useUserData";
import { useEffect, useState } from "react";

const SUGGESTED_PACKAGES = [
  { tokens: 10, amount: 10 },
  { tokens: 20, amount: 20 },
  { tokens: 50, amount: 50 },
  { tokens: 100, amount: 100 },
];

export default function PayPalTab() {
  const { data: userData } = useUserData();
  const [amount, setAmount] = useState<number>(10);
  const [activePackage, setActivePackage] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [, setIsValidAmount] = useState<boolean>(true);
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

  const handleSelectPackage = (index: number, packageAmount: number) => {
    setActivePackage(index);
    setAmount(packageAmount);
    setCustomAmount("");
    setIsValidAmount(true);
  };

  const handleCustomAmountChange = (value: string, isValid: boolean) => {
    setCustomAmount(value);
    setIsValidAmount(isValid);
    if (Number(value) > 0) {
      setAmount(Number(value));
      setActivePackage(-1);
    } else {
      setAmount(SUGGESTED_PACKAGES[0].amount);
      setActivePackage(0);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handlePayPalCheckout = () => {
    // Implement PayPal checkout logic here
    console.log("Processing PayPal payment for:", amount, "USD");
    // Redirect to PayPal or show PayPal button
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Chọn số lượng token</h2>
          <TokenPackages
            packages={SUGGESTED_PACKAGES}
            activePackage={activePackage}
            onSelectPackage={handleSelectPackage}
            formatCurrency={formatCurrency}
          />
          <CustomAmountInput value={customAmount} onChange={handleCustomAmountChange} />
        </div>

        <div className="mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
            <h3 className="text-md font-medium text-blue-800 dark:text-blue-300 mb-2">Thông tin thanh toán</h3>
            <div className="text-blue-700 dark:text-blue-200">
              <p className="mb-1">Tài khoản: {userData?.email || "..."}</p>
              <p className="mb-1">Số tiền: {formatCurrency(amount)}</p>
              <p className="mb-1">Số token nhận được: {Math.floor(amount * exchangeRates.usdToTokenRate)}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handlePayPalCheckout}
          className="w-full bg-[#0070ba] hover:bg-[#003087] text-white rounded-lg py-3 px-6 font-medium transition-colors"
        >
          Thanh toán với PayPal
        </button>

        <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">
            <strong>Lưu ý:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Token sẽ được cộng vào tài khoản của bạn ngay sau khi thanh toán thành công.</li>
            <li>Giao dịch qua PayPal có thể mất phí xử lý tùy theo khu vực của bạn.</li>
            <li>Vui lòng liên hệ hỗ trợ nếu bạn gặp vấn đề trong quá trình thanh toán.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
