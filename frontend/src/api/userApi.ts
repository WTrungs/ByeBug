import api from './axios';

export interface UserProfile {
    username: string;
    fullName: string;
    email: string;
    avatarUrl: string;
    totalPoints: number;
    rank: number;
    solvedCount: number;
    attemptedCount: number;
    verdictStats: {
        ac: number;
        wa: number;
        tle: number;
        mle: number;
        re: number;
        ce: number;
    };
    recentSubmissions: any[];
}

export const getUserProfile = async (username: string): Promise<UserProfile> => {
    const response = await api.get(`/users/${username}`);
    return response.data;
};

export const updateProfile = async (data: { fullName?: string; gender?: string; avatarUrl?: string }) => {
    const response = await api.put('/users/me', data);
    return response.data;
};

export const changePassword = async (data: { oldPassword: string; newPassword: string }) => {
    const response = await api.post('/users/me/change-password', data);
    return response.data;
};

export const deleteAccount = async (password: string) => {
    const response = await api.delete('/users/me', { data: { password } });
    return response.data;
};
