// src/context/NotificationContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import Icons from '../components/ui/Icons';

const NotificationContext = createContext();

const NotificationComponent = ({ notification, onClose }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <Icons.CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <Icons.XCircle className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <Icons.AlertCircle className="w-6 h-6 text-yellow-500" />;
      case 'info':
      default:
        return <Icons.AlertCircle className="w-6 h-6 text-blue-500" />;
    }
  };

  const getStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200';
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(notification.id);
    }, notification.duration || 5000);

    return () => clearTimeout(timer);
  }, [notification.id, notification.duration, onClose]);

  return (
    <div className={`flex items-start p-4 border rounded-lg shadow-lg transition-all duration-300 transform animate-slide-in-right ${getStyles()}`}>
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <div className="ml-3 flex-1">
        {notification.title && (
          <h3 className="text-sm font-semibold">
            {notification.title}
          </h3>
        )}
        <p className="text-sm mt-1">
          {notification.message}
        </p>
        {notification.action && (
          <div className="mt-3">
            <button
              onClick={notification.action.handler}
              className="text-sm font-medium underline hover:no-underline"
            >
              {notification.action.label}
            </button>
          </div>
        )}
      </div>
      <div className="ml-4 flex-shrink-0">
        <button
          onClick={() => onClose(notification.id)}
          className="inline-flex text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
        >
          <Icons.X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const NotificationContainer = ({ notifications, onClose }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {notifications.map((notification) => (
        <NotificationComponent
          key={notification.id}
          notification={notification}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      ...options,
    });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    return addNotification({
      type: 'error',
      message,
      duration: 7000, // Longer duration for errors
      ...options,
    });
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return addNotification({
      type: 'warning',
      message,
      ...options,
    });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      ...options,
    });
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Remove direct hook usage in regular functions to avoid React hook errors.
// Instead, use the useNotification hook inside your components to access notification methods.

// Example usage in a component:
// const { showSuccess, showError, showWarning, showInfo } = useNotification();
// showSuccess('Success message');