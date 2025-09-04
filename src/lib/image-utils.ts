export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export function parseProductImages(imagesJson: string | null, imageUrl: string | null): ProductImage[] {
  const images: ProductImage[] = [];
  
  try {
    // Parse images from JSON
    if (imagesJson) {
      const parsedImages = JSON.parse(imagesJson);
      if (Array.isArray(parsedImages)) {
        parsedImages.forEach((img, index) => {
          images.push({
            id: `img-${index}`,
            url: typeof img === 'string' ? img : img.url,
            alt: typeof img === 'string' ? `Product image ${index + 1}` : img.alt || `Product image ${index + 1}`,
            isPrimary: index === 0
          });
        });
      }
    }
    
    // Fallback to legacy imageUrl if no images array
    if (images.length === 0 && imageUrl) {
      images.push({
        id: 'img-0',
        url: imageUrl,
        alt: 'Product image',
        isPrimary: true
      });
    }
  } catch (error) {
    console.error('Error parsing product images:', error);
    
    // Fallback to legacy imageUrl on error
    if (imageUrl) {
      images.push({
        id: 'img-0',
        url: imageUrl,
        alt: 'Product image',
        isPrimary: true
      });
    }
  }
  
  return images;
}

export function serializeProductImages(images: ProductImage[]): { images: string; imageUrl: string | null } {
  const imageData = images.map(img => ({
    url: img.url,
    alt: img.alt,
    isPrimary: img.isPrimary || false
  }));
  
  const primaryImage = images.find(img => img.isPrimary) || images[0] || null;
  
  return {
    images: JSON.stringify(imageData),
    imageUrl: primaryImage?.url || null
  };
}

export function getPrimaryImage(images: ProductImage[]): ProductImage | null {
  return images.find(img => img.isPrimary) || images[0] || null;
}

export function validateImageUrl(url: string): boolean {
  try {
    new URL(url);
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  } catch {
    return false;
  }
}

export const SAMPLE_PRODUCT_IMAGES = {
  headphones: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop&crop=center'
  ],
  watch: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?w=600&h=600&fit=crop&crop=center'
  ],
  powerbank: [
    'https://images.unsplash.com/photo-1609592806821-c2c4af7a0b00?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&h=600&fit=crop&crop=center'
  ]
};
