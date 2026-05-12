import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProblemById } from '../api/problemApi';
import type { ProblemDetail as ProblemDetailType, TestCase } from '../api/problemApi';
import { submitSolution } from '../api/submissionApi';
import type { Verdict, TestcaseResult } from '../api/submissionApi';
import { getUser } from '../utils/auth';

const LANG_TEMPLATES: Record<string, string> = {
    cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    // Your code here\n    \n    return 0;\n}',
    python: '# Read input\nimport sys\ninput = sys.stdin.readline\n\n# Your code here\n',
};

const LANG_FILENAMES: Record<string, string> = {
    cpp: 'solution.cpp',
    python: 'solution.py',
};

const DIFFICULTY_LABEL: Record<string, string> = {
    easy: 'Dễ', medium: 'Trung bình', hard: 'Khó',
};

const DIFFICULTY_CLASS: Record<string, string> = {
    easy: 'easy', medium: 'medium', hard: 'hard',
};

const VERDICT_LABEL: Record<Verdict, string> = {
    AC: '✓ Accepted', WA: '✗ Wrong Answer', TLE: '⏱ Time Limit Exceeded',
    MLE: '📦 Memory Limit Exceeded', RE: '💥 Runtime Error',
    CE: '🔧 Compile Error', SE: '⚠ System Error', PENDING: '⏳ Judging…',
};

const VERDICT_COLORS: Record<Verdict, { bg: string; color: string; border: string }> = {
    AC:      { bg: '#DCFCE7', color: '#166534', border: '#22C55E' },
    WA:      { bg: '#FFE4E6', color: '#9F1239', border: '#EF4444' },
    TLE:     { bg: '#FEF3C7', color: '#92400E', border: '#F59E0B' },
    MLE:     { bg: '#EFF6FF', color: '#1E40AF', border: '#3B82F6' },
    RE:      { bg: '#F5F3FF', color: '#4C1D95', border: '#8B5CF6' },
    CE:      { bg: '#F3F4F6', color: '#374151', border: '#9CA3AF' },
    SE:      { bg: '#F3F4F6', color: '#374151', border: '#9CA3AF' },
    PENDING: { bg: '#FAFAFA', color: '#6B7280', border: '#D1D5DB' },
};

const difficultyStyles: Record<string, { background: string; color: string }> = {
    easy:   { background: '#DCFCE7', color: '#166534' },
    medium: { background: '#FEF9C3', color: '#854D0E' },
    hard:   { background: '#FFE4E6', color: '#9F1239' },
};

export default function ProblemDetail() {
    const { id } = useParams<{ id: string }>();
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
        getProblemById(numId)
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

    // ── Spinner / Error full-page ────────────────────────────────────────────
    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: 'calc(100vh - 46px)', gap: 12, color: '#666', fontSize: 15, fontWeight: 600 }}>
                <div style={{
                    width: 24, height: 24, border: '3px solid #EEE',
                    borderTopColor: '#FFB338', borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                }} />
                Đang tải bài toán…
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (error || !problem) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: 'calc(100vh - 46px)' }}>
                <div style={{ border: '2px solid #111', boxShadow: '4px 4px 0px #000',
                    background: '#FFE4E6', padding: '24px 40px', fontWeight: 700, color: '#9F1239',
                    textAlign: 'center' }}>
                    {error || 'Không tìm thấy bài toán.'}
                </div>
            </div>
        );
    }

    const diffCls = DIFFICULTY_CLASS[problem.difficulty?.toLowerCase()] ?? 'easy';
    const diffStyles = difficultyStyles[diffCls];
    const vcColors = verdict ? VERDICT_COLORS[verdict] : null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 46px)',
            overflow: 'hidden', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>

            {/* BREADCRUMB */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 20px',
                borderBottom: '2px solid #111', background: '#fff',
                fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
                <Link to="/problems" style={{ color: '#FFB338', textDecoration: 'none', fontWeight: 700 }}>
                    ← Bài tập
                </Link>
                <span style={{ color: '#999' }}>/</span>
                <span style={{ color: '#111' }}>#{problem.problemId} — {problem.title}</span>
            </div>

            {/* BODY */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                {/* ── LEFT: PROBLEM DESCRIPTION ── */}
                <div style={{ width: '42%', display: 'flex', flexDirection: 'column',
                    borderRight: '2px solid #111', overflowY: 'auto', background: '#fff' }}>

                    {/* Header */}
                    <div style={{ padding: '20px 24px 16px', borderBottom: '2px solid #111', flexShrink: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase',
                            letterSpacing: '0.6px', marginBottom: 6,
                            fontFamily: "'Space Grotesk', sans-serif" }}>
                            Bài #{problem.problemId}
                        </div>
                        <h1 style={{ margin: '0 0 12px', fontSize: 21, fontWeight: 800, lineHeight: 1.25,
                            fontFamily: "'Bricolage Grotesque', 'Plus Jakarta Sans', sans-serif" }}>
                            {problem.title}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            {/* Difficulty badge */}
                            <span style={{
                                padding: '3px 10px', border: '2px solid #111',
                                fontSize: 12, fontWeight: 700,
                                boxShadow: '2px 2px 0px #000',
                                fontFamily: "'Space Grotesk', sans-serif",
                                ...diffStyles,
                            }}>
                                {DIFFICULTY_LABEL[problem.difficulty?.toLowerCase()] ?? problem.difficulty}
                            </span>
                            {/* Tags */}
                            {problem.tags?.map((tag: any) => (
                                <span key={tag.tagId} style={{
                                    padding: '3px 10px', border: '1.5px solid #111',
                                    background: '#FDFDFD', fontSize: 11, fontWeight: 600,
                                }}>
                                    {tag.tagName} {}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Limits bar */}
                    <div style={{ display: 'flex', gap: 20, padding: '9px 24px',
                        borderBottom: '2px solid #111', background: '#FAFAFA', flexShrink: 0 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#555',
                            fontFamily: "'Space Grotesk', sans-serif" }}>
                            ⏱ Thời gian: <strong style={{ color: '#111' }}>
                                {problem.timeLimitMs ?? 1000} ms
                            </strong>
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#555',
                            fontFamily: "'Space Grotesk', sans-serif" }}>
                            📦 Bộ nhớ: <strong style={{ color: '#111' }}>
                                {problem.memoryLimitMb ?? 256} MB
                            </strong>
                        </span>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '20px 24px', flex: 1,
                        fontSize: 14.5, lineHeight: 1.75, color: '#222' }}>

                        {/* Description */}
                        <div style={{ marginBottom: 20, whiteSpace: 'pre-wrap' }}>
                            {problem.description}
                        </div>

                        {/* Visible examples */}
                        {visibleTestcases.length > 0 && (
                            <>
                                <SectionTitle>Ví dụ</SectionTitle>
                                {visibleTestcases.map((tc, i) => (
                                    <ExampleBlock key={tc.testcaseId} index={i + 1}
                                        input={tc.input} output={tc.expectedOutput} />
                                ))}
                            </>
                        )}

                        {/* Constraints */}
                        <SectionTitle>Ràng buộc</SectionTitle>
                        <div style={{ border: '2px solid #111', boxShadow: '2px 2px 0px #000',
                            padding: '12px 14px', background: '#FAFAFA' }}>
                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                                <li style={{ fontSize: 13.5, lineHeight: 1.8,
                                    fontFamily: "'JetBrains Mono', monospace" }}>
                                    1 ≤ T ≤ 10<sup>5</sup>
                                </li>
                                <li style={{ fontSize: 13.5, lineHeight: 1.8,
                                    fontFamily: "'JetBrains Mono', monospace" }}>
                                    Thời gian chạy ≤ {problem.timeLimitMs ?? 1000} ms
                                </li>
                                <li style={{ fontSize: 13.5, lineHeight: 1.8,
                                    fontFamily: "'JetBrains Mono', monospace" }}>
                                    Bộ nhớ ≤ {problem.memoryLimitMb ?? 256} MB
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT: EDITOR ── */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
                    background: '#1A1A1A', overflow: 'hidden' }}>

                    {/* Editor header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '8px 16px', borderBottom: '2px solid #2A2A2A', background: '#111',
                        flexShrink: 0 }}>
                        <select
                            value={lang}
                            onChange={e => handleLangChange(e.target.value as 'cpp' | 'python')}
                            style={{ background: '#222', color: '#E0E0E0', border: '1.5px solid #444',
                                padding: '4px 10px', fontSize: 13, outline: 'none',
                                fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, cursor: 'pointer' }}>
                            <option value="cpp">C++17</option>
                            <option value="python">Python 3</option>
                        </select>
                        <span style={{ fontSize: 12, color: '#555',
                            fontFamily: "'JetBrains Mono', monospace" }}>
                            {LANG_FILENAMES[lang]}
                        </span>
                    </div>

                    {/* Code textarea */}
                    <textarea
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        spellCheck={false}
                        style={{ flex: 1, resize: 'none', background: '#1A1A1A', color: '#D4D4D4',
                            border: 'none', outline: 'none', padding: '16px 20px',
                            fontFamily: "'JetBrains Mono', monospace", fontSize: 14, lineHeight: 1.6,
                            tabSize: 4, overflowY: 'auto' }}
                    />

                    {/* Test panel */}
                    <div style={{ flexShrink: 0, borderTop: '2px solid #2A2A2A', background: '#111' }}>
                        {/* Panel header */}
                        <div style={{ display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between', padding: '8px 16px',
                            borderBottom: '1px solid #1E1E1E' }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#AAA',
                                textTransform: 'uppercase', letterSpacing: '0.6px',
                                fontFamily: "'Space Grotesk', sans-serif" }}>
                                Kết quả
                            </span>
                            {verdict && vcColors && (
                                <span style={{
                                    padding: '3px 10px', fontSize: 12, fontWeight: 700,
                                    border: `1.5px solid ${vcColors.border}`,
                                    background: vcColors.bg, color: vcColors.color,
                                    fontFamily: "'Space Grotesk', sans-serif",
                                }}>
                                    {VERDICT_LABEL[verdict]}
                                </span>
                            )}
                        </div>

                        {/* Test-case dots */}
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap',
                            padding: '10px 16px', minHeight: 48, alignItems: 'center' }}>
                            {verdict === 'PENDING'
                                ? Array.from({ length: problem.testcases?.length ?? 3 }).map((_, i) => (
                                    <TcDot key={i} index={i + 1} status="pending" />
                                ))
                                : (verdict === 'CE' || verdict === 'SE')
                                    ? <span style={{ fontSize: 12, color: '#666',
                                        fontFamily: "'JetBrains Mono', monospace" }}>
                                        {verdict === 'CE' ? 'Lỗi biên dịch — không chạy test case nào.' : 'Lỗi hệ thống — không có kết quả.'}
                                      </span>
                                    : tcResults.map((tc, i) => (
                                        <TcDot key={`tc-${i}`} index={i + 1}
                                            status={tc.verdict === 'AC' ? 'pass' : 'fail'} />
                                    ))
                            }
                        </div>
                    </div>

                    {/* Action bar */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 16px', borderTop: '1px solid #1E1E1E', background: '#0D0D0D',
                        flexShrink: 0 }}>
                        <span style={{ fontSize: 12, color: '#555',
                            fontFamily: "'JetBrains Mono', monospace" }}>
                            {submitStats
                                ? `${submitStats.timeMs} ms · ${(submitStats.memKb / 1024).toFixed(1)} MB`
                                : verdict === 'SE'
                                    ? 'Lỗi kết nối — vui lòng thử lại.'
                                    : 'Nhấn Submit để nộp bài'}
                        </span>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button
                                disabled
                                title="Chức năng chạy thử sẽ có trong phiên bản tới"
                                style={{ padding: '7px 20px', background: 'transparent', color: '#555',
                                    border: '1.5px solid #333', fontSize: 13, fontWeight: 700,
                                    cursor: 'not-allowed', fontFamily: "'Space Grotesk', sans-serif",
                                    opacity: 0.4 }}>
                                Chạy thử
                            </button>
                            <button
                                disabled={submitting}
                                onClick={handleSubmit}
                                style={{ padding: '7px 24px', background: '#FFB338', color: '#111',
                                    border: '2px solid #111', fontSize: 13, fontWeight: 800,
                                    cursor: submitting ? 'not-allowed' : 'pointer',
                                    boxShadow: submitting ? 'none' : '3px 3px 0px #000',
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    opacity: submitting ? 0.5 : 1,
                                    transition: 'transform 0.15s, box-shadow 0.15s' }}>
                                {submitting ? 'Đang chấm…' : 'Nộp bài →'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Small sub-components ────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7,
            fontSize: 12, fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.7px', color: '#111', margin: '22px 0 10px',
            fontFamily: "'Space Grotesk', sans-serif" }}>
            <span style={{ display: 'inline-block', width: 3, height: 14,
                background: '#FFB338', border: '1px solid #111' }} />
            {children}
        </div>
    );
}

function ExampleBlock({ index, input, output }: { index: number; input: string; output: string }) {
    return (
        <div style={{ border: '2px solid #111', boxShadow: '2px 2px 0px #000',
            marginBottom: 14, background: '#fff' }}>
            <div style={{ background: '#111', color: '#fff', padding: '5px 12px',
                fontSize: 11, fontWeight: 700, letterSpacing: '0.5px',
                fontFamily: "'Space Grotesk', sans-serif" }}>
                VÍ DỤ {index}
            </div>
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                        color: '#666', letterSpacing: '0.4px', marginBottom: 3 }}>Input</div>
                    <pre style={{ background: '#F8F8F8', border: '1px solid #E5E7EB',
                        padding: '7px 10px', fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 13, whiteSpace: 'pre-wrap', margin: 0 }}>{input}</pre>
                </div>
                <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                        color: '#666', letterSpacing: '0.4px', marginBottom: 3 }}>Output</div>
                    <pre style={{ background: '#F8F8F8', border: '1px solid #E5E7EB',
                        padding: '7px 10px', fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 13, whiteSpace: 'pre-wrap', margin: 0 }}>{output}</pre>
                </div>
            </div>
        </div>
    );
}

function TcDot({ index, status }: { index: number; status: 'pass' | 'fail' | 'pending' }) {
    const styles = {
        pass:    { background: '#14532D', color: '#86EFAC', borderColor: '#22C55E' },
        fail:    { background: '#7F1D1D', color: '#FCA5A5', borderColor: '#EF4444' },
        pending: { background: '#1A1A1A', color: '#555',    borderColor: '#333' },
    }[status];
    return (
        <div style={{ width: 28, height: 28, border: `1.5px solid ${styles.borderColor}`,
            background: styles.background, color: styles.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
            {index}
        </div>
    );
}
