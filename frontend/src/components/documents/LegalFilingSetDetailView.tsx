'use client'

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2, Trash2, Scale, FileText, Brain } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Filing {
  id: string;
  title: string;
  fileType: string;
  pageCount: number;
  filedDate: string;
  hasExhibits: boolean;
  priority: string;
  content?: string;
  exhibits?: string[];
  status: string;
  dueDate?: string;
  assignedTo?: string;
  notes?: string;
}

interface LegalFilingSet {
  id: string;
  name: string;
  uploadDate: string;
  status: string;
  count: number;
  source: string;
  tags: string[];
  filings: Filing[];
  caseNumber: string;
  court: string;
  filingType: string;
  totalPages: number;
}

interface LegalFilingSetDetailViewProps {
  id: string;
  onBack: () => void;
}

export default function LegalFilingSetDetailView({ id, onBack }: LegalFilingSetDetailViewProps) {
  const [selectedFiling, setSelectedFiling] = useState<Filing | null>(null);
  const [extractedText, setExtractedText] = useState<string[]>([]);
  const [userNotes, setUserNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // This would typically fetch the legal filing set details from your backend
  const filingSet: LegalFilingSet = {
    id,
    name: 'Legal Filing Set',
    uploadDate: new Date().toLocaleDateString(),
    status: 'Active',
    count: 25,
    source: 'Court Records',
    tags: ['Civil Case', 'Active', '2024'],
    caseNumber: 'CV-2024-001',
    court: 'Superior Court of California',
    filingType: 'Civil Complaint',
    totalPages: 150,
    filings: [
      {
        id: '1',
        title: 'Initial Complaint',
        fileType: 'PDF',
        pageCount: 25,
        filedDate: '2024-01-15',
        hasExhibits: true,
        priority: 'High',
        status: 'Filed',
        content: 'Sample content of the legal filing...',
        exhibits: ['Exhibit A', 'Exhibit B'],
        dueDate: '2024-02-15',
        assignedTo: 'John Smith',
        notes: 'Important deadlines attached'
      },
      // Add more sample filings as needed
    ]
  };

  const handleExtractText = (text: string) => {
    setExtractedText([...extractedText, text]);
  };

  const filteredFilings = filingSet.filings.filter(filing => {
    const matchesSearch = searchTerm === '' || 
      filing.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !selectedStatus || filing.status === selectedStatus;

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
              <Scale className="w-4 h-4" />
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
                <h2 className="text-2xl font-bold mb-4">Filing Set Overview</h2>
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Case Number</p>
                    <p className="text-3xl font-bold">{filingSet.caseNumber}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Court</p>
                    <p className="text-lg">{filingSet.court}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Filing Type</p>
                    <p className="text-lg">{filingSet.filingType}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <Button className="flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Export Filings
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Total Filings</p>
                      <p className="text-2xl font-bold">{filingSet.count}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Total Pages</p>
                      <p className="text-2xl font-bold">{filingSet.totalPages}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <p className="text-2xl font-bold">{filingSet.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Source</p>
                      <p className="text-2xl font-bold">{filingSet.source}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {filingSet.tags.map(tag => (
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
                <h2 className="text-2xl font-bold">Legal Filings</h2>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Search filings..."
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
                      <TableHead>Title</TableHead>
                      <TableHead>Filed Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Pages</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFilings.map((filing) => (
                      <TableRow 
                        key={filing.id}
                        className="hover:bg-gray-800/50 cursor-pointer"
                        onClick={() => setSelectedFiling(filing)}
                      >
                        <TableCell className="font-medium">{filing.title}</TableCell>
                        <TableCell>{filing.filedDate}</TableCell>
                        <TableCell>{filing.fileType}</TableCell>
                        <TableCell>{filing.pageCount}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            filing.status === 'Filed' 
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {filing.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            filing.priority === 'High'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {filing.priority}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFiling(filing);
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
                      <li>• Legal precedents cited</li>
                      <li>• Key arguments identified</li>
                      <li>• Important dates and deadlines</li>
                      <li>• Related case references</li>
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

      {selectedFiling && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold">Filing Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFiling(null)}
                >
                  ✕
                </Button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Title</p>
                    <p className="font-medium">{selectedFiling.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Filed Date</p>
                    <p>{selectedFiling.filedDate}</p>
                  </div>
                </div>
                {selectedFiling.dueDate && (
                  <div>
                    <p className="text-sm text-gray-400">Due Date</p>
                    <p>{selectedFiling.dueDate}</p>
                  </div>
                )}
                {selectedFiling.assignedTo && (
                  <div>
                    <p className="text-sm text-gray-400">Assigned To</p>
                    <p>{selectedFiling.assignedTo}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-400">Content</p>
                  <div 
                    className="mt-2 p-4 bg-gray-700 rounded-lg whitespace-pre-wrap"
                    onMouseUp={() => {
                      const selection = window.getSelection();
                      if (selection && selection.toString().trim()) {
                        handleExtractText(selection.toString().trim());
                      }
                    }}
                  >
                    {selectedFiling.content}
                  </div>
                </div>
                {selectedFiling.exhibits && selectedFiling.exhibits.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400">Exhibits</p>
                    <div className="mt-2 space-y-2">
                      {selectedFiling.exhibits.map((exhibit, index) => (
                        <div key={index} className="p-2 bg-gray-700 rounded-lg">
                          {exhibit}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedFiling.notes && (
                  <div>
                    <p className="text-sm text-gray-400">Notes</p>
                    <p className="mt-2 p-2 bg-gray-700 rounded-lg">{selectedFiling.notes}</p>
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

