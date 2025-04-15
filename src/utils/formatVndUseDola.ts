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

// Hàm định dạng VND sang USD với tỷ giá động
export const formatVndToUsd = (vndAmount: number, vndToUsdRate: number = 25000) => {
    const usdAmount = vndAmount / vndToUsdRate;
    return usdAmount.toFixed(2);
};