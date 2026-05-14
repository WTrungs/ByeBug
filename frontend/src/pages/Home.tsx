import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import Navbar from "../components/Navbar";
import DifficultyBadge from "../components/DifficultyBadge";
import { getUser } from "../utils/auth";
import { getHomeSummary, type HomeSummary } from "../api/homeApi";
import styles from "../styles/modules/Home.module.css";

// ── Component ────────────────────────────────────────────────────────────────

const Home: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [data, setData] = useState<HomeSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHomeSummary()
      .then((res) => setData(res))
      .catch((err) => console.error("Failed to fetch home summary:", err))
      .finally(() => setLoading(false));
  }, []);

  const progressPct = data 
    ? Math.round((data.userStats.solvedCount / (data.userStats.totalProblems || 1)) * 100)
    : 0;

  return (
    <div className={styles.pageLayout}>
      <UserSidebar />

      <div className={styles.mainArea}>
        {/* TOPBAR */}
        <Navbar
          title="TRANG CHỦ"
          subtitle={
            <>
              Chào mừng trở lại,{" "}
              <strong>{user?.username ?? "Người dùng"}</strong>. Sẵn sàng luyện
              tập hôm nay!
            </>
          }
        />
        {/* CONTENT */}
        <div className={styles.content}>
          {loading ? (
            <div className={styles.loadingOverlay}>Đang tải dữ liệu...</div>
          ) : (
            <>
              {/* ROW 1: Hero + Leaderboard */}
              <div className={styles.topRow}>
                {/* Hero */}
                <div className={styles.heroCard}>
                  <div>
                    <div className={styles.heroLabel}>ONLINE JUDGE SYSTEM</div>
                    <h1 className={styles.heroTitle}>
                      Say goodbye
                      <br />
                      to <span className={styles.heroTitleAccent}>bugs.</span>
                    </h1>
                    <p className={styles.heroSub}>
                      {data?.userStats.totalProblems ?? 0} bài toán C++, Python,...
                    </p>
                  </div>
                  <div className={styles.progressSection}>
                    <div className={styles.progressLabelRow}>
                      <span className={styles.progressLabel}>Tiến trình...</span>
                      <span className={styles.progressPct}>{progressPct}%</span>
                    </div>
                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Leaderboard */}
                <div className={`${styles.card} ${styles.leaderCard}`}>
                  <p className={styles.leaderTitle}>Bảng xếp hạng</p>

                  <div className={styles.podium}>
                    {/* 2nd */}
                    {data?.leaderboard[1] && (
                      <div className={styles.podiumItem}>
                        <span className={styles.podiumMedal}>🥈</span>
                        <div className={`${styles.podiumAvatar} ${styles.podiumAvatarSilver}`}>
                          {data.leaderboard[1].initials}
                        </div>
                        <div className={`${styles.podiumBar} ${styles.podiumBarSecond}`} />
                        <span className={styles.podiumName}>{data.leaderboard[1].username}</span>
                        <span className={styles.podiumScore}>{data.leaderboard[1].score.toLocaleString()}</span>
                      </div>
                    )}
                    {/* 1st */}
                    {data?.leaderboard[0] && (
                      <div className={styles.podiumItem}>
                        <span className={styles.podiumMedal}>🥇</span>
                        <div className={`${styles.podiumAvatar} ${styles.podiumAvatarGold}`}>
                          {data.leaderboard[0].initials}
                        </div>
                        <div className={`${styles.podiumBar} ${styles.podiumBarFirst}`} />
                        <span className={styles.podiumName}>{data.leaderboard[0].username}</span>
                        <span className={styles.podiumScore}>{data.leaderboard[0].score.toLocaleString()}</span>
                      </div>
                    )}
                    {/* 3rd */}
                    {data?.leaderboard[2] && (
                      <div className={styles.podiumItem}>
                        <span className={styles.podiumMedal}>🥉</span>
                        <div className={`${styles.podiumAvatar} ${styles.podiumAvatarBronze}`}>
                          {data.leaderboard[2].initials}
                        </div>
                        <div className={`${styles.podiumBar} ${styles.podiumBarThird}`} />
                        <span className={styles.podiumName}>{data.leaderboard[2].username}</span>
                        <span className={styles.podiumScore}>{data.leaderboard[2].score.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <button className={styles.viewAllBtn} onClick={() => navigate("/leaderboard")}>
                    Xem đầy đủ →
                  </button>
                </div>
              </div>

              {/* ROW 2: Latest + Popular + Stats */}
              <div className={styles.bottomRow}>
                {/* Bài mới nhất */}
                <div className={`${styles.card} ${styles.latestCard}`}>
                  <p className={styles.cardTitle}>Bài mới nhất</p>
                  {data?.latestProblems.map((p) => (
                    <div
                      key={p.id}
                      className={styles.problemRow}
                      onClick={() => navigate(`/problems/${p.id}`)}
                    >
                      <div className={styles.problemRowLeft}>
                        <span className={styles.problemRowTitle}>{p.title}</span>
                        <div className={styles.problemRowMeta}>
                          <span>Vừa đăng bởi admin</span>
                        </div>
                      </div>
                      <DifficultyBadge level={p.difficulty as any} />
                    </div>
                  ))}
                  {data?.latestProblems.length === 0 && (
                    <span className={styles.muted}>Chưa có bài tập nào.</span>
                  )}
                </div>

                {/* Phổ biến nhất */}
                <div className={`${styles.card} ${styles.popularCard}`}>
                  <p className={styles.cardTitle}>Phổ biến nhất</p>
                  {data?.popularProblems.map((p, i) => (
                    <div
                      key={p.id}
                      className={styles.popularItem}
                      onClick={() => navigate(`/problems/${p.id}`)}
                    >
                      <span className={styles.popularRank}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className={styles.popularInfo}>
                        <div className={styles.popularTitle}>{p.title}</div>
                        <div className={styles.popularMeta}>
                          <span className={styles.acRate}>AC: {p.acRate}</span>
                          <span>· {p.submissionCount} nộp</span>
                        </div>
                      </div>
                      <DifficultyBadge level={p.difficulty as any} />
                    </div>
                  ))}
                </div>

                {/* Thống kê của bạn */}
                <div className={`${styles.card} ${styles.statsCard}`}>
                  <p className={styles.cardTitle}>Thống kê của bạn</p>
                  <span className={styles.statsMotivation}>
                    Tiếp tục nỗ lực nhé, Bug hunter!
                  </span>

                  <div className={styles.statsProgressRow}>
                    <div className={styles.statsProgressLabel}>
                      <span>Bài đã AC</span>
                      <span className={styles.statsProgressLabelRight}>
                        {data?.userStats.solvedCount}/{data?.userStats.totalProblems}
                      </span>
                    </div>
                    <div className={styles.statsProgressTrack}>
                      <div
                        className={styles.statsProgressFill}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  <div className={styles.statsGrid}>
                    <div className={styles.statsGridItem}>
                      <span className={styles.statsGridLabel}>Điểm số</span>
                      <span className={styles.statsGridValue}>
                        {data?.userStats.totalScore.toLocaleString()}
                      </span>
                    </div>
                    <div className={styles.statsGridItem}>
                      <span className={styles.statsGridLabel}>Hạng</span>
                      <span className={styles.statsGridValue}>#{data?.userStats.rank}</span>
                    </div>
                  </div>

                  <button
                    className={styles.profileBtn}
                    onClick={() => navigate("/statistics")}
                  >
                    Xem chi tiết →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
