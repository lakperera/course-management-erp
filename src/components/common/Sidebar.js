// src/components/common/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Icons from '../ui/Icons';

const Sidebar = ({ navItems, isOpen, onClose, userRole }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getIcon = (iconName) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent /> : <Icons.Circle />;
  };

  const linkClasses = (path) => 
    `flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
      isActivePath(path)
        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg transform scale-105' 
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-105'
    }`;

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-white dark:bg-gray-800 w-64 shadow-xl p-4 flex flex-col z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 
        border-r border-gray-200 dark:border-gray-700
      `}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Icons.BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">ERP Portal</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{userRole}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-grow space-y-2">
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-4">
              Navigation
            </p>
            {navItems.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                onClick={onClose}
                className={linkClasses(path)}
              >
                <span className="flex-shrink-0">
                  {getIcon(icon)}
                </span>
                <span className="ml-4 font-medium">{label}</span>
                {isActivePath(path) && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* User Section */}
        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-1">
  {/* Profile Link */}
  <Link
    to={`/${userRole}/profile`}
    onClick={onClose}
    className="flex items-center px-3 py-2 rounded-md text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-150"
  >
    <Icons.UserCircle className="w-4 h-4 flex-shrink-0" />
    <span className="ml-3">Profile</span>
  </Link>

  {/* Logout Button */}
  <button
    onClick={handleLogout}
    className="w-full flex items-center px-3 py-2 rounded-md text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150 group"
  >
    <Icons.LogOut className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
    <span className="ml-3">Logout</span>
  </button>
</div>


          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
              Course Management v1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;