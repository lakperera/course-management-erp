// src/pages/admin/Registrations.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Table from '../../components/common/Table';
import Icons from '../../components/ui/Icons';
import { useNotification } from '../../context/NotificationContext';
import { mockRegistrations, mockCourses } from '../../data/mockData';

const RegistrationCard = ({ registration, course, onApprove, onReject, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'waitlisted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <Icons.CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Icons.Clock className="w-4 h-4" />;
      case 'rejected':
        return <Icons.XCircle className="w-4 h-4" />;
      case 'waitlisted':
        return <Icons.AlertCircle className="w-4 h-4" />;
      default:
        return <Icons.AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {registration.studentName}
            </h3>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center space-x-1 ${getStatusColor(registration.status)}`}>
              {getStatusIcon(registration.status)}
              <span>{registration.status}</span>
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Student ID: {registration.studentId}
          </p>
          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
            {registration.courseTitle} ({registration.courseId})
          </p>
        </div>
        <div className="text-right text-sm text-gray-500 dark:text-gray-400">
          <div>{new Date(registration.date).toLocaleDateString()}</div>
          <div>{registration.semester}</div>
        </div>
      </div>

      {course && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Instructor:</span>
              <div className="font-medium text-gray-900 dark:text-white">{course.instructor}</div>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Credits:</span>
              <div className="font-medium text-gray-900 dark:text-white">{course.credits}</div>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Schedule:</span>
              <div className="font-medium text-gray-900 dark:text-white">{course.schedule}</div>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Enrollment:</span>
              <div className="font-medium text-gray-900 dark:text-white">
                {course.enrolled}/{course.capacity}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        <button
          onClick={() => onViewDetails(registration)}
          className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          View Details
        </button>
        
        {registration.status === 'pending' && (
          <>
            <button
              onClick={() => onApprove(registration)}
              className="px-3 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-medium rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors duration-200"
            >
              <Icons.CheckCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => onReject(registration)}
              className="px-3 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors duration-200"
            >
              <Icons.XCircle className="w-4 h-4" />
            </button>
          </>
        )}
        
        {registration.status === 'confirmed' && (
          <button
            onClick={() => onReject(registration)}
            className="px-3 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors duration-200"
          >
            Cancel
          </button>
        )}
      </div>
    </Card>
  );
};

const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [viewMode, setViewMode] = useState('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    // Add status field to registrations if not present
    const registrationsWithStatus = mockRegistrations.map(reg => ({
      ...reg,
      status: reg.status || 'confirmed',
      semester: reg.semester || 'Spring 2025'
    }));
    setRegistrations(registrationsWithStatus);
  }, []);

  useEffect(() => {
    let filtered = registrations.filter(registration => {
      const matchesSearch = 
        registration.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.courseId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || registration.status === filterStatus;
      const matchesCourse = filterCourse === 'all' || registration.courseId === filterCourse;
      
      return matchesSearch && matchesStatus && matchesCourse;
    });

    setFilteredRegistrations(filtered);
  }, [registrations, searchTerm, filterStatus, filterCourse]);

  // Get unique courses and statuses for filters
  const uniqueCourses = [...new Set(registrations.map(reg => reg.courseId))];
  const uniqueStatuses = [...new Set(registrations.map(reg => reg.status))];

  // Calculate statistics
  const stats = {
    total: registrations.length,
    confirmed: registrations.filter(r => r.status === 'confirmed').length,
    pending: registrations.filter(r => r.status === 'pending').length,
    rejected: registrations.filter(r => r.status === 'rejected').length,
    waitlisted: registrations.filter(r => r.status === 'waitlisted').length,
  };

  const handleApprove = (registration) => {
    const course = mockCourses.find(c => c.id === registration.courseId);
    if (course && course.enrolled >= course.capacity) {
      showError('Cannot approve: Course is at full capacity');
      return;
    }

    setRegistrations(prev => prev.map(reg => 
      reg.id === registration.id 
        ? { ...reg, status: 'confirmed' }
        : reg
    ));
    showSuccess(`Registration approved for ${registration.studentName}`, {
      title: 'Registration Approved'
    });
  };

  const handleReject = (registration) => {
    setRegistrations(prev => prev.map(reg => 
      reg.id === registration.id 
        ? { ...reg, status: 'rejected' }
        : reg
    ));
    showSuccess(`Registration ${registration.status === 'confirmed' ? 'cancelled' : 'rejected'} for ${registration.studentName}`, {
      title: registration.status === 'confirmed' ? 'Registration Cancelled' : 'Registration Rejected'
    });
  };

  const handleViewDetails = (registration) => {
    setSelectedRegistration(registration);
    setShowDetailsModal(true);
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Student Name,Student ID,Course ID,Course Title,Status,Registration Date,Semester\n" +
      filteredRegistrations.map(reg => 
        `${reg.studentName},${reg.studentId},${reg.courseId},${reg.courseTitle},${reg.status},${reg.date},${reg.semester}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "registrations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSuccess('Registration data exported successfully');
  };

  // Table configuration
  const tableHeaders = ['Student', 'Student ID', 'Course', 'Status', 'Registration Date', 'Semester'];
  const tableData = filteredRegistrations.map(registration => [
    registration.studentName,
    registration.studentId,
    `${registration.courseTitle} (${registration.courseId})`,
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
      registration.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
      registration.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
      registration.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
      'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    }`}>
      {registration.status}
    </span>,
    new Date(registration.date).toLocaleDateString(),
    registration.semester
  ]);

  const getTableActions = (row, index) => {
    const registration = filteredRegistrations[index];
    return (
      <>
        <button
          onClick={() => handleViewDetails(registration)}
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
          title="View Details"
        >
          <Icons.Eye className="w-4 h-4" />
        </button>
        {registration.status === 'pending' && (
          <>
            <button
              onClick={() => handleApprove(registration)}
              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
              title="Approve Registration"
            >
              <Icons.CheckCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleReject(registration)}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
              title="Reject Registration"
            >
              <Icons.XCircle className="w-4 h-4" />
            </button>
          </>
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Registrations</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage student course registrations and enrollment
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            <Icons.Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <Icons.ClipboardList className="w-8 h-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <Icons.CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.confirmed}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <Icons.Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <Icons.XCircle className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejected</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.rejected}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <Icons.AlertCircle className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Waitlisted</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.waitlisted}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students or courses..."
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
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          {/* Course Filter */}
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Courses</option>
            {uniqueCourses.map(courseId => {
              const course = mockCourses.find(c => c.id === courseId);
              return (
                <option key={courseId} value={courseId}>
                  {course ? `${course.title} (${courseId})` : courseId}
                </option>
              );
            })}
          </select>

          {/* View Toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewMode === 'cards' 
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Cards
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
      </Card>

      {/* Registration List */}
      {filteredRegistrations.length === 0 ? (
        <Card className="p-12 text-center">
          <Icons.ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No registrations found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No registrations match your current search criteria.
          </p>
        </Card>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRegistrations.map((registration) => {
            const course = mockCourses.find(c => c.id === registration.courseId);
            return (
              <RegistrationCard
                key={registration.id}
                registration={registration}
                course={course}
                onApprove={handleApprove}
                onReject={handleReject}
                onViewDetails={handleViewDetails}
              />
            );
          })}
        </div>
      ) : (
        <Table
          headers={tableHeaders}
          data={tableData}
          actions={getTableActions}
          searchable={false}
          sortable={true}
          pagination={true}
          itemsPerPage={15}
          emptyMessage="No registrations found"
        />
      )}

      {/* Registration Details Modal */}
      {showDetailsModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Registration Details
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Icons.X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Student Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                    Student Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Name:</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {selectedRegistration.studentName}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Student ID:</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {selectedRegistration.studentId}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                    Course Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Course:</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {selectedRegistration.courseTitle}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Course ID:</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {selectedRegistration.courseId}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration Details */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                    Registration Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {selectedRegistration.status}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Registration Date:</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {new Date(selectedRegistration.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Semester:</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {selectedRegistration.semester}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Close
                </button>
                {selectedRegistration.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleApprove(selectedRegistration);
                        setShowDetailsModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedRegistration);
                        setShowDetailsModal(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminRegistrations;