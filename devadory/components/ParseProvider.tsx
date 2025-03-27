'use client';

import { useEffect } from 'react';
import { initializeParse } from '@/utils/parse';

export function ParseProvider({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		initializeParse();
	}, []);

	return <>{children}</>;
}
