// src/pages/admin/Results.js
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Table from '../../components/common/Table';
import Icons from '../../components/ui/Icons';
import { useNotification } from '../../context/NotificationContext';
import { mockRegistrations, mockCourses, mockStudents } from '../../data/mockData';

const GradeCard = ({ studentId, courseId, grade, studentName, courseName, semester, onEditGrade }) => {
  const getGradeColor = (gradeValue) => {
    if (!gradeValue) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    
    const points = parseFloat(gradeValue.points || 0);
    if (points >= 3.7) return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    if (points >= 3.0) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    if (points >= 2.0) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
    return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
  };

  const getGradeIcon = (gradeValue) => {
    if (!gradeValue) return <Icons.AlertCircle className="w-5 h-5" />;
    
    const points = parseFloat(gradeValue.points || 0);
    if (points >= 3.7) return <Icons.CheckCircle className="w-5 h-5" />;
    if (points >= 3.0) return <Icons.Award className="w-5 h-5" />;
    if (points >= 2.0) return <Icons.AlertCircle className="w-5 h-5" />;
    return <Icons.XCircle className="w-5 h-5" />;
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {studentName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            ID: {studentId}
          </p>
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            {courseName} ({courseId})
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {semester}
          </p>
        </div>
        <div className="text-center">
          <div className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${getGradeColor(grade)}`}>
            {getGradeIcon(grade)}
            <div>
              <div className="text-xl font-bold">
                {grade?.grade || 'Not Graded'}
              </div>
              {grade?.points && (
                <div className="text-sm opacity-90">
                  {grade.points} pts
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onEditGrade(studentId, courseId, grade, studentName, courseName)}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          {grade ? 'Edit Grade' : 'Add Grade'}
        </button>
      </div>
    </Card>
  );
};

const GradeEditModal = ({ isOpen, onClose, studentId, courseId, currentGrade, studentName, courseName, onSave }) => {
  const [grade, setGrade] = useState('');
  const [points, setPoints] = useState('');

  useEffect(() => {
    if (currentGrade) {
      setGrade(currentGrade.grade || '');
      setPoints(currentGrade.points || '');
    } else {
      setGrade('');
      setPoints('');
    }
  }, [currentGrade, isOpen]);

  const gradeOptions = [
    { grade: 'A', points: '4.0' },
    { grade: 'A-', points: '3.7' },
    { grade: 'B+', points: '3.3' },
    { grade: 'B', points: '3.0' },
    { grade: 'B-', points: '2.7' },
    { grade: 'C+', points: '2.3' },
    { grade: 'C', points: '2.0' },
    { grade: 'C-', points: '1.7' },
    { grade: 'D+', points: '1.3' },
    { grade: 'D', points: '1.0' },
    { grade: 'F', points: '0.0' },
  ];

  const handleGradeChange = (selectedGrade) => {
    const gradeOption = gradeOptions.find(opt => opt.grade === selectedGrade);
    setGrade(selectedGrade);
    if (gradeOption) {
      setPoints(gradeOption.points);
    }
  };

  const handleSave = () => {
    if (!grade || !points) {
      return;
    }
    onSave(studentId, courseId, { grade, points: parseFloat(points) });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentGrade ? 'Edit Grade' : 'Add Grade'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Icons.X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Student: <strong>{studentName}</strong></p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Course: <strong>{courseName} ({courseId})</strong></p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Grade
              </label>
              <select
                value={grade}
                onChange={(e) => handleGradeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Grade</option>
                {gradeOptions.map(option => (
                  <option key={option.grade} value={option.grade}>
                    {option.grade} ({option.points} points)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Grade Points
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="4"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="0.0 - 4.0"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!grade || !points}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Grade
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const AdminResults = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [viewMode, setViewMode] = useState('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterSemester, setFilterSemester] = useState('all');
  const [filterGradeStatus, setFilterGradeStatus] = useState('all');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    // Create results from registrations and existing grades
    const resultsList = [];
    
    mockRegistrations.forEach(registration => {
      const student = mockStudents[registration.studentId];
      const course = mockCourses.find(c => c.id === registration.courseId);
      
      if (student && course) {
        const existingGrade = student.results[course.id];
        
        resultsList.push({
          studentId: registration.studentId,
          studentName: registration.studentName || student.name,
          courseId: course.id,
          courseName: course.title,
          semester: existingGrade?.semester || 'Spring 2025',
          grade: existingGrade || null,
          instructor: course.instructor,
          credits: course.credits
        });
      }
    });

    setResults(resultsList);
  }, []);

  useEffect(() => {
    let filtered = results.filter(result => {
      const matchesSearch = 
        result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.courseId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCourse = filterCourse === 'all' || result.courseId === filterCourse;
      const matchesSemester = filterSemester === 'all' || result.semester === filterSemester;
      
      let matchesGradeStatus = true;
      if (filterGradeStatus === 'graded') {
        matchesGradeStatus = result.grade !== null;
      } else if (filterGradeStatus === 'ungraded') {
        matchesGradeStatus = result.grade === null;
      }
      
      return matchesSearch && matchesCourse && matchesSemester && matchesGradeStatus;
    });

    setFilteredResults(filtered);
  }, [results, searchTerm, filterCourse, filterSemester, filterGradeStatus]);

  // Get unique values for filters
  const uniqueCourses = [...new Set(results.map(r => r.courseId))];
  const uniqueSemesters = [...new Set(results.map(r => r.semester))];

  // Calculate statistics
  const stats = {
    total: results.length,
    graded: results.filter(r => r.grade !== null).length,
    ungraded: results.filter(r => r.grade === null).length,
    averageGPA: (() => {
      const gradedResults = results.filter(r => r.grade !== null);
      if (gradedResults.length === 0) return 0;
      const totalPoints = gradedResults.reduce((sum, r) => sum + r.grade.points, 0);
      return (totalPoints / gradedResults.length).toFixed(2);
    })()
  };

  const handleEditGrade = (studentId, courseId, currentGrade, studentName, courseName) => {
    setSelectedGrade({ studentId, courseId, currentGrade, studentName, courseName });
    setEditModalOpen(true);
  };

  const handleSaveGrade = (studentId, courseId, gradeData) => {
    setResults(prev => prev.map(result => 
      result.studentId === studentId && result.courseId === courseId
        ? { ...result, grade: gradeData }
        : result
    ));
    showSuccess('Grade saved successfully');
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Student Name,Student ID,Course ID,Course Name,Grade,Points,Semester\n" +
      filteredResults.map(result => 
        `${result.studentName},${result.studentId},${result.courseId},${result.courseName},${result.grade?.grade || 'Not Graded'},${result.grade?.points || ''},${result.semester}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student-results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSuccess('Results data exported successfully');
  };

  // Table configuration
  const tableHeaders = ['Student', 'Student ID', 'Course', 'Grade', 'Points', 'Semester'];
  const tableData = filteredResults.map(result => [
    result.studentName,
    result.studentId,
    `${result.courseName} (${result.courseId})`,
    result.grade ? (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
        result.grade.points >= 3.7 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
        result.grade.points >= 3.0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
        result.grade.points >= 2.0 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
        'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      }`}>
        {result.grade.grade}
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
        Not Graded
      </span>
    ),
    result.grade?.points || '-',
    result.semester
  ]);

  const getTableActions = (row, index) => {
    const result = filteredResults[index];
    return (
      <button
        onClick={() => handleEditGrade(result.studentId, result.courseId, result.grade, result.studentName, result.courseName)}
        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
        title="Edit Grade"
      >
        <Icons.Edit className="w-4 h-4" />
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Results</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage and track student grades and academic performance
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <Icons.Award className="w-8 h-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <Icons.CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Graded</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.graded}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <Icons.Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ungraded</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.ungraded}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <Icons.Target className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg GPA</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageGPA}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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

          {/* Semester Filter */}
          <select
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Semesters</option>
            {uniqueSemesters.map(semester => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </select>

          {/* Grade Status Filter */}
          <select
            value={filterGradeStatus}
            onChange={(e) => setFilterGradeStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Statuses</option>
            <option value="graded">Graded</option>
            <option value="ungraded">Ungraded</option>
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

      {/* Results List */}
      {filteredResults.length === 0 ? (
        <Card className="p-12 text-center">
          <Icons.Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No results found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No student results match your current search criteria.
          </p>
        </Card>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredResults.map((result, index) => (
            <GradeCard
              key={`${result.studentId}-${result.courseId}`}
              studentId={result.studentId}
              courseId={result.courseId}
              grade={result.grade}
              studentName={result.studentName}
              courseName={result.courseName}
              semester={result.semester}
              onEditGrade={handleEditGrade}
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
          itemsPerPage={15}
          emptyMessage="No results found"
        />
      )}

      {/* Grade Edit Modal */}
      <GradeEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        studentId={selectedGrade?.studentId}
        courseId={selectedGrade?.courseId}
        currentGrade={selectedGrade?.currentGrade}
        studentName={selectedGrade?.studentName}
        courseName={selectedGrade?.courseName}
        onSave={handleSaveGrade}
      />
    </div>
  );
};

export default AdminResults;