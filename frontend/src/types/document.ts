// Base document interface
export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

// Document processing types
export interface DocumentChunk {
  id: string;
  content: string;
  startIndex: number;
  endIndex: number;
  metadata: Record<string, any>;
}

export interface Entity {
  text: string;
  type: string;
  position: { start: number; end: number };
  confidence: number;
}

export interface TimelineEvent {
  date: Date;
  description: string;
  documentId: string;
  entityReferences: Entity[];
  confidence: number;
}

export interface CrossReference {
  sourceDocId: string;
  targetDocId: string;
  sourceText: string;
  targetText: string;
  type: string;
  confidence: number;
}

export interface ProcessedDocument {
  id: string;
  chunks: DocumentChunk[];
  entities: Entity[];
  timelineEvents: TimelineEvent[];
  crossReferences: CrossReference[];
  metadata: {
    processingDate: Date;
    processingStatus: 'pending' | 'processing' | 'completed' | 'error';
    errorMessage?: string;
    confidence: number;
  };
} 