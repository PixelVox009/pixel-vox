import React, { useState, useEffect } from "react";

interface PaymentNotificationProps {
  userId: string;
  transactionId?: string;
}

const PaymentNotification: React.FC<PaymentNotificationProps> = ({ userId, transactionId }) => {
  const [loading, setLoading] = useState(true);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [checkCount, setCheckCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Kiểm tra thanh toán mỗi 30 giây
  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/credits/check-payment?userId=${userId}`);
        if (!response.ok) {
          throw new Error("Không thể kiểm tra trạng thái thanh toán");
        }

        const data = await response.json();
        if (data.recentPayments && data.recentPayments.length > 0) {
          setRecentPayments(data.recentPayments);
        }
      } catch (err) {
        console.error("Lỗi kiểm tra thanh toán:", err);
        setError("Không thể kiểm tra trạng thái thanh toán");
      } finally {
        setLoading(false);
        setCheckCount((prev) => prev + 1);
      }
    };

    // Kiểm tra ngay lần đầu
    checkPaymentStatus();

    // Thiết lập kiểm tra định kỳ
    const interval = setInterval(checkPaymentStatus, 30000); // 30 giây

    // Ngừng kiểm tra sau 10 phút (20 lần kiểm tra)
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 10 * 60 * 1000); // 10 phút

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [userId]);

  if (error) {
    return (
      <div className="mt-4 p-4 bg-red-50 rounded-md border border-red-200">
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    );
  }

  // Không hiển thị gì nếu đang tải lần đầu tiên
  if (loading && checkCount === 0) {
    return null;
  }

  // Hiển thị thông báo nếu có thanh toán gần đây
  if (recentPayments.length > 0) {
    return (
      <div className="mt-6">
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
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
              {recentPayments.map((payment, index) => (
                <div key={index} className="mt-2 text-sm text-green-700">
                  <p>
                    Bạn đã nạp thành công {payment.amount.toLocaleString("vi-VN")} VND vào lúc{" "}
                    {new Date(payment.createdAt).toLocaleString("vi-VN")}.
                  </p>
                  <p className="font-medium">Số token nhận được: {payment.tokensEarned}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị trạng thái chờ nếu đã kiểm tra ít nhất một lần
  return (
    <div className="mt-6 bg-blue-50 p-4 rounded-md">
      <p className="text-blue-700 text-sm">
        Hệ thống đang chờ xác nhận thanh toán từ ngân hàng. Thông báo sẽ xuất hiện ở đây khi thanh toán được xác nhận.
        {checkCount > 1 && ` (Đã kiểm tra ${checkCount} lần)`}
      </p>
    </div>
  );
};

export default PaymentNotification;
