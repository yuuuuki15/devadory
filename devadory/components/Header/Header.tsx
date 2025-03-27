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
        } else {
            setUsername(null);
        }

        // const interval = setInterval(() => {
        //     const user = Parse.User.current();
        //     if (user) {
        //         setUsername(user.get('username'));
        //     } else {
        //         setUsername(null);
        //     }
        // }, 1000);

        // return () => clearInterval(interval);
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
                            <div className="flex items-center gap-x-6">
                                <div><a href="/projects">Projects</a></div>
                                <div><a href="/logout">Logout</a></div>
                                <span className="text-sm text-gray-300">
                                    welcome {username}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-x-6">
                                <div><a href="/login">Sign in</a></div>
                                <div><a href="/signup">Sign up</a></div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}
