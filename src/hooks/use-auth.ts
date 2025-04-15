import { signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

interface LoginCredentials {
    email: string;
    password: string;
    callbackUrl?: string;
}

interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
}

export function useLogin() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async ({ email, password, callbackUrl = '/dashboard' }: LoginCredentials) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError(result.error);
                return false;
            }

            // Chuyển hướng tới callback URL nếu đăng nhập thành công
            window.location.href = callbackUrl;
            return true;
        } catch (error) {
            setError('Đã xảy ra lỗi không mong muốn');
            console.error(error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { login, isLoading, error };
}

export function useRegister() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const register = async ({ name, email, password }: RegisterCredentials) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Đã xảy ra lỗi khi đăng ký');
                return false;
            }

            // Đăng ký thành công, tiến hành đăng nhập
            const loginResult = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (loginResult?.error) {
                setError(loginResult.error);
                return false;
            }

            // Chuyển hướng tới dashboard
            window.location.href = '/dashboard';
            return true;
        } catch (error) {
            setError('Đã xảy ra lỗi không mong muốn');
            console.error(error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { register, isLoading, error };
}

export function useLogout() {
    const logout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    return { logout };
}