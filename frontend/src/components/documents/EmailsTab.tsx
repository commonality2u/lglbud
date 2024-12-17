'use client'

import React from 'react';
import { Mail } from 'lucide-react';

export default function EmailsTab() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Email Documents</h2>
        <div className="flex gap-2">
          {/* Add email-specific actions here */}
        </div>
      </div>

      {/* Placeholder for email list */}
      <div className="space-y-4">
        <div className="text-center py-8">
          <Mail className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No email documents uploaded yet.</p>
          <p className="text-sm text-gray-400">
            Upload .eml or .msg files to see them here
          </p>
        </div>
      </div>
    </div>
  );
}

