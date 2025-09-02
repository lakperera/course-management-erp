// src/pages/admin/Students.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Table from '../../components/common/Table';
import Icons from '../../components/ui/Icons';
import Button from '../../components/ui/Button';
import { useNotification } from '../../context/NotificationContext';
import { mockStudents } from '../../data/mockData';

const StudentCard = ({ student, onEdit, onDelete, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getGPAColor = (gpa) => {
    if (gpa >= 3.5) return 'text-green-600 dark:text-green-400';
    if (gpa >= 3.0) return 'text-yellow-600 dark:text-yellow-400';
    if (gpa >= 2.5) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {student.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {student.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              ID: {student.studentId} • {student.program}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                {student.status}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Year {student.year}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Student Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">GPA</span>
            <span className={`text-lg font-bold ${getGPAColor(student.gpa)}`}>
              {student.gpa.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Courses</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {student.registeredCourses.length}
            </span>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Icons.Mail className="w-4 h-4" />
          <span className="truncate">{student.email}</span>
        </div>
        {student.phone && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Icons.Phone className="w-4 h-4" />
            <span>{student.phone}</span>
          </div>
        )}
      </div>

      {/* Graduation Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-blue-600 dark:text-blue-400">Expected Graduation</span>
          <span className="font-medium text-blue-900 dark:text-blue-300">
            {new Date(student.expectedGraduation).getFullYear()}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost-primary"
          size="sm"
          onClick={() => onViewDetails(student)}
          className="flex-1"
        >
          View Details
        </Button>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => onEdit(student)}
          icon={<Icons.Edit />}
        />
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => onDelete(student)}
          icon={<Icons.Trash2 />}
        />
      </div>
    </div>
  );
};

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProgram, setFilterProgram] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    const studentsArray = Object.values(mockStudents);
    setStudents(studentsArray);
  }, []);

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    const matchesProgram = filterProgram === 'all' || student.program === filterProgram;
    const matchesYear = filterYear === 'all' || student.year.toString() === filterYear;
    
    return matchesSearch && matchesStatus && matchesProgram && matchesYear;
  });

  // Get unique programs and years for filters
  const programs = [...new Set(students.map(student => student.program))];
  const years = [...new Set(students.map(student => student.year))].sort();

  // Table configuration
  const tableHeaders = ['Student ID', 'Name', 'Program', 'Year', 'GPA', 'Status', 'Enrolled Courses'];
  const tableData = filteredStudents.map(student => [
    student.studentId,
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-bold">
          {student.name.split(' ').map(n => n[0]).join('')}
        </span>
      </div>
      <div>
        <div className="font-medium text-gray-900 dark:text-white">{student.name}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{student.email}</div>
      </div>
    </div>,
    student.program,
    `Year ${student.year}`,
    <span className={`font-semibold ${
      student.gpa >= 3.5 ? 'text-green-600 dark:text-green-400' :
      student.gpa >= 3.0 ? 'text-yellow-600 dark:text-yellow-400' :
      student.gpa >= 2.5 ? 'text-orange-600 dark:text-orange-400' :
      'text-red-600 dark:text-red-400'
    }`}>
      {student.gpa.toFixed(1)}
    </span>,
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
      student.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
      student.status === 'inactive' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    }`}>
      {student.status}
    </span>,
    student.registeredCourses.length
  ]);

  const handleEdit = (student) => {
    showSuccess(`Opening edit form for ${student.name}`, { title: 'Edit Student' });
    // Navigate to edit form
  };

  const handleDelete = (student) => {
    setSelectedStudent(student);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setStudents(prev => prev.filter(student => student.id !== selectedStudent.id));
    showSuccess(`${selectedStudent.name} has been removed`, { title: 'Student Deleted' });
    setShowDeleteModal(false);
    setSelectedStudent(null);
  };

  const handleViewDetails = (student) => {
    showSuccess(`Viewing details for ${student.name}`, { title: 'Student Details' });
    // Navigate to student details
  };

  const getTableActions = (row, index) => {
    const student = filteredStudents[index];
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewDetails(student)}
          icon={<Icons.Eye />}
          title="View Details"
        />
        <Button
          variant="ghost-primary"
          size="sm"
          onClick={() => handleEdit(student)}
          icon={<Icons.Edit />}
          title="Edit Student"
        />
        <Button
          variant="ghost-danger"
          size="sm"
          onClick={() => handleDelete(student)}
          icon={<Icons.Trash2 />}
          title="Delete Student"
        />
      </>
    );
  };

  // Calculate statistics
  const stats = {
    total: students.length,
    active: students.filter(s => s.status === 'active').length,
    averageGPA: students.reduce((sum, s) => sum + s.gpa, 0) / students.length,
    graduating: students.filter(s => s.year === 4).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Management</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage student records, enrollments, and academic progress
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <Button
            variant="outline-primary"
            icon={<Icons.Download />}
          >
            Export Data
          </Button>
          <Button
            variant="primary"
            icon={<Icons.Plus />}
          >
            Add Student
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <Icons.Users className="w-8 h-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <Icons.CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Students</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <Icons.Award className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average GPA</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.averageGPA.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <Icons.GraduationCap className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Graduating Soon</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.graduating}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
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
            <option value="suspended">Suspended</option>
          </select>

          {/* Program Filter */}
          <select
            value={filterProgram}
            onChange={(e) => setFilterProgram(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Programs</option>
            {programs.map(program => (
              <option key={program} value={program}>{program}</option>
            ))}
          </select>

          {/* Year Filter */}
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>Year {year}</option>
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

      {/* Students List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
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
          emptyMessage="No students found"
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <Icons.AlertCircle className="w-6 h-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Student</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete "{selectedStudent?.name}"? This action cannot be undone and will remove all associated records.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
              >
                Delete Student
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;