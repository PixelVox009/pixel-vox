import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface PaymentNotificationProps {
  userId: string;
  transactionId?: string;
}

interface Payment {
  amount: number;
  createdAt: string;
  tokensEarned: number;
  _id: string;
}
const VND_TO_USD_RATE = 25000; 

const fetchPaymentData = async (userId: string) => {
  const response = await fetch(`/api/credits/check-payment?userId=${userId}`);
  if (!response.ok) {
    throw new Error("Không thể kiểm tra trạng thái thanh toán");
  }
  const data = await response.json();
  return data;
};

const PaymentNotification: React.FC<PaymentNotificationProps> = ({ userId, transactionId }) => {
  const [latestPayment, setLatestPayment] = useState<Payment | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [checkCount, setCheckCount] = useState(0);
  const { data, error, isLoading } = useQuery({
    queryKey: ["paymentStatus", userId],
    queryFn: () => fetchPaymentData(userId),
    refetchInterval: 30000, 
    refetchOnWindowFocus: false,
    staleTime: 10000, 
    enabled: !!userId, 
  });
  useEffect(() => {
    if (data?.recentPayments && data.recentPayments.length > 0) {
      const mostRecentPayment = data.recentPayments.sort(
        (a: Payment, b: Payment) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      if (!latestPayment || mostRecentPayment._id !== latestPayment._id) {
        setLatestPayment(mostRecentPayment);
        setShowNotification(true);
        const hideTimer = setTimeout(() => {
          setShowNotification(false);
        }, 30000);
        return () => clearTimeout(hideTimer);
      }
    }
    if (!isLoading) {
      setCheckCount((prev) => prev + 1);
    }
  }, [data, latestPayment, isLoading]);
  useEffect(() => {
    const stopRefetchTimeout = setTimeout(() => {
    }, 10 * 60 * 1000);
    return () => clearTimeout(stopRefetchTimeout);
  }, []);
  const formatVndToUsd = (vndAmount: number) => {
    const usdAmount = vndAmount / VND_TO_USD_RATE;
    return usdAmount.toFixed(2);
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };
  if (error) {
    return (
      <div className="mt-4 p-4 bg-red-50 rounded-md border border-red-200">
        <p className="text-red-700 text-sm">Không thể kiểm tra trạng thái thanh toán</p>
      </div>
    );
  }
  if ((isLoading && checkCount === 0) || !showNotification) {
    return null;
  }

  if (latestPayment && showNotification) {
    const usdAmount = formatVndToUsd(latestPayment.amount);

    return (
      <div className="mt-6 relative">
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
          <button
            onClick={handleCloseNotification}
            className="absolute top-2 right-2 text-green-700 hover:text-green-900"
            aria-label="Đóng thông báo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-green-800 font-medium">Thanh toán thành công!</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Bạn đã nạp thành công ${usdAmount} ({latestPayment.amount.toLocaleString("vi-VN")} VND) vào lúc{" "}
                  {new Date(latestPayment.createdAt).toLocaleString("vi-VN")}.
                </p>
                <p className="font-medium">Số token nhận được: {latestPayment.tokensEarned}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!latestPayment && showNotification) {
    return (
      <div className="mt-6 bg-blue-50 p-4 rounded-md relative">
        <button
          onClick={handleCloseNotification}
          className="absolute top-2 right-2 text-blue-700 hover:text-blue-900"
          aria-label="Đóng thông báo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <p className="text-blue-700 text-sm">
          Hệ thống đang chờ xác nhận thanh toán từ ngân hàng. Thông báo sẽ xuất hiện ở đây khi thanh toán được xác nhận.
          {checkCount > 1 && ` (Đã kiểm tra ${checkCount} lần)`}
        </p>
      </div>
    );
  }

  return null;
};

export default PaymentNotification;
