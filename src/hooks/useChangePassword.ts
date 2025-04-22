// hooks/useChangePassword.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

interface ChangePasswordParams {
    currentPassword: string;
    newPassword: string;
}

interface ChangePasswordResponse {
    message: string;
    user?: {
        hasPassword: boolean;
    };
}

export const useChangePassword = () => {
    const { update } = useSession();
    const queryClient = useQueryClient();

    const mutation = useMutation<ChangePasswordResponse, Error, ChangePasswordParams>({
        mutationFn: async ({ currentPassword, newPassword }) => {
            const response = await fetch("/api/user/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Có lỗi xảy ra khi đổi mật khẩu");
            }

            return data;
        },
        onSuccess: async () => {
            await update({
                user: {
                    hasPassword: true
                }
            });
            queryClient.invalidateQueries({ queryKey: ['userData'] });
        },
    });

    const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
        try {
            await mutation.mutateAsync({ currentPassword, newPassword });
            return true;
        } catch (error) {
            console.error("Error changing password:", error);
            return false;
        }
    };

    return {
        changePassword,
        isLoading: mutation.isPending,
        error: mutation.error?.message || "",
        success: mutation.isSuccess ? "Đổi mật khẩu thành công" : "",
        resetStates: () => mutation.reset(),
    };
};