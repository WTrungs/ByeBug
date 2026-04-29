import api from './axios';

export interface Problem {
    problemId: number;
    title: string;
    difficulty: string;
    tags: string[];
    isPublic: boolean;
}

export const getAllProblems = async (): Promise<Problem[]> => {
    const response = await api.get('/problems');
    return response.data;
};


export const getProblemsByDifficulty = async (difficulty: string): Promise<Problem[]> => {
    const response = await api.get(`/problems/difficulty/${difficulty}`);
    return response.data;
};

export const searchProblems = async (keyword: string): Promise<Problem[]> => {
    const response = await api.get('/problems/search', {
        params: { keyword }
    });
    return response.data;
};