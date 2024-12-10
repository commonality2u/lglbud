'use client';

import { FolderOpen, Search, Filter, BookOpen, Scale, Gavel, FileText } from 'lucide-react';

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Resources</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Access legal resources and references</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </button>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: <Scale className="w-6 h-6" />, label: 'Legal Forms', count: '120+ forms' },
          { icon: <Gavel className="w-6 h-6" />, label: 'Case Law', count: '1000+ cases' },
          { icon: <BookOpen className="w-6 h-6" />, label: 'Legal Guides', count: '50+ guides' },
          { icon: <FileText className="w-6 h-6" />, label: 'Templates', count: '75+ templates' },
        ].map((item) => (
          <div key={item.label} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                  {item.icon}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Resources */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Recent Resources</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {[
            { title: 'Civil Procedure Guide', type: 'Guide', date: '2 hours ago' },
            { title: 'Motion to Dismiss Template', type: 'Template', date: 'Yesterday' },
            { title: 'Evidence Rules Handbook', type: 'Document', date: '3 days ago' },
          ].map((resource) => (
            <div key={resource.title} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <FolderOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{resource.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{resource.type}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{resource.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            'Civil Litigation',
            'Criminal Law',
            'Family Law',
            'Corporate Law',
            'Real Estate',
            'Intellectual Property',
          ].map((category) => (
            <div key={category} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{category}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">50+ resources</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 