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
    isCustom,
    calculatedTokens,
    handleSelectPackage,
    handleCustomAmountChange,
    formatCurrency,
    isLoading: isPackagesLoading,
  } = useTokenPackages();

  const [transferContent, setTransferContent] = useState<string>("");
  useEffect(() => {
    if (!userData?.paymentCode) return;
    const baseContent = `${BANK_CONFIG.prefixCode} ${userData.paymentCode} ${BANK_CONFIG.suffixCode}`;
    const fullContent = isCustom === false ? `${baseContent} ${calculatedTokens.totalTokens}` : baseContent;
    console.log(fullContent);
    setTransferContent(fullContent);
  }, [userData?.paymentCode, isCustom, calculatedTokens.totalTokens]);

  const { qrCodeUrl } = useQRCode({
    amount,
    transferContent,
    bankConfig: BANK_CONFIG,
  });
  const { copied, handleCopy } = useCopyToClipboard();
  if (isUserLoading || isPackagesLoading) {
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
    <div className="grid grid-cols-1 lg:grid-cols-3 ">
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-black rounded-xl mx-6">
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
              isCustom={isCustom}
              calculatedTokens={calculatedTokens}
            />
            <CustomAmountInput
              value={customAmount}
              onChange={(value, isValid) => handleCustomAmountChange(value, isValid)}
            />
          </div>

          {/* Transfer information */}
          <BankTransferInfo
            bankConfig={BANK_CONFIG}
            amount={amount}
            transferContent={transferContent}
            onCopy={handleCopy}
            copied={copied}
            formatCurrency={formatCurrency}
            credits={calculatedTokens.totalTokens}
            isCustom={isCustom}
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
