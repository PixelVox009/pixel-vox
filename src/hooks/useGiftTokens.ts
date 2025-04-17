import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { UserData } from "@/types/users";
import { userService } from "@/lib/api/user";


export const useGiftTokens = () => {
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [isGiftTokenModalOpen, setIsGiftTokenModalOpen] = useState(false);
    const [tokensToGift, setTokensToGift] = useState(0);
    const [giftDescription, setGiftDescription] = useState("");

    const queryClient = useQueryClient();

    const { mutate, isPending: isGiftingTokens } = useMutation({
        mutationFn: async () => {
            if (!selectedUser || tokensToGift <= 0 || !selectedUser.wallet) {
                throw new Error("Thông tin không hợp lệ");
            }

            return userService.giftTokensToUser(
                selectedUser._id,
                selectedUser.wallet._id,
                tokensToGift,
                giftDescription || `Admin tặng ${tokensToGift} credits`
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setIsGiftTokenModalOpen(false);
            setTokensToGift(0);
            setGiftDescription("");
            toast.success(`Đã tặng thành công ${tokensToGift} credits cho ${selectedUser?.name}`);
        },
        onError: (error) => {
            console.error("Error gifting tokens:", error);
            toast.error("Không thể tặng credits. Vui lòng thử lại.");
        }
    });

    const handleOpenGiftModal = (user: UserData) => {
        setSelectedUser(user);
        setIsGiftTokenModalOpen(true);
        setTokensToGift(0);
        setGiftDescription("");
    };

    const handleGiftTokens = () => {
        mutate();
    };

    return {
        selectedUser,
        isGiftTokenModalOpen,
        tokensToGift,
        giftDescription,
        isGiftingTokens,
        setIsGiftTokenModalOpen,
        setTokensToGift,
        setGiftDescription,
        handleOpenGiftModal,
        handleGiftTokens
    };
};