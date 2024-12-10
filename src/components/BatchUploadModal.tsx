'use client';

import { useState, useCallback } from 'react';
import { Upload, X, AlertCircle, CheckCircle, FileText, Mail, Gavel, FileSignature, Scale } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface BatchUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  type: string;
  caseNumber?: string;
  metadata?: Record<string, any>;
}

const DOCUMENT_TYPES = [
  { 
    id: 'email', 
    label: 'Email Communication',
    icon: Mail,
    accepts: '.eml,.msg',
    description: 'Email threads and communications'
  },
  { 
    id: 'legal_filing', 
    label: 'Legal Filing',
    icon: Scale,
    accepts: '.pdf,.doc,.docx',
    description: 'Court filings, motions, and legal documents'
  },
  { 
    id: 'contract', 
    label: 'Contract',
    icon: FileSignature,
    accepts: '.pdf,.doc,.docx',
    description: 'Agreements, contracts, and legal instruments'
  },
  { 
    id: 'evidence', 
    label: 'Evidence Document',
    icon: FileText,
    accepts: '.pdf,.doc,.docx,.txt,.jpg,.png',
    description: 'Supporting evidence and documentation'
  },
  { 
    id: 'correspondence', 
    label: 'Legal Correspondence',
    icon: Mail,
    accepts: '.pdf,.doc,.docx,.txt',
    description: 'Letters, notices, and formal correspondence'
  },
  { 
    id: 'court_order', 
    label: 'Court Order',
    icon: Gavel,
    accepts: '.pdf,.doc,.docx',
    description: 'Orders, judgments, and court decisions'
  },
  { 
    id: 'transcript', 
    label: 'Transcript',
    icon: FileText,
    accepts: '.pdf,.doc,.docx,.txt',
    description: 'Court transcripts and recordings'
  }
];

export function BatchUploadModal({
  isOpen,
  onClose,
  onUploadComplete
}: BatchUploadModalProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [selectedType, setSelectedType] = useState(DOCUMENT_TYPES[0].id);
  const [caseNumber, setCaseNumber] = useState('');
  const [processingOptions, setProcessingOptions] = useState({
    extractEntities: true,
    generateTimeline: true,
    findCrossReferences: true,
    performOCR: false
  });
  const supabase = createClientComponentClient();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const selectedDocType = DOCUMENT_TYPES.find(t => t.id === selectedType);
    
    // Validate file types
    const validFiles = files.filter(file => {
      const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
      return selectedDocType?.accepts.includes(ext);
    });

    if (validFiles.length !== files.length) {
      alert('Some files were skipped because they are not supported for this document type.');
    }

    const newFiles: UploadingFile[] = validFiles.map(file => ({
      id: `${file.name}-${Date.now()}`,
      file,
      progress: 0,
      status: 'pending',
      type: selectedType,
      caseNumber,
      metadata: {
        processingOptions: { ...processingOptions },
        originalName: file.name,
        size: file.size,
        contentType: file.type
      }
    }));

    setUploadingFiles(prev => [...prev, ...newFiles]);
  };

  const uploadFile = async (uploadingFile: UploadingFile) => {
    try {
      // Update status to uploading
      setUploadingFiles(prev =>
        prev.map(f =>
          f.id === uploadingFile.id ? { ...f, status: 'uploading' } : f
        )
      );

      // Upload file to Supabase Storage
      const fileExt = uploadingFile.file.name.split('.').pop();
      const filePath = `${uploadingFile.type}/${uploadingFile.caseNumber || 'uncategorized'}/${uploadingFile.id}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('documents')
        .upload(filePath, uploadingFile.file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Update status to processing
      setUploadingFiles(prev =>
        prev.map(f =>
          f.id === uploadingFile.id ? { ...f, status: 'processing', progress: 50 } : f
        )
      );

      // Create document record in database
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          id: uploadingFile.id,
          title: uploadingFile.file.name,
          type: uploadingFile.type,
          case_number: uploadingFile.caseNumber,
          size: `${(uploadingFile.file.size / 1024 / 1024).toFixed(2)} MB`,
          status: 'processing',
          metadata: uploadingFile.metadata,
          storage_path: filePath
        });

      if (dbError) throw dbError;

      // Trigger backend processing
      const { error: processError } = await supabase.functions.invoke('process-document', {
        body: {
          fileUrl: publicUrl,
          documentType: uploadingFile.type,
          fileName: uploadingFile.file.name,
          documentId: uploadingFile.id,
          caseNumber: uploadingFile.caseNumber,
          processingOptions: uploadingFile.metadata?.processingOptions
        }
      });

      if (processError) throw processError;

      // Update status to completed
      setUploadingFiles(prev =>
        prev.map(f =>
          f.id === uploadingFile.id ? { ...f, status: 'completed', progress: 100 } : f
        )
      );
    } catch (error) {
      console.error('Upload error:', error);
      setUploadingFiles(prev =>
        prev.map(f =>
          f.id === uploadingFile.id
            ? { ...f, status: 'error', error: error.message }
            : f
        )
      );
    }
  };

  const handleUpload = async () => {
    if (!caseNumber.trim()) {
      alert('Please enter a case number');
      return;
    }

    const pendingFiles = uploadingFiles.filter(f => f.status === 'pending');
    await Promise.all(pendingFiles.map(uploadFile));
    onUploadComplete();
  };

  const removeFile = (fileId: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getDocumentTypeIcon = useCallback((type: string) => {
    const docType = DOCUMENT_TYPES.find(t => t.id === type);
    const Icon = docType?.icon || FileText;
    return <Icon className="w-5 h-5" />;
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Batch Upload Documents
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Case Number Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Case Number
              </label>
              <input
                type="text"
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                placeholder="Enter case number"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                  focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            {/* Document Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Document Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {DOCUMENT_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex items-start p-3 rounded-lg border ${
                      selectedType === type.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <type.icon className={`w-5 h-5 mt-0.5 ${
                      selectedType === type.id
                        ? 'text-blue-500'
                        : 'text-gray-400'
                    }`} />
                    <div className="ml-3 text-left">
                      <p className={`text-sm font-medium ${
                        selectedType === type.id
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {type.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {type.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Processing Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Processing Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={processingOptions.extractEntities}
                    onChange={(e) => setProcessingOptions(prev => ({
                      ...prev,
                      extractEntities: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Extract entities (names, dates, citations)
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={processingOptions.generateTimeline}
                    onChange={(e) => setProcessingOptions(prev => ({
                      ...prev,
                      generateTimeline: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Generate document timeline
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={processingOptions.findCrossReferences}
                    onChange={(e) => setProcessingOptions(prev => ({
                      ...prev,
                      findCrossReferences: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Find cross-references
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={processingOptions.performOCR}
                    onChange={(e) => setProcessingOptions(prev => ({
                      ...prev,
                      performOCR: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Perform OCR on scanned documents
                  </span>
                </label>
              </div>
            </div>

            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept={DOCUMENT_TYPES.find(t => t.id === selectedType)?.accepts}
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <Upload className="w-12 h-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Click to select files or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Supported formats: {DOCUMENT_TYPES.find(t => t.id === selectedType)?.accepts}
                </p>
              </label>
            </div>

            {/* File List */}
            {uploadingFiles.length > 0 && (
              <div className="space-y-3">
                {uploadingFiles.map(file => (
                  <div
                    key={file.id}
                    className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      {getDocumentTypeIcon(file.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {file.file.name}
                        </p>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB •{' '}
                        {DOCUMENT_TYPES.find(t => t.id === file.type)?.label}
                      </p>
                      {/* Progress Bar */}
                      <div className="mt-2 h-1.5 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            file.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                      {/* Status */}
                      <div className="mt-1 flex items-center space-x-2">
                        {file.status === 'error' ? (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        ) : file.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : null}
                        <span className="text-xs capitalize text-gray-500 dark:text-gray-400">
                          {file.status}
                          {file.error && `: ${file.error}`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 
                  dark:text-gray-300 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploadingFiles.length === 0 || !caseNumber.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg 
                  hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload & Process
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 