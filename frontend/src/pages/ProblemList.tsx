import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ProblemCard from '../components/ProblemCard';
import type { Problem } from '../components/ProblemCard';

// ── Kiểu dữ liệu trả về từ backend ───────────────────────
interface ProblemDTO {
    problemId: number;
    title: string;
    description: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    tags: string[];
    timeLimitMs: number;
    isPublic: boolean;
    requiredSolved: number; 
}

// ── Map DTO → Problem interface của ProblemCard ───────────
const toCardProblem = (dto: ProblemDTO): Problem => ({
    problem_id: dto.problemId,
    title: dto.title,
    description: dto.description,
    difficulty: dto.difficulty,
    tags: dto.tags ?? [],
    solved_count: 0, 
    is_public: dto.isPublic,
    required_solved: dto.requiredSolved ?? 0,
});

// ── Cấu hình Map cho Sidebar (Để đếm số lượng bài) ────────
const TOPIC_MAP: Record<string, string[]> = {
    'array-string':        ['String', 'Sorting'],
    'Data Structure':      ['Data Structure'],
    'Dynamic Programming': ['Dynamic Programming'],
    'Graph':               ['Graph'],
    'Math':                ['Math'],
    'Bitmask':             ['Bitmask'],
    'Geometry':            ['Geometry'],
};

const SIDEBAR_TOPICS = [
    { label: 'Tất cả bài tập',  value: ''                    },
    { label: 'Mảng & Chuỗi',    value: 'array-string'        },
    { label: 'Cấu trúc cây',    value: 'Data Structure'      },
    { label: 'Quy hoạch động',  value: 'Dynamic Programming' },
    { label: 'Đồ thị & BFS/DFS',value: 'Graph'               },
    { label: 'Toán học',        value: 'Math'                },
];

const DIFFICULTIES = [
    { label: 'Dễ',         value: 'EASY'   },
    { label: 'Trung bình', value: 'MEDIUM' },
    { label: 'Khó',        value: 'HARD'   },
];

const ProblemList: React.FC = () => {
    const navigate = useNavigate();

    // ── State ──────────────────────────────────────────
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userTotalSolved, setUserTotalSolved] = useState<number>(0);

    // State cho bộ lọc
    const [search, setSearch] = useState('');
    const [topic, setTopic] = useState('');
    const [diffs, setDiffs] = useState<string[]>([]);

    // ── Fetch Data ─────────────────────────────────────
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // 1. Lấy danh sách bài tập
                const res = await api.get<ProblemDTO[]>('/problems');
                setProblems(res.data.map(toCardProblem));

                // 2. Lấy thông tin user để check lock
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    setUserTotalSolved(user.total_score || 0);
                }
            } catch (err: any) {
                console.error("API Error:", err);
                setError("Không thể kết nối đến máy chủ.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // ── Logic Bộ lọc (Filter) ──────────────────────────
    const filtered = useMemo(() => {
        return problems.filter(p => {
            const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                               String(p.problem_id).includes(search.trim());

            const matchTopic = !topic || (() => {
                const mapped = TOPIC_MAP[topic] ?? [topic];
                return p.tags.some(t => mapped.includes(t));
            })();

            const matchDiff = diffs.length === 0 || diffs.includes(p.difficulty);

            return matchSearch && matchTopic && matchDiff;
        });
    }, [problems, search, topic, diffs]);

    const topicCount = (value: string) => {
        if (!value) return problems.length;
        const mapped = TOPIC_MAP[value] ?? [value];
        return problems.filter(p => p.tags.some(t => mapped.includes(t))).length;
    };

    const toggleDiff = (v: string) =>
        setDiffs(prev => prev.includes(v) ? prev.filter(d => d !== v) : [...prev, v]);

    // ── Render Giao diện ───────────────────────────────
    if (loading) return <div className="prob-state">Đang tải dữ liệu...</div>;
    if (error) return <div className="prob-state prob-state--error">⚠️ {error}</div>;

    return (
        <div className="problems-page">
            <section className="prob-hero">
                <h1 className="prob-hero__title">DANH SÁCH BÀI TẬP</h1>
            </section>

            <main className="prob-body">
                {/* SIDEBAR BỘ LỌC */}
                <aside className="prob-sidebar">
                    <div className="prob-sidebar__section">
                        <div className="prob-sidebar__section-header">
                            <span>🏷</span> BỘ LỌC
                        </div>
                        <ul className="prob-sidebar__list">
                            {SIDEBAR_TOPICS.map(t => (
                                <li
                                    key={t.value}
                                    className={`prob-sidebar__item ${topic === t.value ? 'prob-sidebar__item--active' : ''}`}
                                    onClick={() => setTopic(t.value)}
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
                            <span>📊</span> Độ khó
                        </div>
                        <ul className="prob-sidebar__checklist">
                            {DIFFICULTIES.map(d => (
                                <li key={d.value} className="prob-sidebar__check-item">
                                    <label className="prob-sidebar__check-label">
                                        <input
                                            type="checkbox"
                                            checked={diffs.includes(d.value)}
                                            onChange={() => toggleDiff(d.value)}
                                            className="prob-sidebar__checkbox"
                                        />
                                        <span className={`prob-sidebar__check-text diff-text--${d.value.toLowerCase()}`}>
                                            {d.label}
                                        </span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button
                        className="btn-neo-submit prob-sidebar__filter-btn"
                        onClick={() => { setTopic(''); setDiffs([]); setSearch(''); }}
                    >
                        Xóa lọc
                    </button>
                </aside>

                <div className="prob-list">
                    {/* THANH TÌM KIẾM */}
                    <div className="prob-search">
                        <span className="prob-search__icon">🔍</span>
                        <input
                            className="prob-search__input"
                            placeholder="Tìm kiếm bài tập..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    {/* HIỂN THỊ DANH SÁCH BÀI TẬP */}
                    {filtered.length === 0 ? (
                        <div className="prob-empty">Không tìm thấy bài tập nào 😢</div>
                    ) : (
                        filtered.map(p => (
                            <ProblemCard
                                key={p.problem_id}
                                problem={p}
                                userTotalSolved={userTotalSolved}
                                onSolve={(id) => navigate(`/problems/${id}`)}
                            />
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default ProblemList;