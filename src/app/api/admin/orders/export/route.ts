import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { orders, users, orderItems, products } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all orders with detailed information
    const ordersData = await db
      .select({
        orderId: orders.id,
        orderDate: orders.createdAt,
        orderStatus: orders.status,
        subtotalHuf: orders.subtotalHuf,
        deliveryFeeHuf: orders.deliveryFeeHuf,
        totalHuf: orders.totalHuf,
        barionPaymentId: orders.barionPaymentId,
        barionStatus: orders.barionStatus,
        customerEmail: users.email,
        itemId: orderItems.id,
        productName: products.name,
        productSku: products.sku,
        quantity: orderItems.quantity,
        unitPrice: orderItems.unitPriceHuf,
        discount: orderItems.discountAppliedHuf,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .leftJoin(products, eq(orderItems.productId, products.id))
      .orderBy(desc(orders.createdAt));

    // Create CSV content
    const csvHeaders = [
      'Order ID',
      'Order Date',
      'Customer Email',
      'Order Status',
      'Product Name',
      'Product SKU',
      'Quantity',
      'Unit Price (HUF)',
      'Discount (HUF)',
      'Item Total (HUF)',
      'Subtotal (HUF)',
      'Delivery Fee (HUF)',
      'Order Total (HUF)',
      'Payment ID',
      'Payment Status',
    ].join(',');

    const csvRows = ordersData.map(row => [
      row.orderId,
      row.orderDate?.toISOString().split('T')[0] || '',
      row.customerEmail || '',
      row.orderStatus,
      row.productName || '',
      row.productSku || '',
      row.quantity || 0,
      row.unitPrice || 0,
      row.discount || 0,
      ((row.unitPrice || 0) * (row.quantity || 0)) - (row.discount || 0),
      row.subtotalHuf,
      row.deliveryFeeHuf,
      row.totalHuf,
      row.barionPaymentId || '',
      row.barionStatus || '',
    ].map(field => `"${field}"`).join(','));

    const csvContent = [csvHeaders, ...csvRows].join('\n');

    // Generate filename with current date
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const filename = `webshop-orders-${dateStr}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('CSV export error:', error);
    return NextResponse.json(
      { error: 'Failed to export orders' },
      { status: 500 }
    );
  }
}
