<<<<<<< Updated upstream
import styles from '../styles/modules/ProblemDetail.module.css';

const DIFFICULTY_MAP: Record<string, string> = {
    easy:   'Dễ',
    medium: 'Trung bình',
    hard:   'Khó',
};

const DIFFICULTY_CLASS: Record<string, string> = {
    easy:   styles.diffEasy,
    medium: styles.diffMedium,
    hard:   styles.diffHard,
};

interface DifficultyBadgeProps {
    level: string; // 'easy' | 'medium' | 'hard' or display label
}

const DifficultyBadge = ({ level }: DifficultyBadgeProps) => {
    const key = level.toLowerCase();
    const label = DIFFICULTY_MAP[key] ?? level;
    const colorClass = DIFFICULTY_CLASS[key] ?? '';
    return (
        <span className={`${styles.difficultyBadge} ${colorClass}`}>
            {label}
=======
import React from 'react';

interface Props {
    level: 'Easy' | 'Medium' | 'Hard' | string;
}

const classMap: Record<string, string> = {
    Easy:   'detail-diff-badge detail-diff-easy',
    Medium: 'detail-diff-badge detail-diff-medium',
    Hard:   'detail-diff-badge detail-diff-hard',
    'Dễ':        'detail-diff-badge detail-diff-easy',
    'Trung bình':'detail-diff-badge detail-diff-medium',
    'Khó':       'detail-diff-badge detail-diff-hard',
};

const DifficultyBadge: React.FC<Props> = ({ level }) => {
    return (
        <span className={classMap[level] ?? 'detail-diff-badge'}>
            {level}
>>>>>>> Stashed changes
        </span>
    );
};

export default DifficultyBadge;