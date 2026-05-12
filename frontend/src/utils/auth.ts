export interface AuthUser {
    userId: number;
    username: string;
    role: string;
}

export const getUser = (): AuthUser | null => {
    const raw = localStorage.getItem('USER') || localStorage.getItem('user');
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        if (typeof parsed?.userId !== 'number' || !parsed?.username) return null;
        return parsed as AuthUser;
    } catch {
        return null;
    }
};

export const isAdmin = () => {
    const user = getUser();
    return user?.role === 'ADMIN';
};