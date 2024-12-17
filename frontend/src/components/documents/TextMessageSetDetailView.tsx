'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2, Trash2 } from 'lucide-react';

interface TextMessageSetDetailViewProps {
  id: string;
  onBack: () => void;
}

export default function TextMessageSetDetailView({ id, onBack }: TextMessageSetDetailViewProps) {
  // This would typically fetch the text message set details from your backend
  const messageSet = {
    id,
    name: 'Text Message Set',
    uploadDate: new Date().toLocaleDateString(),
    status: 'Processed',
    count: 500,
    source: 'Slack Export',
    tags: ['Project', 'Team Chat', '2024'],
    messages: [
      {
        id: '1',
        sender: 'John Doe',
        content: 'Project update: Phase 1 complete',
        timestamp: '2024-01-15T09:30:00',
        hasAttachments: true,
        threadCount: 5,
        reactions: ['👍', '🎉']
      },
      // Add more sample messages as needed
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
          <h2 className="text-2xl font-bold">{messageSet.name}</h2>
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
          <p className="font-medium">{messageSet.uploadDate}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
          <p className="font-medium">{messageSet.status}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Message Count</p>
          <p className="font-medium">{messageSet.count}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Source</p>
          <p className="font-medium">{messageSet.source}</p>
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {messageSet.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Messages</h3>
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
          {messageSet.messages.map(message => (
            <div
              key={message.id}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-medium">{message.sender}</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    {message.content}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(message.timestamp).toLocaleString()}
                    </span>
                    {message.reactions.length > 0 && (
                      <div className="flex items-center gap-1">
                        {message.reactions.map((reaction, index) => (
                          <span key={index} className="text-sm">
                            {reaction}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {message.hasAttachments && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Has Attachments
                    </span>
                  )}
                  {message.threadCount > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {message.threadCount} replies
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

