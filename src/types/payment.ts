export interface Payment {
    amount: number;
    createdAt: string;
    tokensEarned: number;
    _id: string;
}

export interface PaymentCheckResponse {
    recentPayments: Payment[];
}

export interface TokenBalance {
    balance: number;
    totalRecharged: number;
    totalSpent: number;
    totalTokens: number;
}