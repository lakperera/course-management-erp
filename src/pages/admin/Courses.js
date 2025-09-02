// src/pages/admin/Courses.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Table from '../../components/common/Table';
import Icons from '../../components/ui/Icons';
import { useNotification } from '../../context/NotificationContext';
import { mockCourses } from '../../data/mockData';

const CourseCard = ({ course, onEdit, onDelete, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const enrollmentPercentage = (course.enrolled / course.capacity) * 100;
  const getEnrollmentColor = () => {
    if (enrollmentPercentage >= 90) return 'text-red-600 dark:text-red-400';
    if (enrollmentPercentage >= 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {course.title}
            </h3>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(course.status)}`}>
              {course.status}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            {course.id} • {course.instructor} • {course.credits} Credits
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {course.description}
          </p>
        </div>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Enrollment</span>
            <span className={`text-sm font-semibold ${getEnrollmentColor()}`}>
              {enrollmentPercentage.toFixed(0)}%
            </span>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  enrollmentPercentage >= 90 ? 'bg-red-500' :
                  enrollmentPercentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${enrollmentPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>{course.enrolled} enrolled</span>
              <span>{course.capacity} capacity</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Schedule</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {course.schedule.split(' ').slice(0, 3).join(' ')}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {course.room}
          </div>
        </div>
      </div>

      {/* Course Metadata */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
          {course.department}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
          {course.level}
        </span>
        {course.prerequisites && course.prerequisites.length > 0 && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
            Prerequisites: {course.prerequisites.length}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onViewDetails(course)}
          className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          View Details
        </button>
        <button
          onClick={() => onEdit(course)}
          className="px-3 py-2 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-sm font-medium rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/30 transition-colors duration-200"
        >
          <Icons.Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(course)}
          className="px-3 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors duration-200"
        >
          <Icons.Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    setCourses(mockCourses);
  }, []);

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || course.department === filterDepartment;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Get unique departments for filter
  const departments = [...new Set(courses.map(course => course.department))];

  // Table configuration
  const tableHeaders = ['Course ID', 'Title', 'Instructor', 'Enrollment', 'Status', 'Credits'];
  const tableData = filteredCourses.map(course => [
    course.id,
    course.title,
    course.instructor,
    `${course.enrolled}/${course.capacity}`,
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
      course.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
      course.status === 'inactive' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    }`}>
      {course.status}
    </span>,
    course.credits
  ]);

  const handleEdit = (course) => {
    showSuccess(`Editing ${course.title}`, { title: 'Edit Course' });
    // Navigate to edit form
  };

  const handleDelete = (course) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setCourses(prev => prev.filter(course => course.id !== selectedCourse.id));
    showSuccess(`${selectedCourse.title} has been deleted`, { title: 'Course Deleted' });
    setShowDeleteModal(false);
    setSelectedCourse(null);
  };

  const handleViewDetails = (course) => {
    showSuccess(`Viewing details for ${course.title}`, { title: 'Course Details' });
    // Navigate to course details
  };

  const getTableActions = (row, index) => {
    const course = filteredCourses[index];
    return (
      <>
        <button
          onClick={() => handleViewDetails(course)}
          className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          title="View Details"
        >
          <Icons.BookOpen className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleEdit(course)}
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
          title="Edit Course"
        >
          <Icons.Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleDelete(course)}
          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
          title="Delete Course"
        >
          <Icons.Trash2 className="w-4 h-4" />
        </button>
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course Management</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage all courses, enrollments, and schedules
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <Link
            to="/admin/courses/new"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <Icons.Plus className="w-4 h-4 mr-2" />
            Add Course
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <Icons.BookOpen className="w-8 h-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{courses.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <Icons.Users className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Enrollment</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {courses.reduce((sum, course) => sum + course.enrolled, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <Icons.CheckCircle className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Courses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {courses.filter(course => course.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <Icons.Award className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Departments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{departments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>

          {/* Department Filter */}
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewMode === 'table' 
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Course List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <Table
          headers={tableHeaders}
          data={tableData}
          actions={getTableActions}
          searchable={false}
          sortable={true}
          pagination={true}
          itemsPerPage={10}
          emptyMessage="No courses found"
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <Icons.AlertCircle className="w-6 h-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Course</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete "{selectedCourse?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;