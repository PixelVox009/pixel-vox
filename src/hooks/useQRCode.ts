import { useMemo } from "react";

interface UseQRCodeProps {
    amount: number;
    transferContent: string;
    bankConfig: {
        accountNumber: string;
        accountName: string;
    };
}

export const useQRCode = ({ amount, transferContent, bankConfig }: UseQRCodeProps) => {
    const qrCodeUrl = useMemo(() => {
        if (!transferContent) return "";

        return `https://img.vietqr.io/image/ACB-${bankConfig.accountNumber
            }-compact.jpg?amount=${amount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(
                bankConfig.accountName
            )}`;
    }, [amount, transferContent, bankConfig]);

    return { qrCodeUrl };
};