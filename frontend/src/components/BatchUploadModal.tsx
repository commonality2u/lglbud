import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface BatchUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
  uploadType: string;
  caseNumber: string;
}

interface UploadResponse {
  message: string;
  file_url: string;
  document: {
    id: string;
    title: string;
    storage_path: string;
    [key: string]: unknown;
  };
}

interface FileStatus {
  status: 'idle' | 'uploading' | 'pending' | 'error';
  progress: number;
  error?: string;
}

export function BatchUploadModal({
  isOpen,
  onClose,
  onUploadComplete,
  uploadType,
  caseNumber
}: BatchUploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, FileStatus>>({});

  const uploadFile = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadType', uploadType);
    formData.append('caseNumber', caseNumber);

    // Set initial progress
    setUploadProgress(prev => ({
      ...prev,
      [file.name]: { status: 'uploading', progress: 0 }
    }));

    try {
      const xhr = new XMLHttpRequest();
      
      // Create a promise to handle the XHR request
      const uploadPromise = new Promise<UploadResponse>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: { 
                ...prev[file.name],
                progress,
                status: 'uploading'
              }
            }));
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: { 
                status: 'pending',
                progress: 100
              }
            }));
            resolve(response);
          } else {
            let errorMessage;
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              errorMessage = errorResponse.detail || 'Upload failed';
            } catch {
              errorMessage = 'Upload failed';
            }
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: { 
                status: 'error',
                progress: 0,
                error: errorMessage
              }
            }));
            reject(new Error(errorMessage));
          }
        });

        xhr.addEventListener('error', () => {
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: { 
              status: 'error',
              progress: 0,
              error: 'Network error occurred'
            }
          }));
          reject(new Error('Network error occurred'));
        });

        xhr.addEventListener('abort', () => {
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: { 
              status: 'error',
              progress: 0,
              error: 'Upload cancelled'
            }
          }));
          reject(new Error('Upload cancelled'));
        });

        // Open and send the request
        xhr.open('POST', '/api/upload');
        xhr.send(formData);
      });

      return await uploadPromise;
    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: { 
          status: 'error',
          progress: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
      throw error instanceof Error ? error : new Error('Unknown upload error');
    }
  };

  const handleUpload = async (files: File[]): Promise<void> => {
    setUploading(true);
    setError(null);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        
        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });
          
          if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
          }
          
          const result = await response.json();
          console.log('Upload successful:', result);
          
          // Update progress
          const progress = ((i + 1) / files.length) * 100;
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: { 
              status: 'pending',
              progress: progress
            }
          }));
        } catch (error) {
          console.error('Error uploading file:', error);
          setError(`Failed to upload ${file.name}`);
        }
      }
    } finally {
      setUploading(false);
      onClose();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(newFiles);
      setError(null);
      // Initialize progress for new files
      const newProgress: Record<string, FileStatus> = {};
      newFiles.forEach(file => {
        newProgress[file.name] = { status: 'idle', progress: 0 };
      });
      setUploadProgress(newProgress);
    }
  };

  const removeFile = (index: number) => {
    const removedFile = files[index];
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (removedFile) {
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[removedFile.name];
        return newProgress;
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload {uploadType.replace('_', ' ')} Documents</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors"
            role="region"
            aria-label="File upload area"
          >
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              aria-label="Choose files to upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-4" aria-hidden="true" />
              <span className="text-sm text-gray-600">
                Click to select files or drag and drop
              </span>
            </label>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Selected Files</h4>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="space-y-2 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm truncate flex-1">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </Button>
                  </div>
                  
                  {uploadProgress[file.name] && (
                    <div className="space-y-1">
                      <Progress 
                        value={uploadProgress[file.name].progress} 
                        className="h-1"
                      />
                      <div className="flex justify-between text-xs">
                        <span className={
                          uploadProgress[file.name].status === 'uploading' ? 'text-blue-500' :
                          uploadProgress[file.name].status === 'pending' ? 'text-green-500' :
                          uploadProgress[file.name].status === 'error' ? 'text-red-500' :
                          'text-gray-500'
                        }>
                          {uploadProgress[file.name].status.charAt(0).toUpperCase() + 
                           uploadProgress[file.name].status.slice(1)}
                          {uploadProgress[file.name].status === 'uploading' && '...'}
                        </span>
                        <span>{uploadProgress[file.name].progress}%</span>
                      </div>
                      {uploadProgress[file.name].error && (
                        <p className="text-xs text-red-500">
                          {uploadProgress[file.name].error}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {error && (
            <div 
              className="text-sm text-red-600"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleUpload(files)}
              disabled={uploading || files.length === 0}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 