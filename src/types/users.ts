export interface UserWallet {
    _id: string;
    customer: string;
    balance: number;
    totalRecharged: number;
    totalTokens: number;
    totalSpent: number;
    createdAt: string;
    updatedAt: string;
}

export interface UserData {
    _id: string;
    name: string;
    email: string;
    role: string;
    tokenBalance: number;
    lastLoginAt: string;
    createdAt: string;
    updatedAt: string;
    paymentCode?: string;
    wallet?: UserWallet;
}

export interface PaginationProps {
    page: number;
    limit: number;
    totalPages: number;
    total: number;
    from: number;
    to: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

export interface UserRowProps {
    user: UserData;
    onGift: (user: UserData) => void;
    vndToUsdRate: number;
}

export interface SearchAndFilterBarProps {
    search: string;
    setSearch: (search: string) => void;
    role: string;
    onRoleChange: (role: string) => void;
    onSearch: (e: React.FormEvent) => void;
}

export interface GiftTokenModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedUser: UserData | null;
    tokensToGift: number;
    setTokensToGift: (tokens: number) => void;
    giftDescription: string;
    setGiftDescription: (description: string) => void;
    onGift: () => void;
    isGifting: boolean;
}

export interface UsersResponse {
    users: UserData[];
    pagination: {
        total: number;
        totalPages: number;
        from: number;
        to: number;
    };
}