import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from './UserSidebar'; // Đảm bảo đúng đường dẫn
import Navbar from './Navbar';           // Đảm bảo đúng đường dẫn

const MainLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar cố định bên trái */}
      <UserSidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Navbar luôn nằm trên đầu */}
        <Navbar 
            title="BYEBUG SYSTEM" 
            subtitle="Hệ thống luyện tập lập trình" 
        />

        {/* Nội dung thay đổi của từng trang (Leaderboard, Problems, v.v.) */}
        <main style={{ padding: '20px', flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;