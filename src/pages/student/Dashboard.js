// src/pages/student/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icons from '../../components/ui/Icons';
import { mockStudents, mockCourses, mockNotifications } from '../../data/mockData';

const GradeCard = ({ courseId, grade, courseName }) => {
  const getGradeColor = (grade) => {
    const gradeValue = parseFloat(grade.replace(/[A-Z+-]/g, ''));
    if (gradeValue >= 3.7) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (gradeValue >= 3.0) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    return 'text-red-600 bg-red-100 dark:bg-red-900/20';
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
            {courseName}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {courseId}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getGradeColor(grade.grade)}`}>
          {grade.grade}
        </div>
      </div>
    </div>
  );
};

const ScheduleItem = ({ course, time }) => (
  <div className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
    <div className="w-3 h-3 bg-indigo-600 rounded-full mr-3"></div>
    <div className="flex-1">
      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{course.title}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400">{course.instructor}</p>
    </div>
    <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
      {time}
    </div>
  </div>
);

const NotificationItem = ({ notification }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <Icons.CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <Icons.AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Icons.Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className={`p-3 rounded-lg border-l-4 ${notification.read ? 'bg-gray-50 dark:bg-gray-700 border-gray-300' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'}`}>
      <div className="flex items-start space-x-3">
        {getIcon()}
        <div className="flex-1">
          <h4 className={`text-sm font-medium ${notification.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
            {notification.title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {notification.message}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            {notification.date}
          </p>
        </div>
        {!notification.read && (
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        )}
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const [student] = useState(mockStudents['student123']);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);

  useEffect(() => {
    // Get student's registered courses
    const registeredCourses = mockCourses.filter(course => 
      student.registeredCourses.includes(course.id)
    );

    // Mock upcoming schedule
    const schedule = registeredCourses.map(course => ({
      course,
      time: course.schedule.split(' ')[3] + ' ' + course.schedule.split(' ')[4] // Extract time
    }));
    setUpcomingClasses(schedule.slice(0, 3));

    // Get recent grades
    const grades = Object.entries(student.results).slice(-3).map(([courseId, grade]) => {
      const course = mockCourses.find(c => c.id === courseId);
      return {
        courseId,
        courseName: course?.title || courseId,
        grade
      };
    });
    setRecentGrades(grades);
  }, [student]);

  const stats = [
    {
      title: 'Current GPA',
      value: student.gpa.toFixed(1),
      icon: <Icons.Award />,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      textColor: 'text-purple-600'
    },
    {
      title: 'Enrolled Courses',
      value: student.registeredCourses.length,
      icon: <Icons.BookOpen />,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      textColor: 'text-blue-600'
    },
    {
      title: 'Completed Credits',
      value: student.completedCourses.length * 3,
      icon: <Icons.CheckCircle />,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      textColor: 'text-green-600'
    },
    {
      title: 'Academic Year',
      value: `Year ${student.year}`,
      icon: <Icons.Users />,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      textColor: 'text-orange-600'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-lg p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        <div className="relative">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {student.name}!</h1>
          <p className="text-indigo-100 text-lg">
            {student.program} • Student ID: {student.studentId}
          </p>
          <div className="mt-4 flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Icons.Users className="w-4 h-4" />
              <span>Class of {new Date(student.expectedGraduation).getFullYear()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icons.Award className="w-4 h-4" />
              <span>GPA: {student.gpa}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`p-4 rounded-full ${stat.color} bg-opacity-20`}>
                {React.cloneElement(stat.icon, { 
                  className: `w-8 h-8 ${stat.textColor}` 
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Icons.Clock className="w-5 h-5 mr-2 text-indigo-600" />
              Today's Classes
            </h3>
            <Link 
              to="/student/schedule" 
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingClasses.length > 0 ? (
              upcomingClasses.map((item, index) => (
                <ScheduleItem key={index} course={item.course} time={item.time} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Icons.Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No classes scheduled for today</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Grades */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Icons.Award className="w-5 h-5 mr-2 text-green-600" />
              Recent Grades
            </h3>
            <Link 
              to="/student/results" 
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentGrades.length > 0 ? (
              recentGrades.map((item, index) => (
                <GradeCard 
                  key={index} 
                  courseId={item.courseId} 
                  grade={item.grade} 
                  courseName={item.courseName} 
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Icons.Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No grades available yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Icons.Bell className="w-5 h-5 mr-2 text-blue-600" />
              Notifications
            </h3>
            <Link 
              to="/student/notifications" 
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {mockNotifications.slice(0, 3).map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/student/courses"
            className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg hover:shadow-md transition-all duration-300 group"
          >
            <div className="p-3 bg-blue-600 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
              <Icons.Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Browse Courses</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Find new courses</p>
            </div>
          </Link>

          <Link
            to="/student/registrations"
            className="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg hover:shadow-md transition-all duration-300 group"
          >
            <div className="p-3 bg-green-600 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
              <Icons.ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">My Courses</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">View registrations</p>
            </div>
          </Link>

          <Link
            to="/student/results"
            className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg hover:shadow-md transition-all duration-300 group"
          >
            <div className="p-3 bg-purple-600 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
              <Icons.Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">View Grades</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Check results</p>
            </div>
          </Link>

          <Link
            to="/student/profile"
            className="flex items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg hover:shadow-md transition-all duration-300 group"
          >
            <div className="p-3 bg-orange-600 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
              <Icons.UserCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">My Profile</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Update info</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;