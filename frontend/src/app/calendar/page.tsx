'use client';

import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Calendar</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your court dates and deadlines</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5 mr-2" />
          Add Event
        </button>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="inline-flex items-center px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">December 2023</h2>
          <button className="inline-flex items-center px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">Month</button>
          <button className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">Week</button>
          <button className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">Day</button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="grid grid-cols-7 gap-px border-b border-gray-200 dark:border-gray-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 text-center">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="min-h-[120px] p-2 bg-white dark:bg-gray-800 border-b border-r border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">{i + 1}</div>
              {/* Sample Event */}
              {i === 15 && (
                <div className="mt-1">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs rounded p-1">
                    Court Hearing - 9:00 AM
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Upcoming Events</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-none">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Court Hearing - Smith vs. Johnson</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Dec 15, 2023 • 9:00 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 