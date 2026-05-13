import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import Navbar from "../components/Navbar";
import DifficultyBadge from "../components/DifficultyBadge";
import { getUser } from "../utils/auth";
import { getAllProblems, type Problem } from "../api/problemApi";
import styles from "../styles/modules/Home.module.css";

// ── Mock data ───────────────────────────────────────────────────────────────

const LEADERBOARD = [
  { initials: "MN", name: "minh_nguyen", score: "18,420", rank: 1 },
  { initials: "BT", name: "bao_tran", score: "15,890", rank: 2 },
  { initials: "HL", name: "ha_le", score: "14,210", rank: 3 },
];

const POPULAR = [
  {
    id: 1,
    title: "Tính tổng 2 số nguyên",
    acRate: "89%",
    submissions: "1.3k",
    difficulty: "easy",
  },
  {
    id: 2,
    title: "Kiểm tra số nguyên tố",
    acRate: "89%",
    submissions: "1.3k",
    difficulty: "medium",
  },
  {
    id: 3,
    title: "Bài toán dương di",
    acRate: "89%",
    submissions: "1.3k",
    difficulty: "hard",
  },
];

const PROGRESS_PCT = 84;
const AC_SOLVED = 124;
const TOTAL_PROBLEMS = 248;
const USER_SCORE = 1450;
const TOTAL_SUBMIT = 512;

// ── Component ────────────────────────────────────────────────────────────────

const Home: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loadingProblems, setLoadingProblems] = useState(true);

  useEffect(() => {
    getAllProblems()
      .then((data) => setProblems(data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoadingProblems(false));
  }, []);

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
                  {TOTAL_PROBLEMS} bài toán · C++, Python,... · Kết quả tức thì
                </p>
              </div>
              <div className={styles.progressSection}>
                <div className={styles.progressLabelRow}>
                  <span className={styles.progressLabel}>
                    Tiến trình lên Đại Kiện Tướng
                  </span>
                  <span className={styles.progressPct}>{PROGRESS_PCT}%</span>
                </div>
                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${PROGRESS_PCT}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className={`${styles.card} ${styles.leaderCard}`}>
              <p className={styles.leaderTitle}>Bảng xếp hạng</p>

              <div className={styles.podium}>
                {/* 2nd */}
                <div className={styles.podiumItem}>
                  <span className={styles.podiumMedal}>🥈</span>
                  <div
                    className={`${styles.podiumAvatar} ${styles.podiumAvatarSilver}`}
                  >
                    {LEADERBOARD[1].initials}
                  </div>
                  <div
                    className={`${styles.podiumBar} ${styles.podiumBarSecond}`}
                  />
                  <span className={styles.podiumName}>
                    {LEADERBOARD[1].name}
                  </span>
                  <span className={styles.podiumScore}>
                    {LEADERBOARD[1].score}
                  </span>
                </div>
                {/* 1st */}
                <div className={styles.podiumItem}>
                  <span className={styles.podiumMedal}>🥇</span>
                  <div
                    className={`${styles.podiumAvatar} ${styles.podiumAvatarGold}`}
                  >
                    {LEADERBOARD[0].initials}
                  </div>
                  <div
                    className={`${styles.podiumBar} ${styles.podiumBarFirst}`}
                  />
                  <span className={styles.podiumName}>
                    {LEADERBOARD[0].name}
                  </span>
                  <span className={styles.podiumScore}>
                    {LEADERBOARD[0].score}
                  </span>
                </div>
                {/* 3rd */}
                <div className={styles.podiumItem}>
                  <span className={styles.podiumMedal}>🥉</span>
                  <div
                    className={`${styles.podiumAvatar} ${styles.podiumAvatarBronze}`}
                  >
                    {LEADERBOARD[2].initials}
                  </div>
                  <div
                    className={`${styles.podiumBar} ${styles.podiumBarThird}`}
                  />
                  <span className={styles.podiumName}>
                    {LEADERBOARD[2].name}
                  </span>
                  <span className={styles.podiumScore}>
                    {LEADERBOARD[2].score}
                  </span>
                </div>
              </div>

              <button
                className={styles.viewAllBtn}
                onClick={() => navigate("/problems")}
              >
                Xem đầy đủ →
              </button>
            </div>
          </div>

          {/* ROW 2: Latest + Popular + Stats */}
          <div className={styles.bottomRow}>
            {/* Bài mới nhất */}
            <div className={`${styles.card} ${styles.latestCard}`}>
              <p className={styles.cardTitle}>Bài mới nhất</p>
              {loadingProblems && (
                <span className={styles.muted}>Đang tải...</span>
              )}
              {!loadingProblems &&
                problems.map((p) => (
                  <div
                    key={p.problemId}
                    className={styles.problemRow}
                    onClick={() => navigate(`/problems/${p.problemId}`)}
                  >
                    <div className={styles.problemRowLeft}>
                      <span className={styles.problemRowTitle}>{p.title}</span>
                      <div className={styles.problemRowMeta}>
                        <span>⏱ vừa đăng</span>
                        <span>· by Admin</span>
                      </div>
                    </div>
                    <DifficultyBadge level={p.difficulty} />
                  </div>
                ))}
              {!loadingProblems && problems.length === 0 && (
                <span className={styles.muted}>Chưa có bài tập nào.</span>
              )}
            </div>

            {/* Phổ biến nhất */}
            <div className={`${styles.card} ${styles.popularCard}`}>
              <p className={styles.cardTitle}>Phổ biến nhất</p>
              {POPULAR.map((p, i) => (
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
                      <span>· {p.submissions} nộp</span>
                    </div>
                  </div>
                  <DifficultyBadge level={p.difficulty} />
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
                    {AC_SOLVED}/{TOTAL_PROBLEMS}
                  </span>
                </div>
                <div className={styles.statsProgressTrack}>
                  <div
                    className={styles.statsProgressFill}
                    style={{ width: `${(AC_SOLVED / TOTAL_PROBLEMS) * 100}%` }}
                  />
                </div>
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statsGridItem}>
                  <span className={styles.statsGridLabel}>Điểm số</span>
                  <span className={styles.statsGridValue}>
                    {USER_SCORE.toLocaleString()}
                  </span>
                </div>
                <div className={styles.statsGridItem}>
                  <span className={styles.statsGridLabel}>Nộp bài</span>
                  <span className={styles.statsGridValue}>{TOTAL_SUBMIT}</span>
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
        </div>
      </div>
    </div>
  );
};

export default Home;
