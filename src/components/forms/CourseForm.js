// src/components/forms/CourseForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Icons from '../ui/Icons';
import { useNotification } from '../../context/NotificationContext';
import { mockCourses, mockInstructors, mockDepartments } from '../../data/mockData';

const CourseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { success, error } = useNotification();
  const [loading, setLoading] = useState(false);
  const [existingCourse, setExistingCourse] = useState(null);
  const isEditing = Boolean(id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      title: '',
      id: '',
      description: '',
      instructor: '',
      instructorId: '',
      credits: 3,
      capacity: 30,
      schedule: '',
      duration: '16 weeks',
      department: '',
      level: 'Undergraduate',
      room: '',
      startDate: '',
      endDate: '',
      status: 'active',
      prerequisites: [],
    },
  });

  const watchedCredits = watch('credits');
  const watchedCapacity = watch('capacity');

  useEffect(() => {
    if (isEditing && id) {
      // In a real app, this would fetch from API
      const course = mockCourses.find(c => c.id === id);
      if (course) {
        setExistingCourse(course);
        // Populate form with existing data
        Object.keys(course).forEach(key => {
          setValue(key, course[key]);
        });
      } else {
        error('Course not found');
        navigate('/admin/courses');
      }
    }
  }, [id, isEditing, setValue, error, navigate]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isEditing) {
        // Update existing course
        success('Course updated successfully!', {
          title: 'Success',
        });
      } else {
        // Create new course
        success('Course created successfully!', {
          title: 'Success',
        });
      }
      
      // Navigate back to courses list
      navigate('/admin/courses');
    } catch (err) {
      error('Failed to save course. Please try again.', {
        title: 'Error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/courses');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Course' : 'Create New Course'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isEditing 
              ? `Update details for ${existingCourse?.title || 'this course'}`
              : 'Fill out the form below to create a new course offering'
            }
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleCancel}
          icon={<Icons.X />}
        >
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <Card.Header>
            <Card.Title>Basic Information</Card.Title>
            <Card.Description>
              Enter the basic details about the course
            </Card.Description>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">
                  Course Title *
                </label>
                <input
                  type="text"
                  className={`form-input ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="e.g., Introduction to Computer Science"
                  {...register('title', {
                    required: 'Course title is required',
                    minLength: {
                      value: 3,
                      message: 'Title must be at least 3 characters',
                    },
                  })}
                />
                {errors.title && (
                  <p className="form-error">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">
                  Course Code *
                </label>
                <input
                  type="text"
                  className={`form-input ${errors.id ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="e.g., CS101"
                  {...register('id', {
                    required: 'Course code is required',
                    pattern: {
                      value: /^[A-Z]{2,4}\d{3}$/,
                      message: 'Invalid format (e.g., CS101, MATH202)',
                    },
                  })}
                  disabled={isEditing}
                />
                {errors.id && (
                  <p className="form-error">{errors.id.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="form-label">
                  Description *
                </label>
                <textarea
                  rows={4}
                  className={`form-input ${errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Provide a detailed description of the course content and objectives..."
                  {...register('description', {
                    required: 'Description is required',
                    minLength: {
                      value: 20,
                      message: 'Description must be at least 20 characters',
                    },
                  })}
                />
                {errors.description && (
                  <p className="form-error">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">
                  Department *
                </label>
                <select
                  className={`form-input ${errors.department ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  {...register('department', {
                    required: 'Department is required',
                  })}
                >
                  <option value="">Select Department</option>
                  {mockDepartments.map(dept => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="form-error">{errors.department.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">
                  Level *
                </label>
                <select
                  className="form-input"
                  {...register('level')}
                >
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Doctoral">Doctoral</option>
                </select>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Course Details */}
        <Card>
          <Card.Header>
            <Card.Title>Course Details</Card.Title>
            <Card.Description>
              Specify the academic and scheduling details
            </Card.Description>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="form-label">
                  Credits *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="6"
                    className={`form-input ${errors.credits ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    {...register('credits', {
                      required: 'Credits are required',
                      min: { value: 1, message: 'Minimum 1 credit' },
                      max: { value: 6, message: 'Maximum 6 credits' },
                    })}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    {watchedCredits} credit{watchedCredits !== 1 ? 's' : ''}
                  </div>
                </div>
                {errors.credits && (
                  <p className="form-error">{errors.credits.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">
                  Capacity *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    max="200"
                    className={`form-input ${errors.capacity ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    {...register('capacity', {
                      required: 'Capacity is required',
                      min: { value: 5, message: 'Minimum 5 students' },
                      max: { value: 200, message: 'Maximum 200 students' },
                    })}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    {watchedCapacity} students
                  </div>
                </div>
                {errors.capacity && (
                  <p className="form-error">{errors.capacity.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">
                  Duration
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., 16 weeks"
                  {...register('duration')}
                />
              </div>

              <div>
                <label className="form-label">
                  Instructor *
                </label>
                <select
                  className={`form-input ${errors.instructor ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  {...register('instructor', {
                    required: 'Instructor is required',
                  })}
                >
                  <option value="">Select Instructor</option>
                  {mockInstructors.map(instructor => (
                    <option key={instructor.id} value={instructor.name}>
                      {instructor.name} - {instructor.department}
                    </option>
                  ))}
                </select>
                {errors.instructor && (
                  <p className="form-error">{errors.instructor.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">
                  Room/Location
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., CS Building Room 101"
                  {...register('room')}
                />
              </div>

              <div>
                <label className="form-label">
                  Status
                </label>
                <select
                  className="form-input"
                  {...register('status')}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="lg:col-span-3">
                <label className="form-label">
                  Schedule
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Mon, Wed, Fri 9:00 AM - 10:30 AM"
                  {...register('schedule')}
                />
              </div>

              <div>
                <label className="form-label">
                  Start Date
                </label>
                <input
                  type="date"
                  className="form-input"
                  {...register('startDate')}
                />
              </div>

              <div>
                <label className="form-label">
                  End Date
                </label>
                <input
                  type="date"
                  className="form-input"
                  {...register('endDate')}
                />
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting || loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting || loading}
            icon={isEditing ? <Icons.Edit /> : <Icons.Plus />}
          >
            {isEditing ? 'Update Course' : 'Create Course'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;