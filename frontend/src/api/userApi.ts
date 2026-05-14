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

export const updateProfile = async (username: string, data: { fullName?: string; email?: string; gender?: string; avatarUrl?: string }) => {
    const response = await api.put(`/users/${username}`, data);
    return response.data;
};

export const changePassword = async (username: string, data: { oldPassword: string; newPassword: string }) => {
    const response = await api.post(`/users/change-password/${username}`, data);
    return response.data;
};

export const deleteAccount = async (username: string, password: string) => {
    const response = await api.delete(`/users/${username}`, { data: { password } });
    return response.data;
};
