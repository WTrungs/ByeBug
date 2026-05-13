import styles from '../styles/modules/ProblemDetail.module.css';

interface ExampleBoxProps {
    index: number;
    input: string;
    output: string;
}

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

export default ExampleBox;