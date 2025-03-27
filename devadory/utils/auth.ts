import Parse from 'parse';
import { initializeParse } from '@/utils/parse';

initializeParse();

export function isAuthenticated(): boolean {
    try {
        const currentUser = Parse.User.current();
        return currentUser !== null;
    } catch (error) {
        console.error('Auth check failed:', error);
        return false;
    }
}

export function getCurrentUser() {
    try {
        return Parse.User.current();
    } catch (error) {
        console.error('Failed to get current user:', error);
        return null;
    }
}

export function requireAuth() {
    if (!isAuthenticated()) {
        throw new Error('Authentication required');
    }
    return getCurrentUser();
}
