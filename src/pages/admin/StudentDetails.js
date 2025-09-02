// src/pages/admin/StudentDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icons from '../../components/ui/Icons';
import Button from '../../components/ui/Button';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/ui/Card';
import Table from '../../components/common/Table';
import { useNotification } from '../../context/NotificationContext';
import { mockStudents, mockCourses } from '../../data/mockData';

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch student by ID from API
    const foundStudent = Object.values(mockStudents).find(s => s.id === id || s.studentId === id);
    if (foundStudent) {
      setStudent(foundStudent);
    } else {
      showError('Student not found');
      navigate('/admin/students');
    }
    setLoading(false);
  }, [id, navigate, showError]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <Icons.AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Student Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">The student you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/admin/students')}>
          Back to Students
        </Button>
      </div>
    );
  }

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

  // Get enrolled courses
  const enrolledCourses = mockCourses.filter(course => 
    student.registeredCourses.includes(course.id)
  );

  // Get course grades
  const courseGrades = Object.entries(student.results || {}).map(([courseId, result]) => {
    const course = mockCourses.find(c => c.id === courseId);
    return {
      courseId,
      courseTitle: course?.title || courseId,
      instructor: course?.instructor || 'N/A',
      credits: course?.credits || 0,
      grade: result.grade,
      points: result.points,
      semester: result.semester,
    };
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Icons.UserCircle /> },
    { id: 'courses', label: 'Current Courses', icon: <Icons.BookOpen /> },
    { id: 'grades', label: 'Grade History', icon: <Icons.Award /> },
    { id: 'activity', label: 'Activity Log', icon: <Icons.Clock /> },
  ];

  const handleEditStudent = () => {
    showSuccess(`Opening edit form for ${student.name}`, { title: 'Edit Student' });
    // Navigate to edit form
  };

  const handleSuspendStudent = () => {
    showSuccess(`${student.name} has been suspended`, { title: 'Student Suspended' });
    setStudent(prev => ({ ...prev, status: 'suspended' }));
  };

  const handleActivateStudent = () => {
    showSuccess(`${student.name} has been activated`, { title: 'Student Activated' });
    setStudent(prev => ({ ...prev, status: 'active' }));
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Personal Information */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <Button variant="outline-primary" size="sm" onClick={handleEditStudent}>
              <Icons.Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <p className="text-gray-900 dark:text-white font-medium">{student.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Student ID
                </label>
                <p className="text-gray-900 dark:text-white font-medium">{student.studentId}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <p className="text-gray-900 dark:text-white">{student.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <p className="text-gray-900 dark:text-white">{student.phone || 'Not provided'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Program
                </label>
                <p className="text-gray-900 dark:text-white font-medium">{student.program}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Academic Year
                </label>
                <p className="text-gray-900 dark:text-white">Year {student.year}</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address
                </label>
                <p className="text-gray-900 dark:text-white">{student.address || 'Not provided'}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Academic Summary */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Academic Summary</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="text-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
              <div className={`text-3xl font-bold ${getGPAColor(student.gpa)}`}>
                {student.gpa.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Current GPA</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {student.registeredCourses.length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Current Courses</div>
              </div>

              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {student.completedCourses.length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                  {student.status}
                </span>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Expected Graduation</div>
              <div className="text-gray-900 dark:text-white font-medium">
                {new Date(student.expectedGraduation).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Enrollment Date</div>
              <div className="text-gray-900 dark:text-white">
                {new Date(student.enrollmentDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            <Button variant="outline-primary" fullWidth>
              <Icons.Mail className="w-4 h-4 mr-2" />
              Send Message
            </Button>
            
            {student.status === 'active' ? (
              <Button variant="outline-warning" fullWidth onClick={handleSuspendStudent}>
                <Icons.AlertCircle className="w-4 h-4 mr-2" />
                Suspend Student
              </Button>
            ) : (
              <Button variant="outline-success" fullWidth onClick={handleActivateStudent}>
                <Icons.CheckCircle className="w-4 h-4 mr-2" />
                Activate Student
              </Button>
            )}
            
            <Button variant="outline-danger" fullWidth>
              <Icons.Download className="w-4 h-4 mr-2" />
              Export Records
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );

  const renderCurrentCourses = () => {
    const courseHeaders = ['Course Code', 'Course Title', 'Instructor', 'Credits', 'Schedule'];
    const courseData = enrolledCourses.map(course => [
      course.id,
      course.title,
      course.instructor,
      course.credits,
      course.schedule
    ]);

    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Enrolled Courses</CardTitle>
          <Button variant="outline-primary" size="sm">
            <Icons.Plus className="w-4 h-4 mr-2" />
            Enroll in Course
          </Button>
        </CardHeader>
        <CardBody>
          <Table
            headers={courseHeaders}
            data={courseData}
            searchable={true}
            sortable={true}
            emptyMessage="No courses enrolled"
          />
        </CardBody>
      </Card>
    );
  };

  const renderGradeHistory = () => {
    const gradeHeaders = ['Course', 'Instructor', 'Credits', 'Grade', 'Points', 'Semester'];
    const gradeData = courseGrades.map(grade => [
      `${grade.courseTitle} (${grade.courseId})`,
      grade.instructor,
      grade.credits,
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
        grade.points >= 3.7 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
        grade.points >= 3.0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
        'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      }`}>
        {grade.grade}
      </span>,
      grade.points.toFixed(1),
      grade.semester
    ]);

    return (
      <Card>
        <CardHeader>
          <CardTitle>Academic History</CardTitle>
          <Button variant="outline-primary" size="sm">
            <Icons.Download className="w-4 h-4 mr-2" />
            Export Transcript
          </Button>
        </CardHeader>
        <CardBody>
          <Table
            headers={gradeHeaders}
            data={gradeData}
            searchable={true}
            sortable={true}
            pagination={true}
            itemsPerPage={10}
            emptyMessage="No grades recorded"
          />
        </CardBody>
      </Card>
    );
  };

  const renderActivityLog = () => {
    // Mock activity data
    const activities = [
      { date: '2025-01-15', action: 'Enrolled in CS101', type: 'enrollment' },
      { date: '2025-01-10', action: 'Grade posted for MA202', type: 'grade' },
      { date: '2025-01-05', action: 'Profile updated', type: 'profile' },
      { date: '2024-12-20', action: 'Completed final exam for ENG210', type: 'exam' },
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
                    <Icons.Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(activity.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Student Info */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin/students')}
              className="text-white hover:bg-white/20"
            >
              <Icons.ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">
                {student.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{student.name}</h1>
              <p className="text-indigo-100">
                {student.studentId} • {student.program}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{student.gpa.toFixed(1)}</div>
            <div className="text-indigo-100">GPA</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {React.cloneElement(tab.icon, { className: "w-4 h-4 mr-2" })}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'courses' && renderCurrentCourses()}
        {activeTab === 'grades' && renderGradeHistory()}
        {activeTab === 'activity' && renderActivityLog()}
      </div>
    </div>
  );
};

export default StudentDetails;