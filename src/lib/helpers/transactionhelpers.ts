import { Transaction } from "@/types/month";

export const getTokenChange = (transaction: Transaction) => {
    switch (transaction.type) {
        case "token_usage":
            return `-${(transaction.tokensEarned || 0).toLocaleString()}`;
        case "bank":
        case "bonus":
            return `+${(transaction.tokensEarned || 0).toLocaleString()}`;
        default:
            if (transaction.oldBalance !== undefined && transaction.newBalance !== undefined) {
                const diff = transaction.oldBalance - transaction.newBalance;
                return diff >= 0 ? `-${Math.abs(diff).toLocaleString()}` : `+${Math.abs(diff).toLocaleString()}`;
            }
            return "0";
    }
};

export const getTokenColor = (transaction: Transaction) => {
    switch (transaction.type) {
        case "bank":
        case "bonus":
            return "text-green-500";
        case "token_usage":
            return "text-red-500";
        default:
            if (transaction.oldBalance !== undefined && transaction.newBalance !== undefined) {
                return transaction.newBalance >= transaction.oldBalance ? "text-red-500" : "text-green-500";
            }
            return "text-gray-500";
    }
};

export const getTransactionTitle = (transaction: Transaction) => {
    if (transaction.description) return transaction.description;
    switch (transaction.type) {
        case "bank": return "Top-up Credits";
        case "token_usage": return "Used Credits";
        case "bonus": return "Bonus Credits";
        default: return "Transaction";
    }
};