import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import Navbar from "../components/Navbar";
import UserStatCard from "../components/UserStatCard";
import VerdictBadge from "../components/VerdictBadge";
import { getUserProfile, type UserProfile } from "../api/userApi";
import { getUser } from "../utils/auth";
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
          let targetUser = username;
          const currentUser = getUser();
          
          if (username === "me") {
            if (currentUser) {
              targetUser = currentUser.username;
            } else {
              navigate("/login");
              return;
            }
          }

          try {
            const data = await getUserProfile(targetUser);
            setProfile(data);
          } catch (apiError) {
            console.error("API failed to fetch profile, using local/mock data", apiError);
            // Fallback to basic info if it's the current user
            if (currentUser && targetUser === currentUser.username) {
               setProfile({
                 username: currentUser.username,
                 fullName: currentUser.fullName || "Người dùng",
                 email: currentUser.email || "",
                 avatarUrl: currentUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`,
                 totalPoints: 0,
                 rank: 0,
                 solvedCount: 0,
                 attemptedCount: 0,
                 verdictStats: { ac: 0, wa: 0, tle: 0, mle: 0, re: 0, ce: 0 },
                 recentSubmissions: []
               });
            } else {
               throw apiError;
            }
          }
        } catch (error) {
          console.error("Failed to load profile", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [username, navigate]);

  if (loading) return <div className={styles.loading}>Loading profile...</div>;
  if (!profile) return (
    <div className={styles.pageLayout}>
      <UserSidebar />
      <div className={styles.mainArea}>
        <Navbar title="HỒ SƠ CÁ NHÂN" />
        <div className={styles.content}>
           <div className={styles.error}>Không tìm thấy thông tin người dùng <strong>{username}</strong></div>
        </div>
      </div>
    </div>
  );

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
              <h1 className={styles.name}>{profile.username}</h1>
              <p style={{ color: '#666', fontWeight: 600, marginTop: '-12px', marginBottom: '16px' }}>{profile.fullName}</p>

              <div className={styles.statsGrid}>
                <button
                  type="button"
                  className={styles.statAction}
                  onClick={() => navigate("/leaderboard")}
                  aria-label="Xem bảng xếp hạng"
                >
                  <UserStatCard
                    icon=""
                    value={profile.rank > 0 ? `#${profile.rank}` : "N/A"}
                    label="Rank"
                    accent="yellow"
                  />
                </button>
                <div className={styles.statPreview}>
                  <UserStatCard
                    icon=""
                    value={(profile.totalPoints || 0).toString()}
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
                    {profile.attemptedCount > 0
                      ? ((profile.solvedCount / profile.attemptedCount) * 100).toFixed(1)
                      : "0.0"}
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
                        <td>
                          <VerdictBadge verdict={sub.result} />
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
