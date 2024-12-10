'use client';

import { Scale, Search, Filter, Plus } from 'lucide-react';

export default function CasesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Cases</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage and track your legal cases</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5 mr-2" />
          New Case
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search cases..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </button>
      </div>

      {/* Cases List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Active Cases</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* Sample Case Item */}
          <div className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Smith vs. Johnson</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Case #123-45</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Active
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Updated 2h ago</span>
              </div>
            </div>
          </div>
          {/* Add more case items here */}
        </div>
      </div>
    </div>
  );
} 