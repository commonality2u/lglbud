'use client'

import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function TextMessagesTab() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Text Messages</h2>
        <div className="flex gap-2">
          {/* Add text message-specific actions here */}
        </div>
      </div>

      {/* Placeholder for text messages list */}
      <div className="space-y-4">
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No text messages uploaded yet.</p>
          <p className="text-sm text-gray-400">
            Upload text message exports to see them here
          </p>
        </div>
      </div>
    </div>
  );
}

