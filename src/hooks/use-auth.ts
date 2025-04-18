import { signOut } from 'next-auth/react';

export function useLogout() {
    const logout = async () => {
        await signOut({ callbackUrl: '/' });
    };
    return { logout };
}