import React, { useState, useEffect } from "react";
import UserSidebar from "../components/UserSidebar";
import Navbar from "../components/Navbar";
import { getLeaderboard, type LeaderboardUser } from "../api/userApi";
import styles from "../styles/modules/Leaderboard.module.css";

const INITIAL_VISIBLE_COUNT = 7;
const SHOW_MORE_STEP = 5;

const Leaderboard: React.FC = () => {
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setLeaders(data);
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const visibleLeaders = leaders.slice(0, visibleCount);
  const canShowMore = visibleCount < leaders.length;
  const canCollapse = visibleCount > INITIAL_VISIBLE_COUNT;

  if (loading) return <div className={styles.loading}>Đang tải bảng xếp hạng...</div>;

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
                {visibleLeaders.map((leader, index) => {
                  const rank = index + 1;
                  const avatarFallback = leader.username.charAt(0).toUpperCase();
                  const accents = ["gold", "green", "blue", "red", "cyan"];
                  const accent = rank <= 5 ? accents[rank - 1] : "blue";

                  return (
                    <tr
                      key={leader.username}
                      className={rank === 1 ? styles.topRankRow : ""}
                    >
                      <td>
                        <div className={styles.rankCell}>
                          {rank <= 3 ? (
                            <span
                              className={`${styles.rankMedal} ${styles[`rank${rank}`]}`}
                            >
                              {rank}
                            </span>
                          ) : (
                            <span className={styles.rankNumber}>
                              {String(rank).padStart(2, "0")}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className={styles.memberCell}>
                          <div className={`${styles.avatar} ${styles[accent]}`}>
                            {leader.avatarUrl ? (
                              <img
                                src={leader.avatarUrl}
                                alt={`${leader.username} avatar`}
                              />
                            ) : (
                              avatarFallback
                            )}
                          </div>
                          <div>
                            <div className={styles.memberName}>
                              {leader.username}
                            </div>
                            <div className={styles.memberMeta}>
                              {rank === 1
                                ? "TOP CONTRIBUTOR"
                                : `Joined ${new Date(leader.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.solvedCell}>
                          <span>{leader.solvedCount}</span>
                        </div>
                      </td>
                      <td className={styles.scoreCell}>
                        {leader.totalPoints.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.showMoreButton}
              onClick={() =>
                setVisibleCount((count) =>
                  Math.min(count + SHOW_MORE_STEP, leaders.length)
                )
              }
              disabled={!canShowMore}
            >
              {canShowMore ? "XEM THÊM" : "ĐÃ HIỂN THỊ TẤT CẢ"}
            </button>
            {canCollapse && (
              <button
                type="button"
                className={styles.showMoreButton}
                onClick={() => setVisibleCount(INITIAL_VISIBLE_COUNT)}
              >
                THU GỌN
              </button>
            )}
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
