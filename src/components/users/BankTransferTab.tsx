import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useQRCode } from "@/hooks/useQRCode";
import { useTokenPackages } from "@/hooks/useTokenPackages";
import { useUserData } from "@/hooks/useUserData";
import { useEffect, useState } from "react";

import PaymentNotification from "@/components/users/PaymentNotification";
import BankTransferInfo from "@/components/users/deposit/BankTransferInfo";
import CustomAmountInput from "@/components/users/deposit/CustomAmountInput";
import ImportantNotes from "@/components/users/deposit/ImportantNotes";
import QRCodeDisplay from "@/components/users/deposit/QRCodeDisplay";
import TokenPackages from "@/components/users/deposit/TokenPackages";

const BANK_CONFIG = {
  bankName: "ACB",
  accountNumber: "6959741",
  accountName: "CA VAN QUE",
  prefixCode: "TB",
  suffixCode: "AI",
};

export default function BankTransferTab() {
  const { data: userData, isLoading: isUserLoading } = useUserData();

  const {
    packages,
    activePackage,
    amount,
    customAmount,
    handleSelectPackage,
    handleCustomAmountChange,
    formatCurrency,
  } = useTokenPackages();

  const [transferContent, setTransferContent] = useState<string>("");

  useEffect(() => {
    if (userData?.paymentCode) {
      const content = `${BANK_CONFIG.prefixCode} ${userData.paymentCode} ${BANK_CONFIG.suffixCode}`;
      setTransferContent(content);
    }
  }, [userData?.paymentCode]);

  const { qrCodeUrl } = useQRCode({
    amount,
    transferContent,
    bankConfig: BANK_CONFIG,
  });

  const { copied, handleCopy } = useCopyToClipboard();

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-pulse flex space-x-2">
          <div className="h-3 w-3 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
          <div className="h-3 w-3 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
          <div className="h-3 w-3 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mx-8">
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-slate-800 rounded-xl ">
          {userData?.id && (
            <div className="mb-6">
              <PaymentNotification userId={userData.id} />
            </div>
          )}

          {/* Gói token */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Choose the number of credits</h2>
            <TokenPackages
              packages={packages}
              activePackage={activePackage}
              onSelectPackage={handleSelectPackage}
              formatCurrency={formatCurrency}
            />
            <CustomAmountInput value={customAmount} onChange={handleCustomAmountChange} />
          </div>

          {/* Transfer information */}
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
  );
}
