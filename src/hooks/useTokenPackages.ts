import { useState, useMemo } from "react";
import { useExchangeRates } from "./useExchangeRates";

const SUGGESTED_PACKAGES = [
    { tokens: 10, amount: 250000 },
    { tokens: 20, amount: 500000 },
    { tokens: 50, amount: 1250000 },
    { tokens: 100, amount: 2500000 },
];

export const useTokenPackages = () => {
    const [activePackage, setActivePackage] = useState<number>(0);
    const [amount, setAmount] = useState<number>(SUGGESTED_PACKAGES[0].amount);
    const [customAmount, setCustomAmount] = useState<string>("");
    const [isValidAmount, setIsValidAmount] = useState<boolean>(true);

    const { rates } = useExchangeRates();

    const tokenEstimate = useMemo(() => {
        const amountUsd = amount / rates.vndToUsdRate;
        return Math.floor(amountUsd * rates.usdToTokenRate);
    }, [amount, rates]);

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

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
        }).format(value);
    };

    return {
        packages: SUGGESTED_PACKAGES,
        activePackage,
        amount,
        customAmount,
        isValidAmount,
        tokenEstimate,
        handleSelectPackage,
        handleCustomAmountChange,
        formatCurrency
    };
};