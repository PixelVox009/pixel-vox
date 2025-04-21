// src/hooks/useTokenPackages.ts
import { useExchangeRates } from "@/hooks/useExchangeRates";
import { useFirstRecharge } from "@/hooks/useFirstRecharge";
import { useCallback, useMemo, useState } from "react";

// Các gói nạp tiền định sẵn
const DEFAULT_PACKAGES = [
    { tokens: 1000, amount: 250000 },
    { tokens: 2000, amount: 500000 },
    { tokens: 5000, amount: 1250000 },
    { tokens: 10000, amount: 2500000 },
];

export function useTokenPackages() {
    const [activePackage, setActivePackage] = useState<number>(-1);
    const [customAmount, setCustomAmount] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);
    const [isCustom, setIsCustom] = useState<boolean>(true);
    const { rates, isLoading: isRatesLoading } = useExchangeRates();
    const { isFirstRecharge } = useFirstRecharge();
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
        }).format(value);
    };
    const calculateBonus = useCallback((usdAmount: number, isCustomInput = false): number => {
        if (isCustomInput) return 0;
        if (isFirstRecharge) return 50;
        if (usdAmount >= 100) return 15;
        if (usdAmount >= 50) return 10;
        if (usdAmount >= 20) return 5;
        return 0;
    }, [isFirstRecharge]);

    const packages = useMemo(() => {
        return DEFAULT_PACKAGES.map((pkg) => {
            const usdAmount = Number((pkg.amount / rates.vndToUsdRate).toFixed(2));
            const bonusPercent = calculateBonus(usdAmount, false);
            const bonusTokens = Math.floor((pkg.tokens * bonusPercent) / 100);
            return {
                ...pkg,
                bonusTokens,
                totalTokens: pkg.tokens + bonusTokens,
            };
        });
    }, [rates.vndToUsdRate, calculateBonus]);

    const calculatedTokens = useMemo(() => {
        if (amount <= 0) return { baseTokens: 0, bonusTokens: 0, totalTokens: 0, bonusPercent: 0, usdAmount: 0 };
        const usdAmount = Number((amount / rates.vndToUsdRate).toFixed(2));
        const baseTokens = Math.floor(usdAmount * rates.usdToTokenRate);
        const bonusPercent = calculateBonus(usdAmount, isCustom);
        const bonusTokens = Math.floor((baseTokens * bonusPercent) / 100);
        return {
            baseTokens,
            bonusTokens,
            totalTokens: baseTokens + bonusTokens,
            bonusPercent,
            usdAmount
        };
    }, [amount, rates, isCustom, calculateBonus]);
    const handleSelectPackage = (index: number, amount: number) => {
        setActivePackage(index);
        setAmount(amount);
        setCustomAmount("");
        setIsCustom(false);
    };
    const handleCustomAmountChange = (value: string, isValid: boolean = true) => {
        setCustomAmount(value);
        const numericValue = value ? parseInt(value.replace(/[,.]/g, ""), 10) : 0;
        if (numericValue > 0 && isValid) {
            setActivePackage(-1);
            setAmount(numericValue);
            setIsCustom(true);
        } else {
            setAmount(0);
            setIsCustom(false);
        }
    };
    return {
        packages,
        activePackage,
        amount,
        customAmount,
        isCustom,
        handleSelectPackage,
        handleCustomAmountChange,
        formatCurrency,
        calculatedTokens,
        isLoading: isRatesLoading,
    };
}