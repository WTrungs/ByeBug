<<<<<<< Updated upstream
import styles from '../styles/modules/ProblemDetail.module.css';

interface ExampleBoxProps {
    index: number;
=======
import React from 'react';

interface Props {
    id: number;
>>>>>>> Stashed changes
    input: string;
    output: string;
}

<<<<<<< Updated upstream
const ExampleBox = ({ index, input, output }: ExampleBoxProps) => (
    <div className={styles.exampleBlock}>
        <div className={styles.exampleHeader}>VÍ DỤ {index}</div>
        <div className={styles.exampleBody}>
            <div>
                <div className={styles.exampleLabel}>Input</div>
                <pre className={styles.examplePre}>{input}</pre>
            </div>
            <div>
                <div className={styles.exampleLabel}>Output</div>
                <pre className={styles.examplePre}>{output}</pre>
            </div>
        </div>
    </div>
);
=======
const ExampleBox: React.FC<Props> = ({ id, input, output, explanation }) => {
    return (
        <div>
            <p className="detail-section-title">Ví dụ {id}</p>
            <div className="detail-example">
                <div className="detail-example-header">Example {id}</div>
                <div className="detail-example-body">
                    <div className="detail-example-row">
                        <span className="detail-example-label">Input</span>
                        <span className="detail-example-value">{input}</span>
                    </div>
                    <div className="detail-example-row">
                        <span className="detail-example-label">Output</span>
                        <span className="detail-example-value">{output}</span>
                    </div>
                    {explanation && (
                        <div className="detail-example-row">
                            <span className="detail-example-label">Giải thích</span>
                            <span style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>
                                {explanation}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
>>>>>>> Stashed changes

export default ExampleBox;