'use client';

import { useState, useEffect } from 'react';
import { FileText, Search, Filter, Upload, FolderPlus, BarChart2, X, Mic, Mail, MessageSquare, Scale, FileSignature } from 'lucide-react';
import Link from 'next/link';
import { useDocumentProcessor } from '@/hooks/useDocumentProcessor';
import { Document, ProcessedDocument } from '@/types/document';
import { BatchUploadModal } from '@/components/BatchUploadModal';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { supabase } from '@/lib/supabase';

type DocumentRow = Database['public']['Tables']['documents']['Row'];

interface DocumentItem {
  id: string;
  title: string;
  modifiedAt: Date;
  size: string;
  caseNumber: string;
  content: string;
  status: DocumentRow['status'];
  type: string;
}

type RealtimeUpdatePayload = {
  id: string;
  status: DocumentRow['status'];
  [key: string]: any;
}

type RealtimePayload = RealtimePostgresChangesPayload<RealtimeUpdatePayload>;

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
  // ... add other document types as needed
} as const;

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [showBatchUpload, setShowBatchUpload] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadType, setUploadType] = useState<keyof typeof DOCUMENT_TYPES>('audio_transcript');

  const {
    processDocument,
    isProcessing,
    currentDocument,
    error: processingError,
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

  // Subscribe to document status updates
  useEffect(() => {
    const channel = supabase
      .channel('document-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'documents'
        },
        (payload: RealtimePayload) => {
          const newData = payload.new as RealtimeUpdatePayload;
          if (newData && newData.id && newData.status) {
            setDocuments(prev =>
              prev.map(doc =>
                doc.id === newData.id
                  ? { 
                      ...doc, 
                      status: newData.status
                    }
                  : doc
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Add connection validation on mount
  useEffect(() => {
    validateSupabaseConnection().then(({ isValid, error }) => {
      console.log('Supabase connection validation:', { isValid, error });
      if (!isValid) {
        setError(`Database connection error: ${error}`);
      }
    });
  }, []);

  // Load documents
  useEffect(() => {
    async function loadDocuments() {
      try {
        setIsLoading(true);
        setError(null);

        console.log('Fetching documents...', {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        });

        const { data, error: fetchError } = await supabase
          .from('documents')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.error('Supabase error:', {
            error: fetchError,
            message: fetchError.message,
            details: fetchError.details,
            hint: fetchError.hint
          });
          throw new Error(fetchError.message);
        }

        console.log('Documents data:', data);

        if (data) {
          const mappedDocs = data.map((doc: DocumentRow) => ({
            id: doc.id,
            title: doc.title,
            modifiedAt: new Date(doc.updated_at),
            size: doc.size || '0 B',
            caseNumber: doc.case_number || 'N/A',
            content: doc.content,
            status: doc.status,
            type: doc.type
          }));
          console.log('Mapped documents:', mappedDocs);
          setDocuments(mappedDocs);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load documents';
        console.error('Error loading documents:', {
          error: err,
          message: errorMessage,
          stack: err instanceof Error ? err.stack : undefined
        });
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    loadDocuments();
  }, []);

  const handleAnalyzeClick = async (doc: DocumentItem) => {
    setSelectedDocument(doc);
    setShowPreview(true);
    
    const documentForProcessing: Document = {
      id: doc.id,
      title: doc.title,
      content: doc.content,
      createdAt: doc.modifiedAt,
      updatedAt: doc.modifiedAt
    };

    await processDocument(documentForProcessing);
  };

  const handleBatchUploadComplete = () => {
    setShowBatchUpload(false);
    // Refresh documents list
    window.location.reload();
  };

  const renderAnalysisPreview = (processedDoc: ProcessedDocument) => {
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    // Filter files based on uploadType
    const validFiles = files.filter(file => {
      const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
      return DOCUMENT_TYPES[uploadType].acceptedFiles.includes(fileExt);
    });

    if (validFiles.length === 0) {
      setError('No valid files selected');
      return;
    }

    setShowBatchUpload(true);
    // Pass files to BatchUploadModal
    // You'll need to modify the BatchUploadModal to accept initialFiles
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Documents</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your legal documents and forms</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/documents/analysis"
            className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <BarChart2 className="w-5 h-5 mr-2" />
            Analyze Documents
          </Link>
          <button className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
            <FolderPlus className="w-5 h-5 mr-2" />
            New Folder
          </button>
          <button
            onClick={() => setShowBatchUpload(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Documents
          </button>
        </div>
      </div>

      {/* Add document type selector */}
      <div className="flex gap-2 mb-4">
        {Object.entries(DOCUMENT_TYPES).map(([type, config]) => (
          <button
            key={type}
            onClick={() => setUploadType(type as keyof typeof DOCUMENT_TYPES)}
            className={`flex items-center px-3 py-2 rounded-lg border ${
              uploadType === type 
                ? 'border-blue-600 bg-blue-50 text-blue-600' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <config.icon className={`w-4 h-4 mr-2 ${config.color}`} />
            {type.split('_').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </button>
        ))}
      </div>

      {/* Add drag and drop zone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors"
      >
        <div className="flex flex-col items-center">
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-xl font-medium text-gray-900 dark:text-gray-100">
            Drag and drop your {uploadType.split('_').join(' ')} files
          </p>
          <p className="text-sm text-gray-500 mt-2">
            or click to browse your computer
          </p>
          <input
            type="file"
            multiple
            accept={DOCUMENT_TYPES[uploadType].acceptedFiles}
            onChange={(e) => handleFiles(Array.from(e.target.files || []))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`p-4 ${
              doc.status === 'processing'
                ? 'opacity-60 bg-gray-50 dark:bg-gray-700/50'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center space-x-4">
              <FileText className={`w-8 h-8 ${
                doc.status === 'completed' ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {doc.title}
                  </p>
                  {doc.status === 'processing' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      Processing
                    </span>
                  )}
                  {doc.status === 'error' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      Error
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Modified {doc.modifiedAt.toLocaleTimeString()} • {doc.size} •{' '}
                  {doc.type}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
                  Case #{doc.caseNumber}
                </span>
                {doc.status === 'completed' && (
                  <button
                    onClick={() => handleAnalyzeClick(doc)}
                    className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <BarChart2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Batch Upload Modal */}
      <BatchUploadModal
        isOpen={showBatchUpload}
        onClose={() => setShowBatchUpload(false)}
        onUploadComplete={handleBatchUploadComplete}
      />

      {/* Analysis Preview Modal */}
      {showPreview && currentDocument && !isProcessing && renderAnalysisPreview(currentDocument)}

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 text-red-700 p-4 rounded-lg shadow-lg">
          <h3 className="font-medium">Analysis Error</h3>
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
