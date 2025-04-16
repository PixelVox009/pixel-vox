import React from "react";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import ErrorNotification from "./ErrorNotification";
import SuccessNotification from "./SuccessNotification";
import PendingNotification from "./PendingNotification";


interface PaymentNotificationProps {
  userId: string;
  transactionId?: string;
}

const PaymentNotification: React.FC<PaymentNotificationProps> = ({ userId }) => {
  const {
    latestPayment,
    showNotification,
    checkCount,
    exchangeRates,
    error,
    isLoading,
    formatVndToUsd,
    hideNotification,
  } = usePaymentStatus(userId);

  if (error) {
    return <ErrorNotification />;
  }

  if ((isLoading && checkCount === 0) || !showNotification) {
    return null;
  }

  if (latestPayment && showNotification) {
    return (
      <SuccessNotification
        payment={latestPayment}
        exchangeRates={exchangeRates}
        formatVndToUsd={formatVndToUsd}
        onClose={hideNotification}
      />
    );
  }

  if (!latestPayment && showNotification) {
    return <PendingNotification checkCount={checkCount} onClose={hideNotification} />;
  }

  return null;
};

export default PaymentNotification;
