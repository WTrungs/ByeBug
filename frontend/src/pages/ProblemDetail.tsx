import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import { getProblemDetailById } from '../api/problemApi';
import type { ProblemDetail as ProblemDetailType, TestCase } from '../api/problemApi';
import { submitSolution } from '../api/submissionApi';
import type { Verdict, TestcaseResult } from '../api/submissionApi';
import { getUser } from '../utils/auth';
import DifficultyBadge from '../components/DifficultyBadge';
import ExampleBox from '../components/ExampleBox';
import styles from '../styles/modules/ProblemDetail.module.css';

// ── Constants ────────────────────────────────────────────────────────────────

const LANG_TEMPLATES: Record<string, string> = {
    cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    // Your code here\n    \n    return 0;\n}',
    python: '# Read input\nimport sys\ninput = sys.stdin.readline\n\n# Your code here\n',
};

const LANG_FILENAMES: Record<string, string> = {
    cpp: 'solution.cpp',
    python: 'solution.py',
};

const VERDICT_LABEL: Record<Verdict, string> = {
    AC: '✓ Accepted', WA: '✗ Wrong Answer', TLE: '⏱ Time Limit Exceeded',
    MLE: '📦 Memory Limit Exceeded', RE: '💥 Runtime Error',
    CE: '🔧 Compile Error', SE: '⚠ System Error', PENDING: '⏳ Judging…',
};

const VERDICT_CLASS: Record<Verdict, string> = {
    AC:      styles.verdictAC,
    WA:      styles.verdictWA,
    TLE:     styles.verdictTLE,
    MLE:     styles.verdictMLE,
    RE:      styles.verdictRE,
    CE:      styles.verdictCE,
    SE:      styles.verdictSE,
    PENDING: styles.verdictPending,
};

// ── Page component ───────────────────────────────────────────────────────────

export default function ProblemDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [problem, setProblem] = useState<ProblemDetailType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [lang, setLang] = useState<'cpp' | 'python'>('cpp');
    const [code, setCode] = useState(LANG_TEMPLATES['cpp']);

    const [submitting, setSubmitting] = useState(false);
    const [verdict, setVerdict] = useState<Verdict | null>(null);
    const [tcResults, setTcResults] = useState<TestcaseResult[]>([]);
    const [submitStats, setSubmitStats] = useState<{ timeMs: number; memKb: number } | null>(null);

    useEffect(() => {
        const numId = Number(id);
        if (!id || !Number.isInteger(numId) || numId <= 0) {
            setError('ID bài toán không hợp lệ.');
            setLoading(false);
            return;
        }
        setLoading(true);
        getProblemDetailById(numId)
            .then((data: ProblemDetailType) => { setProblem(data); setError(''); })
            .catch((err: any) => {
                if (err?.response?.status === 404) {
                    setError('Bài toán không tồn tại.');
                } else {
                    setError('Không thể kết nối tới máy chủ. Kiểm tra lại backend.');
                }
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleLangChange = (newLang: 'cpp' | 'python') => {
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

    const visibleTestcases: TestCase[] = problem?.testcases?.filter((tc: TestCase) => tc.isVisible) ?? [];

    // ── Loading state ────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className={styles.fullPageCenter}>
                <div className={styles.loadingWrapper}>
                    <div className={styles.spinner} />
                    Đang tải bài toán…
                </div>
            </div>
        );
    }

    // ── Error state ──────────────────────────────────────────────────────────
    if (error || !problem) {
        return (
            <div className={styles.fullPageCenter}>
                <div className={styles.errorBox}>
                    {error || 'Không tìm thấy bài toán.'}
                </div>
            </div>
        );
    }

    // ── Main render ──────────────────────────────────────────────────────────
    return (
        <div className={styles.page}>

            {/* NAVBAR */}
            <div className={styles.navbar}>
                <div className={styles.navLogoWrap}>
                    <BrandLogo onClick={() => navigate('/home')} />
                </div>
                <div className={styles.breadcrumb}>
                    <Link to="/problems" className={styles.breadcrumbLink}>← Bài tập</Link>
                    <span className={styles.breadcrumbSep}>/</span>
                    <span className={styles.breadcrumbCurrent}>#{problem.problemId} — {problem.title}</span>
                </div>
            </div>

            {/* BODY */}
            <div className={styles.body}>

                {/* ── LEFT: PROBLEM DESCRIPTION ── */}
                <div className={styles.leftPanel}>

                    {/* Header */}
                    <div className={styles.problemHeader}>
                        <div className={styles.problemId}>Bài #{problem.problemId}</div>
                        <h1 className={styles.problemTitle}>{problem.title}</h1>
                        <div className={styles.metaRow}>
                            <DifficultyBadge level={problem.difficulty ?? 'easy'} />
                            {problem.tags?.map((tag: any) => (
                                <span key={tag.tagId} className={styles.tagBadge}>
                                    {tag.tagName}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Limits bar */}
                    <div className={styles.limitsBar}>
                        <span className={styles.limitItem}>
                            ⏱ Thời gian:{' '}
                            <strong className={styles.limitValue}>{problem.timeLimitMs ?? 1000} ms</strong>
                        </span>
                        <span className={styles.limitItem}>
                            📦 Bộ nhớ:{' '}
                            <strong className={styles.limitValue}>{problem.memoryLimitMb ?? 256} MB</strong>
                        </span>
                    </div>

                    {/* Content */}
                    <div className={styles.problemContent}>

                        {/* Description */}
                        <div className={styles.descriptionText}>{problem.description}</div>

                        {/* Visible examples */}
                        {visibleTestcases.length > 0 && (
                            <>
                                <SectionTitle>Ví dụ</SectionTitle>
                                {visibleTestcases.map((tc, i) => (
                                    <ExampleBox
                                        key={tc.testcaseId}
                                        index={i + 1}
                                        input={tc.input}
                                        output={tc.expectedOutput}
                                    />
                                ))}
                            </>
                        )}

                        {/* Constraints */}
                        <SectionTitle>Ràng buộc</SectionTitle>
                        <div className={styles.constraintsBox}>
                            <ul className={styles.constraintsList}>
                                <li className={styles.constraintItem}>
                                    1 ≤ T ≤ 10<sup>5</sup>
                                </li>
                                <li className={styles.constraintItem}>
                                    Thời gian chạy ≤ {problem.timeLimitMs ?? 1000} ms
                                </li>
                                <li className={styles.constraintItem}>
                                    Bộ nhớ ≤ {problem.memoryLimitMb ?? 256} MB
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT: EDITOR ── */}
                <div className={styles.rightPanel}>

                    {/* Editor header */}
                    <div className={styles.editorHeader}>
                        <select
                            value={lang}
                            onChange={e => handleLangChange(e.target.value as 'cpp' | 'python')}
                            className={styles.langSelect}
                        >
                            <option value="cpp">C++17</option>
                            <option value="python">Python 3</option>
                        </select>
                        <span className={styles.filenameLabel}>{LANG_FILENAMES[lang]}</span>
                    </div>

                    {/* Code textarea */}
                    <textarea
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        spellCheck={false}
                        className={styles.codeEditor}
                    />

                    {/* Test panel */}
                    <div className={styles.testPanel}>

                        {/* Panel header */}
                        <div className={styles.testPanelHeader}>
                            <span className={styles.testPanelTitle}>Kết quả</span>
                            {verdict && (
                                <span className={`${styles.verdictBadge} ${VERDICT_CLASS[verdict]}`}>
                                    {VERDICT_LABEL[verdict]}
                                </span>
                            )}
                        </div>

                        {/* Test-case dots */}
                        <div className={styles.tcDotsRow}>
                            {verdict === 'PENDING'
                                ? Array.from({ length: problem.testcases?.length ?? 3 }).map((_, i) => (
                                    <TcDot key={i} index={i + 1} status="pending" />
                                ))
                                : (verdict === 'CE' || verdict === 'SE')
                                    ? (
                                        <span className={styles.tcMessage}>
                                            {verdict === 'CE'
                                                ? 'Lỗi biên dịch — không chạy test case nào.'
                                                : 'Lỗi hệ thống — không có kết quả.'}
                                        </span>
                                    )
                                    : tcResults.map((tc, i) => (
                                        <TcDot key={`tc-${i}`} index={i + 1}
                                            status={tc.verdict === 'AC' ? 'pass' : 'fail'} />
                                    ))
                            }
                        </div>
                    </div>

                    {/* Action bar */}
                    <div className={styles.actionBar}>
                        <span className={styles.statsHint}>
                            {submitStats
                                ? `${submitStats.timeMs} ms · ${(submitStats.memKb / 1024).toFixed(1)} MB`
                                : verdict === 'SE'
                                    ? 'Lỗi kết nối — vui lòng thử lại.'
                                    : 'Nhấn Submit để nộp bài'}
                        </span>
                        <div className={styles.buttonGroup}>
                            <button
                                disabled
                                title="Chức năng chạy thử sẽ có trong phiên bản tới"
                                className={styles.btnRun}
                            >
                                Chạy thử
                            </button>
                            <button
                                disabled={submitting}
                                onClick={handleSubmit}
                                className={styles.btnSubmit}
                            >
                                {submitting ? 'Đang chấm…' : 'Nộp bài →'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.sectionTitle}>
            <span className={styles.sectionTitleBar} />
            {children}
        </div>
    );
}

function TcDot({ index, status }: { index: number; status: 'pass' | 'fail' | 'pending' }) {
    const statusClass = {
        pass:    styles.tcDotPass,
        fail:    styles.tcDotFail,
        pending: styles.tcDotPending,
    }[status];

    return (
        <div className={`${styles.tcDot} ${statusClass}`}>
            {index}
        </div>
    );
}
