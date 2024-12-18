'use client'

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2, Trash2, Receipt, FileText, Brain } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  number: string;
  vendor: string;
  amount: number;
  dueDate: string;
  status: string;
  hasAttachments: boolean;
  currency: string;
  items?: InvoiceItem[];
  notes?: string;
  paymentTerms?: string;
  billingAddress?: string;
  shippingAddress?: string;
  taxAmount?: number;
  subtotal?: number;
  total?: number;
}

interface InvoiceSet {
  id: string;
  name: string;
  uploadDate: string;
  status: string;
  count: number;
  source: string;
  tags: string[];
  invoices: Invoice[];
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  project?: string;
  department?: string;
}

interface InvoiceSetDetailViewProps {
  id: string;
  onBack: () => void;
}

export default function InvoiceSetDetailView({ id, onBack }: InvoiceSetDetailViewProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [extractedText, setExtractedText] = useState<string[]>([]);
  const [userNotes, setUserNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // This would typically fetch the invoice set details from your backend
  const invoiceSet: InvoiceSet = {
    id,
    name: 'Invoice Set',
    uploadDate: new Date().toLocaleDateString(),
    status: 'Paid',
    count: 3,
    source: 'Accounts Payable',
    tags: ['Q1', '2024', 'Office Supplies'],
    totalAmount: 5000.00,
    paidAmount: 3750.00,
    pendingAmount: 1250.00,
    project: 'Office Renovation',
    department: 'Operations',
    invoices: [
      {
        id: '1',
        number: 'INV-2024-001',
        vendor: 'Office Supplies Co.',
        amount: 1250.00,
        dueDate: '2024-02-15',
        status: 'Paid',
        hasAttachments: true,
        currency: 'USD',
        items: [
          {
            id: '1',
            description: 'Office Chairs',
            quantity: 5,
            unitPrice: 150.00,
            total: 750.00
          },
          {
            id: '2',
            description: 'Desk Lamps',
            quantity: 10,
            unitPrice: 50.00,
            total: 500.00
          }
        ],
        notes: 'Bulk order for office renovation',
        paymentTerms: 'Net 30',
        billingAddress: '123 Business St, Suite 100',
        shippingAddress: '123 Business St, Suite 100',
        taxAmount: 100.00,
        subtotal: 1150.00,
        total: 1250.00
      }
    ]
  };

  const handleExtractText = (text: string) => {
    setExtractedText([...extractedText, text]);
  };

  const filteredInvoices = invoiceSet.invoices.filter(invoice => {
    const matchesSearch = searchTerm === '' || 
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !selectedStatus || invoice.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-6">
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="mb-6 hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Documents
        </Button>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-800 p-1 rounded-lg">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="aiAnalysis" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="bg-gray-800 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Invoice Set Overview</h2>
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Total Amount</p>
                    <p className="text-3xl font-bold">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(invoiceSet.totalAmount)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Paid</p>
                      <p className="text-xl font-bold text-green-400">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(invoiceSet.paidAmount)}
                      </p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Pending</p>
                      <p className="text-xl font-bold text-yellow-400">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(invoiceSet.pendingAmount)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <Button className="flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Export Invoices
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400">Project</p>
                      <p className="text-lg">{invoiceSet.project}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Department</p>
                      <p className="text-lg">{invoiceSet.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Source</p>
                      <p className="text-lg">{invoiceSet.source}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {invoiceSet.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-sm rounded-full bg-blue-500/20 text-blue-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="bg-gray-800 rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Invoices</h2>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    className="px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {selectedStatus && (
                    <Button 
                      variant="secondary"
                      onClick={() => setSelectedStatus(null)}
                    >
                      Clear Filter ({selectedStatus})
                    </Button>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-gray-700 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-gray-800/50">
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow 
                        key={invoice.id}
                        className="hover:bg-gray-800/50 cursor-pointer"
                        onClick={() => setSelectedInvoice(invoice)}
                      >
                        <TableCell className="font-medium">{invoice.number}</TableCell>
                        <TableCell>{invoice.vendor}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: invoice.currency
                          }).format(invoice.amount)}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            invoice.status === 'Paid'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {invoice.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedInvoice(invoice);
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="aiAnalysis" className="bg-gray-800 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">AI Analysis</h2>
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Key Insights</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Spending patterns</li>
                      <li>• Vendor analysis</li>
                      <li>• Payment trends</li>
                      <li>• Cost categorization</li>
                    </ul>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">User Notes</h3>
                    <textarea
                      value={userNotes}
                      onChange={(e) => setUserNotes(e.target.value)}
                      placeholder="Add your notes here..."
                      className="w-full h-32 bg-gray-600 text-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Extracted Information</h3>
                <div className="space-y-4">
                  {extractedText.map((text, index) => (
                    <div key={index} className="bg-gray-600 p-3 rounded-lg">
                      <p className="text-sm">{text}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="mt-2"
                        onClick={() => {
                          const newExtracted = [...extractedText];
                          newExtracted.splice(index, 1);
                          setExtractedText(newExtracted);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold">Invoice Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedInvoice(null)}
                >
                  ✕
                </Button>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Invoice Number</p>
                    <p className="font-medium">{selectedInvoice.number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Due Date</p>
                    <p>{selectedInvoice.dueDate}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Vendor</p>
                  <p className="font-medium">{selectedInvoice.vendor}</p>
                </div>
                {selectedInvoice.items && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Items</p>
                    <div className="bg-gray-700 rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead className="text-right">Unit Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedInvoice.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.description}</TableCell>
                              <TableCell className="text-right">{item.quantity}</TableCell>
                              <TableCell className="text-right">
                                {new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: selectedInvoice.currency
                                }).format(item.unitPrice)}
                              </TableCell>
                              <TableCell className="text-right">
                                {new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: selectedInvoice.currency
                                }).format(item.total)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {selectedInvoice.subtotal && (
                    <div>
                      <p className="text-sm text-gray-400">Subtotal</p>
                      <p>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: selectedInvoice.currency
                        }).format(selectedInvoice.subtotal)}
                      </p>
                    </div>
                  )}
                  {selectedInvoice.taxAmount && (
                    <div>
                      <p className="text-sm text-gray-400">Tax</p>
                      <p>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: selectedInvoice.currency
                        }).format(selectedInvoice.taxAmount)}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Amount</p>
                  <p className="text-2xl font-bold">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: selectedInvoice.currency
                    }).format(selectedInvoice.amount)}
                  </p>
                </div>
                {selectedInvoice.paymentTerms && (
                  <div>
                    <p className="text-sm text-gray-400">Payment Terms</p>
                    <p>{selectedInvoice.paymentTerms}</p>
                  </div>
                )}
                {selectedInvoice.billingAddress && (
                  <div>
                    <p className="text-sm text-gray-400">Billing Address</p>
                    <p>{selectedInvoice.billingAddress}</p>
                  </div>
                )}
                {selectedInvoice.shippingAddress && (
                  <div>
                    <p className="text-sm text-gray-400">Shipping Address</p>
                    <p>{selectedInvoice.shippingAddress}</p>
                  </div>
                )}
                {selectedInvoice.notes && (
                  <div>
                    <p className="text-sm text-gray-400">Notes</p>
                    <p className="mt-2 p-2 bg-gray-700 rounded-lg">{selectedInvoice.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

