import React from 'react';
import styles from '../styles/modules/StatCard.module.css';

export type AccentVariant = 'green' | 'yellow' | 'blue' | 'red';

interface UserStatCardProps {
    icon: string;
    value: string;
    label: string;
    accent?: AccentVariant;
}

const UserStatCard: React.FC<UserStatCardProps> = ({ icon, value, label, accent = 'yellow' }) => (
    <div className={styles.card}>
        <div className={styles.icon}>{icon}</div>
        <div className={styles.value}>{value}</div>
        <div className={styles.label}>{label}</div>
        <div className={`${styles.accentBar} ${styles[accent]}`} />
    </div>
);

export default UserStatCard;
