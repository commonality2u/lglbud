'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2, Trash2 } from 'lucide-react';

interface AudioTranscriptSetDetailViewProps {
  id: string;
  onBack: () => void;
}

export default function AudioTranscriptSetDetailView({ id, onBack }: AudioTranscriptSetDetailViewProps) {
  // This would typically fetch the audio transcript set details from your backend
  const transcriptSet = {
    id,
    name: 'Audio Transcript Set',
    uploadDate: new Date().toLocaleDateString(),
    status: 'Transcribed',
    count: 1,
    source: 'Zoom Recording',
    tags: ['Meeting', '2024', 'Transcribed'],
    transcripts: [
      {
        id: '1',
        title: 'Meeting Recording',
        duration: '1:30:00',
        speakerCount: 4,
        confidenceScore: 0.95,
        hasTimestamps: true
      },
      // Add more sample transcripts as needed
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
          <h2 className="text-2xl font-bold">{transcriptSet.name}</h2>
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
          <p className="font-medium">{transcriptSet.uploadDate}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
          <p className="font-medium">{transcriptSet.status}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Transcript Count</p>
          <p className="font-medium">{transcriptSet.count}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Source</p>
          <p className="font-medium">{transcriptSet.source}</p>
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {transcriptSet.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Transcripts List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Transcripts</h3>
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
          {transcriptSet.transcripts.map(transcript => (
            <div
              key={transcript.id}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-medium">{transcript.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Duration: {transcript.duration}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Speakers: {transcript.speakerCount}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Confidence: {(transcript.confidenceScore * 100).toFixed(1)}%
                  </span>
                  {transcript.hasTimestamps && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Timestamped
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

