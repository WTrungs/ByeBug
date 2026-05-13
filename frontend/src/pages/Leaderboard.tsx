import React, { useState } from "react";
import UserSidebar from "../components/UserSidebar";
import Navbar from "../components/Navbar";
import styles from "../styles/modules/Leaderboard.module.css";

type LeaderboardRow = {
  rank: number;
  username: string;
  title: string;
  solved: number;
  score: number;
  joinedAt: string;
  avatarUrl?: string;
  avatarFallback: string;
  accent: "gold" | "green" | "red" | "blue" | "cyan";
};

const leaders: LeaderboardRow[] = [
  {
    rank: 1,
    username: "minh_anh_pro",
    title: "TOP CONTRIBUTOR",
    solved: 582,
    score: 3420,
    joinedAt: "Joined Dec 2023",
    avatarFallback: "MA",
    accent: "gold",
  },
  {
    rank: 2,
    username: "hoang_nam_99",
    title: "Joined Dec 2023",
    solved: 412,
    score: 2850,
    joinedAt: "Joined Dec 2023",
    avatarFallback: "HN",
    accent: "green",
  },
  {
    rank: 3,
    username: "quoc_bao_dev",
    title: "Joined Jan 2024",
    solved: 395,
    score: 2410,
    joinedAt: "Joined Jan 2024",
    avatarFallback: "QB",
    accent: "blue",
  },
  {
    rank: 4,
    username: "thuy_duong_code",
    title: "Joined Mar 2024",
    solved: 352,
    score: 2100,
    joinedAt: "Joined Mar 2024",
    avatarFallback: "TD",
    accent: "red",
  },
  {
    rank: 5,
    username: "nguyen_tien_95",
    title: "Joined Jan 2024",
    solved: 318,
    score: 1950,
    joinedAt: "Joined Jan 2024",
    avatarFallback: "NT",
    accent: "cyan",
  },
  {
    rank: 6,
    username: "lan_anh_tech",
    title: "Joined Feb 2024",
    solved: 294,
    score: 1820,
    joinedAt: "Joined Feb 2024",
    avatarFallback: "LA",
    accent: "blue",
  },
  {
    rank: 7,
    username: "duc_thanh_pro",
    title: "Joined Apr 2024",
    solved: 275,
    score: 1740,
    joinedAt: "Joined Apr 2024",
    avatarFallback: "DT",
    accent: "green",
  },
  {
    rank: 8,
    username: "kim_ngan_ai",
    title: "Joined Apr 2024",
    solved: 248,
    score: 1660,
    joinedAt: "Joined Apr 2024",
    avatarFallback: "KN",
    accent: "gold",
  },
  {
    rank: 9,
    username: "viet_code_runner",
    title: "Joined May 2024",
    solved: 231,
    score: 1535,
    joinedAt: "Joined May 2024",
    avatarFallback: "VC",
    accent: "red",
  },
  {
    rank: 10,
    username: "linh_debugger",
    title: "Joined May 2024",
    solved: 219,
    score: 1460,
    joinedAt: "Joined May 2024",
    avatarFallback: "LD",
    accent: "cyan",
  },
];

const Leaderboard: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(7);
  const visibleLeaders = leaders.slice(0, visibleCount);
  const canShowMore = visibleCount < leaders.length;

  return (
    <div className={styles.pageLayout}>
      <UserSidebar />

      <div className={styles.mainArea}>
        <Navbar
          title="BẢNG XẾP HẠNG"
          subtitle="Theo dõi thứ hạng và vươn lên dẫn đầu."
        />

        <main className={styles.content}>
          <section className={styles.hero}>
            <h1>BẢNG XẾP HẠNG</h1>
            <p>
              Nơi vinh danh những lập trình viên xuất sắc nhất trong hệ thống
              ByeBug. Thử thách bản thân và vươn lên dẫn đầu!
            </p>
            <div className={styles.heroMark} aria-hidden="true">
              <span />
              <span />
            </div>
          </section>

          <section
            className={styles.board}
            aria-label="Bảng xếp hạng thành viên"
          >
            <table className={styles.leaderTable}>
              <thead>
                <tr>
                  <th>XẾP HẠNG</th>
                  <th>THÀNH VIÊN</th>
                  <th>BÀI ĐÃ GIẢI</th>
                  <th>TỔNG ĐIỂM</th>
                </tr>
              </thead>
              <tbody>
                {visibleLeaders.map((leader) => (
                  <tr
                    key={leader.username}
                    className={leader.rank === 1 ? styles.topRankRow : ""}
                  >
                    <td>
                      <div className={styles.rankCell}>
                        {leader.rank <= 3 && (
                          <span
                            className={`${styles.rankMedal} ${styles[`rank${leader.rank}`]}`}
                          >
                            {leader.rank}
                          </span>
                        )}
                        {leader.rank > 3 && (
                          <span className={styles.rankNumber}>
                            {String(leader.rank).padStart(2, "0")}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className={styles.memberCell}>
                        <div className={styles.avatar}>
                          {leader.avatarUrl ? (
                            <img
                              src={leader.avatarUrl}
                              alt={`${leader.username} avatar`}
                            />
                          ) : (
                            leader.avatarFallback
                          )}
                        </div>
                        <div>
                          <div className={styles.memberName}>
                            {leader.username}
                          </div>
                          <div className={styles.memberMeta}>
                            {leader.rank === 1 ? leader.title : leader.joinedAt}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.solvedCell}>
                        <span>{leader.solved}</span>
                      </div>
                    </td>
                    <td className={styles.scoreCell}>
                      {leader.score.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.showMoreButton}
              onClick={() =>
                setVisibleCount((count) => Math.min(count + 3, leaders.length))
              }
              disabled={!canShowMore}
            >
              {canShowMore ? "XEM THÊM" : "ĐÃ HIỂN THỊ TẤT CẢ"}
              <span>v</span>
            </button>
          </div>
        </main>

        <footer className={styles.footer}>
          <div>
            <strong>ByeBug</strong>
            <span>
              © 2026 ByeBug Online Judge. Built for heavy performance.
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Leaderboard;
