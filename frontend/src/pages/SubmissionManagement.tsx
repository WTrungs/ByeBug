import React, { useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

const VERDICT_STYLE: Record<string, { bg: string; color: string; label: string }> = {
    AC:            { bg: '#F0FFF4', color: '#22543D', label: 'AC' },
    WRONG_ANSWER:  { bg: '#FFF5F5', color: '#C53030', label: 'WA' },
    TIME_LIMIT:    { bg: '#FFFAF0', color: '#C05621', label: 'TLE' },
    MEMORY_LIMIT:  { bg: '#EBF8FF', color: '#2B6CB0', label: 'MLE' },
    RUNTIME_ERROR: { bg: '#FAF5FF', color: '#553C9A', label: 'RE' },
    COMPILE_ERROR: { bg: '#F7FAFC', color: '#4A5568', label: 'CE' },
    PENDING:       { bg: '#FFFBEF', color: '#92400E', label: 'PENDING' },
};

function getVerdict(v: string) {
    return VERDICT_STYLE[v] ?? { bg: '#F7FAFC', color: '#4A5568', label: v };
}

interface Submission {
    submissionId: number;
    verdict: string;
    score: number;
    totalTimeMs: number | null;
    maxMemoryKb: number | null;
    sourceCode: string;
    language: string;
    compileError: string | null;
    judgeMessage: string | null;
    submittedAt: string;
    username: string;
}

interface Problem {
    problemId: number;
    title: string;
}

const SubmissionManagement: React.FC = () => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [selectedProblemId, setSelectedProblemId] = useState<number | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<Submission | null>(null);
    const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const token = (() => {
        try { return JSON.parse(localStorage.getItem('TOKEN') ?? '""'); } catch { return ''; }
    })();

    const authHeader = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

    // Load problems list
    useEffect(() => {
        fetch(`${API_BASE}/problems`, { headers: authHeader })
            .then(r => r.json())
            .then(data => setProblems(Array.isArray(data) ? data : data.content ?? []))
            .catch(() => setProblems([]));
    }, []);

    const loadSubmissions = useCallback(async (problemId: number) => {
        setLoading(true);
        setSubmissions([]);
        try {
            const r = await fetch(
                `${API_BASE}/admin/submissions?problemId=${problemId}&limit=50`,
                { headers: authHeader }
            );
            const data = await r.json();
            setSubmissions(Array.isArray(data) ? data : []);
        } catch {
            setSubmissions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleProblemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = Number(e.target.value);
        setSelectedProblemId(id);
        setSelected(null);
        if (id) loadSubmissions(id);
    };

    const showMsg = (type: 'success' | 'error', text: string) => {
        setActionMsg({ type, text });
        setTimeout(() => setActionMsg(null), 3500);
    };

    const handleRejudge = async (submissionId: number) => {
        setActionLoading(true);
        try {
            const r = await fetch(`${API_BASE}/admin/submissions/${submissionId}/rejudge`, {
                method: 'PATCH', headers: authHeader,
            });
            if (!r.ok) throw new Error();
            const updated: Submission = await r.json();
            setSubmissions(prev => prev.map(s => s.submissionId === submissionId ? updated : s));
            if (selected?.submissionId === submissionId) setSelected(updated);
            showMsg('success', `Đã đưa submission #${submissionId} vào hàng chờ chấm lại.`);
        } catch {
            showMsg('error', 'Rejudge thất bại. Thử lại sau.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAccept = async (submissionId: number) => {
        setActionLoading(true);
        try {
            const r = await fetch(`${API_BASE}/admin/submissions/${submissionId}/accept`, {
                method: 'PATCH', headers: authHeader,
            });
            if (!r.ok) throw new Error();
            const updated: Submission = await r.json();
            setSubmissions(prev => prev.map(s => s.submissionId === submissionId ? updated : s));
            if (selected?.submissionId === submissionId) setSelected(updated);
            showMsg('success', `Đã gán AC thủ công cho submission #${submissionId}.`);
        } catch {
            showMsg('error', 'Gán AC thất bại. Thử lại sau.');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <p style={{ margin: '0 0 4px', color: 'var(--admin-red)', fontSize: 11, fontWeight: 900, letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                        ADMIN
                    </p>
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px' }}>
                        Quản lý Submissions
                    </h2>
                </div>

                {/* Problem selector */}
                <select
                    className="neo-input"
                    style={{ minWidth: 260, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                    value={selectedProblemId ?? ''}
                    onChange={handleProblemChange}
                >
                    <option value="">-- Chọn bài toán --</option>
                    {problems.map(p => (
                        <option key={p.problemId} value={p.problemId}>#{p.problemId} — {p.title}</option>
                    ))}
                </select>
            </div>

            {/* Toast */}
            {actionMsg && (
                <div style={{
                    padding: '10px 16px',
                    border: '2px solid var(--black)',
                    fontWeight: 800,
                    fontSize: 13,
                    boxShadow: 'var(--shadow-sm)',
                    background: actionMsg.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: actionMsg.type === 'success' ? '#14532d' : '#991b1b',
                }}>
                    {actionMsg.text}
                </div>
            )}

            {/* Main layout: table + detail panel */}
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

                {/* Table */}
                <div style={{ flex: 1, minWidth: 0, background: 'var(--white)', border: 'var(--border-main)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: 'var(--border-main)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 900, fontSize: 14 }}>
                            {selectedProblemId
                                ? `${submissions.length} submissions gần nhất`
                                : 'Chọn bài toán để xem submissions'}
                        </span>
                        {selectedProblemId && (
                            <button className="btn-act-log" style={{ fontSize: 12, padding: '5px 14px' }}
                                onClick={() => loadSubmissions(selectedProblemId)}>
                                ↻ Tải lại
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div style={{ padding: 40, textAlign: 'center', fontWeight: 700, color: '#888' }}>Đang tải...</div>
                    ) : !selectedProblemId ? (
                        <div style={{ padding: 40, textAlign: 'center', color: '#aaa', fontWeight: 700 }}>
                            Chọn một bài toán ở trên để xem danh sách submissions
                        </div>
                    ) : submissions.length === 0 ? (
                        <div style={{ padding: 40, textAlign: 'center', color: '#aaa', fontWeight: 700 }}>Chưa có submission nào</div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    {['#ID', 'User', 'Verdict', 'Score', 'Time', 'Nộp lúc'].map(h => (
                                        <th key={h} style={{
                                            background: '#1A1A1A', color: '#fff', padding: '12px 14px',
                                            textAlign: 'left', fontSize: 11, fontWeight: 800,
                                            textTransform: 'uppercase', letterSpacing: '0.5px',
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map(s => {
                                    const v = getVerdict(s.verdict);
                                    const isSelected = selected?.submissionId === s.submissionId;
                                    return (
                                        <tr
                                            key={s.submissionId}
                                            onClick={() => setSelected(s)}
                                            style={{
                                                cursor: 'pointer',
                                                background: isSelected ? 'var(--admin-red-soft)' : undefined,
                                                borderLeft: isSelected ? '4px solid var(--admin-red)' : '4px solid transparent',
                                                transition: '0.12s',
                                            }}
                                            onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'var(--bg-soft)'; }}
                                            onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = ''; }}
                                        >
                                            <td style={{ padding: '13px 14px', borderBottom: '1px solid #eee', fontWeight: 800, fontSize: 13 }}>
                                                #{s.submissionId}
                                            </td>
                                            <td style={{ padding: '13px 14px', borderBottom: '1px solid #eee', fontWeight: 700, fontSize: 13 }}>
                                                {s.username ?? '—'}
                                            </td>
                                            <td style={{ padding: '13px 14px', borderBottom: '1px solid #eee' }}>
                                                <span style={{
                                                    padding: '3px 8px', fontSize: 11, fontWeight: 800,
                                                    border: '1.5px solid currentColor',
                                                    background: v.bg, color: v.color,
                                                }}>{v.label}</span>
                                            </td>
                                            <td style={{ padding: '13px 14px', borderBottom: '1px solid #eee', fontWeight: 700, fontSize: 13 }}>
                                                {s.score ?? 0}
                                            </td>
                                            <td style={{ padding: '13px 14px', borderBottom: '1px solid #eee', fontSize: 12, color: '#666', fontWeight: 600 }}>
                                                {s.totalTimeMs != null ? `${s.totalTimeMs}ms` : '—'}
                                            </td>
                                            <td style={{ padding: '13px 14px', borderBottom: '1px solid #eee', fontSize: 12, color: '#666', fontWeight: 600 }}>
                                                {s.submittedAt ? new Date(s.submittedAt).toLocaleString('vi-VN') : '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Detail panel */}
                {selected && (
                    <div style={{
                        width: 380, flexShrink: 0,
                        background: 'var(--white)', border: 'var(--border-main)',
                        boxShadow: 'var(--shadow-md)', position: 'sticky', top: 20,
                    }}>
                        {/* Panel header */}
                        <div style={{
                            padding: '14px 18px', borderBottom: 'var(--border-main)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                            <span style={{ fontWeight: 900, fontSize: 14 }}>Submission #{selected.submissionId}</span>
                            <button
                                onClick={() => setSelected(null)}
                                style={{
                                    width: 28, height: 28, border: '2px solid var(--black)',
                                    background: 'var(--white)', fontWeight: 900, fontSize: 16,
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                            >×</button>
                        </div>

                        {/* Meta */}
                        <div style={{ padding: '14px 18px', borderBottom: '1px solid #eee', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {[
                                { label: 'User', value: selected.username },
                                { label: 'Lang', value: selected.language },
                                { label: 'Score', value: String(selected.score ?? 0) },
                                { label: 'Time', value: selected.totalTimeMs != null ? `${selected.totalTimeMs}ms` : '—' },
                                { label: 'Memory', value: selected.maxMemoryKb != null ? `${selected.maxMemoryKb}KB` : '—' },
                            ].map(({ label, value }) => (
                                <span key={label} style={{
                                    fontSize: 11, fontWeight: 800, padding: '3px 8px',
                                    border: '1.5px solid var(--black)', background: 'var(--bg-soft)',
                                }}>
                                    {label}: {value}
                                </span>
                            ))}
                            {/* Verdict badge */}
                            <span style={{
                                fontSize: 11, fontWeight: 800, padding: '3px 8px',
                                border: '1.5px solid currentColor',
                                background: getVerdict(selected.verdict).bg,
                                color: getVerdict(selected.verdict).color,
                            }}>
                                {getVerdict(selected.verdict).label}
                            </span>
                        </div>

                        {/* Source code */}
                        <div style={{ padding: '12px 18px', borderBottom: '1px solid #eee' }}>
                            <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4px', color: '#888' }}>
                                Source Code
                            </p>
                            <pre style={{
                                margin: 0, padding: '12px', fontSize: 12, lineHeight: 1.6,
                                fontFamily: 'var(--font-mono)', background: '#1A1A1A', color: '#E2E8F0',
                                overflowX: 'auto', maxHeight: 280, overflowY: 'auto',
                                border: '2px solid var(--black)',
                            }}>
                                {selected.sourceCode ?? '(không có source code)'}
                            </pre>
                        </div>

                        {/* Compile error / judge message */}
                        {(selected.compileError || selected.judgeMessage) && (
                            <div style={{ padding: '12px 18px', borderBottom: '1px solid #eee' }}>
                                <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', color: '#C53030' }}>
                                    {selected.compileError ? 'Compile Error' : 'Judge Message'}
                                </p>
                                <pre style={{
                                    margin: 0, padding: '10px', fontSize: 12, lineHeight: 1.5,
                                    fontFamily: 'var(--font-mono)', background: '#FFF5F5',
                                    color: '#C53030', border: '1.5px solid #FC8181',
                                    overflowX: 'auto', maxHeight: 120, overflowY: 'auto', whiteSpace: 'pre-wrap',
                                }}>
                                    {selected.compileError ?? selected.judgeMessage}
                                </pre>
                            </div>
                        )}

                        {/* Actions */}
                        <div style={{ padding: '14px 18px', display: 'flex', gap: 10 }}>
                            <button
                                className="btn-act-log"
                                style={{ flex: 1, justifyContent: 'center' }}
                                disabled={actionLoading}
                                onClick={() => handleRejudge(selected.submissionId)}
                            >
                                ↻ Chấm lại
                            </button>
                            <button
                                style={{
                                    flex: 1, padding: '8px 12px', fontWeight: 700, fontSize: 13,
                                    border: '2px solid var(--black)', cursor: 'pointer',
                                    background: '#F0FFF4', color: '#22543D',
                                    boxShadow: 'var(--shadow-sm)', transition: 'all 0.15s',
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                }}
                                disabled={actionLoading}
                                onClick={() => handleAccept(selected.submissionId)}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'; }}
                            >
                                ✓ Gán AC
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubmissionManagement;