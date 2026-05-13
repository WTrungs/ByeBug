import CodeEditor from './CodeEditor';
import type { ProblemDetail } from '../api/problemApi';
import type { TestcaseResult, Verdict } from '../api/submissionApi';
import styles from '../styles/modules/ProblemDetail.module.css';

export type Language = 'cpp' | 'python';
type TestStatus = 'pass' | 'fail' | 'pending';

export const LANG_TEMPLATES: Record<Language, string> = {
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

export interface SubmitStats {
    timeMs: number;
    memKb: number;
}

interface CodeWorkspacePanelProps {
    code: string;
    lang: Language;
    problem: ProblemDetail;
    submitting: boolean;
    submitStats: SubmitStats | null;
    tcResults: TestcaseResult[];
    verdict: Verdict | null;
    onCodeChange: (value: string) => void;
    onLangChange: (lang: Language) => void;
    onSubmit: () => void;
}

export default function CodeWorkspacePanel({
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
            <EditorToolbar lang={lang} onLangChange={onLangChange} />

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
                    ▸ Run Tests
                </button>
                <button disabled={submitting} onClick={onSubmit} className={styles.btnSubmit}>
                    {submitting ? 'Đang chấm...' : '☁ Submit Solution'}
                </button>
            </div>
        </section>
    );
}

function EditorToolbar({ lang, onLangChange }: { lang: Language; onLangChange: (lang: Language) => void }) {
    return (
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
    );
}

function ResultsPanel({
    problem,
    submitStats,
    tcResults,
    verdict,
}: {
    problem: ProblemDetail;
    submitStats: SubmitStats | null;
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
    submitStats: SubmitStats | null,
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
