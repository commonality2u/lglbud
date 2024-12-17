'use client'

import React from 'react';
import { useAppContext } from '@/app/context/AppContext';
import { X } from 'lucide-react';

export default function ExtractionPanel() {
  const { extractedItems, removeExtractedItem } = useAppContext();

  if (extractedItems.length === 0) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No items extracted yet. Select text from documents to extract important information.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Extracted Items</h3>
      <div className="space-y-2">
        {extractedItems.map((item) => (
          <div
            key={item.id}
            className="p-3 bg-white dark:bg-gray-800 rounded-lg border shadow-sm"
          >
            <div className="flex justify-between items-start gap-2">
              <p className="text-sm">{item.content}</p>
              <button
                onClick={() => removeExtractedItem(item.id)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

