import CustomAmountInput from "@/components/users/deposit/CustomAmountInput";
import TokenPackages from "@/components/users/deposit/TokenPackages";
import { useExchangeRates } from "@/hooks/useExchangeRates";
import { useUserData } from "@/hooks/useUserData";
import { Bitcoin, Info } from "lucide-react";
import { useState } from "react";

const CRYPTO_PACKAGES = [
  { tokens: 10, amount: 10 },
  { tokens: 20, amount: 20 },
  { tokens: 50, amount: 50 },
  { tokens: 100, amount: 100 },
];

const SUPPORTED_CRYPTO = [
  { id: "btc", name: "Bitcoin", icon: "₿" },
  { id: "eth", name: "Ethereum", icon: "Ξ" },
  { id: "usdt", name: "USDT", icon: "₮" },
  { id: "usdc", name: "USDC", icon: "₮" },
];

export default function CryptomusTab() {
  const { data: userData } = useUserData();
  const [amount, setAmount] = useState<number>(10);
  const [activePackage, setActivePackage] = useState<number>(0);
  const [selectedCrypto, setSelectedCrypto] = useState<string>("btc");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [, setIsValidAmount] = useState<boolean>(true);
  const { rates } = useExchangeRates();

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
      setAmount(CRYPTO_PACKAGES[0].amount);
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

  const handleCryptoCheckout = () => {
    console.log("Processing crypto payment:", amount, "USD in", selectedCrypto);
  };

  return (
    <div className="bg-white dark:bg-black  p-6 sm:p-8">
      <div className=" mx-auto">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Choose the number of credits</h2>
          <TokenPackages
            packages={CRYPTO_PACKAGES}
            activePackage={activePackage}
            onSelectPackage={handleSelectPackage}
            formatCurrency={formatCurrency}
          />
          <CustomAmountInput value={customAmount} onChange={handleCustomAmountChange} />
        </div>

        <div className="mb-8">
          <h3 className="text-md font-medium text-slate-800 dark:text-white mb-4">Chọn loại tiền điện tử</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SUPPORTED_CRYPTO.map((crypto) => (
              <div
                key={crypto.id}
                className={`border-2 rounded-lg p-3 text-center cursor-pointer transition-all ${
                  selectedCrypto === crypto.id
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                }`}
                onClick={() => setSelectedCrypto(crypto.id)}
              >
                <div className="text-2xl mb-1">{crypto.icon}</div>
                <div
                  className={`text-sm font-medium ${
                    selectedCrypto === crypto.id
                      ? "text-blue-700 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {crypto.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
            <h3 className="text-md font-medium text-blue-800 dark:text-blue-300 mb-2">Thông tin thanh toán</h3>
            <div className="text-blue-700 dark:text-blue-200">
              <p className="mb-1">Tài khoản: {userData?.email || "..."}</p>
              <p className="mb-1">Số tiền: {formatCurrency(amount)}</p>
              <p className="mb-1">Loại tiền điện tử: {SUPPORTED_CRYPTO.find((c) => c.id === selectedCrypto)?.name}</p>
              <p className="mb-1">Số token nhận được: {Math.floor(amount * rates.usdToTokenRate)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center p-4 mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <Info className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0" />
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Thanh toán bằng tiền điện tử có thể mất từ 10-30 phút để xác nhận trên blockchain. Token sẽ được cộng vào
            tài khoản của bạn sau khi giao dịch được xác nhận.
          </p>
        </div>

        <button
          onClick={handleCryptoCheckout}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg py-3 px-6 font-medium transition-colors flex items-center justify-center"
        >
          <Bitcoin className="h-5 w-5 mr-2" />
          Thanh toán bằng {SUPPORTED_CRYPTO.find((c) => c.id === selectedCrypto)?.name}
        </button>

        <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">
            <strong>Lưu ý:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Đảm bảo bạn gửi đúng loại tiền điện tử đã chọn.</li>
            <li>Không gửi tiền từ sàn giao dịch không hỗ trợ mạng chúng tôi đang sử dụng.</li>
            <li>
              Giá trị của tiền điện tử có thể thay đổi giữa thời điểm bạn thực hiện giao dịch và thời điểm giao dịch
              được xác nhận.
            </li>
            <li>Nếu bạn gặp vấn đề trong quá trình thanh toán, vui lòng liên hệ hỗ trợ và cung cấp ID giao dịch.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
