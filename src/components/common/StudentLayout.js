// src/components/common/StudentLayout.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const StudentLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const studentNavItems = [
    { 
      path: '/student/dashboard', 
      label: 'Dashboard', 
      icon: 'LayoutDashboard' 
    },
    { 
      path: '/student/courses', 
      label: 'Browse Courses', 
      icon: 'BookOpen' 
    },
    { 
      path: '/student/registrations', 
      label: 'My Registrations', 
      icon: 'ClipboardList' 
    },
    { 
      path: '/student/results', 
      label: 'My Results', 
      icon: 'Award' 
    }
  ];

  const getPageTitle = () => {
    const currentItem = studentNavItems.find(item => 
      location.pathname === item.path || location.pathname.startsWith(item.path + '/')
    );
    return currentItem?.label || 'Student Portal';
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        navItems={studentNavItems}
        currentPath={location.pathname}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole="student"
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

export default StudentLayout;