<<<<<<< HEAD
"use client"
=======
"use client";
>>>>>>> 64c64e6ee45324cd7123d8055e67ecf56831e689
import { useEffect, useState } from 'react';

interface ExchangeRates {
    vndToUsdRate: number;
    usdToTokenRate: number;
}

// Hook để lấy tỷ giá từ API
export const useExchangeRates = () => {
    const [rates, setRates] = useState<ExchangeRates>({
        vndToUsdRate: 25000, 
        usdToTokenRate: 10, 
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await fetch('/api/settings/exchange-rates');
                if (response.ok) {
                    const data = await response.json();
                    setRates({
                        vndToUsdRate: data.vndToUsdRate || 25000,
                        usdToTokenRate: data.usdToTokenRate || 10,
                    });
                }
            } catch (error) {
                console.error('Lỗi khi lấy tỷ giá:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRates();
    }, []);

    return { rates, loading };
};


export const formatVndToUsd = (vndAmount: number, vndToUsdRate: number = 25000) => {
    const usdAmount = vndAmount / vndToUsdRate;
    return usdAmount.toFixed(2);
};