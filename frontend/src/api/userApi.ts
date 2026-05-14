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

export interface LeaderboardUser {
    username: string;
    fullName: string;
    avatarUrl: string;
    totalPoints: number;
    solvedCount: number;
    createdAt: string;
}

export const getLeaderboard = async (): Promise<LeaderboardUser[]> => {
    const response = await api.get('/users/leaderboard');
    return response.data;
};

export interface UserStatistics {
    solvedCount: number;
    rank: number;
    attemptedCount: number;
    streak: number;
    chartData: {
        day: string;
        ac: number;
        wa: number;
    }[];
    recentSubmissions: {
        id: number;
        problemId: number;
        problemTitle: string;
        result: string;
        time: string;
    }[];
}

export const getStatistics = async (username: string): Promise<UserStatistics> => {
    const response = await api.get(`/users/statistics/${username}`);
    return response.data;
};
