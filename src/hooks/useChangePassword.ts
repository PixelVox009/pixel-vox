import { useState } from "react";

interface ChangePasswordResponse {
    message: string;
    [key: string]: any;
}

export const useChangePassword = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");

    const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
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

            const data = await response.json() as ChangePasswordResponse;

            if (!response.ok) {
                throw new Error(data.message || "Có lỗi xảy ra khi đổi mật khẩu");
            }

            setSuccess(data.message || "Đổi mật khẩu thành công");
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi đổi mật khẩu");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        changePassword,
        isLoading,
        error,
        success,
        resetStates: () => {
            setError("");
            setSuccess("");
        }
    };
};