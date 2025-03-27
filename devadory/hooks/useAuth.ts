// hooks/useAuth.ts
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Parse from 'parse';
import { initializeParse } from '@/utils/parse';

initializeParse();

export function useAuth(requireAuth: boolean = false) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<Parse.User | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const currentUser = Parse.User.current();
                setUser(currentUser);

                if (requireAuth && !currentUser) {
                    router.push('/login');
                } else if (!requireAuth && currentUser) {
                    router.push('/projects');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                if (requireAuth) {
                    router.push('/login');
                }
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [requireAuth, router]);

    return { user, isLoading };
}
