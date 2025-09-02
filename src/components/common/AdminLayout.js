// src/components/common/AdminLayout.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const adminNavItems = [
    { 
      path: '/admin/dashboard', 
      label: 'Dashboard', 
      icon: 'LayoutDashboard' 
    },
    { 
      path: '/admin/courses', 
      label: 'Courses', 
      icon: 'BookOpen' 
    },
    { 
      path: '/admin/students', 
      label: 'Students', 
      icon: 'Users' 
    },
    { 
      path: '/admin/registrations', 
      label: 'Registrations', 
      icon: 'ClipboardList' 
    },
    { 
      path: '/admin/results', 
      label: 'Results', 
      icon: 'Award' 
    }
  ];

  const getPageTitle = () => {
    const currentItem = adminNavItems.find(item => 
      location.pathname.startsWith(item.path)
    );
    return currentItem?.label || 'Admin Panel';
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        navItems={adminNavItems}
        currentPath={location.pathname}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole="admin"
      />
      
      <div className="flex-1 flex flex-col md:ml-64">
        <Header
          title={getPageTitle()}
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;