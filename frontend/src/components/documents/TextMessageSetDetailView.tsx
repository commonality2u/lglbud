'use client'

import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2, Trash2, MessageSquare, Users, Brain } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  hasAttachments: boolean;
  threadCount: number;
  reactions: string[];
  recipients?: string[];
}

interface TextMessageSet {
  id: string;
  name: string;
  uploadDate: string;
  status: string;
  count: number;
  source: string;
  tags: string[];
  messages: Message[];
  dateRange: string;
  participants: string[];
}

interface TextMessageSetDetailViewProps {
  id: string;
  onBack: () => void;
}

export default function TextMessageSetDetailView({ id, onBack }: TextMessageSetDetailViewProps) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [extractedText, setExtractedText] = useState<string[]>([]);
  const [userNotes, setUserNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);

  // This would typically fetch the text message set details from your backend
  const messageSet: TextMessageSet = {
    id,
    name: 'Text Message Set',
    uploadDate: new Date().toLocaleDateString(),
    status: 'Processed',
    count: 500,
    source: 'Slack Export',
    tags: ['Project', 'Team Chat', '2024'],
    dateRange: 'Jan 1, 2024 - Jan 15, 2024',
    participants: ['John Doe', 'Jane Smith', 'Bob Johnson'],
    messages: [
      {
        id: '1',
        sender: 'John Doe',
        content: 'Project update: Phase 1 complete',
        timestamp: '2024-01-15T09:30:00',
        hasAttachments: true,
        threadCount: 5,
        reactions: ['👍', '🎉'],
        recipients: ['Jane Smith', 'Bob Johnson']
      },
      // Add more sample messages as needed
    ]
  };

  const filteredMessages = messageSet.messages.filter(message => {
    const matchesSearch = searchTerm === '' || 
      message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.sender.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesParticipant = !selectedParticipant || 
      message.sender === selectedParticipant ||
      message.recipients?.includes(selectedParticipant);

    return matchesSearch && matchesParticipant;
  });

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
  };

  const handleExtractText = (text: string) => {
    setExtractedText([...extractedText, text]);
  };

  const handleParticipantFilter = (participant: string) => {
    setSelectedParticipant(participant === selectedParticipant ? null : participant);
  };

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
              <MessageSquare className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
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
                <h2 className="text-2xl font-bold mb-4">Message Set Overview</h2>
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Total Messages</p>
                    <p className="text-3xl font-bold">{messageSet.count}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Date Range</p>
                    <p className="text-lg">{messageSet.dateRange}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Participants</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {messageSet.participants.map(participant => (
                        <span
                          key={participant}
                          className="px-2 py-1 text-sm rounded-full bg-blue-500/20 text-blue-400"
                        >
                          {participant}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <Button className="flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Export Messages
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Most Active Participant</p>
                    <p className="text-2xl font-bold">John Doe</p>
                    <p className="text-sm text-gray-400">150 messages</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Peak Activity Period</p>
                    <p className="text-2xl font-bold">9:00 AM - 11:00 AM</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Attachments</p>
                    <p className="text-2xl font-bold">25</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="bg-gray-800 rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Messages</h2>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {selectedParticipant && (
                    <Button 
                      variant="secondary"
                      onClick={() => setSelectedParticipant(null)}
                    >
                      Clear Filter ({selectedParticipant})
                    </Button>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-gray-700 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-gray-800/50">
                      <TableHead>Sender</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages.map((message) => (
                      <TableRow 
                        key={message.id}
                        className="hover:bg-gray-800/50 cursor-pointer"
                        onClick={() => handleViewMessage(message)}
                      >
                        <TableCell>{message.sender}</TableCell>
                        <TableCell>{message.recipients?.join(', ')}</TableCell>
                        <TableCell className="max-w-xs truncate">{message.content}</TableCell>
                        <TableCell>{new Date(message.timestamp).toLocaleString()}</TableCell>
                        <TableCell>
                          <Button 
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewMessage(message);
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
                      <li>• Most discussed topics</li>
                      <li>• Sentiment trends</li>
                      <li>• Communication patterns</li>
                      <li>• Action items identified</li>
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

      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold">Message Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMessage(null)}
                >
                  ✕
                </Button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">From</p>
                    <p className="font-medium">{selectedMessage.sender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Time</p>
                    <p>{new Date(selectedMessage.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">To</p>
                  <p>{selectedMessage.recipients?.join(', ') || 'All participants'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Message</p>
                  <div 
                    className="mt-2 p-4 bg-gray-700 rounded-lg whitespace-pre-wrap"
                    onMouseUp={() => {
                      const selection = window.getSelection();
                      if (selection && selection.toString().trim()) {
                        handleExtractText(selection.toString().trim());
                      }
                    }}
                  >
                    {selectedMessage.content}
                  </div>
                </div>
                {selectedMessage.hasAttachments && (
                  <div>
                    <p className="text-sm text-gray-400">Attachments</p>
                    <div className="mt-2 p-2 bg-gray-700 rounded-lg">
                      <span className="text-sm">Has attachments</span>
                    </div>
                  </div>
                )}
                {selectedMessage.reactions.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400">Reactions</p>
                    <div className="flex gap-2 mt-2">
                      {selectedMessage.reactions.map((reaction, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-lg bg-gray-700 rounded-lg"
                        >
                          {reaction}
                        </span>
                      ))}
                    </div>
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

