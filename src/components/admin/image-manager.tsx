'use client';

import { useState } from 'react';
import { ProductImage, validateImageUrl, serializeProductImages } from '@/lib/image-utils';
import { Plus, Trash2, Star, StarOff, Move, ExternalLink, Upload, Link } from 'lucide-react';
import { FileUpload } from './file-upload';

interface ImageManagerProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  maxImages?: number;
}

export function ImageManager({ images, onChange, maxImages = 5 }: ImageManagerProps) {
  const [newImageUrl, setNewImageUrl] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload');

  const addImageFromUrl = () => {
    setError(null);
    
    if (!newImageUrl.trim()) {
      setError('Please enter an image URL');
      return;
    }

    if (!validateImageUrl(newImageUrl)) {
      setError('Please enter a valid image URL (jpg, jpeg, png, gif, webp)');
      return;
    }

    if (images.length >= maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    const newImage: ProductImage = {
      id: `img-${Date.now()}`,
      url: newImageUrl.trim(),
      alt: `Product image ${images.length + 1}`,
      isPrimary: images.length === 0 // First image is primary by default
    };

    onChange([...images, newImage]);
    setNewImageUrl('');
  };

  const handleUploadComplete = (url: string) => {
    setError(null);
    
    if (images.length >= maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    const newImage: ProductImage = {
      id: `img-${Date.now()}`,
      url,
      alt: `Product image ${images.length + 1}`,
      isPrimary: images.length === 0 // First image is primary by default
    };

    onChange([...images, newImage]);
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const removeImage = (imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    
    // If we removed the primary image, make the first remaining image primary
    if (updatedImages.length > 0 && !updatedImages.some(img => img.isPrimary)) {
      updatedImages[0].isPrimary = true;
    }
    
    onChange(updatedImages);
  };

  const setPrimaryImage = (imageId: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      isPrimary: img.id === imageId
    }));
    onChange(updatedImages);
  };

  const updateImageAlt = (imageId: string, alt: string) => {
    const updatedImages = images.map(img =>
      img.id === imageId ? { ...img, alt } : img
    );
    onChange(updatedImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    onChange(updatedImages);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveImage(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700">
          Product Images ({images.length}/{maxImages})
        </h3>
        <span className="text-xs text-gray-500">
          Drag to reorder • Click star to set as primary
        </span>
      </div>

      {/* Add New Image */}
      <div className="border border-dashed border-gray-300 rounded-lg p-4">
        {/* Upload Mode Toggle */}
        <div className="flex items-center justify-center space-x-1 mb-4">
          <button
            onClick={() => setUploadMode('upload')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              uploadMode === 'upload' 
                ? 'bg-primary-100 text-primary-700 font-medium' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Upload className="w-4 h-4 inline mr-1" />
            Upload Files
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => setUploadMode('url')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              uploadMode === 'url' 
                ? 'bg-primary-100 text-primary-700 font-medium' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Link className="w-4 h-4 inline mr-1" />
            Add URL
          </button>
        </div>

        {uploadMode === 'upload' ? (
          <FileUpload
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            maxFiles={maxImages - images.length}
            disabled={images.length >= maxImages}
          />
        ) : (
          <div>
            <div className="flex space-x-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Enter image URL (https://...)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addImageFromUrl();
                  }
                }}
              />
              <button
                onClick={addImageFromUrl}
                disabled={images.length >= maxImages}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </button>
            </div>
            
            <p className="mt-2 text-xs text-gray-500">
              Supported formats: JPG, JPEG, PNG, GIF, WebP
            </p>
          </div>
        )}
        
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Image List */}
      {images.length > 0 && (
        <div className="space-y-2">
          {images.map((image, index) => (
            <div
              key={image.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`flex items-center space-x-3 p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-move ${
                draggedIndex === index ? 'opacity-50' : ''
              }`}
            >
              <Move className="w-4 h-4 text-gray-400 flex-shrink-0" />
              
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-product.svg';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={image.alt}
                  onChange={(e) => updateImageAlt(image.id, e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="Image description"
                />
                <div className="flex items-center mt-1 space-x-2">
                  <a
                    href={image.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View
                  </a>
                  {image.isPrimary && (
                    <span className="text-xs text-green-600 font-medium">Primary</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-1 flex-shrink-0">
                <button
                  onClick={() => setPrimaryImage(image.id)}
                  className={`p-1 rounded hover:bg-gray-100 ${
                    image.isPrimary ? 'text-yellow-500' : 'text-gray-400'
                  }`}
                  title="Set as primary image"
                >
                  {image.isPrimary ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={() => removeImage(image.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm">No images added yet</p>
          <p className="text-xs">Add your first product image above</p>
        </div>
      )}
    </div>
  );
}
