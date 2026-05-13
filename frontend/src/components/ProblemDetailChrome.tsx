import { Link, NavLink } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { getUser } from '../utils/auth';
import styles from '../styles/modules/ProblemDetail.module.css';

interface ProblemDetailHeaderProps {
    onLogoClick: () => void;
}

export function ProblemDetailHeader({ onLogoClick }: ProblemDetailHeaderProps) {
    const user = getUser();
    const displayName = user?.username ?? 'Guest';
    const avatarSeed = encodeURIComponent(displayName);

    return (
        <header className={styles.navbar}>
            <div className={styles.navLogoWrap}>
                <BrandLogo onClick={onLogoClick} />
            </div>
            <nav className={styles.topNav} aria-label="Primary navigation">
                <NavLink to="/problems" className={({ isActive }) => `${styles.topNavLink} ${isActive ? styles.topNavLinkActive : ''}`}>
                    Problems
                </NavLink>
                <Link to="/contests" className={styles.topNavLink}>Contests</Link>
                <Link to="/leaderboard" className={styles.topNavLink}>Leaderboard</Link>
                <Link to="/discuss" className={styles.topNavLink}>Discuss</Link>
            </nav>
            <div className={styles.headerActions}>
                <button className={styles.iconButton} type="button" aria-label="Thông báo">
                    <span aria-hidden="true">●</span>
                </button>
                <Link to="/profile/me" className={styles.avatarButton} aria-label={`Mở hồ sơ của ${displayName}`}>
                    <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
                        alt=""
                        className={styles.avatarImage}
                    />
                </Link>
            </div>
        </header>
    );
}

export function ProblemDetailFooter() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerLinks}>
                <span>© 2024 ByeBug Online Judge</span>
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms of Service</Link>
                <Link to="/api-docs" className={styles.footerActiveLink}>API Docs</Link>
                <Link to="/status">Status</Link>
            </div>
            <strong className={styles.versionLabel}>v2.4.0-stable</strong>
        </footer>
    );
}
