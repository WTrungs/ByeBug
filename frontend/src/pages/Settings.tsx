import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import Navbar from "../components/Navbar";
import { getUserProfile, updateProfile, changePassword, deleteAccount } from "../api/userApi";
import { getUser } from "../utils/auth";
import styles from "../styles/modules/Settings.module.css";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUser();
    console.log("Settings Initial Load - User:", user);
    
    if (!user) {
      console.warn("No user found, redirecting to login");
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile(user.username);
        console.log("Profile Fetched:", profile);
        setFullName(profile.fullName || "");
        setEmail(profile.email || "");
      } catch (error) {
        console.error("Failed to fetch profile in Settings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = getUser();
    if (!user) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    try {
      console.log("Attempting to update profile for:", user.username);
      await updateProfile(user.username, { fullName, email });
      
      // Update localStorage safely
      try {
        const rawUser = localStorage.getItem('USER') || localStorage.getItem('user');
        if (rawUser) {
            const parsed = JSON.parse(rawUser);
            const updatedUser = { ...parsed, fullName, email };
            const stringified = JSON.stringify(updatedUser);
            localStorage.setItem('USER', stringified);
            localStorage.setItem('user', stringified);
            console.log("LocalStorage updated successfully");
            // Notify other components (like Sidebar) to refresh
            window.dispatchEvent(new Event('userUpdated'));
        }
      } catch (lsError) {
        console.error("LocalStorage update failed", lsError);
      }
      
      alert("Thông tin cá nhân đã được cập nhật thành công!");
    } catch (error: any) {
      console.error("Profile update error:", error);
      const errMsg = error.response?.data?.message || error.response?.data || "Cập nhật thất bại. Vui lòng thử lại.";
      alert(typeof errMsg === 'object' ? JSON.stringify(errMsg) : errMsg);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = getUser();
    if (!user) return;

    if (!oldPassword || !newPassword) {
      alert("Vui lòng nhập đầy đủ mật khẩu");
      return;
    }

    try {
      console.log("Attempting to change password for:", user.username);
      await changePassword(user.username, { oldPassword, newPassword });
      alert("Mật khẩu đã được thay đổi thành công!");
      setOldPassword("");
      setNewPassword("");
    } catch (error: any) {
      console.error("Password change error:", error);
      const errMsg = error.response?.data?.message || error.response?.data || "Đổi mật khẩu thất bại";
      alert(typeof errMsg === 'object' ? JSON.stringify(errMsg) : errMsg);
    }
  };

  if (loading) return <div className={styles.loading}>Đang tải...</div>;

  return (
    <div className={styles.pageLayout}>
      <UserSidebar />

      <div className={styles.mainArea}>
        <Navbar
          title="THIẾT LẬP TÀI KHOẢN"
          subtitle="Quản lý thông tin cá nhân và bảo mật tài khoản."
        />

        <div className={styles.content}>
          <div className={styles.settingsCard}>
            <section>
              <h2 className={styles.sectionTitle}>Thông tin cá nhân</h2>
              <form onSubmit={handleSaveProfile}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Họ và tên</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Họ và tên của bạn"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Địa chỉ Email</label>
                  <input
                    type="email"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
                <button type="submit" className={styles.submitBtn}>
                  Lưu thay đổi
                </button>
              </form>
            </section>

            <hr className={styles.divider} />

            <section>
              <h2 className={styles.sectionTitle}>Bảo mật</h2>
              <form onSubmit={handleChangePassword}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Mật khẩu mới</label>
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className={styles.secondaryBtn}>
                  Cập nhật mật khẩu
                </button>
              </form>
            </section>

            <hr className={styles.divider} />

            <section>
              <h2 className={`${styles.sectionTitle} ${styles.dangerTitle}`}>
                Khu vực nguy hiểm
              </h2>
              <p className={styles.dangerText}>
                Khi bạn xóa tài khoản, mọi dữ liệu bài nộp và điểm số sẽ bị xóa
                vĩnh viễn. Hành động này không thể hoàn tác.
              </p>
              <button
                type="button"
                className={`${styles.secondaryBtn} ${styles.dangerBtn}`}
                onClick={async () => {
                  const confirmed = window.confirm("BẠN CÓ CHẮC CHẮN MUỐN XÓA TÀI KHOẢN VĨNH VIỄN KHÔNG? Hành động này không thể hoàn tác!");
                  if (confirmed) {
                    const password = window.prompt("Vui lòng nhập mật khẩu của bạn để xác nhận xóa tài khoản:");
                    if (password) {
                      try {
                        const user = getUser();
                        if (!user) return;
                        
                        await deleteAccount(user.username, password);
                        alert("Tài khoản của bạn đã được xóa thành công. ByeBug sẽ rất nhớ bạn!");
                        
                        // Logout and redirect
                        localStorage.removeItem('USER');
                        localStorage.removeItem('user');
                        localStorage.removeItem('TOKEN');
                        navigate("/login");
                      } catch (error: any) {
                        console.error("Delete account error:", error);
                        const errMsg = error.response?.data?.message || error.response?.data || "Xóa tài khoản thất bại. Vui lòng kiểm tra lại mật khẩu.";
                        alert(typeof errMsg === 'object' ? JSON.stringify(errMsg) : errMsg);
                      }
                    }
                  }
                }}
              >
                Xóa tài khoản
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
