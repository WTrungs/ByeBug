// src/pages/Problems.tsx

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/modules/Problems.css'
import api from '../api/axios';
import ProblemCard from '../components/ProblemCard';
import type { Problem } from '../components/ProblemCard';

interface TagDTO {
    tagId: number;
    tagName: string;
}

interface ProblemDTO {
    problemId: number;
    title: string;
    description: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    tags: TagDTO[];
    timeLimitMs: number;
    isPublic: boolean;
    solvedCount?: number;
}

const toCardProblem = (dto: ProblemDTO): Problem => ({
    problem_id: dto.problemId,
    title: dto.title,
    description: dto.description,
    difficulty: dto.difficulty,
    tags: dto.tags?.map(tag => tag.tagName) ?? [],
    solved_count: dto.solvedCount ?? 0,
    time_limit_ms: dto.timeLimitMs,
    is_public: dto.isPublic,
});

const TOPIC_MAP: Record<string, string[]> = {
    'array-string': ['String'],
    'sorting': ['Sorting'],
    'data-structure': ['Data Structure'],
    'dynamic-programming': ['Dynamic Programming'],
    'graph': ['Graph'],
    'math': ['Math'],
    'bitmask': ['Bitmask'],
    'geometry': ['Geometry'],
};

const SIDEBAR_TOPICS = [
    { label: 'Tất cả bài tập', value: '' },
    { label: 'Mảng & Chuỗi', value: 'array-string' },
    { label: 'Sắp xếp', value: 'sorting' },
    { label: 'Cấu trúc dữ liệu', value: 'data-structure' },
    { label: 'Quy hoạch động', value: 'dynamic-programming' },
    { label: 'Đồ thị', value: 'graph' },
    { label: 'Toán học', value: 'math' },
];

const DIFFICULTIES = [
    { label: 'Dễ', value: 'EASY' },
    { label: 'Trung bình', value: 'MEDIUM' },
    { label: 'Khó', value: 'HARD' },
];

const PAGE_SIZE = 12;

const Problems: React.FC = () => {
    const navigate = useNavigate();

    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [search, setSearch] = useState('');
    const [topic, setTopic] = useState('');
    const [diffs, setDiffs] = useState<string[]>([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await api.get<ProblemDTO[]>('/problems');
                setProblems(res.data.map(toCardProblem));
            } catch (err) {
                console.error(err);
                setError('Không thể tải dữ liệu.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Reset về trang 1 khi filter thay đổi
    useEffect(() => {
        setPage(1);
    }, [search, topic, diffs]);

    const filtered = useMemo(() => {
        return problems.filter(p => {
            const matchSearch =
                p.title.toLowerCase().includes(search.toLowerCase()) ||
                String(p.problem_id).includes(search.trim());

            const matchTopic =
                !topic ||
                (() => {
                    const mapped = TOPIC_MAP[topic] ?? [topic];
                    return p.tags.some((tag: string) => mapped.includes(tag));
                })();

            const matchDiff =
                diffs.length === 0 || diffs.includes(p.difficulty);

            return matchSearch && matchTopic && matchDiff;
        });
    }, [problems, search, topic, diffs]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const topicCount = (value: string) => {
        if (!value) return problems.length;
        const mapped = TOPIC_MAP[value] ?? [value];
        return problems.filter(p =>
            p.tags.some((tag: string) => mapped.includes(tag))
        ).length;
    };

    const toggleDiff = (v: string) => {
        setDiffs(prev =>
            prev.includes(v) ? prev.filter(d => d !== v) : [...prev, v]
        );
    };

    if (loading) return <div className="prob-state">Đang tải dữ liệu...</div>;
    if (error) return <div className="prob-state prob-state--error">⚠️ {error}</div>;

    return (
        <div className="problems-page">
            <main className="prob-body">

                {/* ── FILTER BAR ── */}
                <div className="prob-filterbar">

                    <ul className="prob-filterbar__topics" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                        {SIDEBAR_TOPICS.map(t => (
                            <li
                                key={t.value}
                                className={`prob-filterbar__pill ${topic === t.value ? 'prob-filterbar__pill--active' : ''}`}
                                onClick={() => setTopic(t.value)}
                            >
                                {t.label}
                                {t.value !== '' && (
                                    <span style={{ marginLeft: 6, opacity: 0.6 }}>
                                        {topicCount(t.value)}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>

                    <div className="prob-filterbar__divider" />

                    <div className="prob-filterbar__diffs">
                        {DIFFICULTIES.map(d => (
                            <label key={d.value} className="prob-filterbar__check-label">
                                <input
                                    type="checkbox"
                                    checked={diffs.includes(d.value)}
                                    onChange={() => toggleDiff(d.value)}
                                    className="prob-filterbar__checkbox"
                                />
                                <span className={`diff-text--${d.value.toLowerCase()}`}>
                                    {d.label}
                                </span>
                            </label>
                        ))}
                    </div>

                    <div className="prob-filterbar__divider" />

                    <button
                        className="prob-filterbar__clear"
                        onClick={() => { setTopic(''); setDiffs([]); setSearch(''); }}
                    >
                        Xóa lọc
                    </button>
                </div>

                {/* ── SEARCH ── */}
                <div className="prob-search">
                    <input
                        className="prob-search__input"
                        placeholder="Tìm kiếm bài tập..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* ── RESULT META ── */}
                <p className="prob-meta">
                    Hiển thị {paginated.length} / {filtered.length} bài tập
                    &nbsp;·&nbsp; Trang {page} / {totalPages}
                </p>

                {/* ── CARD GRID ── */}
                <div className="prob-list">
                    {paginated.length === 0 ? (
                        <div className="prob-empty">Không tìm thấy bài tập 😢</div>
                    ) : (
                        paginated.map(problem => (
                            <ProblemCard
                                key={problem.problem_id}
                                problem={problem}
                                onSolve={(id: number) => navigate(`/problems/${id}`)}
                            />
                        ))
                    )}
                </div>

                {/* ── PAGINATION ── */}
                {totalPages > 1 && (
                    <div className="prob-pagination">
                        <button
                            className="prob-pagination__btn"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            aria-label="Trang trước"
                        >
                            ▲
                        </button>
                        <span className="prob-pagination__info">
                            {page} / {totalPages}
                        </span>
                        <button
                            className="prob-pagination__btn"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            aria-label="Trang sau"
                        >
                            ▼
                        </button>
                    </div>
                )}

            </main>
        </div>
    );
};

export default Problems;