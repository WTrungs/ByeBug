import api from './axios';

export interface Problem {
    problemId: number;
    title: string;
    difficulty: string;
    tags: string[];
    isPublic: boolean;
    description?: string;
    examples?: {
        input: string;
        output: string;
        explanation?: string;
    }[];
    constraints?: string[];
}

export interface TestCase {
    testcaseId: number;
    input: string;
    expectedOutput: string;
    isVisible: boolean;
    displayOrder: number;
}

export interface ProblemDetail extends Problem {
    description: string;
    timeLimitMs: number;
    memoryLimitMb: number;
    testcases: TestCase[];
}

export const getAllProblems = async (): Promise<Problem[]> => {
    const response = await api.get('/problems');
    return response.data;
};

export const getProblemById = async (id: number): Promise<Problem> => {
    const response = await api.get(`/problems/${id}`);
    return response.data;
};

// ✅ Đổi tên hàm này
export const getProblemDetailById = async (id: number): Promise<ProblemDetail> => {
    const response = await api.get(`/problems/${id}`);
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