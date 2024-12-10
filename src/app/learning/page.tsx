'use client';

import { BookOpen, Search, GraduationCap, BookMarked, Video, Award } from 'lucide-react';

export default function LearningCenterPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Learning Center</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Enhance your legal knowledge and skills</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <GraduationCap className="w-5 h-5 mr-2" />
            Start Learning
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search courses and resources..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      {/* Progress Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Courses Completed</p>
                <p className="text-2xl font-semibold text-blue-700 dark:text-blue-300">3/12</p>
              </div>
              <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          {/* Add more progress stats */}
        </div>
      </div>

      {/* Featured Courses */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Featured Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Course Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="aspect-video bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Video className="w-12 h-12 text-gray-400" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Legal Writing Essentials</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Master the art of legal writing and documentation</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <BookMarked className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">8 Modules</span>
                </div>
                <button className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700">
                  Start Course →
                </button>
              </div>
            </div>
          </div>
          {/* Add more course cards */}
        </div>
      </div>

      {/* Learning Paths */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Learning Paths</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['Civil Litigation', 'Contract Law', 'Legal Research', 'Court Procedures'].map((path) => (
            <div key={path} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{path}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">4 courses • 12 hours</p>
                </div>
                <div>
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700">
                    View Path →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 