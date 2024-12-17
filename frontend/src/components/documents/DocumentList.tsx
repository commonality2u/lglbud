'use client'

import React from 'react';
import { Button } from "@/components/ui/button";

interface DocumentListProps {
  documents: Array<{
    id: string;
    name: string;
    uploadDate: string;
    status: string;
    count?: number;
    source?: string;
    tags?: string[];
    [key: string]: any;
  }>;
  onRowClick: (id: string) => void;
  onEditTags?: (id: string) => void;
  onDelete?: (id: string) => void;
  columns: string[];
}

export default function DocumentList({
  documents,
  onRowClick,
  onEditTags,
  onDelete,
  columns
}: DocumentListProps) {
  const formatValue = (value: any) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {column.split(/(?=[A-Z])/).join(' ')}
              </th>
            ))}
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {documents.map((doc) => (
            <tr
              key={doc.id}
              onClick={() => onRowClick(doc.id)}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            >
              {columns.map((column) => (
                <td
                  key={`${doc.id}-${column}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                >
                  {column === 'tags' && Array.isArray(doc[column]) ? (
                    <div className="flex flex-wrap gap-1">
                      {doc[column].map((tag: string) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    formatValue(doc[column])
                  )}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  {onEditTags && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTags(doc.id);
                      }}
                    >
                      Edit Tags
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(doc.id);
                      }}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

