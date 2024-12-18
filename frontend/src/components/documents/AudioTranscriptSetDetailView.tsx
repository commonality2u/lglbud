'use client'

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2, Trash2, Mic, Play, Pause, Brain } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface Transcript {
  id: string;
  title: string;
  duration: string;
  speakerCount: number;
  confidenceScore: number;
  hasTimestamps: boolean;
  content: string;
  speakers: string[];
  segments: Array<{
    speaker: string;
    timestamp: string;
    text: string;
  }>;
}

interface AudioTranscriptSet {
  id: string;
  name: string;
  uploadDate: string;
  status: string;
  count: number;
  source: string;
  tags: string[];
  transcripts: Transcript[];
  duration: string;
  totalSpeakers: number;
  averageConfidence: number;
}

interface AudioTranscriptSetDetailViewProps {
  id: string;
  onBack: () => void;
}

export default function AudioTranscriptSetDetailView({ id, onBack }: AudioTranscriptSetDetailViewProps) {
  const [selectedTranscript, setSelectedTranscript] = useState<Transcript | null>(null);
  const [extractedText, setExtractedText] = useState<string[]>([]);
  const [userNotes, setUserNotes] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // This would typically fetch the audio transcript set details from your backend
  const transcriptSet: AudioTranscriptSet = {
    id,
    name: 'Audio Transcript Set',
    uploadDate: new Date().toLocaleDateString(),
    status: 'Transcribed',
    count: 1,
    source: 'Zoom Recording',
    tags: ['Meeting', '2024', 'Transcribed'],
    duration: '1:30:00',
    totalSpeakers: 4,
    averageConfidence: 0.95,
    transcripts: [
      {
        id: '1',
        title: 'Meeting Recording',
        duration: '1:30:00',
        speakerCount: 4,
        confidenceScore: 0.95,
        hasTimestamps: true,
        content: 'Full transcript content...',
        speakers: ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown'],
        segments: [
          {
            speaker: 'John Doe',
            timestamp: '00:00:00',
            text: 'Welcome everyone to the meeting.'
          },
          {
            speaker: 'Jane Smith',
            timestamp: '00:00:05',
            text: 'Thanks for having us.'
          },
          // Add more segments as needed
        ]
      }
    ]
  };

  const handleExtractText = (text: string) => {
    setExtractedText([...extractedText, text]);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
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
              <Mic className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
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
                <h2 className="text-2xl font-bold mb-4">Audio Transcript Overview</h2>
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Duration</p>
                    <p className="text-3xl font-bold">{transcriptSet.duration}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Total Speakers</p>
                    <p className="text-3xl font-bold">{transcriptSet.totalSpeakers}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Average Confidence</p>
                    <p className="text-3xl font-bold">
                      {(transcriptSet.averageConfidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <Button className="flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Export Transcript
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Speaker Breakdown</h3>
                  {transcriptSet.transcripts[0].speakers.map((speaker, index) => (
                    <div key={speaker} className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{speaker}</span>
                        <span>25%</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                  ))}
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {transcriptSet.tags.map(tag => (
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
            <div className="space-y-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 rounded-full"
                      onClick={togglePlayback}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <span className="text-sm">
                      {new Date(currentTime * 1000).toISOString().substr(11, 8)}
                    </span>
                  </div>
                  <Progress value={(currentTime / (90 * 60)) * 100} className="w-full max-w-md h-2" />
                  <span className="text-sm">{transcriptSet.duration}</span>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg">
                <div 
                  className="p-4 space-y-4"
                  onMouseUp={() => {
                    const selection = window.getSelection();
                    if (selection && selection.toString().trim()) {
                      handleExtractText(selection.toString().trim());
                    }
                  }}
                >
                  {transcriptSet.transcripts[0].segments.map((segment, index) => (
                    <div 
                      key={index}
                      className="group flex gap-4 p-2 hover:bg-gray-600/50 rounded-lg"
                    >
                      <div className="w-32 flex-shrink-0">
                        <div className="text-sm text-gray-400">{segment.timestamp}</div>
                        <div className="text-sm font-medium">{segment.speaker}</div>
                      </div>
                      <div className="flex-grow">
                        <p className="text-gray-100">{segment.text}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          // Handle playing from timestamp
                        }}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
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
                      <li>• Main discussion topics</li>
                      <li>• Speaker sentiment analysis</li>
                      <li>• Action items identified</li>
                      <li>• Key decisions made</li>
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
    </div>
  );
}

