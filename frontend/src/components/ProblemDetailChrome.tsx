import { Link } from 'react-router-dom';
import Navbar from './Navbar';

interface ProblemDetailHeaderProps {
    onLogoClick: () => void;
    problemTitle?: string;
}

export function ProblemDetailHeader({ onLogoClick, problemTitle }: ProblemDetailHeaderProps) {
    return (
        <Navbar
            title={problemTitle ?? 'Problem Detail'}
            subtitle={
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#888' }}>
                    <span
                        onClick={onLogoClick}
                        style={{ cursor: 'pointer', fontWeight: 700, color: 'var(--primary)', transition: 'all 0.15s ease' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--black)';
                            e.currentTarget.style.textShadow = '1.5px 1.5px 0px var(--primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--primary)';
                            e.currentTarget.style.textShadow = 'none';
                        }}
                    >
                        ByeBug
                    </span>
                    <span style={{ color: '#ccc' }}>›</span>
                    <Link
                        to="/problems"
                        style={{ color: '#888', textDecoration: 'none' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--black)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
                    >
                        Problems
                    </Link>
                    {problemTitle && (
                        <>
                            <span style={{ color: '#ccc' }}>›</span>
                            <strong style={{ color: 'var(--black)', fontWeight: 800 }}>{problemTitle}</strong>
                        </>
                    )}
                </span>
            }
        />
    );
}
