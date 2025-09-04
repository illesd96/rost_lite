import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { validateImageFile, generateUploadFilename } from '@/lib/upload-utils';
import { put } from '@vercel/blob';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Generate unique filename for blob storage
    const filename = generateUploadFilename(file.name);
    
    // Upload to Vercel Blob Storage
    const blob = await put(`products/${filename}`, file, {
      access: 'public',
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: file.name,
      size: file.size
    });

  } catch (error) {
    console.error('Blob upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image to blob storage' },
      { status: 500 }
    );
  }
}
