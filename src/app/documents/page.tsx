'use client';

import { useState, useEffect } from 'react';
import { FileText, Search, Filter, Upload, FolderPlus, BarChart2, X } from 'lucide-react';
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

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [showBatchUpload, setShowBatchUpload] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Load documents
  useEffect(() => {
    async function loadDocuments() {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('documents')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        if (data) {
          setDocuments(
            data.map((doc: DocumentRow) => ({
              id: doc.id,
              title: doc.title,
              modifiedAt: new Date(doc.updated_at),
              size: doc.size || '0 B',
              caseNumber: doc.case_number || 'N/A',
              content: doc.content,
              status: doc.status,
              type: doc.type
            }))
          );
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load documents';
        console.error('Error loading documents:', err);
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
