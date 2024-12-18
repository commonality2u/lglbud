'use client'

import React, { useState } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import { X, Download, Copy, Tag, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ExtractedItem {
  id: string;
  content: string;
  source: string;
  type: string;
  notes?: string;
  timestamp: string;
}

export default function ExtractionPanel() {
  const { extractedItems, removeExtractedItem } = useAppContext();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<string>('all');

  const handleExport = () => {
    const itemsToExport = extractedItems.filter(item => 
      selectedItems.size === 0 || selectedItems.has(item.id)
    );

    const exportData = itemsToExport.map(item => ({
      content: item.content,
      source: item.source,
      type: item.type,
      notes: item.notes,
      timestamp: item.timestamp
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-items.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === extractedItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(extractedItems.map(item => item.id)));
    }
  };

  const filteredItems = extractedItems.filter(item => 
    filter === 'all' || item.type === filter
  );

  if (extractedItems.length === 0) {
    return (
      <div className="p-6 border border-gray-700 rounded-lg bg-gray-800">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="p-3 bg-gray-700 rounded-full">
            <Tag className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-200">No Extracted Items</h3>
            <p className="text-sm text-gray-400 mt-1">
              Select text from documents to extract important information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-700 rounded-lg bg-gray-800 overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-200">Extracted Items</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSelectAll}
              className="text-gray-400 hover:text-gray-300"
            >
              {selectedItems.size === extractedItems.length ? 'Deselect All' : 'Select All'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleExport}
              className="text-gray-400 hover:text-gray-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filter === 'all' ? 'default' : 'ghost'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={filter === 'text' ? 'default' : 'ghost'}
            onClick={() => setFilter('text')}
          >
            Text
          </Button>
          <Button
            size="sm"
            variant={filter === 'date' ? 'default' : 'ghost'}
            onClick={() => setFilter('date')}
          >
            Dates
          </Button>
          <Button
            size="sm"
            variant={filter === 'amount' ? 'default' : 'ghost'}
            onClick={() => setFilter('amount')}
          >
            Amounts
          </Button>
        </div>
      </div>

      <div className="divide-y divide-gray-700">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`p-4 transition-colors ${
              selectedItems.has(item.id) ? 'bg-gray-700' : 'hover:bg-gray-700/50'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selectedItems.has(item.id)}
                onChange={() => handleSelectItem(item.id)}
                className="mt-1"
              />
              <div className="flex-grow">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="text-sm text-gray-200">{item.content}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">
                        From: {item.source}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">
                        {item.timestamp}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(item.content)}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeExtractedItem(item.id)}
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {item.notes && (
                  <p className="mt-2 text-sm text-gray-400 bg-gray-700/50 p-2 rounded">
                    {item.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedItems.size > 0 && (
        <div className="p-4 border-t border-gray-700 bg-gray-700/50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">
              {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const itemsToDelete = Array.from(selectedItems);
                  itemsToDelete.forEach(id => removeExtractedItem(id));
                  setSelectedItems(new Set());
                }}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  const selectedContent = extractedItems
                    .filter(item => selectedItems.has(item.id))
                    .map(item => item.content)
                    .join('\n\n');
                  handleCopy(selectedContent);
                }}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Selected
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

