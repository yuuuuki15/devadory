'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Parse from 'parse';
import { initializeParse } from '@/utils/parse';

initializeParse();

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                await Parse.User.logOut();
                router.push('/login');
            } catch (error) {
                console.error('Logout failed:', error);

                router.push('/login');
            }
        };

        handleLogout();
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-gray-300">Logging out...</div>
        </div>
    );
}
