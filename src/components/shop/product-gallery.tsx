'use client';

import { useState, useEffect } from 'react';
import { ProductImage } from '@/lib/image-utils';
import { ChevronLeft, ChevronRight, Expand, X, ZoomIn, ZoomOut } from 'lucide-react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showZoomGallery, setShowZoomGallery] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [fitToScreenZoom, setFitToScreenZoom] = useState(1);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  if (images.length === 0) {
    return (
      <div className="aspect-square w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  const currentImage = images[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    resetZoom();
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    resetZoom();
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
    resetZoom();
  };

  const resetZoom = () => {
    setZoomLevel(1); // Always reset to 100%
    setImagePosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.5, 4));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.5, 0.25));
    if (zoomLevel <= 1.1) {
      setImagePosition({ x: 0, y: 0 });
    }
  };

  const fitToScreen = () => {
    // Recalculate fit-to-screen in case window was resized
    const img = new Image();
    img.onload = () => {
      const viewportWidth = window.innerWidth * 0.85;
      const viewportHeight = (window.innerHeight - 120) * 0.85;
      
      const scaleX = viewportWidth / img.naturalWidth;
      const scaleY = viewportHeight / img.naturalHeight;
      const fitScale = Math.min(scaleX, scaleY, 1);
      
      setFitToScreenZoom(fitScale);
      setZoomLevel(fitScale);
      setImagePosition({ x: 0, y: 0 });
    };
    img.src = images[currentImageIndex].url;
  };

  const zoomToActualSize = () => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (zoomLevel > 1 && e.buttons === 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    // Reset drag state
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showZoomGallery) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            prevImage();
            break;
          case 'ArrowRight':
            e.preventDefault();
            nextImage();
            break;
          case 'Escape':
            e.preventDefault();
            setShowZoomGallery(false);
            resetZoom();
            break;
          case '+':
          case '=':
            e.preventDefault();
            handleZoomIn();
            break;
          case '-':
            e.preventDefault();
            handleZoomOut();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showZoomGallery, images.length]);

  // Initialize zoom to 100% when gallery opens
  useEffect(() => {
    if (showZoomGallery) {
      // Small delay to ensure the modal is fully rendered
      const timer = setTimeout(() => {
        const img = new Image();
        img.onload = () => {
          // Calculate fit-to-screen for the "Fit" button, but start at 100%
          const viewportWidth = window.innerWidth * 0.85;
          const viewportHeight = (window.innerHeight - 120) * 0.85;
          
          const scaleX = viewportWidth / img.naturalWidth;
          const scaleY = viewportHeight / img.naturalHeight;
          const fitScale = Math.min(scaleX, scaleY, 1);
          
          setFitToScreenZoom(fitScale);
          setZoomLevel(1); // Always start at 100%
          setImagePosition({ x: 0, y: 0 });
        };
        img.onerror = () => {
          // Fallback if image fails to load
          setFitToScreenZoom(1);
          setZoomLevel(1);
          setImagePosition({ x: 0, y: 0 });
        };
        img.src = images[currentImageIndex].url;
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      // Reset when closing
      setFitToScreenZoom(1);
      setZoomLevel(1);
      setImagePosition({ x: 0, y: 0 });
    }
  }, [showZoomGallery, currentImageIndex, images]);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden group">
        <div 
          className="w-full h-full cursor-zoom-in"
          onClick={() => setShowZoomGallery(true)}
        >
          <img
            src={currentImage.url}
            alt={currentImage.alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-product.svg';
            }}
          />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Zoom Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowZoomGallery(true);
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                index === currentImageIndex
                  ? 'border-primary-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-product.svg';
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Enhanced Zoom Gallery Modal */}
      {showZoomGallery && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Header Controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <div className="flex items-center space-x-2">
              {/* Zoom Controls */}
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.25}
                className="w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={fitToScreen}
                  className="text-white text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors duration-200"
                  title="Fit to screen"
                >
                  Fit
                </button>
                <button
                  onClick={zoomToActualSize}
                  className="text-white text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors duration-200"
                  title="Actual size (100%)"
                >
                  100%
                </button>
              </div>
              
              <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                {Math.round(zoomLevel * 100)}%
              </span>
              
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 4}
                className="w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              {/* Image Counter */}
              {images.length > 1 && (
                <div className="bg-black/50 text-white px-3 py-1 rounded text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
              
              {/* Close Button */}
              <button
                onClick={() => setShowZoomGallery(false)}
                className="w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Main Image Container */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ top: '60px', bottom: '80px' }}>
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <div
                className="transition-transform duration-200 ease-out select-none flex items-center justify-center"
                style={{
                  transform: `scale(${zoomLevel}) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`,
                  cursor: zoomLevel > 1 ? 'grab' : 'default',
                  width: '100%',
                  height: '100%'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img
                  src={currentImage.url}
                  alt={currentImage.alt}
                  className="block max-w-full max-h-full object-contain"
                  draggable={false}
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-product.svg';
                  }}
                  style={{
                    maxWidth: '85vw',
                    maxHeight: '85vh'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Gallery Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200 z-20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200 z-20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 max-w-[90vw] overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentImageIndex
                      ? 'border-white shadow-lg'
                      : 'border-white/30 hover:border-white/60'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-product.svg';
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Keyboard Shortcuts Help */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
            <div>← → Navigate • + - Zoom • ESC Close • Drag to pan</div>
          </div>
        </div>
      )}
    </div>
  );
}
