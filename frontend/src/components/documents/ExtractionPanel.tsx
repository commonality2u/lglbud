'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';

interface ExtractionPanelProps {
  extractedText: string[];
  onRemove: (index: number) => void;
}

export default function ExtractionPanel({
  extractedText,
  onRemove
}: ExtractionPanelProps): React.ReactElement {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Extracted Information</h3>
        <div className="space-y-2">
          {extractedText.map((text, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
              <p className="text-sm flex-grow">{text}</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(index)}
                className="ml-2"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {extractedText.length === 0 && (
            <p className="text-sm text-gray-500">
              No text has been extracted yet. Select text from the document to extract it.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

