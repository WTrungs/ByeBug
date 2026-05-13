import React from 'react';

export interface Problem {
    problem_id: number;
    title: string;
    description: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    tags: string[];
    solved_count?: number;
    time_limit_ms?: number;
    is_public: boolean;
    required_solved?: number;
}

interface ProblemCardProps {
    problem: Problem;
    isSolved?: boolean;
    userTotalSolved: number;
    onSolve: (id: number) => void;
}

const DIFF_LABEL: Record<string, string> = {
    EASY: 'Dễ',
    MEDIUM: 'Trung bình',
    HARD: 'Khó',
};

const formatNum = (n?: number) => {
    if (!n) return '0';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return String(n);
};

const ProblemCard: React.FC<ProblemCardProps> = ({ 
    problem, 
    isSolved, 
    userTotalSolved, 
    onSolve 
}) => {
    const diff = problem.difficulty;
    
    // Logic mở khóa: Phải là Public VÀ số bài đã giải của user >= mức yêu cầu
    const required = problem.required_solved || 0;
    const isLocked = !problem.is_public || userTotalSolved < required;

    return (
        <div className={`prob-card ${isLocked ? 'prob-card--locked' : ''}`}>
            <div className="prob-card__left">
                <div className="prob-card__title-row">
                    <span className={`prob-card__icon ${isLocked ? 'locked' : isSolved ? 'solved' : ''}`}>
                        {isLocked ? '🔒' : isSolved ? '✅' : '○'}
                    </span>

                    <h3 className="prob-card__title">
                        {String(problem.problem_id).padStart(3, '0')}. {problem.title}
                    </h3>

                    <span className={`prob-card__diff diff--${diff.toLowerCase()}`}>
                        {DIFF_LABEL[diff]}
                    </span>
                </div>

                <p className="prob-card__desc">
                    {isLocked 
                        ? `Thử thách bị khóa. Giải thêm ${required - userTotalSolved} bài tập nữa để truy cập nội dung này.` 
                        : problem.description}
                </p>

                <div className="prob-card__tags">
                    {problem.tags.map(tag => (
                        <span key={tag} className="prob-card__tag">{tag}</span>
                    ))}
                </div>
            </div>

            <div className="prob-card__right">
                {isLocked ? (
                    <div className="prob-card__lock-status">
                        {/* Thanh Progress Bar Neobrutalism */}
                        <div className="lock-progress-container">
                            <div 
                                className="lock-progress-bar" 
                                style={{ width: `${(userTotalSolved / required) * 100}%` }}
                            />
                        </div>
                        <span className="lock-text">Tiến độ: {userTotalSolved}/{required}</span>
                        <button className="prob-card__btn prob-card__btn--locked" disabled>
                            Bị khóa
                        </button>
                    </div>
                ) : (
                    <div className="prob-card__stats-group">
                        <div className="prob-card__stats">
                            <div className="prob-card__stat">
                                <span className="prob-card__stat-label">Đã giải</span>
                                <span className="prob-card__stat-value">{formatNum(problem.solved_count)}</span>
                            </div>
                            <div className="prob-card__stat-divider" />
                            <div className="prob-card__stat">
                                <span className="prob-card__stat-label">Dự kiến</span>
                                <span className="prob-card__stat-value">
                                    {Math.round((problem.time_limit_ms ?? 1000) / 60000 * 15 + 10)}p
                                </span>
                            </div>
                        </div>
                        <button
                            className="prob-card__btn prob-card__btn--solve"
                            onClick={() => onSolve(problem.problem_id)}
                        >
                            Giải →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProblemCard;