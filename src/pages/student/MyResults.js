// src/pages/student/MyResults.js
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Icons from '../../components/ui/Icons';
import { mockCourses, mockStudents } from '../../data/mockData';

const MyResults = () => {
  const [completedCourses, setCompletedCourses] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('all');
  
  const student = mockStudents['student123'];
  const results = student.results;

  useEffect(() => {
    const courses = mockCourses.filter(course => 
      Object.keys(results).includes(course.id)
    );
    setCompletedCourses(courses);
  }, [results]);

  // Calculate statistics
  const totalCredits = completedCourses.reduce((sum, course) => sum + course.credits, 0);
  const totalQualityPoints = completedCourses.reduce((sum, course) => {
    const result = results[course.id];
    return sum + (result.points * course.credits);
  }, 0);
  const overallGPA = totalCredits > 0 ? (totalQualityPoints / totalCredits).toFixed(2) : 0;

  // Get unique semesters
  const semesters = [...new Set(Object.values(results).map(result => result.semester))].sort();

  // Filter courses by semester
  const filteredCourses = selectedSemester === 'all' 
    ? completedCourses 
    : completedCourses.filter(course => results[course.id].semester === selectedSemester);

  const getGradeColor = (points) => {
    if (points >= 3.7) return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
    if (points >= 3.0) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
    if (points >= 2.0) return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400';
    return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Academic Results</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {completedCourses.length} courses completed • {totalCredits} credits • {overallGPA} GPA
          </p>
        </div>
      </div>

      {/* GPA Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div className="flex items-center">
            <Icons.Award className="w-8 h-8 opacity-80" />
            <div className="ml-3">
              <p className="text-sm opacity-90">Overall GPA</p>
              <p className="text-2xl font-bold">{overallGPA}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <Icons.BookOpen className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Courses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedCourses.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <Icons.Target className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Credits</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCredits}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <Icons.TrendingUp className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Quality Points</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalQualityPoints.toFixed(1)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Semester Filter */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by Semester:
          </label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Semesters</option>
            {semesters.map(semester => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Results List */}
      {filteredCourses.length === 0 ? (
        <Card className="p-8 text-center">
          <Icons.Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No results available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Complete courses to see your grades here.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredCourses.map((course) => {
            const result = results[course.id];
            const qualityPoints = (result.points * course.credits).toFixed(1);
            
            return (
              <Card key={course.id} className="p-6">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {course.id} • {course.credits} Credits • {result.semester}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Grade</p>
                      <div className={`px-3 py-1 rounded-lg font-bold text-lg ${getGradeColor(result.points)}`}>
                        {result.grade}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Points</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {result.points}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Quality Points</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {qualityPoints}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Grade Scale */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Grade Scale</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { grade: 'A', points: '4.0', range: '90-100%' },
            { grade: 'A-', points: '3.7', range: '87-89%' },
            { grade: 'B+', points: '3.3', range: '83-86%' },
            { grade: 'B', points: '3.0', range: '80-82%' },
            { grade: 'B-', points: '2.7', range: '77-79%' },
            { grade: 'C+', points: '2.3', range: '73-76%' },
            { grade: 'C', points: '2.0', range: '70-72%' },
            { grade: 'F', points: '0.0', range: '<70%' },
          ].map((item) => (
            <div key={item.grade} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
              <div className="font-bold text-lg text-gray-900 dark:text-white">{item.grade}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{item.points}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">{item.range}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MyResults;