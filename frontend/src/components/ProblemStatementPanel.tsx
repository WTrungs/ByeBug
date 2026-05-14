import DifficultyBadge from './DifficultyBadge';
import MarkdownRenderer from './MarkdownRenderer';
import type { ProblemDetail, ProblemExample, ProblemTag } from '../api/problemApi';
import styles from '../styles/modules/ProblemDetail.module.css';

export default function ProblemStatementPanel({ problem }: { problem: ProblemDetail }) {
    const tags = problem.tags ?? [];
    const examples = problem.examples ?? [];
    const hasConstraints = Boolean(problem.constraints?.trim());

    return (
        <section className={styles.leftPanel} aria-label="Đề bài">
            <article className={styles.statementCard}>
                <header className={styles.problemHeader}>
                    <div className={styles.metaRow}>
                        <DifficultyBadge level={problem.difficulty ?? 'easy'} />
                        <span className={styles.problemId}>Problem ID: #{problem.problemId}</span>
                    </div>
                    <h1 className={styles.problemTitle}>{problem.title}</h1>
                    {tags.length > 0 && (
                        <div className={styles.tagsRow}>
                            {tags.map((tag, index) => (
                                <span key={getTagKey(tag, index)} className={styles.tagBadge}>
                                    {getTagLabel(tag)}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                <div className={styles.limitsBar}>
                    <span className={styles.limitItem}>
                        Time <strong className={styles.limitValue}>{problem.timeLimitMs ?? 1000} ms</strong>
                    </span>
                    <span className={styles.limitItem}>
                        Memory <strong className={styles.limitValue}>{problem.memoryLimitKb ?? 262144} KB</strong>
                    </span>
                </div>

                <div className={styles.problemContent}>
                    <MarkdownRenderer content={problem.description} />
                    {examples.length > 0 && <ExamplesSection examples={examples} />}
                    {hasConstraints && (
                        <section className={styles.problemSection}>
                            <h2 className={styles.problemSectionTitle}>Constraints:</h2>
                            <MarkdownRenderer content={problem.constraints ?? ''} />
                        </section>
                    )}
                </div>
            </article>
        </section>
    );
}

function getTagLabel(tag: string | ProblemTag) {
    return typeof tag === 'string' ? tag : tag.tagName;
}

function getTagKey(tag: string | ProblemTag, index: number) {
    if (typeof tag === 'string') return `${tag}-${index}`;
    return tag.tagId ?? `${tag.tagName}-${index}`;
}

function ExamplesSection({ examples }: { examples: ProblemExample[] }) {
    return (
        <section className={`${styles.problemSection} ${styles.examplesSection}`}>
            <h2 className={styles.examplesTitle}>
                <span className={styles.examplesIcon} aria-hidden="true" />
                Examples
            </h2>
            <div className={styles.examplesList}>
                {examples.map((example, index) => (
                    <ExampleCard key={example.exampleId ?? index} example={example} index={index} />
                ))}
            </div>
        </section>
    );
}

function ExampleCard({ example, index }: { example: ProblemExample; index: number }) {
    return (
        <article className={styles.exampleCard}>
            <div className={styles.exampleTitle}>Example {index + 1}:</div>
            <ExampleRow label="Input:" content={example.input} />
            <ExampleRow label="Output:" content={example.output} />
            {example.explanation?.trim() && (
                <ExampleRow label="Explanation:" content={example.explanation} />
            )}
        </article>
    );
}

function ExampleRow({ label, content }: { label: string; content: string }) {
    return (
        <div className={styles.exampleRow}>
            <span className={styles.exampleLabel}>{label}</span>
            <div className={styles.exampleValue}>
                <MarkdownRenderer content={content} />
            </div>
        </div>
    );
}
