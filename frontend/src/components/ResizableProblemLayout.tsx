import type { ReactNode } from 'react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import styles from '../styles/modules/ProblemDetail.module.css';

interface ResizableProblemLayoutProps {
    left: ReactNode;
    right: ReactNode;
}

export default function ResizableProblemLayout({ left, right }: ResizableProblemLayoutProps) {
    return (
        <main className={styles.body}>
            <Group orientation="horizontal" className={styles.panelGroup}>
                <Panel defaultSize={50} minSize={32} className={styles.resizablePanel}>
                    {left}
                </Panel>
                <Separator className={styles.resizeHandle}>
                    <span className={styles.resizeHandleGrip} />
                </Separator>
                <Panel defaultSize={50} minSize={34} className={styles.resizablePanel}>
                    {right}
                </Panel>
            </Group>
        </main>
    );
}
