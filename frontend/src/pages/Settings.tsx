import React, { useState } from "react";
import UserSidebar from "../components/UserSidebar";
import Navbar from "../components/Navbar";
import styles from "../styles/modules/Settings.module.css";

const Settings: React.FC = () => {
  const [fullName, setFullName] = useState("Bug Hunter");
  const [email, setEmail] = useState("hunter@byebug.com");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thông tin cá nhân đã được cập nhật!");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Mật khẩu đã được thay đổi!");
  };

  return (
    <div className={styles.pageLayout}>
      <UserSidebar />

      <div className={styles.mainArea}>
        <Navbar
          title="THIẾT LẬP TÀI KHOẢN"
          subtitle="Quản lý thông tin cá nhân và bảo mật tài khoản."
        />

        {/* CONTENT */}
        <div className={styles.content}>
          <div className={styles.settingsCard}>
            {/* Profile Section */}
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
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Địa chỉ Email</label>
                  <input
                    type="email"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button type="submit" className={styles.submitBtn}>
                  Lưu thay đổi
                </button>
              </form>
            </section>

            <hr className={styles.divider} />

            {/* Security Section */}
            <section>
              <h2 className={styles.sectionTitle}>Bảo mật</h2>
              <form onSubmit={handleChangePassword}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="••••••••"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Mật khẩu mới</label>
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className={styles.secondaryBtn}>
                  Cập nhật mật khẩu
                </button>
              </form>
            </section>

            <hr className={styles.divider} />

            {/* Danger Zone */}
            <section>
              <h2 className={`${styles.sectionTitle} ${styles.dangerTitle}`}>
                Khu vực nguy hiểm
              </h2>
              <p className={styles.dangerText}>
                Khi bạn xóa tài khoản, mọi dữ liệu bài nộp và điểm số sẽ bị xóa
                vĩnh viễn. Hành động này không thể hoàn tác.
              </p>
              <button className={`${styles.secondaryBtn} ${styles.dangerBtn}`}>
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
