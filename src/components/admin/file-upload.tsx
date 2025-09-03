'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, CheckCircle, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { validateImageFile, getFilePreview, formatFileSize } from '@/lib/upload-utils';

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  onUploadError?: (error: string) => void;
  maxFiles?: number;
  disabled?: boolean;
}

interface FileWithPreview extends File {
  preview?: string;
}

export function FileUpload({ 
  onUploadComplete, 
  onUploadError, 
  maxFiles = 5,
  disabled = false 
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const uploadFile = async (file: FileWithPreview) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
      
      const response = await fetch('/api/upload/images', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
      onUploadComplete(result.url);
      
      // Remove from uploaded files after successful upload
      setTimeout(() => {
        setUploadedFiles(prev => prev.filter(f => f.name !== file.name));
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      onUploadError?.(errorMessage);
      
      // Remove failed file
      setUploadedFiles(prev => prev.filter(f => f.name !== file.name));
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[file.name];
        return newProgress;
      });
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled) return;

    setUploading(true);
    
    const validFiles: FileWithPreview[] = [];
    
    for (const file of acceptedFiles) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        onUploadError?.(validation.error || 'Invalid file');
        continue;
      }

      try {
        const preview = await getFilePreview(file);
        const fileWithPreview = Object.assign(file, { preview });
        validFiles.push(fileWithPreview);
      } catch (error) {
        console.error('Preview error:', error);
        onUploadError?.('Failed to generate preview');
      }
    }

    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      
      // Upload files sequentially
      for (const file of validFiles) {
        await uploadFile(file);
      }
    }
    
    setUploading(false);
  }, [disabled, onUploadComplete, onUploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles,
    disabled: disabled || uploading,
    multiple: true
  });

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-2">
          {uploading ? (
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-gray-400" />
          )}
          
          <div>
            <p className="text-sm font-medium text-gray-900">
              {isDragActive ? 'Drop images here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG, GIF, WebP up to 5MB each
            </p>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploading Files</h4>
          {uploadedFiles.map((file) => {
            const progress = uploadProgress[file.name] || 0;
            const isComplete = progress === 100;
            
            return (
              <div key={file.name} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                {/* Preview */}
                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isComplete ? 'bg-green-500' : 'bg-primary-600'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center space-x-2">
                  {isComplete ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : progress > 0 ? (
                    <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  
                  <button
                    onClick={() => removeFile(file.name)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
