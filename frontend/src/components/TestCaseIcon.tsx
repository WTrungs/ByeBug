import React from 'react';

interface Props {
    status: 'pass' | 'fail' | 'pending';
}

const styles: Record<string, React.CSSProperties> = {
    pass: {
        width: 32,
        height: 32,
        border: '2px solid #111',
        background: '#dcfce7',
        color: '#16a34a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 900,
        fontSize: 14,
        boxShadow: '2px 2px 0px #111',
        flexShrink: 0,
    },
    fail: {
        width: 32,
        height: 32,
        border: '2px solid #111',
        background: '#ffdae4',
        color: '#d62a4d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 900,
        fontSize: 14,
        boxShadow: '2px 2px 0px #111',
        flexShrink: 0,
    },
    pending: {
        width: 32,
        height: 32,
        border: '2px solid #111',
        background: '#f3f4f6',
        color: '#9ca3af',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 900,
        fontSize: 14,
        boxShadow: '2px 2px 0px #111',
        flexShrink: 0,
    },
};

const icons = { pass: '✓', fail: '✕', pending: '–' };

const TestCaseIcon: React.FC<Props> = ({ status }) => {
    return (
        <div style={styles[status]}>
            {icons[status]}
        </div>
    );
};

export default TestCaseIcon;