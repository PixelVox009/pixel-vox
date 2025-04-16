export const fetchUsers = async (page = 1, limit = 10, search = "", role = "") => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        role,
    });

    const response = await fetch(`/api/admin/users?${params}`);
    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    return response.json();
};

export const giftTokensToUser = async (userId: string, walletId: string, tokens: number, description: string) => {
    const response = await fetch(`/api/admin/payments/gift`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            customer: userId,
            wallet: walletId,
            tokensEarned: tokens,
            description,
            type: "bonus",
            status: "success",
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to gift tokens");
    }

    return response.json();
};