'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2, Trash2 } from 'lucide-react';

interface LegalFilingSetDetailViewProps {
  id: string;
  onBack: () => void;
}

export default function LegalFilingSetDetailView({ id, onBack }: LegalFilingSetDetailViewProps) {
  // This would typically fetch the legal filing set details from your backend
  const filingSet = {
    id,
    name: 'Legal Filing Set',
    uploadDate: new Date().toLocaleDateString(),
    status: 'Active',
    count: 25,
    source: 'Court Records',
    tags: ['Civil Case', 'Active', '2024'],
    filings: [
      {
        id: '1',
        title: 'Initial Complaint',
        fileType: 'PDF',
        pageCount: 25,
        filedDate: '2024-01-15',
        hasExhibits: true,
        priority: 'High'
      },
      // Add more sample filings as needed
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-2xl font-bold">{filingSet.name}</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-4 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Upload Date</p>
          <p className="font-medium">{filingSet.uploadDate}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
          <p className="font-medium">{filingSet.status}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Filing Count</p>
          <p className="font-medium">{filingSet.count}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Source</p>
          <p className="font-medium">{filingSet.source}</p>
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {filingSet.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Filings List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Filings</h3>
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
          {filingSet.filings.map(filing => (
            <div
              key={filing.id}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-medium">{filing.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Type: {filing.fileType} • Pages: {filing.pageCount}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Filed: {filing.filedDate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    filing.priority === 'High' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                  }`}>
                    {filing.priority}
                  </span>
                  {filing.hasExhibits && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      Has Exhibits
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

