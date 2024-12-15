import { useState, useCallback } from 'react';
import { Document } from '@/types/document';
import { DocumentProcessor } from '@/lib/documentProcessing';
import {
  ProcessedDocument,
  DocumentChunk,
  Entity,
  TimelineEvent,
  CrossReference
} from '@/types/document';

interface UseDocumentProcessorProps {
  onProcessingComplete?: (result: ProcessedDocument) => void;
  onError?: (error: Error) => void;
}

export const useDocumentProcessor = ({
  onProcessingComplete,
  onError
}: UseDocumentProcessorProps = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<ProcessedDocument | null>(
    null
  );
  const [error, setError] = useState<Error | null>(null);

  const processDocument = useCallback(
    async (document: Document) => {
      setIsProcessing(true);
      setError(null);

      try {
        // Initialize processed document
        const processedDoc: ProcessedDocument = {
          id: document.id,
          chunks: [],
          entities: [],
          timelineEvents: [],
          crossReferences: [],
          metadata: {
            processingDate: new Date(),
            processingStatus: 'processing',
            confidence: 0
          }
        };

        // Step 1: Chunk the document
        const chunks = DocumentProcessor.chunkDocument(document.content);
        processedDoc.chunks = chunks;

        // Step 2: Extract entities
        const entities = await DocumentProcessor.extractEntities(document.content);
        processedDoc.entities = entities;

        // Step 3: Construct timeline
        const timelineEvents = await DocumentProcessor.constructTimeline(
          document,
          entities
        );
        processedDoc.timelineEvents = timelineEvents;

        // Step 4: Find patterns and cross-references
        const crossReferences = await DocumentProcessor.findPatterns([document]);
        processedDoc.crossReferences = crossReferences;

        // Calculate overall confidence
        const confidenceScores = [
          ...entities.map(e => e.confidence),
          ...timelineEvents.map(e => e.confidence),
          ...crossReferences.map(r => r.confidence)
        ];
        const averageConfidence =
          confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length;

        // Update metadata
        processedDoc.metadata = {
          ...processedDoc.metadata,
          processingStatus: 'completed',
          confidence: averageConfidence
        };

        setCurrentDocument(processedDoc);
        onProcessingComplete?.(processedDoc);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Processing failed');
        setError(error);
        onError?.(error);
      } finally {
        setIsProcessing(false);
      }
    },
    [onProcessingComplete, onError]
  );

  const clearProcessedDocument = useCallback(() => {
    setCurrentDocument(null);
    setError(null);
  }, []);

  return {
    processDocument,
    clearProcessedDocument,
    isProcessing,
    currentDocument,
    error
  };
};
