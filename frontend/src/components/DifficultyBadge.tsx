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
        </span>
    );
};

export default DifficultyBadge;