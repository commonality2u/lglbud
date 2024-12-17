'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2, Trash2 } from 'lucide-react';

interface EmailSetDetailViewProps {
  id: string;
  onBack: () => void;
}

export default function EmailSetDetailView({ id, onBack }: EmailSetDetailViewProps) {
  // This would typically fetch the email set details from your backend
  const emailSet = {
    id,
    name: 'Email Set',
    uploadDate: new Date().toLocaleDateString(),
    status: 'Processed',
    count: 150,
    source: 'Outlook Export',
    tags: ['Q4', '2023', 'Correspondence'],
    emails: [
      {
        id: '1',
        subject: 'Re: Project Update',
        from: 'john@example.com',
        to: 'jane@example.com',
        date: '2024-01-15',
        hasAttachments: true
      },
      // Add more sample emails as needed
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
          <h2 className="text-2xl font-bold">{emailSet.name}</h2>
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
          <p className="font-medium">{emailSet.uploadDate}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
          <p className="font-medium">{emailSet.status}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Email Count</p>
          <p className="font-medium">{emailSet.count}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Source</p>
          <p className="font-medium">{emailSet.source}</p>
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {emailSet.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Email List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Emails</h3>
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
          {emailSet.emails.map(email => (
            <div
              key={email.id}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-medium">{email.subject}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    From: {email.from}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    To: {email.to}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(email.date).toLocaleDateString()}
                  </span>
                  {email.hasAttachments && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                      Attachment
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

