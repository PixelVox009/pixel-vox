export interface Payment {
    amount: number;
    createdAt: string;
    tokensEarned: number;
    _id: string;
}

export interface PaymentCheckResponse {
    recentPayments: Payment[];
}