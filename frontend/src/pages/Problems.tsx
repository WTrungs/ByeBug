// src/pages/Problems.tsx

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const Problems: React.FC = () => {
    const navigate = useNavigate();

    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [search, setSearch] = useState('');
    const [topic, setTopic] = useState('');
    const [diffs, setDiffs] = useState<string[]>([]);
    

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

    const filtered = useMemo(() => {
        return problems.filter(p => {
            const matchSearch =
                p.title.toLowerCase().includes(search.toLowerCase()) ||
                String(p.problem_id).includes(search.trim());

            const matchTopic =
                !topic ||
                (() => {
                    const mapped = TOPIC_MAP[topic] ?? [topic];

                    return p.tags.some((tag:string) =>
                        mapped.includes(tag)
                    );
                })();

            const matchDiff =
                diffs.length === 0 ||
                diffs.includes(p.difficulty);

            return (
                matchSearch &&
                matchTopic &&
                matchDiff
            );
        });
    }, [problems, search, topic, diffs]);

    const topicCount = (value: string) => {
        if (!value) return problems.length;

        const mapped = TOPIC_MAP[value] ?? [value];

        return problems.filter(p =>
            p.tags.some((tag:string) =>
                mapped.includes(tag)
            )
        ).length;
    };

    const toggleDiff = (v: string) => {
        setDiffs(prev =>
            prev.includes(v)
                ? prev.filter(d => d !== v)
                : [...prev, v]
        );
    };

    if (loading) {
        return (
            <div className="prob-state">
                Đang tải dữ liệu...
            </div>
        );
    }

    if (error) {
        return (
            <div className="prob-state prob-state--error">
                ⚠️ {error}
            </div>
        );
    }

    return (
        <div className="problems-page">
            <section className="prob-hero">
                <h1 className="prob-hero__title">
                    DANH SÁCH BÀI TẬP
                </h1>
            </section>

            <main className="prob-body">
                <aside className="prob-sidebar">
                    <div className="prob-sidebar__section">
                        <div className="prob-sidebar__section-header">
                            <span>🏷</span>
                            BỘ LỌC
                        </div>

                        <ul className="prob-sidebar__list">
                            {SIDEBAR_TOPICS.map(t => (
                                <li
                                    key={t.value}
                                    className={`prob-sidebar__item ${
                                        topic === t.value
                                            ? 'prob-sidebar__item--active'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        setTopic(t.value)
                                    }
                                >
                                    <span>{t.label}</span>

                                    <span className="prob-sidebar__count">
                                        {topicCount(t.value)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="prob-sidebar__section">
                        <div className="prob-sidebar__section-header">
                            <span>📊</span>
                            ĐỘ KHÓ
                        </div>

                        <ul className="prob-sidebar__checklist">
                            {DIFFICULTIES.map(d => (
                                <li
                                    key={d.value}
                                    className="prob-sidebar__check-item"
                                >
                                    <label className="prob-sidebar__check-label">
                                        <input
                                            type="checkbox"
                                            checked={diffs.includes(
                                                d.value
                                            )}
                                            onChange={() =>
                                                toggleDiff(d.value)
                                            }
                                            className="prob-sidebar__checkbox"
                                        />

                                        <span
                                            className={`prob-sidebar__check-text diff-text--${d.value.toLowerCase()}`}
                                        >
                                            {d.label}
                                        </span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button
                        className="btn-neo-submit prob-sidebar__filter-btn"
                        onClick={() => {
                            setTopic('');
                            setDiffs([]);
                            setSearch('');
                        }}
                    >
                        Xóa lọc
                    </button>
                </aside>

                <div className="prob-list">
                    <div className="prob-search">
                        <span className="prob-search__icon">
                            🔍
                        </span>

                        <input
                            className="prob-search__input"
                            placeholder="Tìm kiếm bài tập..."
                            value={search}
                            onChange={e =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>

                    {filtered.length === 0 ? (
                        <div className="prob-empty">
                            Không tìm thấy bài tập 😢
                        </div>
                    ) : (
                        filtered.map(problem => (
                            <ProblemCard
                                key={problem.problem_id}
                                problem={problem}
                                onSolve={(id: number) =>
                                    navigate(`/problems/${id}`)
                                }
                            />
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default Problems;