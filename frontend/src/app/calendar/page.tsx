'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  List,
  Bell,
  MapPin,
  Settings,
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  location?: string;
  description?: string;
  isDeadline?: boolean;
}

export default function CalendarPage() {
  const [currentTab, setCurrentTab] = useState<'calendar' | 'deadlines' | 'settings'>('calendar');
  const [events, setEvents] = useState<Event[]>([
    {
      id: 'event-1',
      title: 'Court Hearing - Smith vs. Johnson',
      date: new Date('2023-12-15'),
      time: '9:00 AM',
      location: 'Courtroom 3',
      isDeadline: false,
    },
    {
      id: 'deadline-1',
      title: 'File Response to Motion',
      date: new Date('2023-12-18'),
      time: '5:00 PM',
      isDeadline: true,
    },
  ]);

  const handleTabChange = (tab: 'calendar' | 'deadlines' | 'settings') => {
    setCurrentTab(tab);
  };

  const renderCalendarView = () => (
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
  );

  const renderDeadlineView = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Upcoming Deadlines</h3>
      <div className="space-y-4">
        {events
          .filter((event) => event.isDeadline)
          .map((event) => (
            <div key={event.id} className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{event.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {event.date.toLocaleDateString()} • {event.time}
                </p>
              </div>
              <Bell className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
          ))}
      </div>
    </div>
  );

  const renderSettingsView = () => (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Calendar Settings</h3>
          <div className="space-y-4">
              <div className="flex items-center space-x-4">
                  <Settings className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Calendar Synchronization</p>
              </div>
              <div className="flex items-center space-x-4">
                  <MapPin className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Location-Based Alerts</p>
              </div>
          </div>
      </div>
  );

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
            <button
                onClick={() => handleTabChange('calendar')}
                className={`px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg ${
                  currentTab === 'calendar' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                }`}
              >
                Month
              </button>
              <button
                onClick={() => handleTabChange('deadlines')}
                className={`px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg ${
                  currentTab === 'deadlines' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                }`}
              >
                Deadlines
              </button>
              <button
                onClick={() => handleTabChange('settings')}
                className={`px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg ${
                  currentTab === 'settings' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                }`}
              >
                Settings
              </button>
          </div>
      </div>

      {/* Calendar/Deadlines/Settings View */}
      {currentTab === 'calendar' && renderCalendarView()}
      {currentTab === 'deadlines' && renderDeadlineView()}
      {currentTab === 'settings' && renderSettingsView()}
    </div>
  );
}