// src/components/ProblemCard.tsx

import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';
import DifficultyBadge from './DifficultyBadge';

export interface Problem {
    problem_id: number;
    title: string;
    description: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    tags: string[];
    solved_count: number;
    time_limit_ms: number;
    is_public: boolean;
}

interface ProblemCardProps {
    problem: Problem;
    isSolved?: boolean;
    onSolve: (id: number) => void;
}

const formatNum = (n: number) => {
    if (n >= 1000) {
        return `${(n / 1000).toFixed(1)}k`;
    }

    return String(n);
};

const ProblemCard: React.FC<ProblemCardProps> = ({
    problem,
    isSolved,
    onSolve,
}) => {
    return (
        <div className="prob-card">
            <div className="prob-card__left">
                <div className="prob-card__title-row">
                    <span
                        className={`prob-card__icon ${isSolved ? 'solved' : ''}`}
                        aria-hidden="true"
                    >
                        {isSolved ? '✓' : '○'}
                    </span>

                    <h3 className="prob-card__title">
                        #{problem.problem_id} {problem.title}
                    </h3>

                    <DifficultyBadge level={problem.difficulty} />
                </div>

                <div className="prob-card__desc">
                    <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                    >
                        {problem.description || 'Chưa có mô tả cho bài tập này.'}
                    </ReactMarkdown>
                </div>

                <div className="prob-card__tags">
                    {problem.tags.map((tag, index) => (
                        <span key={`${tag}-${index}`} className="prob-card__tag">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="prob-card__right">
                <div className="prob-card__stats">
                    <div className="prob-card__stat">
                        <span className="prob-card__stat-label">Đã giải</span>

                        <span className="prob-card__stat-value">
                            {formatNum(problem.solved_count)}
                        </span>
                    </div>

                    <div className="prob-card__stat-divider" />

                    <div className="prob-card__stat">
                        <span className="prob-card__stat-label">Dự kiến</span>

                        <span className="prob-card__stat-value">
                            {Math.round((problem.time_limit_ms / 60000) * 15 + 10)}
                            p
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
        </div>
    );
};

export default ProblemCard;
