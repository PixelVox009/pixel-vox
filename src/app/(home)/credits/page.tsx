"use client";

import PaymentNotification from "@/components/users/PaymentNotification";
import copy from "clipboard-copy";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

// Cấu hình ngân hàng (trong thực tế nên lấy từ database hoặc env)
const BANK_CONFIG = {
  bankName: "ACB",
  accountNumber: "6959741",
  accountName: "CA VAN QUE",
  prefixCode: "TB",
  suffixCode: "AI",
};
// Các gói token được đề xuất
const SUGGESTED_PACKAGES = [
  { tokens: 10, amount: 250000 },
  { tokens: 20, amount: 500000 },
  { tokens: 50, amount: 1250000 },
  { tokens: 100, amount: 2500000 },
];

export default function DepositPage() {
  const { data: session, status } = useSession();
  const [amount, setAmount] = useState<number>(250000); // Mặc định 10 token
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [transferContent, setTransferContent] = useState<string>("");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [activePackage, setActivePackage] = useState<number>(0);
  const [tokenEstimate, setTokenEstimate] = useState<number>(10);
  const [userData, setUserData] = useState<any>(null);
  const [transactionId, setTransactionId] = useState<string>(`QRPAY${Date.now()}`);

  // Lấy thông tin người dùng khi đã đăng nhập
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user) {
        try {
          const response = await fetch(`/api/user/me`);
          const userData = await response.json();
          setUserData({
            id: session.user.id || "123",
            paymentCode: userData.paymentCode,
            name: session.user.name,
            email: session.user.email,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    if (status === "authenticated") {
      fetchUserData();
    }
  }, [session, status]);

  // Tạo nội dung chuyển khoản
  useEffect(() => {
    if (userData?.paymentCode) {
      const content = `${BANK_CONFIG.prefixCode} ${userData.paymentCode} ${BANK_CONFIG.suffixCode}`;
      setTransferContent(content);

      // Tính toán số token
      setTokenEstimate(Math.floor(amount / 25000));

      // Tạo mã QR VietQR
      const vietQrUrl = `https://img.vietqr.io/image/ACB-${
        BANK_CONFIG.accountNumber
      }-compact.jpg?amount=${amount}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(
        BANK_CONFIG.accountName
      )}`;
      setQrCodeUrl(vietQrUrl);
    }
  }, [amount, userData?.paymentCode]);

  // Tạo mã giao dịch mới khi thay đổi số tiền
  useEffect(() => {
    setTransactionId(`QRPAY${Date.now()}`);
  }, [amount]);

  // Xử lý chọn gói token
  const handleSelectPackage = (index: number, packageAmount: number) => {
    setActivePackage(index);
    setAmount(packageAmount);
    setCustomAmount("");
  };

  // Xử lý nhập số tiền tùy chỉnh
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCustomAmount(value);
    if (Number(value) > 0) {
      setAmount(Number(value));
      setActivePackage(-1);
    } else {
      setAmount(SUGGESTED_PACKAGES[0].amount);
      setActivePackage(0);
    }
  };

  // Xử lý sao chép nội dung
  const handleCopy = (text: string) => {
    copy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format số tiền
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Loading state khi đang kiểm tra phiên
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Đang tải...</p>
      </div>
    );
  }

  // Yêu cầu đăng nhập nếu chưa đăng nhập
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <p className="text-gray-700 mb-4">Vui lòng đăng nhập để sử dụng tính năng nạp token</p>
        <button
          onClick={() => signIn()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 p-4 text-white">
            <h1 className="text-xl font-bold">Nạp Token qua Chuyển khoản Ngân hàng</h1>
            <p className="text-sm mt-1 text-blue-100">Chuyển khoản ngân hàng để nạp token vào tài khoản của bạn</p>
          </div>

          <div className="p-6">
            {/* Hiển thị thông báo thanh toán nếu có */}
            {userData?.id && <PaymentNotification userId={userData.id} transactionId={transactionId} />}

            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-3">Chọn số lượng token</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {SUGGESTED_PACKAGES.map((pkg, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectPackage(index, pkg.amount)}
                    className={`border rounded-lg p-3 text-center ${
                      activePackage === index
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-bold text-lg">{pkg.tokens} tokens</div>
                    <div className="text-sm text-gray-500">{formatCurrency(pkg.amount)}</div>
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <label htmlFor="customAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Hoặc nhập số tiền tùy chỉnh
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="customAmount"
                    id="customAmount"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 pr-12 py-3 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Nhập số tiền VND"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">VND</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Bạn sẽ nhận được <span className="font-medium text-blue-600">{tokenEstimate}</span> tokens
                  <span className="italic"> (1 token = 25,000 VND)</span>
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Thông tin chuyển khoản</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="mb-3">
                      <p className="text-sm text-gray-500">Ngân hàng</p>
                      <p className="font-medium">{BANK_CONFIG.bankName}</p>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-gray-500">Số tài khoản</p>
                      <div className="flex items-center">
                        <p className="font-medium">{BANK_CONFIG.accountNumber}</p>
                        <button
                          onClick={() => handleCopy(BANK_CONFIG.accountNumber)}
                          className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Sao chép
                        </button>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-gray-500">Chủ tài khoản</p>
                      <p className="font-medium">{BANK_CONFIG.accountName}</p>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-gray-500">Số tiền</p>
                      <div className="flex items-center">
                        <p className="font-medium">{formatCurrency(amount)}</p>
                        <button
                          onClick={() => handleCopy(amount.toString())}
                          className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Sao chép
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nội dung chuyển khoản</p>
                      <div className="flex items-center">
                        <p className="font-medium bg-yellow-50 p-1 border border-yellow-200 rounded">
                          {transferContent}
                        </p>
                        <button
                          onClick={() => handleCopy(transferContent)}
                          className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          {copied ? "Đã sao chép!" : "Sao chép"}
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-red-500 font-medium">
                        * Vui lòng nhập chính xác nội dung chuyển khoản
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm text-gray-500 mb-2">Quét mã QR để thanh toán</p>
                  <div className="bg-white p-2 border rounded-lg shadow-sm">
                    {qrCodeUrl && (
                      <Image
                        src={qrCodeUrl}
                        alt="QR Code chuyển khoản"
                        width={200}
                        height={200}
                        className="w-full h-auto"
                        unoptimized
                      />
                    )}
                  </div>
                  <p className="mt-2 text-xs text-gray-500 text-center max-w-xs">
                    Sử dụng app ngân hàng để quét mã QR này hoặc nhập thông tin chuyển khoản thủ công
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 rounded-lg p-4">
              <h3 className="text-blue-800 font-medium mb-2">Lưu ý quan trọng:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Token sẽ được tự động cộng vào tài khoản sau khi hệ thống xác nhận giao dịch (5-15 phút)</li>
                <li>• Vui lòng điền chính xác nội dung chuyển khoản để hệ thống xác nhận tự động</li>
                <li>• Nếu cần hỗ trợ, vui lòng liên hệ hotline: 1900 xxxx</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
