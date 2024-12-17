'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { FileText, Upload, BarChart2, X, Mic, Mail, MessageSquare, Scale, FileSignature } from 'lucide-react';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { supabase } from '@/lib/supabase';
import { useDocumentProcessor } from '@/hooks/useDocumentProcessor';
import type { Document, ProcessedDocument } from '@/types/document';
import { BatchUploadModal } from '@/components/BatchUploadModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailsTab from '@/components/documents/EmailsTab';
import LegalFilingsTab from '@/components/documents/LegalFilingsTab';
import AudioTranscriptsTab from '@/components/documents/AudioTranscriptsTab';
import TextMessagesTab from '@/components/documents/TextMessagesTab';
import InvoicesTab from '@/components/documents/InvoicesTab';
import ExtractionPanel from '@/components/documents/ExtractionPanel';
import DocumentList from '@/components/documents/DocumentList';
import AudioTranscriptSetDetailView from '@/components/documents/AudioTranscriptSetDetailView';
import EmailSetDetailView from '@/components/documents/EmailSetDetailView';
import InvoiceSetDetailView from '@/components/documents/InvoiceSetDetailView';
import LegalFilingSetDetailView from '@/components/documents/LegalFilingSetDetailView';
import TextMessageSetDetailView from '@/components/documents/TextMessageSetDetailView';
import type { ReactElement } from 'react';

type DocumentRow = Database['public']['Tables']['documents']['Row'];

type DocumentType = keyof typeof DOCUMENT_TYPES;

interface DocumentItem {
  id: string;
  title: string;
  modifiedAt: Date;
  size: string;
  caseNumber: string;
  content: string | null;
  status: DocumentRow['status'];
  type: DocumentType;
  sender?: string;
  duration?: string;
  name: string;
  uploadDate: string;
  source?: string;
  tags?: string[];
}

type RealtimeUpdatePayload = {
  id: string;
  status: DocumentRow['status'];
  [key: string]: any;
}

type RealtimePayload = RealtimePostgresChangesPayload<{
  old: { [key: string]: any };
  new: RealtimeUpdatePayload;
}>;

const DOCUMENT_TYPES = {
  audio_transcript: {
    icon: Mic,
    acceptedFiles: '.mp3,.wav,.m4a',
    color: 'text-purple-600'
  },
  email: {
    icon: Mail,
    acceptedFiles: '.eml,.msg',
    color: 'text-blue-600'
  },
  text_message: {
    icon: MessageSquare,
    acceptedFiles: '.txt,.csv',
    color: 'text-green-600'
  },
  court_document: {
    icon: Scale,
    acceptedFiles: '.pdf,.doc,.docx',
    color: 'text-red-600'
  },
  legal_filing: {
    icon: FileSignature,
    acceptedFiles: '.pdf,.doc,.docx',
    color: 'text-orange-600'
  },
  invoice: {
    icon: FileText,
    acceptedFiles: '.pdf,.doc,.docx',
    color: 'text-yellow-600'
  }
} as const;

const DOCUMENT_COLUMNS = {
  audio_transcript: [
    { key: 'title', label: 'Title' },
    { key: 'modifiedAt', label: 'Date Recorded' },
    { key: 'caseNumber', label: 'Case Number' },
    { key: 'size', label: 'Duration' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ],
  email: [
    { key: 'title', label: 'Subject' },
    { key: 'modifiedAt', label: 'Date Received' },
    { key: 'caseNumber', label: 'Case Number' },
    { key: 'sender', label: 'From' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ],
  text_message: [
    { key: 'title', label: 'Content' },
    { key: 'modifiedAt', label: 'Date Sent' },
    { key: 'caseNumber', label: 'Case Number' },
    { key: 'sender', label: 'From' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ],
  court_document: [
    { key: 'title', label: 'Document Title' },
    { key: 'modifiedAt', label: 'Filing Date' },
    { key: 'caseNumber', label: 'Case Number' },
    { key: 'size', label: 'Size' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ],
  legal_filing: [
    { key: 'title', label: 'Filing Title' },
    { key: 'modifiedAt', label: 'Filing Date' },
    { key: 'caseNumber', label: 'Case Number' },
    { key: 'size', label: 'Size' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ],
} as const;

export default function DocumentsPage(): ReactElement {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<keyof typeof DOCUMENT_TYPES>('audio_transcript');
  const [uploadType, setUploadType] = useState<keyof typeof DOCUMENT_TYPES>('audio_transcript');
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  const {
    processDocument,
    isProcessing,
    currentDocument,
    clearProcessedDocument
  } = useDocumentProcessor({
    onProcessingComplete: (result) => {
      console.log('Document processing completed:', result);
    },
    onError: (error) => {
      console.error('Document processing failed:', error);
      setError(error.message);
    }
  });

  // Memoize loadDocuments callback
  const loadDocuments = useCallback(async (type?: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      if (data) {
        const mappedDocs = data.map((doc: DocumentRow) => ({
          id: doc.id,
          title: doc.title,
          name: doc.title,
          modifiedAt: new Date(doc.updated_at),
          uploadDate: new Date(doc.updated_at).toLocaleDateString(),
          size: doc.size || '0 B',
          caseNumber: doc.case_number || 'N/A',
          content: doc.content || '',
          status: doc.status,
          type: doc.type as DocumentType,
          source: 'System Upload',
          tags: []
        }));
        setDocuments(mappedDocs);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load documents';
      console.error('Error loading documents:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Memoize filtered documents
  const filteredDocuments = useMemo(() => 
    documents.filter(doc => doc.type === activeTab),
    [documents, activeTab]
  );

  // Memoize handlers
  const handleTabChange = useCallback((type: keyof typeof DOCUMENT_TYPES) => {
    setActiveTab(type);
    setUploadType(type);
  }, []);

  const handleUploadComplete = useCallback(async () => {
    setShowUploadModal(false);
    await loadDocuments(activeTab);
  }, [activeTab, loadDocuments]);

  const handleRowClick = useCallback((id: string) => {
    setSelectedDocumentId(id);
    setShowDetailView(true);
  }, []);

  const handleBackFromDetail = useCallback(() => {
    setSelectedDocumentId(null);
    setShowDetailView(false);
  }, []);

  const handleEditTags = useCallback((id: string) => {
    // TODO: Implement tag editing functionality
    console.log('Edit tags for document:', id);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete document';
      setError(errorMessage);
    }
  }, []);

  // Initial load
  useEffect(() => {
    void loadDocuments(activeTab);
  }, [activeTab, loadDocuments]);

  // Subscribe to document updates
  useEffect(() => {
    const channel = supabase
      .channel('document-updates')
      .on<RealtimeUpdatePayload>(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'documents'
        },
        (payload: RealtimePayload) => {
          const newData = payload.new;
          if (newData?.id && newData?.status) {
            setDocuments(prev =>
              prev.map(doc =>
                doc.id === newData.id
                  ? { ...doc, status: newData.status }
                  : doc
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const handleAnalyzeClick = useCallback(async (doc: DocumentItem): Promise<void> => {
    setSelectedDocument(doc);
    setShowPreview(true);
    
    const documentForProcessing: Document = {
      id: doc.id,
      title: doc.title,
      content: doc.content || '',
      createdAt: doc.modifiedAt,
      updatedAt: doc.modifiedAt
    };

    await processDocument(documentForProcessing);
  }, [processDocument]);

  const renderAnalysisPreview = (processedDoc: ProcessedDocument): ReactElement => {
    const entityCount = processedDoc.entities.length;
    const timelineEventCount = processedDoc.timelineEvents.length;
    const crossRefCount = processedDoc.crossReferences.length;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Quick Analysis: {selectedDocument?.title}
              </h3>
              <button
                onClick={() => {
                  setShowPreview(false);
                  clearProcessedDocument();
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Analysis Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {entityCount}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Entities Found
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {timelineEventCount}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    Timeline Events
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {crossRefCount}
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">
                    Cross References
                  </div>
                </div>
              </div>

              {/* Key Entities */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Key Entities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {processedDoc.entities.slice(0, 5).map((entity, index) => (
                    <span
                      key={`${entity.text}-${index}`}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    >
                      {entity.text}
                    </span>
                  ))}
                  {processedDoc.entities.length > 5 && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      +{processedDoc.entities.length - 5} more
                    </span>
                  )}
                </div>
              </div>

              {/* Timeline Preview */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Timeline Preview
                </h4>
                <div className="space-y-2">
                  {processedDoc.timelineEvents.slice(0, 3).map((event, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-600 dark:text-gray-300"
                    >
                      {event.date.toLocaleDateString()}: {event.description}
                    </div>
                  ))}
                  {processedDoc.timelineEvents.length > 3 && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      +{processedDoc.timelineEvents.length - 3} more events
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowPreview(false);
                    clearProcessedDocument();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200"
                >
                  Close
                </button>
                <Link
                  href={`/documents/analysis?id=${processedDoc.id}`}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  View Full Analysis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
    }
  }, []);

  const handleFiles = useCallback(async (files: File[]): Promise<void> => {
    try {
      // Filter files based on uploadType
      const validFiles = files.filter(file => {
        const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
        return DOCUMENT_TYPES[uploadType].acceptedFiles.includes(fileExt);
      });

      if (validFiles.length === 0) {
        setError('No valid files selected');
        return;
      }

      setShowUploadModal(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process files';
      setError(errorMessage);
    }
  }, [uploadType]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    void handleFiles(files);
  }, [handleFiles]);

  const renderDetailView = () => {
    const doc = documents.find(d => d.id === selectedDocumentId);
    if (!doc) return null;

    const type = doc.type as DocumentType;
    switch (type) {
      case 'audio_transcript':
        return <AudioTranscriptSetDetailView id={doc.id} onBack={handleBackFromDetail} />;
      case 'email':
        return <EmailSetDetailView id={doc.id} onBack={handleBackFromDetail} />;
      case 'invoice':
        return <InvoiceSetDetailView id={doc.id} onBack={handleBackFromDetail} />;
      case 'legal_filing':
        return <LegalFilingSetDetailView id={doc.id} onBack={handleBackFromDetail} />;
      case 'text_message':
        return <TextMessageSetDetailView id={doc.id} onBack={handleBackFromDetail} />;
      default:
        return null;
    }
  };

  const renderEmptyState = () => {
    const type = activeTab as DocumentType;
    switch (type) {
      case 'audio_transcript':
        return <AudioTranscriptsTab />;
      case 'email':
        return <EmailsTab />;
      case 'invoice':
        return <InvoicesTab />;
      case 'legal_filing':
        return <LegalFilingsTab />;
      case 'text_message':
        return <TextMessagesTab />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="container mx-auto" 
      onMouseUp={handleTextSelection}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {showDetailView ? (
        renderDetailView()
      ) : (
        <>
          {/* Header - flush with top */}
          <div className="px-6">
            <div className="flex justify-between items-center" style={{ marginTop: '-18px' }}>
              <h1 className="text-2xl font-bold text-white">Documents</h1>
              <div className="flex gap-3">
                <button 
                  className="inline-flex items-center h-7 px-4 bg-gray-800/50 text-gray-200 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <BarChart2 className="w-4 h-4 mr-2" />
                  Analyze Documents
                </button>
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center h-7 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Documents
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 pt-6 flex gap-6">
            {/* Main Content */}
            <div className="flex-1">
              <Tabs
                defaultValue={activeTab}
                value={activeTab}
                onValueChange={(value) => {
                  const docType = value as DocumentType;
                  if (Object.keys(DOCUMENT_TYPES).includes(docType)) {
                    handleTabChange(docType);
                  }
                }}
                className="w-full"
              >
                <TabsList className="w-full flex justify-center">
                  {Object.entries(DOCUMENT_TYPES).map(([type, config]) => (
                    <TabsTrigger
                      key={type}
                      value={type}
                      className="flex items-center h-9 px-4 text-sm gap-2 min-w-[140px] justify-center
                        rounded-md border border-gray-700/50 transition-colors mx-0.5 first:ml-0 last:mr-0
                        data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=active]:border-gray-600
                        data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-400 
                        hover:text-gray-300 hover:bg-gray-800/20
                        focus:outline-none focus:ring-1 focus:ring-gray-600"
                    >
                      <config.icon className={`w-4 h-4 ${config.color}`} />
                      <span>
                        {type.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.keys(DOCUMENT_TYPES).map((type) => {
                  const docType = type as DocumentType;
                  return (
                    <TabsContent 
                      key={type} 
                      value={type}
                      className="bg-gray-800/95 border border-gray-700 rounded-b-lg p-4"
                    >
                      {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mb-3"></div>
                          <span className="ml-3 text-gray-400">Loading documents...</span>
                        </div>
                      ) : documents.length === 0 ? (
                        renderEmptyState()
                      ) : (
                        <DocumentList
                          documents={filteredDocuments}
                          onRowClick={handleRowClick}
                          onEditTags={handleEditTags}
                          onDelete={handleDelete}
                          columns={DOCUMENT_COLUMNS[docType].map(col => col.key)}
                        />
                      )}
                    </TabsContent>
                  );
                })}
              </Tabs>
            </div>

            {/* Extraction Panel */}
            <div className="w-80">
              <ExtractionPanel />
            </div>
          </div>
        </>
      )}

      {/* Modals and Error Messages */}
      <BatchUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadComplete={handleUploadComplete}
      />

      {showPreview && currentDocument && !isProcessing && renderAnalysisPreview(currentDocument)}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 text-red-700 p-4 rounded-lg shadow-lg">
          <h3 className="font-medium">Analysis Error</h3>
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
