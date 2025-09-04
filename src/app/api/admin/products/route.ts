import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { productSchema } from '@/lib/validations';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate the product data
    const validatedData = productSchema.parse(body);

    // Create the product
    const newProduct = await db
      .insert(products)
      .values({
        sku: validatedData.sku,
        name: validatedData.name,
        description: validatedData.description || null,
        imageUrl: validatedData.imageUrl || null,
        images: validatedData.images || null,
        basePriceHuf: validatedData.basePriceHuf,
        onSale: validatedData.onSale || false,
        salePriceHuf: validatedData.salePriceHuf || null,
        discountThreshold: validatedData.discountThreshold || 1,
        discountPercentage: validatedData.discountPercentage || 0,
      })
      .returning();

    return NextResponse.json(newProduct[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid product data', details: error.message },
        { status: 400 }
      );
    }

    // Handle database constraint errors (like duplicate SKU)
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'A product with this SKU already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
