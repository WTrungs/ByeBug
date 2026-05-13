import type { Verdict } from "../api/submissionApi";
import styles from "../styles/modules/VerdictBadge.module.css";

type VerdictBadgeValue = Verdict | string | null | undefined;

interface VerdictBadgeProps {
  verdict: VerdictBadgeValue;
  label?: string;
  className?: string;
}

const VERDICT_CLASS: Record<Verdict, string> = {
  AC: styles.ac,
  WA: styles.wa,
  TLE: styles.tle,
  MLE: styles.mle,
  RE: styles.re,
  CE: styles.ce,
  SE: styles.se,
  PENDING: styles.pending,
};

const normalizeVerdict = (verdict: VerdictBadgeValue) => {
  const value = verdict?.trim().toUpperCase();

  if (
    value === "AC" ||
    value === "WA" ||
    value === "TLE" ||
    value === "MLE" ||
    value === "RE" ||
    value === "CE" ||
    value === "SE" ||
    value === "PENDING"
  ) {
    return value;
  }

  return null;
};

const VerdictBadge = ({ verdict, label, className = "" }: VerdictBadgeProps) => {
  const normalized = normalizeVerdict(verdict);
  const displayText = label ?? normalized ?? verdict?.trim() ?? "-";
  const colorClass = normalized ? VERDICT_CLASS[normalized] : styles.neutral;

  return (
    <span className={`${styles.badge} ${colorClass} ${className}`.trim()}>
      {displayText}
    </span>
  );
};

export default VerdictBadge;
