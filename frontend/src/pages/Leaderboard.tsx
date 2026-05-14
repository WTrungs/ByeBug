import React, { useState } from "react";
import styles from "../styles/modules/Leaderboard.module.css";

type LeaderboardRow = {
  rank: number;
  username: string;
  title: string;
  solved: number;
  score: number;
  joinedAt: string;
  avatarFallback: string;
  accent: "gold" | "green" | "red" | "blue" | "cyan";
};

const leaders: LeaderboardRow[] = [
  { rank: 1, username: "minh_anh_pro", title: "TOP CONTRIBUTOR", solved: 582, score: 3420, joinedAt: "Joined Dec 2023", avatarFallback: "MA", accent: "gold" },
  { rank: 2, username: "hoang_nam_99", title: "Joined Dec 2023", solved: 412, score: 2850, joinedAt: "Joined Dec 2023", avatarFallback: "HN", accent: "green" },
  { rank: 3, username: "quoc_bao_dev", title: "Joined Jan 2024", solved: 395, score: 2410, joinedAt: "Joined Jan 2024", avatarFallback: "QB", accent: "blue" },
  { rank: 4, username: "thuy_duong_code", title: "Joined Mar 2024", solved: 352, score: 2100, joinedAt: "Joined Mar 2024", avatarFallback: "TD", accent: "red" },
  { rank: 5, username: "nguyen_tien_95", title: "Joined Jan 2024", solved: 318, score: 1950, joinedAt: "Joined Jan 2024", avatarFallback: "NT", accent: "cyan" },
  { rank: 6, username: "lan_anh_tech", title: "Joined Feb 2024", solved: 294, score: 1820, joinedAt: "Joined Feb 2024", avatarFallback: "LA", accent: "blue" },
  { rank: 7, username: "duc_thanh_pro", title: "Joined Apr 2024", solved: 275, score: 1740, joinedAt: "Joined Apr 2024", avatarFallback: "DT", accent: "green" },
  { rank: 8, username: "kim_ngan_ai", title: "Joined Apr 2024", solved: 248, score: 1660, joinedAt: "Joined Apr 2024", avatarFallback: "KN", accent: "gold" },
  { rank: 9, username: "viet_code_runner", title: "Joined May 2024", solved: 231, score: 1535, joinedAt: "Joined May 2024", avatarFallback: "VC", accent: "red" },
  { rank: 10, username: "linh_debugger", title: "Joined May 2024", solved: 219, score: 1460, joinedAt: "Joined May 2024", avatarFallback: "LD", accent: "cyan" },
];

const TrophyIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.trophyIcon}>
      <path d="M6 2H18V13C18 16.314 15.314 19 12 19C8.686 19 6 16.314 6 13V2Z" fill="#f59e0b" stroke="#92400e" strokeWidth="1.5"/>
      <path d="M6 5H3C3 5 2 5 2 7C2 9.5 4 11 6 11" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M18 5H21C21 5 22 5 22 7C22 9.5 20 11 18 11" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 19V22M15 19V22M7 22H17" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 9L11.5 7L12 9L14 9.5L12.5 11L13 13L11.5 12L10 13L10.5 11L9 9.5L10 9Z" fill="#fff7ed" stroke="#92400e" strokeWidth="0.5"/>
    </svg>
  );
  if (rank === 2) return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.trophyIcon}>
      <path d="M6 2H18V13C18 16.314 15.314 19 12 19C8.686 19 6 16.314 6 13V2Z" fill="#d1d5db" stroke="#6b7280" strokeWidth="1.5"/>
      <path d="M6 5H3C3 5 2 5 2 7C2 9.5 4 11 6 11" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M18 5H21C21 5 22 5 22 7C22 9.5 20 11 18 11" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 19V22M15 19V22M7 22H17" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
  if (rank === 3) return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.trophyIcon}>
      <path d="M6 2H18V13C18 16.314 15.314 19 12 19C8.686 19 6 16.314 6 13V2Z" fill="#fb923c" stroke="#9a3412" strokeWidth="1.5"/>
      <path d="M6 5H3C3 5 2 5 2 7C2 9.5 4 11 6 11" stroke="#9a3412" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M18 5H21C21 5 22 5 22 7C22 9.5 20 11 18 11" stroke="#9a3412" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 19V22M15 19V22M7 22H17" stroke="#9a3412" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
  return null;
};

const Leaderboard: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(7);
  const visibleLeaders = leaders.slice(0, visibleCount);
  const canShowMore = visibleCount < leaders.length;

  return (
    
        <main className={styles.content}>

          <section className={styles.hero}>
            <div className={styles.heroIconRow}>
              <span className={styles.heroBadge} data-type="star">★</span>
              <span className={styles.heroBadge} data-type="heart">♥</span>
              <span className={styles.heroBadge} data-type="code">&lt;/&gt;</span>
            </div>
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

          <section className={styles.board} aria-label="Bảng xếp hạng thành viên">
            <table className={styles.leaderTable}>
              <colgroup>
                  <col style={{ width: "5%" }} />   {/* XẾP HẠNG */}
                  <col style={{ width: "45%" }} />   {/* THÀNH VIÊN */}
                  <col style={{ width: "40%" }} />   {/* BÀI ĐÃ GIẢI */}
                  <col style={{ width: "10%" }} />   {/* TỔNG ĐIỂM */}
              </colgroup>
              <thead>
                <tr>
                  <th>XẾP HẠNG</th>
                  <th>THÀNH VIÊN</th>
                  <th>BÀI ĐÃ GIẢI</th>
                  <th>TỔNG ĐIỂM</th>
                </tr>
              </thead>
              <tbody>
                {visibleLeaders.map((leader, idx) => (
                  <tr
                    key={leader.username}
                    className={[
                      leader.rank === 1 ? styles.topRankRow : "",
                      leader.rank === 2 ? styles.secondRankRow : "",
                      leader.rank === 3 ? styles.thirdRankRow : "",
                      styles.animateRow,
                    ].join(" ")}
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    {/* Rank */}
                    <td>
                      <div className={styles.rankCell}>
                        {leader.rank <= 3 ? (
                          <div className={styles.rankTop}>
                            <TrophyIcon rank={leader.rank} />
                            <span className={`${styles.rankNumTop} ${styles[`rankColor${leader.rank}`]}`}>
                              {String(leader.rank).padStart(2, "0")}
                            </span>
                          </div>
                        ) : (
                          <span className={styles.rankNumber}>
                            {String(leader.rank).padStart(2, "0")}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Member */}
                    <td>
                      <div className={styles.memberCell}>
                        <div className={`${styles.avatar} ${styles[leader.accent]}`}>
                          {leader.avatarFallback}
                        </div>
                        <div>
                          <div className={styles.memberName}>{leader.username}</div>
                          <div className={styles.memberMeta}>
                            {leader.rank === 1 ? leader.title : leader.joinedAt}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Solved */}
                    <td>
                      <div className={styles.solvedCell}>
                        <span className={leader.rank <= 3 ? styles.solvedBadgeTop : ""}>
                          {leader.solved}
                        </span>
                      </div>
                    </td>

                    {/* Score */}
                    <td className={styles.scoreCell}>
                      <span className={leader.rank === 1 ? styles.scoreTop : ""}>
                        {leader.score.toLocaleString()}
                      </span>
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
              onClick={() => setVisibleCount((c) => Math.min(c + 3, leaders.length))}
              disabled={!canShowMore}
            >
              {canShowMore ? `XEM THÊM ${Math.min(3, leaders.length - visibleCount)} NGƯỜI KHÁC` : "ĐÃ HIỂN THỊ TẤT CẢ"}
              {canShowMore && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 5L7 10L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
        </main>
  );
};

export default Leaderboard;