// src/pages/student/Courses.js
import React, { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import Icons from '../../components/ui/Icons';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { mockCourses, mockStudents } from '../../data/mockData';

const CourseCard = ({ course, isRegistered, onRegister, onViewDetails }) => {
  const enrollmentPercentage = (course.enrolled / course.capacity) * 100;
  const isAlmostFull = enrollmentPercentage >= 85;
  const isFull = enrollmentPercentage >= 100;

  const getStatusBadge = () => {
    if (isFull) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
          <Icons.XCircle className="w-3 h-3 mr-1" />
          Full
        </span>
      );
    }
    if (isAlmostFull) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
          <Icons.AlertCircle className="w-3 h-3 mr-1" />
          Almost Full
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
        <Icons.CheckCircle className="w-3 h-3 mr-1" />
        Available
      </span>
    );
  };

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
                {course.title}
              </h3>
              {getStatusBadge()}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {course.id} • {course.instructor}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {course.description}
            </p>
          </div>
        </div>

        {/* Course Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Icons.Award className="w-4 h-4 mr-2 text-indigo-500" />
            {course.credits} Credits
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Icons.Building className="w-4 h-4 mr-2 text-indigo-500" />
            {course.department}
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Icons.Clock className="w-4 h-4 mr-2 text-indigo-500" />
            {course.duration}
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Icons.MapPin className="w-4 h-4 mr-2 text-indigo-500" />
            {course.room}
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
          <div className="flex items-center mb-2">
            <Icons.Calendar className="w-4 h-4 mr-2 text-indigo-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Schedule</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{course.schedule}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {course.startDate} - {course.endDate}
          </p>
        </div>

        {/* Enrollment Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enrollment</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {course.enrolled}/{course.capacity}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isFull ? 'bg-red-500' : isAlmostFull ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(enrollmentPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Prerequisites */}
        {course.prerequisites && course.prerequisites.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prerequisites:</h4>
            <div className="flex flex-wrap gap-1">
              {course.prerequisites.map((prereq, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                >
                  {prereq}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto flex items-center space-x-2">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => onViewDetails(course)}
            className="flex-1"
            icon={<Icons.Eye />}
          >
            View Details
          </Button>
          {isRegistered ? (
            <Button
              variant="success"
              size="sm"
              disabled
              className="flex-1"
              icon={<Icons.CheckCircle />}
            >
              Registered
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onRegister(course)}
              disabled={isFull}
              className="flex-1"
              icon={<Icons.Plus />}
            >
              {isFull ? 'Full' : 'Register'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

const FilterPanel = ({ 
  departments, 
  filters, 
  onFilterChange, 
  onClearFilters 
}) => {
  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          icon={<Icons.X />}
        >
          Clear All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Department */}
        <select
          value={filters.department}
          onChange={(e) => onFilterChange('department', e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        {/* Credits */}
        <select
          value={filters.credits}
          onChange={(e) => onFilterChange('credits', e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Any Credits</option>
          <option value="3">3 Credits</option>
          <option value="4">4 Credits</option>
          <option value="5">5+ Credits</option>
        </select>

        {/* Level */}
        <select
          value={filters.level}
          onChange={(e) => onFilterChange('level', e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Levels</option>
          <option value="Undergraduate">Undergraduate</option>
          <option value="Graduate">Graduate</option>
        </select>
      </div>
    </Card>
  );
};

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [student] = useState(mockStudents['student123']);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    credits: '',
    level: '',
  });
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    setCourses(mockCourses);
  }, []);

  useEffect(() => {
    let filtered = [...courses];

    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm) ||
        course.id.toLowerCase().includes(searchTerm) ||
        course.instructor.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.department) {
      filtered = filtered.filter(course => course.department === filters.department);
    }

    if (filters.credits) {
      filtered = filtered.filter(course => {
        if (filters.credits === '5') return course.credits >= 5;
        return course.credits.toString() === filters.credits;
      });
    }

    if (filters.level) {
      filtered = filtered.filter(course => course.level === filters.level);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    setFilteredCourses(filtered);
  }, [courses, filters, sortBy, sortOrder]);

  const departments = [...new Set(courses.map(course => course.department))];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      department: '',
      credits: '',
      level: '',
    });
  };

  const handleRegister = (course) => {
    // Check if already registered
    if (student.registeredCourses.includes(course.id)) {
      showError('You are already registered for this course');
      return;
    }

    // Check prerequisites (simplified check)
    if (course.prerequisites && course.prerequisites.length > 0) {
      const missingPrereqs = course.prerequisites.filter(
        prereq => !student.completedCourses.includes(prereq)
      );
      
      if (missingPrereqs.length > 0) {
        showError(`Missing prerequisites: ${missingPrereqs.join(', ')}`);
        return;
      }
    }

    // Check capacity
    if (course.enrolled >= course.capacity) {
      showError('This course is at full capacity');
      return;
    }

    // Simulate registration
    showSuccess(`Successfully registered for ${course.title}`, {
      title: 'Registration Successful'
    });

    // Update course enrollment (in real app, this would be an API call)
    setCourses(prev => prev.map(c => 
      c.id === course.id 
        ? { ...c, enrolled: c.enrolled + 1 }
        : c
    ));
  };

  const handleViewDetails = (course) => {
    showSuccess(`Viewing details for ${course.title}`);
    // Navigate to course details page
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Browse Courses</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Discover and register for courses that match your interests
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card padding="sm">
          <div className="flex items-center">
            <Icons.BookOpen className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{courses.length}</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center">
            <Icons.Filter className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredCourses.filter(c => c.enrolled < c.capacity).length}
              </p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center">
            <Icons.Building className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Departments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{departments.length}</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center">
            <Icons.CheckCircle className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">My Registrations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{student.registeredCourses.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <FilterPanel
        departments={departments}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredCourses.length} of {courses.length} courses
        </p>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="credits-asc">Credits Low-High</option>
            <option value="credits-desc">Credits High-Low</option>
            <option value="enrolled-asc">Enrollment Low-High</option>
            <option value="enrolled-desc">Enrollment High-Low</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <Card className="text-center py-12">
          <Icons.Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No courses found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your filters to find more courses
          </p>
          <Button variant="outline-primary" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isRegistered={student.registeredCourses.includes(course.id)}
              onRegister={handleRegister}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCourses;