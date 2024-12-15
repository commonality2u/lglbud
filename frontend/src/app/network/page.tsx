'use client';

import { Users, Search, UserPlus, MessageSquare, Mail, Building } from 'lucide-react';

export default function NetworkPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Network</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Connect with legal professionals</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <UserPlus className="w-5 h-5 mr-2" />
          Add Connection
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search network..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      {/* Network Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Connections', count: '150+', icon: <Users className="w-6 h-6" /> },
          { label: 'Messages', count: '24', icon: <MessageSquare className="w-6 h-6" /> },
          { label: 'Law Firms', count: '45', icon: <Building className="w-6 h-6" /> },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stat.count}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Connections */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Recent Connections</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {[
            { name: 'Sarah Johnson', role: 'Corporate Lawyer', firm: 'Johnson & Associates' },
            { name: 'Michael Chen', role: 'Patent Attorney', firm: 'IP Law Group' },
            { name: 'Emily Williams', role: 'Family Law Specialist', firm: 'Williams Law' },
          ].map((connection) => (
            <div key={connection.name} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {connection.name[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{connection.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{connection.role} • {connection.firm}</p>
                  </div>
                </div>
                <button className="inline-flex items-center px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Mail className="w-4 h-4 mr-2" />
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Connections */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Suggested Connections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'David Miller', role: 'Criminal Defense', firm: 'Miller & Partners' },
            { name: 'Lisa Zhang', role: 'Real Estate Law', firm: 'Zhang Legal' },
            { name: 'Robert Taylor', role: 'Civil Litigation', firm: 'Taylor Law Group' },
          ].map((suggestion) => (
            <div key={suggestion.name} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 text-lg font-medium">
                    {suggestion.name[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{suggestion.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{suggestion.role}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{suggestion.firm}</p>
                </div>
              </div>
              <button className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 