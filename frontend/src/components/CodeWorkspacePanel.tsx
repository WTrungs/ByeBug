import { useState } from "react";
import CodeEditor from "./CodeEditor";
import type { ProblemDetail } from "../api/problemApi";
import type { TestcaseResult, Verdict } from "../api/submissionApi";
import { LANG_FILENAMES, LANG_LABELS, type Language } from "../constants/languages";
import styles from "../styles/modules/ProblemDetail.module.css";

type TestStatus = "pass" | "fail" | "pending";

export interface SubmitStats {
  timeMs: number;
  memKb: number;
}

interface CodeWorkspacePanelProps {
  code: string;
  lang: Language;
  problem: ProblemDetail;
  submitting: boolean;
  submitStats: SubmitStats | null;
  tcResults: TestcaseResult[];
  verdict: Verdict | null;
  onCodeChange: (value: string) => void;
  onLangChange: (lang: Language) => void;
  onSubmit: () => void;
}

export default function CodeWorkspacePanel({
  code,
  lang,
  problem,
  submitting,
  submitStats,
  tcResults,
  verdict,
  onCodeChange,
  onLangChange,
  onSubmit,
}: CodeWorkspacePanelProps) {
  return (
    <section className={styles.rightPanel} aria-label="Code editor">
      <EditorToolbar lang={lang} onLangChange={onLangChange} />

      <div className={styles.editorShell}>
        <CodeEditor
          code={code}
          language={lang}
          onChange={(value) => onCodeChange(value ?? "")}
          theme="vs-dark"
        />
      </div>

      <ResultsPanel
        problem={problem}
        submitStats={submitStats}
        tcResults={tcResults}
        verdict={verdict}
      />

      <div className={styles.actionBar}>
        <button
          disabled={submitting}
          onClick={onSubmit}
          className={styles.btnSubmit}
        >
          {submitting ? "Judging..." : "Submit Solution"}
        </button>
      </div>
    </section>
  );
}

function EditorToolbar({
  lang,
  onLangChange,
}: {
  lang: Language;
  onLangChange: (lang: Language) => void;
}) {
  return (
    <div className={styles.editorHeader}>
      <div className={styles.editorHeaderLeft}>
        <div className={styles.editorFileInfo}>
          <span className={styles.codeGlyph}>{"<>"}</span>
          <span className={styles.filenameLabel}>{LANG_FILENAMES[lang]}</span>
        </div>
        <div className={styles.langSelectLabel}>
          <LanguageDropdown lang={lang} onLangChange={onLangChange} />
        </div>
      </div>
      <div className={styles.windowDots} aria-hidden="true">
        <span className={styles.windowDotRed} />
        <span className={styles.windowDotAmber} />
        <span className={styles.windowDotGreen} />
      </div>
    </div>
  );
}

function LanguageDropdown({
  lang,
  onLangChange,
}: {
  lang: Language;
  onLangChange: (lang: Language) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={styles.langSelectControl}
      onBlur={(event) => {
        const nextFocus = event.relatedTarget as Node | null;
        if (!nextFocus || !event.currentTarget.contains(nextFocus)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        className={styles.langSelectButton}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {LANG_LABELS[lang]}
      </button>
      {isOpen && (
        <div
          className={styles.langSelectMenu}
          role="listbox"
          aria-label="Choose programming language"
        >
          {Object.entries(LANG_LABELS).map(([value, label]) => {
            const language = value as Language;

            return (
              <button
                key={value}
                type="button"
                role="option"
                aria-selected={language === lang}
                className={styles.langSelectOption}
                onClick={() => {
                  onLangChange(language);
                  setIsOpen(false);
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ResultsPanel({
  problem,
  submitStats,
  tcResults,
  verdict,
}: {
  problem: ProblemDetail;
  submitStats: SubmitStats | null;
  tcResults: TestcaseResult[];
  verdict: Verdict | null;
}) {
  const passedCount = tcResults.filter((tc) => tc.verdict === "AC").length;
  const totalCount = tcResults.length || problem.testcases?.length || 0;

  return (
    <div className={styles.testPanel}>
      <div className={styles.testPanelHeader}>
        <span className={styles.testPanelTitle}>Live Test Results</span>
        <span className={styles.statsHint}>
          {getStatsText(verdict, submitStats, passedCount, totalCount)}
        </span>
      </div>
      <div className={styles.tcDotsRow}>
        {renderTestDots(verdict, tcResults, problem.testcases?.length ?? 3)}
      </div>
    </div>
  );
}

function getStatsText(
  verdict: Verdict | null,
  submitStats: SubmitStats | null,
  passedCount: number,
  totalCount: number,
) {
  if (submitStats) {
    return `${passedCount}/${totalCount} passed - ${submitStats.timeMs} ms - ${submitStats.memKb} KB`;
  }
  if (verdict === "SE") return "Connection error - please try again.";
  if (verdict && verdict !== "PENDING" && totalCount > 0) {
    return `${passedCount}/${totalCount} passed`;
  }
  return "Submit to see results";
}

function renderTestDots(
  verdict: Verdict | null,
  tcResults: TestcaseResult[],
  pendingCount: number,
) {
  if (verdict === "PENDING") {
    return Array.from({ length: pendingCount }).map((_, i) => (
      <TcDot key={i} index={i + 1} status="pending" />
    ));
  }

  if (verdict === "CE" || verdict === "SE") {
    return (
      <span className={styles.tcMessage}>
        {verdict === "CE"
          ? "Compile error - no test cases were run."
          : "System error - no results available."}
      </span>
    );
  }

  if (tcResults.length === 0) {
    return <span className={styles.tcMessage}>No judge results yet.</span>;
  }

  return tcResults.map((tc, i) => (
    <TcDot
      key={`tc-${i}`}
      index={i + 1}
      status={tc.verdict === "AC" ? "pass" : "fail"}
    />
  ));
}

function TcDot({ index, status }: { index: number; status: TestStatus }) {
  const statusClass = {
    pass: styles.tcDotPass,
    fail: styles.tcDotFail,
    pending: styles.tcDotPending,
  }[status];

  return (
    <div
      className={`${styles.tcDot} ${statusClass}`}
      aria-label={`Test ${index}: ${status}`}
    >
      {status === "pass" ? "OK" : status === "fail" ? "X" : index}
    </div>
  );
}
