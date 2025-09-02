// src/pages/student/MyRegistrations.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Icons from '../../components/ui/Icons';
import { useNotification } from '../../context/NotificationContext';
import { mockCourses, mockStudents } from '../../data/mockData';

const MyRegistrations = () => {
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [showDropModal, setShowDropModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { showSuccess } = useNotification();

  const student = mockStudents['student123'];

  useEffect(() => {
    const courses = mockCourses.filter(course => 
      student.registeredCourses.includes(course.id)
    );
    setRegisteredCourses(courses);
  }, []);

  const handleDrop = (course) => {
    setSelectedCourse(course);
    setShowDropModal(true);
  };

  const confirmDrop = () => {
    setRegisteredCourses(prev => prev.filter(course => course.id !== selectedCourse.id));
    showSuccess(`Dropped ${selectedCourse.title}`);
    setShowDropModal(false);
    setSelectedCourse(null);
  };

  const totalCredits = registeredCourses.reduce((sum, course) => sum + course.credits, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Registered Courses</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {registeredCourses.length} courses • {totalCredits} total credits
          </p>
        </div>
        <Link
          to="/student/courses"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Browse More Courses
        </Link>
      </div>

      {/* Course List */}
      {registeredCourses.length === 0 ? (
        <Card className="p-8 text-center">
          <Icons.BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No courses registered
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Browse and register for courses to get started.
          </p>
          <Link
            to="/student/courses"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Icons.Search className="w-4 h-4 mr-2" />
            Browse Courses
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6">
          {registeredCourses.map((course) => (
            <Card key={course.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {course.title}
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full">
                      Enrolled
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {course.id} • {course.instructor} • {course.credits} Credits
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Icons.Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{course.schedule}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icons.MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{course.room}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icons.Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {course.enrolled}/{course.capacity} students
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {course.description}
                  </p>
                </div>

                <div className="ml-6 flex flex-col space-y-2">
                  <button
                    onClick={() => handleDrop(course)}
                    className="px-4 py-2 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30"
                  >
                    Drop Course
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Drop Confirmation Modal */}
      {showDropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4 p-6">
            <div className="flex items-center mb-4">
              <Icons.AlertCircle className="w-6 h-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Drop Course</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to drop <strong>"{selectedCourse?.title}"</strong>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDropModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDrop}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Drop Course
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;