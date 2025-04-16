import { Transaction } from "@/types/month";
import { format } from "date-fns";
export function formatDateTime(dateString: string) {
    const date = new Date(dateString);
    return {
        date: format(date, "dd/MM/yyyy"),
        time: format(date, "HH:mm:ss"),
    };
}

export function formatTokens(transaction: Transaction) {
    if (transaction.type === "token_usage") {
        const tokenValue = Math.abs(transaction?.tokensEarned || 0);
        return `-${tokenValue}`;
    } else {
        return `+${transaction.tokensEarned}`;
    }
}

export function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

export const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
    });
};