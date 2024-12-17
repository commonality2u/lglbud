'use client'

import React from 'react';
import { FileText } from 'lucide-react';

export default function InvoicesTab() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Invoices</h2>
        <div className="flex gap-2">
          {/* Add invoice-specific actions here */}
        </div>
      </div>

      {/* Placeholder for invoices list */}
      <div className="space-y-4">
        <div className="text-center py-8">
          <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No invoices uploaded yet.</p>
          <p className="text-sm text-gray-400">
            Upload invoice documents to see them here
          </p>
        </div>
      </div>
    </div>
  );
}

