import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
