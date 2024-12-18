'use client'

import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Download,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AudioTranscriptSetDetailViewProps {
  id: string;
  onBack: () => void;
}

export default function AudioTranscriptSetDetailView({
  id,
  onBack
}: AudioTranscriptSetDetailViewProps): React.ReactElement {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');

  useEffect(() => {
    // Fetch audio file and transcript data
    const fetchData = async () => {
      try {
        // Simulated API call
        const response = await fetch(`/api/audio-transcripts/${id}`);
        const data = await response.json();
        setAudioUrl(data.audioUrl);
        setTranscript(data.transcript);
      } catch (error) {
        console.error('Error fetching audio data:', error);
      }
    };

    void fetchData();
  }, [id]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = (): void => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (value: number): void => {
    setVolume(value);
    setIsMuted(value === 0);
  };

  const handleMuteToggle = (): void => {
    setIsMuted(!isMuted);
    setVolume(isMuted ? 1 : 0);
  };

  const handleTimelineClick = (value: number): void => {
    setCurrentTime(value);
  };

  const handleSkipBack = (): void => {
    setCurrentTime(Math.max(0, currentTime - 10));
  };

  const handleSkipForward = (): void => {
    setCurrentTime(Math.min(duration, currentTime + 10));
  };

  const handleDownload = async (): Promise<void> => {
    if (!audioUrl) return;
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transcript_${id}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading audio:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSkipBack}
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSkipForward}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMuteToggle}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              <div className="w-24">
                <Slider
                  value={[volume]}
                  min={0}
                  max={1}
                  step={0.1}
                  onValueChange={([value]) => handleVolumeChange(value)}
                />
              </div>
            </div>
          </div>
          <div>
            <Slider
              value={[currentTime]}
              min={0}
              max={duration}
              step={1}
              onValueChange={([value]) => handleTimelineClick(value)}
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Transcript</h3>
          <div className="space-y-2">
            {transcript.split('\n').map((line, i) => (
              <p key={i} className="text-sm">
                {line}
              </p>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

