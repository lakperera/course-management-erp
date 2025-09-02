// src/pages/admin/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icons from '../../components/ui/Icons';
import { mockCourses, mockStudents, mockRegistrations } from '../../data/mockData';

const StatCard = ({ title, value, icon, trend, color = 'indigo' }) => {
  const colorClasses = {
    indigo: 'bg-indigo-500 text-indigo-600',
    teal: 'bg-teal-500 text-teal-600',
    purple: 'bg-purple-500 text-purple-600',
    orange: 'bg-orange-500 text-orange-600',
    green: 'bg-green-500 text-green-600',
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              <Icons.ChevronUp className={`w-4 h-4 ${!trend.positive && 'rotate-180'}`} />
              <span>{trend.value}% from last month</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-full ${colorClasses[color]} bg-opacity-20`}>
          {React.cloneElement(icon, { 
            className: `w-8 h-8 ${colorClasses[color].split(' ')[1]}` 
          })}
        </div>
      </div>
    </div>
  );
};

const QuickActionCard = ({ title, description, icon, link, color = 'indigo' }) => {
  const colorClasses = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    teal: 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-500',
    purple: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
    orange: 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500',
  };

  return (
    <Link
      to={link}
      className={`block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group animate-fade-in`}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]} group-hover:scale-110 transition-transform duration-300`}>
          {React.cloneElement(icon, { className: "w-6 h-6 text-white" })}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {description}
          </p>
        </div>
        <Icons.ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 ml-auto transition-colors" />
      </div>
    </Link>
  );
};

const RecentActivity = () => {
  const activities = [
    { 
      id: 1, 
      type: 'registration', 
      message: 'Alice Johnson registered for CS101', 
      time: '2 minutes ago',
      icon: <Icons.UserCircle className="w-5 h-5 text-blue-500" />
    },
    { 
      id: 2, 
      type: 'course', 
      message: 'New course "Advanced React" was added', 
      time: '1 hour ago',
      icon: <Icons.BookOpen className="w-5 h-5 text-green-500" />
    },
    { 
      id: 3, 
      type: 'grade', 
      message: 'Grades posted for MA202', 
      time: '3 hours ago',
      icon: <Icons.Award className="w-5 h-5 text-purple-500" />
    },
    { 
      id: 4, 
      type: 'registration', 
      message: 'Bob Williams completed registration', 
      time: '5 hours ago',
      icon: <Icons.CheckCircle className="w-5 h-5 text-green-500" />
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        <Link 
          to="/admin/activity" 
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium"
        >
          View all
        </Link>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex-shrink-0">{activity.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRegistrations: 0,
    activeInstructors: 0,
  });

  useEffect(() => {
    // Calculate stats from mock data
    setStats({
      totalCourses: mockCourses.length,
      totalStudents: Object.keys(mockStudents).length,
      totalRegistrations: mockRegistrations.length,
      activeInstructors: new Set(mockCourses.map(course => course.instructorId)).size,
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Administrator!</h1>
        <p className="text-indigo-100 text-lg">
          Here's what's happening with your course management system today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          icon={<Icons.BookOpen />}
          trend={{ positive: true, value: 8 }}
          color="indigo"
        />
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={<Icons.Users />}
          trend={{ positive: true, value: 12 }}
          color="teal"
        />
        <StatCard
          title="Registrations"
          value={stats.totalRegistrations}
          icon={<Icons.ClipboardList />}
          trend={{ positive: true, value: 5 }}
          color="purple"
        />
        <StatCard
          title="Active Instructors"
          value={stats.activeInstructors}
          icon={<Icons.UserCircle />}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            title="Add New Course"
            description="Create a new course offering"
            icon={<Icons.Plus />}
            link="/admin/courses/new"
            color="indigo"
          />
          <QuickActionCard
            title="Manage Students"
            description="View and edit student information"
            icon={<Icons.Users />}
            link="/admin/students"
            color="teal"
          />
          <QuickActionCard
            title="View Registrations"
            description="Monitor course registrations"
            icon={<Icons.ClipboardList />}
            link="/admin/registrations"
            color="purple"
          />
          <QuickActionCard
            title="Generate Reports"
            description="Create comprehensive reports"
            icon={<Icons.BarChart />}
            link="/admin/reports"
            color="orange"
          />
        </div>
      </div>

      {/* Activity and Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        
        {/* Chart Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Registration Trends
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <Icons.BarChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Chart component would go here
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Integration with Chart.js or Recharts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          System Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Icons.CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <p className="font-medium text-green-900 dark:text-green-100">All Systems Operational</p>
              <p className="text-sm text-green-600 dark:text-green-300">No issues detected</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Icons.Bell className="w-6 h-6 text-blue-500" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">3 Pending Actions</p>
              <p className="text-sm text-blue-600 dark:text-blue-300">Course approvals needed</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Icons.Users className="w-6 h-6 text-gray-500" />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">24 Active Users</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Currently online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;