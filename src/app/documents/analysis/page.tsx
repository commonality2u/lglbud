'use client';

import React, { useState } from 'react';
import { useDocumentProcessor } from '@/hooks/useDocumentProcessor';
import { DocumentTimeline } from '@/components/DocumentTimeline';
import { DocumentAnalysis } from '@/components/DocumentAnalysis';
import { Document, Entity, CrossReference, TimelineEvent } from '@/types/document';

export default function DocumentAnalysisPage() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const {
    processDocument,
    isProcessing,
    currentDocument,
    error,
    clearProcessedDocument
  } = useDocumentProcessor({
    onProcessingComplete: (result) => {
      console.log('Document processing completed:', result);
    },
    onError: (error) => {
      console.error('Document processing failed:', error);
    }
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      const doc: Document = {
        id: `doc-${Date.now()}`,
        title: file.name,
        content,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setSelectedDocument(doc);
      await processDocument(doc);
    };
    reader.readAsText(file);
  };

  const handleEntityClick = (entity: Entity) => {
    if (!selectedDocument) return;
    
    // Find the entity in the original document content
    const start = entity.position.start;
    const end = entity.position.end;
    const context = selectedDocument.content.slice(
      Math.max(0, start - 100),
      Math.min(selectedDocument.content.length, end + 100)
    );
    
    console.log('Entity context:', {
      entity,
      context
    });
  };

  const handleCrossReferenceClick = (reference: CrossReference) => {
    console.log('Cross reference clicked:', reference);
  };

  const handleTimelineEventClick = (event: TimelineEvent) => {
    console.log('Timeline event clicked:', event);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Document Analysis</h1>
        <div className="flex items-center space-x-4">
          <label className="block">
            <span className="sr-only">Choose a document</span>
            <input
              type="file"
              accept=".txt,.doc,.docx,.pdf"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </label>
          {currentDocument && (
            <button
              onClick={clearProcessedDocument}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
            >
              Clear Results
            </button>
          )}
        </div>
      </div>

      {isProcessing && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          <span className="ml-3">Processing document...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8">
          <h3 className="font-medium">Processing Error</h3>
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      {currentDocument && (
        <div className="space-y-8">
          <DocumentAnalysis
            document={currentDocument}
            onEntityClick={handleEntityClick}
            onCrossReferenceClick={handleCrossReferenceClick}
          />
          
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-4">Document Timeline</h2>
            <DocumentTimeline
              events={currentDocument.timelineEvents}
              onEventClick={handleTimelineEventClick}
            />
          </div>
        </div>
      )}
    </div>
  );
} 