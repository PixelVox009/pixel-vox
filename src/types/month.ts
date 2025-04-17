export interface TransactionStats {
    totalAmount: number;
    totalTransactions: number;
    totalTokens: number;
    totalEarned?: number;
    totalSpent?: number;
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
    transaction?: string | "";
    amount?: number | 0;
    userId?: string | "";
    oldBalance?: number | 0;
    newBalance?: number | 0;
    customer?: string | "";
    wallet?: string | "";
    type?: string | "";
    status?: string | "";
    description?: string | "";
    depositDiscountPercent?: number | 0;
    tokensEarned?: number | 0;
    createdAt?: string | "";
    updatedAt?: string | "";
    tokensUsed?: number | 0;

}

export interface ExchangeRates {
    usdToTokenRate?: number | 0;
    vndToUsdRate?: number | 0;
    imageToTokenRate?: number | 0;
    minuteToTokenRate?: number | 0;
}

export interface BankConfig {
    bankName: string;
    accountNumber: string;
    accountName: string;
    prefixCode: string;
    suffixCode: string;
}
export interface TransactionResponse {
    transactions: Transaction[];
    pagination: {
        total: number;
        totalPages: number;
        from: number;
        to: number;
    };
    hasMore?: boolean;
}