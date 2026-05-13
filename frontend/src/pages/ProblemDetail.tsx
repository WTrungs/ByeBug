import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { Group, Panel, Separator } from 'react-resizable-panels';
import BrandLogo from '../components/BrandLogo';
import CodeEditor from '../components/CodeEditor';
import DifficultyBadge from '../components/DifficultyBadge';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { getProblemById } from '../api/problemApi';
import type { ProblemDetail as ProblemDetailType } from '../api/problemApi';
import { submitSolution } from '../api/submissionApi';
import type { TestcaseResult, Verdict } from '../api/submissionApi';
import { getUser } from '../utils/auth';
import styles from '../styles/modules/ProblemDetail.module.css';

type Language = 'cpp' | 'python';
type TestStatus = 'pass' | 'fail' | 'pending';
type ProblemTag = string | { tagId?: number; tagName: string };

const LANG_TEMPLATES: Record<Language, string> = {
    cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    // Your code here\n    \n    return 0;\n}',
    python: '# Read input\nimport sys\ninput = sys.stdin.readline\n\n# Your code here\n',
};

const LANG_FILENAMES: Record<Language, string> = {
    cpp: 'solution.cpp',
    python: 'solution.py',
};

const LANG_LABELS: Record<Language, string> = {
    cpp: 'C++17',
    python: 'Python 3',
};

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
    const [submitStats, setSubmitStats] = useState<{ timeMs: number; memKb: number } | null>(null);

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

function ProblemDetailHeader({ onLogoClick }: { onLogoClick: () => void }) {
    const user = getUser();
    const displayName = user?.username ?? 'Guest';
    const avatarSeed = encodeURIComponent(displayName);

    return (
        <header className={styles.navbar}>
            <div className={styles.navLogoWrap}>
                <BrandLogo onClick={onLogoClick} />
            </div>
            <nav className={styles.topNav} aria-label="Primary navigation">
                <NavLink to="/problems" className={({ isActive }) => `${styles.topNavLink} ${isActive ? styles.topNavLinkActive : ''}`}>
                    Problems
                </NavLink>
                <Link to="/contests" className={styles.topNavLink}>Contests</Link>
                <Link to="/leaderboard" className={styles.topNavLink}>Leaderboard</Link>
                <Link to="/discuss" className={styles.topNavLink}>Discuss</Link>
            </nav>
            <div className={styles.headerActions}>
                <button className={styles.iconButton} type="button" aria-label="Thông báo">
                    <span aria-hidden="true">●</span>
                </button>
                <Link to="/profile/me" className={styles.avatarButton} aria-label={`Mở hồ sơ của ${displayName}`}>
                    <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
                        alt=""
                        className={styles.avatarImage}
                    />
                </Link>
            </div>
        </header>
    );
}

function ProblemDetailFooter() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerLinks}>
                <span>© 2024 ByeBug Online Judge</span>
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms of Service</Link>
                <Link to="/api-docs" className={styles.footerActiveLink}>API Docs</Link>
                <Link to="/status">Status</Link>
            </div>
            <strong className={styles.versionLabel}>v2.4.0-stable</strong>
        </footer>
    );
}

function ResizableProblemLayout({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
    return (
        <main className={styles.body}>
            <Group orientation="horizontal" className={styles.panelGroup}>
                <Panel defaultSize="50" minSize="32" className={styles.resizablePanel}>
                    {left}
                </Panel>
                <Separator className={styles.resizeHandle}>
                    <span className={styles.resizeHandleGrip} />
                </Separator>
                <Panel defaultSize="50" minSize="34" className={styles.resizablePanel}>
                    {right}
                </Panel>
            </Group>
        </main>
    );
}

function ProblemStatementPanel({ problem }: { problem: ProblemDetailType }) {
    const tags = (problem.tags ?? []) as ProblemTag[];

    return (
        <section className={styles.leftPanel} aria-label="Đề bài">
            <article className={styles.statementCard}>
                <header className={styles.problemHeader}>
                    <div className={styles.metaRow}>
                        <DifficultyBadge level={problem.difficulty ?? 'easy'} />
                        <span className={styles.problemId}>Problem ID: #{problem.problemId}</span>
                    </div>
                    <h1 className={styles.problemTitle}>{problem.title}</h1>
                    {tags.length > 0 && (
                        <div className={styles.tagsRow}>
                            {tags.map((tag, index) => {
                                const label = typeof tag === 'string' ? tag : tag.tagName;
                                const key = typeof tag === 'string' ? `${tag}-${index}` : tag.tagId ?? `${label}-${index}`;
                                return (
                                    <span key={key} className={styles.tagBadge}>
                                        {label}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </header>

                <div className={styles.limitsBar}>
                    <span className={styles.limitItem}>
                        Time <strong className={styles.limitValue}>{problem.timeLimitMs ?? 1000} ms</strong>
                    </span>
                    <span className={styles.limitItem}>
                        Memory <strong className={styles.limitValue}>{problem.memoryLimitMb ?? 256} MB</strong>
                    </span>
                </div>

                <div className={styles.problemContent}>
                    <MarkdownRenderer content={problem.description} />
                </div>
            </article>
        </section>
    );
}

interface CodeWorkspacePanelProps {
    code: string;
    lang: Language;
    problem: ProblemDetailType;
    submitting: boolean;
    submitStats: { timeMs: number; memKb: number } | null;
    tcResults: TestcaseResult[];
    verdict: Verdict | null;
    onCodeChange: (value: string) => void;
    onLangChange: (lang: Language) => void;
    onSubmit: () => void;
}

function CodeWorkspacePanel({
    code,
    lang,
    problem,
    submitting,
    submitStats,
    tcResults,
    verdict,
    onCodeChange,
    onLangChange,
    onSubmit,
}: CodeWorkspacePanelProps) {
    return (
        <section className={styles.rightPanel} aria-label="Trình soạn thảo code">
            <div className={styles.editorHeader}>
                <div className={styles.editorHeaderLeft}>
                    <div className={styles.editorFileInfo}>
                        <span className={styles.codeGlyph}>‹›</span>
                        <span className={styles.filenameLabel}>{LANG_FILENAMES[lang]}</span>
                    </div>
                    <label className={styles.langSelectLabel}>
                        <span className={styles.configIcon}>⚙</span>
                        <span className={styles.configLabel}>Config</span>
                        <select
                            value={lang}
                            onChange={e => onLangChange(e.target.value as Language)}
                            className={styles.langSelect}
                        >
                            {Object.entries(LANG_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className={styles.windowDots} aria-hidden="true">
                    <span className={styles.windowDotRed} />
                    <span className={styles.windowDotAmber} />
                    <span className={styles.windowDotGreen} />
                </div>
            </div>

            <div className={styles.editorShell}>
                <CodeEditor
                    code={code}
                    language={lang}
                    onChange={value => onCodeChange(value ?? '')}
                    theme="vs-dark"
                />
            </div>

            <ResultsPanel
                problem={problem}
                submitStats={submitStats}
                tcResults={tcResults}
                verdict={verdict}
            />

            <div className={styles.actionBar}>
                <button
                    disabled
                    title="Chức năng chạy thử sẽ có trong phiên bản tới"
                    className={styles.btnRun}
                >
                    ▸  Run Tests
                </button>
                <button disabled={submitting} onClick={onSubmit} className={styles.btnSubmit}>
                    {submitting ? 'Đang chấm...' : '☁  Submit Solution'}
                </button>
            </div>
        </section>
    );
}

function ResultsPanel({
    problem,
    submitStats,
    tcResults,
    verdict,
}: {
    problem: ProblemDetailType;
    submitStats: { timeMs: number; memKb: number } | null;
    tcResults: TestcaseResult[];
    verdict: Verdict | null;
}) {
    const passedCount = tcResults.filter(tc => tc.verdict === 'AC').length;
    const totalCount = tcResults.length || problem.testcases?.length || 0;

    return (
        <div className={styles.testPanel}>
            <div className={styles.testPanelHeader}>
                <span className={styles.testPanelTitle}>Live Test Results</span>
                <span className={styles.statsHint}>{getStatsText(verdict, submitStats, passedCount, totalCount)}</span>
            </div>
            <div className={styles.tcDotsRow}>{renderTestDots(verdict, tcResults, problem.testcases?.length ?? 3)}</div>
        </div>
    );
}

function getStatsText(
    verdict: Verdict | null,
    submitStats: { timeMs: number; memKb: number } | null,
    passedCount: number,
    totalCount: number,
) {
    if (submitStats) {
        return `${passedCount}/${totalCount} passed - ${submitStats.timeMs} ms - ${(submitStats.memKb / 1024).toFixed(1)} MB`;
    }
    if (verdict === 'SE') return 'Lỗi kết nối - vui lòng thử lại.';
    if (verdict && verdict !== 'PENDING' && totalCount > 0) return `${passedCount}/${totalCount} passed`;
    return 'Submit để xem kết quả';
}

function renderTestDots(verdict: Verdict | null, tcResults: TestcaseResult[], pendingCount: number) {
    if (verdict === 'PENDING') {
        return Array.from({ length: pendingCount }).map((_, i) => <TcDot key={i} index={i + 1} status="pending" />);
    }

    if (verdict === 'CE' || verdict === 'SE') {
        return (
            <span className={styles.tcMessage}>
                {verdict === 'CE' ? 'Lỗi biên dịch - không chạy test case nào.' : 'Lỗi hệ thống - không có kết quả.'}
            </span>
        );
    }

    if (tcResults.length === 0) {
        return <span className={styles.tcMessage}>Chưa có kết quả chấm.</span>;
    }

    return tcResults.map((tc, i) => (
        <TcDot key={`tc-${i}`} index={i + 1} status={tc.verdict === 'AC' ? 'pass' : 'fail'} />
    ));
}

function TcDot({ index, status }: { index: number; status: TestStatus }) {
    const statusClass = {
        pass: styles.tcDotPass,
        fail: styles.tcDotFail,
        pending: styles.tcDotPending,
    }[status];

    return (
        <div className={`${styles.tcDot} ${statusClass}`} aria-label={`Test ${index}: ${status}`}>
            {status === 'pass' ? '✓' : status === 'fail' ? '×' : index}
        </div>
    );
}
