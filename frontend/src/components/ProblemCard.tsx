// src/components/ProblemCard.tsx

import React from 'react';

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

const DIFF_LABEL: Record<string, string> = {
    EASY: 'Dễ',
    MEDIUM: 'Trung bình',
    HARD: 'Khó',
};

const formatNum = (n: number) => {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return String(n);
};

/** Strip markdown/latex ký tự khỏi description để hiển thị plain text */
const stripMarkdown = (text: string): string => {
    return text
        .replace(/\$\$[\s\S]*?\$\$/g, '')   // block math $$...$$
        .replace(/\$[^$]*?\$/g, '')           // inline math $...$
        .replace(/#{1,6}\s+/g, '')            // headings ##
        .replace(/\*\*([^*]+)\*\*/g, '$1')   // bold **text**
        .replace(/\*([^*]+)\*/g, '$1')        // italic *text*
        .replace(/`{1,3}[^`]*`{1,3}/g, '')   // code `...`
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
        .replace(/\n+/g, ' ')                 // newlines → space
        .trim();
};

const ProblemCard: React.FC<ProblemCardProps> = ({ problem, isSolved, onSolve }) => {
    return (
        <div className="prob-card">

            {/* top row: badge + status */}
            <div className="prob-card__top">
                <span className={`prob-card__diff diff--${problem.difficulty.toLowerCase()}`}>
                    {DIFF_LABEL[problem.difficulty]}
                </span>
                <span className="prob-card__status">
                    {isSolved ? '✅' : '○'}
                </span>
            </div>

            {/* title */}
            <h3 className="prob-card__title">
                {String(problem.problem_id).padStart(3, '0')}. {problem.title}
            </h3>

            {/* description — stripped */}
            <p className="prob-card__desc">
                {stripMarkdown(problem.description)}
            </p>

            {/* tags */}
            <div className="prob-card__tags">
                {problem.tags.map((tag, i) => (
                    <span key={i} className="prob-card__tag">{tag}</span>
                ))}
            </div>

            {/* footer */}
            <div className="prob-card__footer">
                <div className="prob-card__stats">
                    <span className="prob-card__stat">
                        👥 {formatNum(problem.solved_count)}
                    </span>
                    <span className="prob-card__stat">
                        ⏱ {Math.round((problem.time_limit_ms / 60000) * 15 + 10)}p
                    </span>
                </div>
                <button
                    className="prob-card__btn"
                    onClick={() => onSolve(problem.problem_id)}
                >
                    Giải →
                </button>
            </div>

        </div>
    );
};

export default ProblemCard;