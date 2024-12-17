'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2, Trash2 } from 'lucide-react';

interface InvoiceSetDetailViewProps {
  id: string;
  onBack: () => void;
}

export default function InvoiceSetDetailView({ id, onBack }: InvoiceSetDetailViewProps) {
  // This would typically fetch the invoice set details from your backend
  const invoiceSet = {
    id,
    name: 'Invoice Set',
    uploadDate: new Date().toLocaleDateString(),
    status: 'Paid',
    count: 3,
    source: 'Accounts Payable',
    tags: ['Q1', '2024', 'Office Supplies'],
    invoices: [
      {
        id: '1',
        number: 'INV-2024-001',
        vendor: 'Office Supplies Co.',
        amount: 1250.00,
        dueDate: '2024-02-15',
        status: 'Paid',
        hasAttachments: true,
        currency: 'USD'
      },
      // Add more sample invoices as needed
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
          <h2 className="text-2xl font-bold">{invoiceSet.name}</h2>
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
          <p className="font-medium">{invoiceSet.uploadDate}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
          <p className="font-medium">{invoiceSet.status}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Invoice Count</p>
          <p className="font-medium">{invoiceSet.count}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Source</p>
          <p className="font-medium">{invoiceSet.source}</p>
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {invoiceSet.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Invoices List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Invoices</h3>
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
          {invoiceSet.invoices.map(invoice => (
            <div
              key={invoice.id}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-medium">{invoice.number}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {invoice.vendor}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Due: {invoice.dueDate}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-lg font-semibold">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: invoice.currency
                    }).format(invoice.amount)}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    invoice.status === 'Paid'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {invoice.status}
                  </span>
                  {invoice.hasAttachments && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Has Attachments
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

