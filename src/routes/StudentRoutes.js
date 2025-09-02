// src/routes/StudentRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentLayout from '../components/common/StudentLayout';

// Student Pages
import StudentDashboard from '../pages/student/Dashboard';
import StudentCourses from '../pages/student/Courses';
import StudentRegistrations from '../pages/student/MyRegistrations';
import StudentResults from '../pages/student/MyResults';
import StudentProfile from '../pages/student/Profile';
// import CourseDetails from '../pages/student/CourseDetails';

const StudentRoutes = () => {
  return (
    <StudentLayout>
      <Routes>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="courses" element={<StudentCourses />} />
        {/* <Route path="courses/:id" element={<CourseDetails />} /> */}
        <Route path="registrations" element={<StudentRegistrations />} />
        <Route path="results" element={<StudentResults />} />
        <Route path="profile" element={<StudentProfile />} />
      </Routes>
    </StudentLayout>
  );
};

export default StudentRoutes;