// src/routes/AdminRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../components/common/AdminLayout';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminCourses from '../pages/admin/Courses';
import AdminStudents from '../pages/admin/Students';
import AdminRegistrations from '../pages/admin/Registrations';
import AdminResults from '../pages/admin/Results';
import CourseForm from '../components/forms/CourseForm';
// import StudentDetails from '../pages/admin/StudentDetails';

const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="courses/new" element={<CourseForm />} />
        <Route path="courses/:id/edit" element={<CourseForm />} />
        <Route path="students" element={<AdminStudents />} />
        {/* <Route path="students/:id" element={<StudentDetails />} /> */}
        <Route path="registrations" element={<AdminRegistrations />} />
        <Route path="results" element={<AdminResults />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;