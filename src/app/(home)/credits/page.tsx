"use client";

import copy from "clipboard-copy";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";

import PaymentNotification from "@/components/users/PaymentNotification";
import BankTransferInfo from "@/components/users/deposit/BankTransferInfo";
import CustomAmountInput from "@/components/users/deposit/CustomAmountInput";
import ImportantNotes from "@/components/users/deposit/ImportantNotes";
import QRCodeDisplay from "@/components/users/deposit/QRCodeDisplay";
import TokenPackages from "@/components/users/deposit/TokenPackages";

import { useUserData } from "@/hooks/useUserData";

const BANK_CONFIG = {
  bankName: "ACB",
  accountNumber: "6959741",
  accountName: "CA VAN QUE",
  prefixCode: "TB",
  suffixCode: "AI",
};

const SUGGESTED_PACKAGES = [
  { tokens: 10, amount: 250000 },
  { tokens: 20, amount: 500000 },
  { tokens: 50, amount: 1250000 },
  { tokens: 100, amount: 2500000 },
];

const MIN_AMOUNT = 25000;

export default function DepositPage() {
  const { session, sessionStatus, data: userData, isLoading } = useUserData();

  const [amount, setAmount] = useState<number>(250000);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [transferContent, setTransferContent] = useState<string>("");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [activePackage, setActivePackage] = useState<number>(0);
  const [tokenEstimate, setTokenEstimate] = useState<number>(10);
  const [transactionId, setTransactionId] = useState<string>(`QRPAY${Date.now()}`);
  const [isValidAmount, setIsValidAmount] = useState<boolean>(true);

  useEffect(() => {
    if (userData?.paymentCode) {
      const content = `${BANK_CONFIG.prefixCode} ${userData.paymentCode} ${BANK_CONFIG.suffixCode}`;
      setTransferContent(content);
      setTokenEstimate(Math.floor(amount / MIN_AMOUNT));
      const vietQrUrl = `https://img.vietqr.io/image/ACB-${
        BANK_CONFIG.accountNumber
      }-compact.jpg?amount=${amount}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(
        BANK_CONFIG.accountName
      )}`;
      setQrCodeUrl(vietQrUrl);
    }
  }, [amount, userData?.paymentCode]);

  useEffect(() => {
    setTransactionId(`QRPAY${Date.now()}`);
  }, [amount]);

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

  const handleCopy = (text: string) => {
    copy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (sessionStatus === "loading" || (sessionStatus === "authenticated" && isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="animate-pulse flex space-x-2">
          <div className="h-3 w-3 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
          <div className="h-3 w-3 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
          <div className="h-3 w-3 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
        <div className="w-full max-w-md p-6 bg-white dark:bg-slate-800 rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-white">Yêu cầu đăng nhập</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6 text-center">
            Vui lòng đăng nhập để sử dụng tính năng nạp token
          </p>
          <button
            onClick={() => signIn()}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 py-6">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-xl overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <h1 className="text-xl sm:text-xl font-bold text-white">Nạp Token qua Chuyển khoản Ngân hàng</h1>
            <p className="text-blue-100 mt-2 max-w-2xl">
              Chuyển khoản ngân hàng để nạp token vào tài khoản của bạn. Token sẽ được cộng tự động sau khi hệ thống xác
              nhận giao dịch.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
              {/* Thông báo giao dịch */}
              {userData?.id && (
                <div className="mb-6">
                  <PaymentNotification userId={userData.id} transactionId={transactionId} />
                </div>
              )}

              {/* Gói token */}
              <div className="mb-10">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Chọn số lượng token</h2>
                <TokenPackages
                  packages={SUGGESTED_PACKAGES}
                  activePackage={activePackage}
                  onSelectPackage={handleSelectPackage}
                  formatCurrency={formatCurrency}
                />
                <CustomAmountInput
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  tokenEstimate={tokenEstimate}
                  minAmount={MIN_AMOUNT}
                />
              </div>

              {/* Thông tin chuyển khoản */}
              <BankTransferInfo
                bankConfig={BANK_CONFIG}
                amount={amount}
                transferContent={transferContent}
                onCopy={handleCopy}
                copied={copied}
                formatCurrency={formatCurrency}
              />

              <div className="mt-8">
                <ImportantNotes />
              </div>
            </div>
          </div>

          {/* Mã QR */}
          <div className="lg:col-span-1">
            <QRCodeDisplay qrCodeUrl={qrCodeUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
