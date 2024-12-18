import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, ArrowLeft, Mail, Users, Brain } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Email {
  id: string;
  sender: string;
  recipients: string;
  subject: string;
  dateTime: string;
  snippet: string;
  tags: string[];
}

interface EmailSet {
    id: string;
    totalEmails: number;
    dateRange: string;
    emails: Email[];
}


interface EmailSetDetailViewProps {
    emailSet: EmailSet;
    onBack: () => void;
}

const EmailSetDetailView: React.FC<EmailSetDetailViewProps> = ({ emailSet, onBack }) => {
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [filteredEmails, setFilteredEmails] = useState<Email[]>(emailSet.emails);
    const [extractedText, setExtractedText] = useState<string[]>([]);
    const [selectedSender, setSelectedSender] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [userNotes, setUserNotes] = useState('');

    useEffect(() => {
        let filtered = emailSet.emails;
        if (selectedSender) {
            filtered = filtered.filter(email => email.sender === selectedSender);
        }
        if (searchTerm) {
            filtered = filtered.filter(email => 
                email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                email.snippet.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredEmails(filtered);
    }, [selectedSender, searchTerm, emailSet.emails]);

    const handleViewEmail = (email: Email) => {
        setSelectedEmail(email);
    };

    const handleExtractText = (text: string) => {
        setExtractedText([...extractedText, text]);
    };

    const handleFilterBySender = (sender: string) => {
        setSelectedSender(sender === selectedSender ? null : sender);
    };

    const getSenderStats = () => {
        const stats = new Map<string, number>();
        emailSet.emails.forEach(email => {
            stats.set(email.sender, (stats.get(email.sender) || 0) + 1);
        });
        return Array.from(stats.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([sender, count]) => ({
                sender,
                count,
                percentage: (count / emailSet.emails.length) * 100
            }));
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
                            <Mail className="w-4 h-4" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="emailList" className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Email List
                        </TabsTrigger>
                        <TabsTrigger value="employeeBreakdown" className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Employee Breakdown
                        </TabsTrigger>
                        <TabsTrigger value="aiAnalysis" className="flex items-center gap-2">
                            <Brain className="w-4 h-4" />
                            AI Analysis
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="bg-gray-800 rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Email Set Overview</h2>
                                <div className="space-y-4">
                                    <div className="bg-gray-700 p-4 rounded-lg">
                                        <p className="text-sm text-gray-400">Total Emails</p>
                                        <p className="text-3xl font-bold">{emailSet.totalEmails}</p>
                                    </div>
                                    <div className="bg-gray-700 p-4 rounded-lg">
                                        <p className="text-sm text-gray-400">Date Range</p>
                                        <p className="text-lg">{emailSet.dateRange}</p>
                                    </div>
                                </div>
                                <Button className="mt-6" onClick={() => {}}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Email Set
                                </Button>
                            </div>
                            <div className="bg-gray-700 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-400">Unique Senders</p>
                                        <p className="text-2xl font-bold">
                                            {new Set(emailSet.emails.map(e => e.sender)).size}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Average Response Time</p>
                                        <p className="text-2xl font-bold">2.5 hours</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="emailList" className="bg-gray-800 rounded-lg p-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold">Email List</h2>
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="Search emails..."
                                        className="px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    {selectedSender && (
                                        <Button 
                                            variant="secondary"
                                            onClick={() => setSelectedSender(null)}
                                        >
                                            Clear Filter ({selectedSender})
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
                                            <TableHead>Subject</TableHead>
                                            <TableHead>Date/Time</TableHead>
                                            <TableHead>Snippet</TableHead>
                                            <TableHead>Tags</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredEmails.map((email) => (
                                            <TableRow 
                                                key={email.id}
                                                className="hover:bg-gray-800/50 cursor-pointer"
                                                onClick={() => handleViewEmail(email)}
                                            >
                                                <TableCell>{email.sender}</TableCell>
                                                <TableCell>{email.recipients}</TableCell>
                                                <TableCell className="font-medium">{email.subject}</TableCell>
                                                <TableCell>{email.dateTime}</TableCell>
                                                <TableCell className="max-w-xs truncate">{email.snippet}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-1 flex-wrap">
                                                        {email.tags.map((tag) => (
                                                            <span
                                                                key={tag}
                                                                className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button 
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleViewEmail(email);
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

                    <TabsContent value="employeeBreakdown" className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-6">Employee Breakdown</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                {getSenderStats().map(({ sender, count, percentage }) => (
                                    <div
                                        key={sender}
                                        className={`p-4 rounded-lg cursor-pointer transition-colors ${
                                            selectedSender === sender 
                                                ? 'bg-blue-500/20 border border-blue-500/50'
                                                : 'bg-gray-700 hover:bg-gray-700/80'
                                        }`}
                                        onClick={() => handleFilterBySender(sender)}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium">{sender}</span>
                                            <span className="text-sm text-gray-400">{count} emails</span>
                                        </div>
                                        <Progress value={percentage} className="h-2" />
                                    </div>
                                ))}
                            </div>
                            <div className="bg-gray-700 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Communication Patterns</h3>
                                {/* Placeholder for communication patterns visualization */}
                                <div className="h-64 flex items-center justify-center text-gray-400">
                                    Communication patterns visualization coming soon
                                </div>
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
                                            <li>• Most active discussion topics</li>
                                            <li>• Sentiment analysis</li>
                                            <li>• Important dates and deadlines</li>
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

            {selectedEmail && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xl font-bold">Email Details</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedEmail(null)}
                                >
                                    ✕
                                </Button>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-400">From</p>
                                        <p className="font-medium">{selectedEmail.sender}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Date/Time</p>
                                        <p>{selectedEmail.dateTime}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">To</p>
                                    <p>{selectedEmail.recipients}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Subject</p>
                                    <p className="font-medium">{selectedEmail.subject}</p>
                                </div>
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
                                        {selectedEmail.snippet}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Tags</p>
                                    <div className="flex gap-2 mt-2">
                                        {selectedEmail.tags.map((tag) => (
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailSetDetailView;
