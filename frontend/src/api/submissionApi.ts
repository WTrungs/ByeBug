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

export interface SubmissionHistoryItem {
    submissionId: number;
    problemId: number;
    problemTitle: string;
    language: string;
    verdict: Verdict;
    score: number;
    totalTimeMs: number | null;
    maxMemoryKb: number | null;
    submittedAt: string;
}

export interface SubmissionHistoryQuery {
    userId?: number;
    problemTitle?: string;
    verdict?: Verdict | 'ALL';
    language?: string | 'ALL';
}

const mockSubmissionHistory: SubmissionHistoryItem[] = [
    {
        submissionId: 1028,
        problemId: 1,
        problemTitle: 'Two Sum',
        language: 'C++17',
        verdict: 'AC',
        score: 100,
        totalTimeMs: 12,
        maxMemoryKb: 1840,
        submittedAt: '2026-05-12 14:30',
    },
    {
        submissionId: 1027,
        problemId: 2,
        problemTitle: 'Fibonacci',
        language: 'Python 3',
        verdict: 'WA',
        score: 0,
        totalTimeMs: 45,
        maxMemoryKb: 9216,
        submittedAt: '2026-05-12 13:15',
    },
    {
        submissionId: 1026,
        problemId: 3,
        problemTitle: 'Longest Substring',
        language: 'C++17',
        verdict: 'TLE',
        score: 40,
        totalTimeMs: 2001,
        maxMemoryKb: 2048,
        submittedAt: '2026-05-12 11:42',
    },
    {
        submissionId: 1025,
        problemId: 4,
        problemTitle: 'Binary Search',
        language: 'C++17',
        verdict: 'AC',
        score: 100,
        totalTimeMs: 8,
        maxMemoryKb: 1536,
        submittedAt: '2026-05-11 22:07',
    },
    {
        submissionId: 1024,
        problemId: 5,
        problemTitle: 'Merge Sort',
        language: 'Python 3',
        verdict: 'RE',
        score: 20,
        totalTimeMs: null,
        maxMemoryKb: null,
        submittedAt: '2026-05-11 18:55',
    },
    {
        submissionId: 1023,
        problemId: 6,
        problemTitle: 'Prime Counter',
        language: 'C++17',
        verdict: 'CE',
        score: 0,
        totalTimeMs: null,
        maxMemoryKb: null,
        submittedAt: '2026-05-10 19:21',
    },
];

export const submitSolution = async (req: SubmissionRequest): Promise<SubmissionResult> => {
    const response = await api.post('/submissions', req);
    return response.data;
};

export const getSubmissionHistory = async (
    query: SubmissionHistoryQuery = {},
): Promise<SubmissionHistoryItem[]> => {
    // TODO: replace this mock with api.get('/submissions', { params: query }) when backend exposes history.
    const problemTitle = query.problemTitle?.trim().toLowerCase();

    return mockSubmissionHistory.filter((submission) => {
        const matchesTitle =
            !problemTitle || submission.problemTitle.toLowerCase().includes(problemTitle);
        const matchesVerdict =
            !query.verdict || query.verdict === 'ALL' || submission.verdict === query.verdict;
        const matchesLanguage =
            !query.language || query.language === 'ALL' || submission.language === query.language;

        return matchesTitle && matchesVerdict && matchesLanguage;
    });
};
