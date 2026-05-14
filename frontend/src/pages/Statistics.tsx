import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import UserStatCard from "../components/UserStatCard";
import DifficultyBadge from "../components/DifficultyBadge";
import { getUser } from "../utils/auth";
import { getAllProblems, type Problem } from "../api/problemApi";
import type { Verdict } from "../api/submissionApi";
import {
  xAxisTick,
  yAxisTick,
  tooltipContentStyle,
  tooltipCursor,
  legendWrapperStyle,
  barSize,
} from "../constants/chartConfig";
import styles from "../styles/modules/Statistic.module.css";

// ── Mock data ──────────────────────────────────────────────────────────────
const chartData = [
  { day: "T2", AC: 3, WA: 1 },
  { day: "T3", AC: 5, WA: 2 },
  { day: "T4", AC: 2, WA: 4 },
  { day: "T5", AC: 7, WA: 1 },
  { day: "T6", AC: 4, WA: 3 },
  { day: "T7", AC: 6, WA: 0 },
  { day: "CN", AC: 8, WA: 2 },
];

interface SubmissionRow {
  id: number;
  problem: string;
  language: string;
  verdict: Verdict;
  timeMs: number | null;
  submittedAt: string;
}

const recentSubmissions: SubmissionRow[] = [
  { id: 1, problem: "Two Sum",           language: "C++17",    verdict: "AC",  timeMs: 12,   submittedAt: "2026-05-12 14:30" },
  { id: 2, problem: "Fibonacci",         language: "Python 3", verdict: "WA",  timeMs: 45,   submittedAt: "2026-05-12 13:15" },
  { id: 3, problem: "Longest Substring", language: "C++17",    verdict: "TLE", timeMs: 2001, submittedAt: "2026-05-12 11:42" },
  { id: 4, problem: "Binary Search",     language: "C++17",    verdict: "AC",  timeMs: 8,    submittedAt: "2026-05-11 22:07" },
  { id: 5, problem: "Merge Sort",         language: "Python 3", verdict: "RE",  timeMs: null, submittedAt: "2026-05-11 18:55" },
];

const verdictClass: Record<Verdict, string> = {
  AC:      styles.verdictAC,
  WA:      styles.verdictWA,
  TLE:     styles.verdictTLE,
  MLE:     styles.verdictMLE,
  RE:      styles.verdictRE,
  CE:      styles.verdictCE,
  SE:      styles.verdictSE,
  PENDING: styles.verdictPending,
};

// ── Component ──────────────────────────────────────────────────────────────
const Statistics: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser();

  const [problems, setProblems] = useState<Problem[]>([]);
  const [loadingProblems, setLoadingProblems] = useState(true);
  const [problemsError, setProblemsError] = useState(false);
  const [chartFilter, setChartFilter] = useState<"both" | "AC" | "WA">("both");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getAllProblems()
      .then((data) => setProblems(data.slice(0, 3)))
      .catch(() => setProblemsError(true))
      .finally(() => setLoadingProblems(false));
  }, []);

  const filteredSubmissions = recentSubmissions.filter((s) =>
    s.problem.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className={styles.fullPageWrapper}>
      {/* TOPBAR - Giữ nguyên Navbar nhưng nội dung sẽ trải dài */}

      {/* CONTENT AREA - Bỏ bọc Sidebar layout, trực tiếp dùng content container */}
      <div className={styles.content}>

        {/* STATS ROW */}
        <div className={styles.statsRow}>
          <UserStatCard icon="✅" value="24"  label="Bài đã giải"   accent="green"  />
          <UserStatCard icon="🏅" value="#42" label="Xếp hạng"      accent="yellow" />
          <UserStatCard icon="📤" value="87"  label="Tổng nộp bài"  accent="blue"   />
          <UserStatCard icon="🔥" value="7"   label="Streak (ngày)" accent="red"    />
        </div>

        {/* CHART + FEATURED */}
        <div className={styles.twoColRow}>

          {/* Bar chart */}
          <div className={`${styles.card} ${styles.chartCard}`}>
            <div className={styles.chartHeader}>
              <span className={styles.sectionTitle}>Thống kê nộp bài</span>
              <div className={styles.filterGroup}>
                {(["both", "AC", "WA"] as const).map((f) => (
                  <button
                    key={f}
                    className={`filter-btn${chartFilter === f ? " active" : ""}`}
                    onClick={() => setChartFilter(f)}
                  >
                    {f === "both" ? "ALL" : f}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} barSize={barSize} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={xAxisTick}
                  axisLine={{ stroke: "#111", strokeWidth: 2 }}
                  tickLine={false}
                />
                <YAxis
                  tick={yAxisTick}
                  axisLine={{ stroke: "#111", strokeWidth: 2 }}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltipContentStyle} cursor={tooltipCursor} />
                <Legend wrapperStyle={legendWrapperStyle} />
                {(chartFilter === "both" || chartFilter === "AC") && (
                  <Bar dataKey="AC" fill="#22C55E" radius={[2, 2, 0, 0] as [number, number, number, number]} />
                )}
                {(chartFilter === "both" || chartFilter === "WA") && (
                  <Bar dataKey="WA" fill="#EF4444" radius={[2, 2, 0, 0] as [number, number, number, number]} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Featured problems */}
          <div className={`${styles.card} ${styles.featuredCard}`}>
            <span className={`${styles.sectionTitle} ${styles.sectionTitleBlock}`}>
              Bài tập đề xuất
            </span>
            <div className={styles.problemList}>
              {loadingProblems && (
                <p className={styles.muted}>Đang tải...</p>
              )}
              {!loadingProblems && problemsError && (
                <p className={styles.errorText}>Không thể tải bài tập. Vui lòng thử lại.</p>
              )}
              {!loadingProblems && !problemsError && problems.length === 0 && (
                <p className={styles.muted}>Chưa có bài tập nào.</p>
              )}
              {!loadingProblems && !problemsError && problems.map((p) => (
                <div key={p.problemId} className={styles.problemRow}>
                  <div className={styles.problemRowHeader}>
                    <span className={styles.problemTitle}>#{p.problemId} {p.title}</span>
                    <DifficultyBadge level={p.difficulty} />
                  </div>
                  <button
                    className={styles.doNowBtn}
                    onClick={() => navigate(`/problems/${p.problemId}`)}
                  >
                    LÀM NGAY →
                  </button>
                </div>
              ))}
            </div>
            <span className={styles.seeAllLink} onClick={() => navigate("/problems")}>
              XEM TẤT CẢ →
            </span>
          </div>
        </div>

        {/* SUBMISSION HISTORY */}
        <div className={styles.card}>
          <div className={styles.tableHeader}>
            <span className={styles.sectionTitle}>Lịch sử nộp bài</span>
            <input
              className={styles.tableSearchInput}
              placeholder="Tìm kiếm bài toán..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <table className={styles.submissionTable}>
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Bài toán</th>
                <th>Ngôn ngữ</th>
                <th>Kết quả</th>
                <th>Thời gian chạy</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((s) => (
                <tr key={s.id}>
                  <td className={styles.cellMono}>{s.submittedAt}</td>
                  <td className={styles.cellProblem}>{s.problem}</td>
                  <td className={styles.cellMonoMid}>{s.language}</td>
                  <td>
                    <span className={`${styles.verdictBadge} ${verdictClass[s.verdict] ?? styles.verdictPending}`}>
                      {s.verdict}
                    </span>
                  </td>
                  <td className={styles.cellMonoMid}>
                    {s.timeMs != null ? `${s.timeMs} ms` : "—"}
                  </td>
                </tr>
              ))}
              {filteredSubmissions.length === 0 && (
                <tr>
                  <td colSpan={5} className={styles.emptyRow}>
                    Không tìm thấy kết quả.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistics;