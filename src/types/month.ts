export interface TransactionStats {
    totalAmount: number;
    totalTransactions: number;
    totalTokens: number;
}

export interface MonthlyData {
    month: string;
    amount: number;
}

export interface StatsData {
    stats: TransactionStats;
    monthlyData: MonthlyData[];
}

export interface Transaction {
    _id: string;
    transaction?: string;
    createAt: string;
    amount: number;
    tokensEarned: number;
    userId?: string;
}

export interface ExchangeRates {
    usdToTokenRate: number;
    vndToUsdRate: number;
}

export interface BankConfig {
    bankName: string;
    accountNumber: string;
    accountName: string;
    prefixCode: string;
    suffixCode: string;
}
