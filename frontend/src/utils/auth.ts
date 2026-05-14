export interface AuthUser {
    userId: number;
    username: string;
    fullName?: string;
    email?: string;
    avatarUrl?: string;
    role: string;
    token?: string;
}

export const getUser = (): AuthUser | null => {
    try {
        const raw = localStorage.getItem('USER') || localStorage.getItem('user');
        if (!raw || raw === "undefined" || raw === "null") return null;
        
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') {
            console.warn("Invalid USER object in localStorage", parsed);
            return null;
        }

        if (!parsed.username) {
            console.warn("User object found but missing username", parsed);
            return null;
        }

        return parsed as AuthUser;
    } catch (e) {
        console.error("CRITICAL: Failed to parse USER from localStorage", e);
        return null;
    }
};

export const isAdmin = () => {
    const user = getUser();
    return user?.role === 'ADMIN';
};
