import { ChangeEvent, ReactNode } from "react";
import { ExchangeRates, MonthlyData, TransactionStats } from "./month";

export interface StatsOverviewProps {
    stats?: TransactionStats;
    isLoading: boolean;
    vndToUsdRate: number;
    formatVndToUsd: (amount: number, rate: number) => string;
}

export interface StatCardProps {
    icon: ReactNode;
    title: string;
    value: string | number;
    iconBgColor: string;
    iconColor: string;
    isLoading?: boolean;
}

export interface TransactionChartProps {
    startDate: string;
    endDate: string;
    onStartDateChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onEndDateChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onApplyFilters: () => void;
    isLoading: boolean;
    monthlyData?: MonthlyData[];
    vndToUsdRate: number;
    formatVndToUsd: (amount: number, rate: number) => string;
}

export interface RecentTransactionsProps {
    transactions?: RecentTransaction[];
    isLoading: boolean;
    vndToUsdRate: number;
    formatVndToUsd: (amount: number, rate: number) => string;
}

export interface ExchangeRateSettingsProps {
    exchangeRates?: ExchangeRates;
    newExchangeRates: ExchangeRates;
    onExchangeRatesChange: (rates: ExchangeRates) => void;
    onUpdateRates: () => void;
    isUpdating: boolean;
    isLoading: boolean;
    formatCurrency: (amount?: number) => string;
}

export interface StatsResponse {
    stats: TransactionStats;
    monthlyData: MonthlyData[];
}

export interface RecentTransaction {
    _id: string;
    createdAt: string;
    amount: number;
    tokensEarned: number;
    customer: {
        _id: string;
        name: string;
        email: string;
    };
    status: string;
    type: string;
    transaction?: string;
}


