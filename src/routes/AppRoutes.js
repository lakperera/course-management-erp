// src/routes/AppRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';
import AdminRoutes from './AdminRoutes';
import StudentRoutes from './StudentRoutes';

// Auth Pages
import Login from '../pages/auth/Login';

// Shared Pages
// import NotFound from '../pages/shared/NotFound';
// import Unauthorized from '../pages/shared/Unauthorized';

const AppRoutes = () => {
  const { isAuthenticated, userRole } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/auth/login" 
        element={
          isAuthenticated ? 
          <Navigate to={userRole === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace /> :
          <Login />
        } 
      />
      
      {/* Redirect root to appropriate dashboard */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? 
          <Navigate to={userRole === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace /> :
          <Navigate to="/auth/login" replace />
        } 
      />

      {/* Admin Routes */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminRoutes />
          </ProtectedRoute>
        } 
      />

      {/* Student Routes */}
      <Route 
        path="/student/*" 
        element={
          <ProtectedRoute requiredRole="student">
            <StudentRoutes />
          </ProtectedRoute>
        } 
      />

      {/* Error Routes */}
      {/* <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default AppRoutes;