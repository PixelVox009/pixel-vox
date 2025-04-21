// src/hooks/useFirstRecharge.ts
import { userService } from '@/lib/api/user';
import { useEffect, useState } from 'react';


export const useFirstRecharge = () => {
    const [isFirstRecharge, setIsFirstRecharge] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const checkFirstRecharge = async () => {
            setIsLoading(true);
            try {
                const isFirst = await userService.isFirstRecharge();
                setIsFirstRecharge(isFirst);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Lỗi không xác định'));
                setIsFirstRecharge(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkFirstRecharge();
    }, []);

    return { isFirstRecharge, isLoading, error };
};