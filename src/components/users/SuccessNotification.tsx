import { ExchangeRates } from "@/types/month";
import { Payment } from "@/types/payment";
import { CheckIcon, XIcon } from "lucide-react";
import React from "react";

interface SuccessNotificationProps {
  payment: Payment;
  exchangeRates: ExchangeRates;
  formatVndToUsd: (amount: number) => string;
  onClose: () => void;
}

const SuccessNotification: React.FC<SuccessNotificationProps> = ({
  payment,
  exchangeRates,
  formatVndToUsd,
  onClose,
}) => {
  const usdAmount = formatVndToUsd(payment.amount);

  return (
    <div className="mt-6 relative">
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-green-700 hover:text-green-900"
          aria-label="Đóng thông báo"
        >
          <XIcon className="h-5 w-5" />
        </button>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <CheckIcon className="h-5 w-5 text-green-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-green-800 font-medium">Thanh toán thành công!</h3>
            <div className="mt-2 text-sm text-green-700">
              <p>
                Bạn đã nạp thành công ${usdAmount} ({payment.amount.toLocaleString("vi-VN")} VND) vào lúc{" "}
                {new Date(payment.createdAt).toLocaleString("vi-VN")}.
              </p>
              <p className="font-medium">Số token nhận được: {payment.tokensEarned}</p>
              <p className="text-xs mt-1">
                <span className="italic">
                  1 USD = {exchangeRates.usdToTokenRate} token = {exchangeRates.vndToUsdRate} VND
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessNotification;
