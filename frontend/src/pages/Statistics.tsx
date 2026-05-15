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
import UserSidebar from "../components/UserSidebar";
import UserStatCard from "../components/UserStatCard";
import Navbar from "../components/Navbar";
import DifficultyBadge from "../components/DifficultyBadge";
import VerdictBadge from "../components/VerdictBadge";
import { getUser } from "../utils/auth";
import { getAllProblems, type Problem } from "../api/problemApi";
import {
  xAxisTick,
  yAxisTick,
  tooltipContentStyle,
  tooltipCursor,
  legendWrapperStyle,
  barSize,
} from "../constants/chartConfig";
import styles from "../styles/modules/Statistic.module.css";
import { getStatistics, type UserStatistics } from "../api/userApi";

const Statistics: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser();

  const [stats, setStats] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loadingProblems, setLoadingProblems] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [chartFilter, setChartFilter] = useState<"both" | "AC" | "WA">("both");

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.username) return;
      try {
        const [statsData, problemsData] = await Promise.all([
          getStatistics(user.username),
          getAllProblems(),
        ]);
        setStats(statsData);
        setProblems(problemsData.slice(0, 3));
      } catch (err: any) {
        console.error("Failed to fetch statistics", err);
        setError(err.response?.data || err.message || "Unknown error");
      } finally {
        setLoading(false);
        setLoadingProblems(false);
      }
    };

    fetchData();
  }, [user?.username]);

  const filteredSubmissions =
    stats?.recentSubmissions.filter((s) =>
      s.problemTitle.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  if (loading) return <div className={styles.loading}>Đang tải dữ liệu thống kê...</div>;
  if (error) return <div className={styles.error}>Lỗi: {error}</div>;
  if (!stats) return <div className={styles.error}>Không thể tải dữ liệu thống kê.</div>;

  return (
    <div className={styles.pageLayout}>
      <UserSidebar />

      <div className={styles.mainArea}>
        <Navbar
          title="THỐNG KÊ CÁ NHÂN"
          subtitle={
            <>
              Chào mừng trở lại, <strong>{user?.username ?? "Người dùng"}</strong>.
              Tiếp tục luyện tập nào!
            </>
          }
        />

        <div className={styles.content}>
          <div className={styles.statsRow}>
            <UserStatCard
              icon="✅"
              value={stats.solvedCount.toString()}
              label="Bài đã giải"
              accent="green"
            />
            <UserStatCard
              icon="🏅"
              value={`#${stats.rank}`}
              label="Xếp hạng"
              accent="yellow"
            />
            <UserStatCard
              icon="📤"
              value={stats.attemptedCount.toString()}
              label="Tổng nộp bài"
              accent="blue"
            />
            <UserStatCard
              icon="🔥"
              value={stats.streak.toString()}
              label="Streak (ngày)"
              accent="red"
            />
          </div>

          <div className={styles.twoColRow}>
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
                <BarChart data={stats.chartData} barSize={barSize} barGap={4}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#eee"
                    vertical={false}
                  />
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
                  <Tooltip
                    contentStyle={tooltipContentStyle}
                    cursor={tooltipCursor}
                  />
                  <Legend wrapperStyle={legendWrapperStyle} />
                  {(chartFilter === "both" || chartFilter === "AC") && (
                    <Bar
                      dataKey="ac"
                      name="AC"
                      fill="#22C55E"
                      radius={[2, 2, 0, 0] as [number, number, number, number]}
                    />
                  )}
                  {(chartFilter === "both" || chartFilter === "WA") && (
                    <Bar
                      dataKey="wa"
                      name="WA"
                      fill="#EF4444"
                      radius={[2, 2, 0, 0] as [number, number, number, number]}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className={`${styles.card} ${styles.featuredCard}`}>
              <span
                className={`${styles.sectionTitle} ${styles.sectionTitleBlock}`}
              >
                Bài tập đề xuất
              </span>
              <div className={styles.problemList}>
                {loadingProblems && <p className={styles.muted}>Đang tải...</p>}
                {!loadingProblems &&
                  problems.length === 0 && (
                    <p className={styles.muted}>Chưa có bài tập nào.</p>
                  )}
                {!loadingProblems &&
                  problems.map((p) => (
                    <div key={p.problemId} className={styles.problemRow}>
                      <div className={styles.problemRowHeader}>
                        <span className={styles.problemTitle}>
                          #{p.problemId} {p.title}
                        </span>
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
              <span
                className={styles.seeAllLink}
                onClick={() => navigate("/problems")}
              >
                XEM TẤT CẢ →
              </span>
            </div>
          </div>

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
                    <td className={styles.cellMono}>
                      {new Date(s.time).toLocaleString("vi-VN")}
                    </td>
                    <td className={styles.cellProblem}>{s.problemTitle}</td>
                    <td className={styles.cellMonoMid}>C++</td>
                    <td>
                      <VerdictBadge verdict={s.result} />
                    </td>
                    <td className={styles.cellMonoMid}>—</td>
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
    </div>
  );
};

export default Statistics;
