import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; 

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F4F4]">
      <Navbar />
      <main className="main-content flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;