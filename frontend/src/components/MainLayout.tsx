import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; 

const MainLayout: React.FC = () => {
  return (
    /* flex-col giúp Navbar ở trên, Content ở dưới */
    <div className="min-h-screen flex flex-col bg-[#F4F4F4]">
      <Navbar />

      {/* Khu vực nội dung chính - Giờ đã rộng thênh thang */}
      <main className="main-content flex-1">
        <div className="container mx-auto p-6">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default MainLayout;