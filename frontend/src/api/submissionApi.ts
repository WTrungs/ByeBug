import api from './axios';

export type Verdict = 'AC' | 'WA' | 'TLE' | 'MLE' | 'RE' | 'CE' | 'SE' | 'PENDING';

export interface SubmissionRequest {
    problemId: number;
    userId: number;
    language: string;
    sourceCode: string;
}

export interface TestcaseResult {
    testcaseId: number;
    verdict: Verdict;
    timeMs: number;
    memoryKb: number;
}

export interface SubmissionResult {
    submissionId: number;
    verdict: Verdict;
    score: number;
    totalTimeMs: number;
    maxMemoryKb: number;
    testcaseResults: TestcaseResult[];
}

export const submitSolution = async (req: SubmissionRequest): Promise<SubmissionResult> => {
    const response = await api.post('/submissions', req);
    return response.data;
};
