import api from './axios';

export interface Problem {
    problemId: number;
    title: string;
    difficulty: string;
    tags: Array<string | ProblemTag>;
    isPublic: boolean;
}

export interface ProblemTag {
    tagId: number;
    tagName: string;
}

export interface TestCase {
    testcaseId: number;
    input: string;
    expectedOutput: string;
    isVisible: boolean;
    displayOrder: number;
}

export interface ProblemExample {
    exampleId: number;
    input: string;
    output: string;
    explanation?: string | null;
    displayOrder: number;
}

export interface ProblemDetail extends Problem {
    description: string;
    constraints?: string | null;
    timeLimitMs: number;
    memoryLimitMb: number;
    testcases: TestCase[];
    examples?: ProblemExample[];
}

export const getAllProblems = async (): Promise<Problem[]> => {
    const response = await api.get('/problems');
    return response.data;
};


export const getProblemsByDifficulty = async (difficulty: string): Promise<Problem[]> => {
    const response = await api.get(`/problems/difficulty/${difficulty}`);
    return response.data;
};

export const getProblemById = async (id: number): Promise<ProblemDetail> => {
    const response = await api.get(`/problems/${id}`);
    return response.data;
};

export const searchProblems = async (keyword: string): Promise<Problem[]> => {
    const response = await api.get('/problems/search', {
        params: { keyword }
    });
    return response.data;
};
