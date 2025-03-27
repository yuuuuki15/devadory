'use client';

import { useEffect, useState } from 'react';
import Parse from 'parse';
import { initializeParse } from '@/utils/parse';

initializeParse();

export default function Header() {
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        // Get current user
        const currentUser = Parse.User.current();
        if (currentUser) {
            setUsername(currentUser.get('username'));
        }

        // Check user state periodically
        const interval = setInterval(() => {
            const user = Parse.User.current();
            if (user) {
                setUsername(user.get('username'));
            } else {
                setUsername(null);
            }
        }, 1000); // Check every second

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Global">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <a href="/" className="text-xl font-bold text-gray-300 hover:text-indigo-400">
                            Devadory
                        </a>
                    </div>

                    <div className="flex items-center gap-x-6">
                        {username ? (
                            <span className="text-sm text-gray-300">
                                welcome {username}
                            </span>
                        ) : (
                            <a
                                href="/login"
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                            >
                                Sign in
                            </a>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}
