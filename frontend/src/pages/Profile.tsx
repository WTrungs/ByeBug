import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import Navbar from "../components/Navbar";
import UserStatCard from "../components/UserStatCard";
import { getUserProfile, type UserProfile } from "../api/userApi";
import styles from "../styles/modules/Profile.module.css";

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (username) {
        try {
          // In a real app, 'me' would be replaced by the actual username from context
          const targetUser = username === "me" ? "admin" : username;
          const data = await getUserProfile(targetUser);
          setProfile(data);
        } catch (error) {
          console.error("Failed to fetch profile", error);
          // Mock data for demonstration if API fails
          setProfile({
            username: username === "me" ? "admin" : username,
            fullName: "Bug Hunter",
            email: "hunter@byebug.com",
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            totalPoints: 1250,
            rank: 42,
            solvedCount: 85,
            attemptedCount: 120,
            verdictStats: { ac: 85, wa: 20, tle: 5, mle: 2, re: 3, ce: 5 },
            recentSubmissions: [
              {
                id: 1,
                problemTitle: "Two Sum",
                result: "AC",
                time: "2024-05-12 14:30",
              },
              {
                id: 2,
                problemTitle: "Add Two Numbers",
                result: "WA",
                time: "2024-05-11 09:15",
              },
              {
                id: 3,
                problemTitle: "Longest Substring",
                result: "AC",
                time: "2024-05-10 22:45",
              },
              {
                id: 4,
                problemTitle: "Reverse Integer",
                result: "AC",
                time: "2024-05-09 11:20",
              },
            ],
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) return <div className={styles.loading}>Loading profile...</div>;
  if (!profile) return <div className={styles.error}>Profile not found</div>;

  // const totalStats = profile.verdictStats.ac + profile.verdictStats.wa + profile.verdictStats.tle + profile.verdictStats.mle + profile.verdictStats.re + profile.verdictStats.ce;

  return (
    <div className={styles.pageLayout}>
      <UserSidebar />

      <div className={styles.mainArea}>
        <Navbar
          title="HỒ SƠ CÁ NHÂN"
          subtitle={
            <>
              Theo dõi thành tích và hoạt động của{" "}
              <strong>{profile.username}</strong>.
            </>
          }
        />

        {/* CONTENT */}
        <div className={styles.content}>
          <div className={styles.profileGrid}>
            {/* Left Column: User Info */}
            <div className={styles.userCard}>
              <img
                src={profile.avatarUrl}
                alt="avatar"
                className={styles.avatar}
              />
              <h1 className={styles.name}>{profile.fullName}</h1>

              <div className={styles.statsGrid}>
                <button
                  type="button"
                  className={styles.statAction}
                  onClick={() => navigate("/leaderboard")}
                  aria-label="Xem bảng xếp hạng"
                >
                  <UserStatCard
                    icon=""
                    value={`#${profile.rank}`}
                    label="Rank"
                    accent="yellow"
                  />
                </button>
                <div className={styles.statPreview}>
                  <UserStatCard
                    icon=""
                    value={profile.totalPoints.toString()}
                    label="Points"
                    accent="blue"
                  />
                </div>
              </div>

              <Link to="/settings" className={styles.editBtn}>
                Edit Profile
              </Link>
            </div>

            {/* Right Column: Detailed Stats & Activity */}
            <div className={styles.mainContent}>
              {/* Summary Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
                }}
              >
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Đã giải</h2>
                  <div style={{ fontSize: "36px", fontWeight: 900 }}>
                    {profile.solvedCount}
                  </div>
                  <div
                    style={{ fontSize: "13px", color: "#666", fontWeight: 600 }}
                  >
                    Trong tổng số {profile.attemptedCount} bài nộp
                  </div>
                </div>
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Tỷ lệ AC</h2>
                  <div
                    style={{
                      fontSize: "36px",
                      fontWeight: 900,
                      color: "#22C55E",
                    }}
                  >
                    {(
                      (profile.solvedCount / profile.attemptedCount) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                  <div
                    style={{ fontSize: "13px", color: "#666", fontWeight: 600 }}
                  >
                    Hiệu suất làm bài
                  </div>
                </div>
              </div>

              {/* Recent Submissions */}
              <div
                className={styles.section}
                style={{ padding: 0, overflow: "hidden" }}
              >
                <div className={styles.activityHeader}>
                  <h2 className={styles.sectionTitle}>Hoạt động gần đây</h2>
                  <button
                    type="button"
                    className={styles.detailLink}
                    onClick={() => navigate("/submissions")}
                  >
                    Chi tiết
                  </button>
                </div>
                <table className={styles.submissionTable}>
                  <thead>
                    <tr>
                      <th>Bài toán</th>
                      <th>Kết quả</th>
                      <th>Thời gian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.recentSubmissions.map((sub) => (
                      <tr key={sub.id} className={styles.activityRow}>
                        <td>
                          <button
                            type="button"
                            className={styles.problemLink}
                            onClick={() =>
                              navigate(`/problems/${sub.problemId ?? sub.id}`)
                            }
                          >
                            {sub.problemTitle}
                          </button>
                        </td>
                        <td
                          className={
                            sub.result === "AC"
                              ? styles.verdictAC
                              : styles.verdictWA
                          }
                        >
                          {sub.result}
                        </td>
                        <td style={{ fontSize: "12px", color: "#888" }}>
                          {sub.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
