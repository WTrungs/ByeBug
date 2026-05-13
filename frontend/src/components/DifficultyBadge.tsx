import styles from '../styles/modules/DifficultyBadge.module.css';

const DIFFICULTY_LABEL: Record<string, string> = {
    easy: 'Dễ',
    'dễ': 'Dễ',
    medium: 'Vừa',
    'vừa': 'Vừa',
    'trung bình': 'Vừa',
    hard: 'Khó',
    'khó': 'Khó',
};

const DIFFICULTY_CLASS: Record<string, string> = {
    easy: styles.easy,
    'dễ': styles.easy,
    medium: styles.medium,
    'vừa': styles.medium,
    'trung bình': styles.medium,
    hard: styles.hard,
    'khó': styles.hard,
};

interface DifficultyBadgeProps {
    level?: string | null;
}

const DifficultyBadge = ({ level }: DifficultyBadgeProps) => {
    const value = level?.trim() || '';
    const key = value.toLowerCase();
    const label = DIFFICULTY_LABEL[key] ?? value;
    const colorClass = DIFFICULTY_CLASS[key] ?? styles.default;

    return (
        <span className={`${styles.badge} ${colorClass}`}>
            {label}
        </span>
    );
};

export default DifficultyBadge;