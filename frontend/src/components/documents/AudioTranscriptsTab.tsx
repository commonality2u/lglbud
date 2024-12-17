'use client'

import React from 'react';
import { Mic } from 'lucide-react';

export default function AudioTranscriptsTab() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Audio Transcripts</h2>
        <div className="flex gap-2">
          {/* Add audio transcript-specific actions here */}
        </div>
      </div>

      {/* Placeholder for audio transcripts list */}
      <div className="space-y-4">
        <div className="text-center py-8">
          <Mic className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No audio transcripts uploaded yet.</p>
          <p className="text-sm text-gray-400">
            Upload audio files to generate transcripts
          </p>
        </div>
      </div>
    </div>
  );
}

