import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CodeWorkspacePanel, { LANG_TEMPLATES, type Language, type SubmitStats } from '../components/CodeWorkspacePanel';
import { ProblemDetailFooter, ProblemDetailHeader } from '../components/ProblemDetailChrome';
import ProblemStatementPanel from '../components/ProblemStatementPanel';
import ResizableProblemLayout from '../components/ResizableProblemLayout';
import { getProblemById } from '../api/problemApi';
import type { ProblemDetail as ProblemDetailType } from '../api/problemApi';
import { submitSolution } from '../api/submissionApi';
import type { TestcaseResult, Verdict } from '../api/submissionApi';
import { getUser } from '../utils/auth';
import styles from '../styles/modules/ProblemDetail.module.css';

export default function ProblemDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [problem, setProblem] = useState<ProblemDetailType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [lang, setLang] = useState<Language>('cpp');
    const [code, setCode] = useState(LANG_TEMPLATES.cpp);

    const [submitting, setSubmitting] = useState(false);
    const [verdict, setVerdict] = useState<Verdict | null>(null);
    const [tcResults, setTcResults] = useState<TestcaseResult[]>([]);
    const [submitStats, setSubmitStats] = useState<SubmitStats | null>(null);

    useEffect(() => {
        const numId = Number(id);
        if (!id || !Number.isInteger(numId) || numId <= 0) {
            setError('ID bài toán không hợp lệ.');
            setLoading(false);
            return;
        }

        setLoading(true);
        getProblemById(numId)
            .then((data: ProblemDetailType) => {
                setProblem(data);
                setError('');
            })
            .catch((err: unknown) => {
                const status = typeof err === 'object' && err !== null && 'response' in err
                    ? (err as { response?: { status?: number } }).response?.status
                    : undefined;

                if (status === 404) {
                    setError('Bài toán không tồn tại.');
                } else {
                    setError('Không thể kết nối tới máy chủ. Kiểm tra lại backend.');
                }
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleLangChange = (newLang: Language) => {
        setLang(newLang);
        setCode(LANG_TEMPLATES[newLang]);
        setVerdict(null);
        setTcResults([]);
    };

    const handleSubmit = async () => {
        if (!problem) return;
        if (code.trim() === '') {
            setVerdict('CE');
            return;
        }

        const user = getUser();
        if (!user) {
            setVerdict('SE');
            setSubmitStats(null);
            return;
        }

        setSubmitting(true);
        setVerdict('PENDING');
        setTcResults([]);
        setSubmitStats(null);

        try {
            const result = await submitSolution({
                problemId: problem.problemId,
                userId: user.userId,
                language: lang,
                sourceCode: code,
            });
            setVerdict(result.verdict);
            setTcResults(result.testcaseResults ?? []);
            if (result.totalTimeMs != null && result.maxMemoryKb != null) {
                setSubmitStats({ timeMs: result.totalTimeMs, memKb: result.maxMemoryKb });
            }
        } catch {
            setVerdict('SE');
            setSubmitStats(null);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.fullPageCenter}>
                <div className={styles.loadingWrapper}>
                    <div className={styles.spinner} />
                    Đang tải bài toán...
                </div>
            </div>
        );
    }

    if (error || !problem) {
        return (
            <div className={styles.fullPageCenter}>
                <div className={styles.errorBox}>{error || 'Không tìm thấy bài toán.'}</div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <ProblemDetailHeader onLogoClick={() => navigate('/home')} />
            <ResizableProblemLayout
                left={<ProblemStatementPanel problem={problem} />}
                right={
                    <CodeWorkspacePanel
                        code={code}
                        lang={lang}
                        problem={problem}
                        submitting={submitting}
                        submitStats={submitStats}
                        tcResults={tcResults}
                        verdict={verdict}
                        onCodeChange={setCode}
                        onLangChange={handleLangChange}
                        onSubmit={handleSubmit}
                    />
                }
            />
            <ProblemDetailFooter />
        </div>
    );
}
