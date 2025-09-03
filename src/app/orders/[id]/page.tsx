import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { orders, orderItems, products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Navbar } from '@/components/ui/navbar';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, CreditCard, MapPin, Clock } from 'lucide-react';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function OrderDetailsPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  // Fetch order details
  const orderData = await db
    .select({
      id: orders.id,
      createdAt: orders.createdAt,
      status: orders.status,
      subtotalHuf: orders.subtotalHuf,
      deliveryFeeHuf: orders.deliveryFeeHuf,
      totalHuf: orders.totalHuf,
      deliveryMethod: orders.deliveryMethod,
      deliveryAddress: orders.deliveryAddress,
      pickupPointId: orders.pickupPointId,
      barionPaymentId: orders.barionPaymentId,
      barionStatus: orders.barionStatus,
    })
    .from(orders)
    .where(eq(orders.id, params.id))
    .limit(1);

  if (orderData.length === 0) {
    notFound();
  }

  const order = orderData[0];

  // Check if this order belongs to the current user
  const orderOwnership = await db
    .select({ userId: orders.userId })
    .from(orders)
    .where(eq(orders.id, params.id))
    .limit(1);

  if (orderOwnership.length === 0 || orderOwnership[0].userId !== session.user.id) {
    notFound();
  }

  // Fetch order items with product details
  const items = await db
    .select({
      id: orderItems.id,
      quantity: orderItems.quantity,
      unitPriceHuf: orderItems.unitPriceHuf,
      discountAppliedHuf: orderItems.discountAppliedHuf,
      productId: products.id,
      productName: products.name,
      productSku: products.sku,
      productImageUrl: products.imageUrl,
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, params.id));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      case 'DELIVERED':
        return 'bg-purple-100 text-purple-800';
      case 'FAILED':
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CreditCard className="w-4 h-4" />;
      case 'SHIPPED':
        return <Truck className="w-4 h-4" />;
      case 'DELIVERED':
        return <Package className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getDeliveryMethodName = (method: string) => {
    switch (method) {
      case 'own-delivery':
        return 'Own Delivery';
      case 'foxpost-home':
        return 'Foxpost Home Delivery';
      case 'foxpost-pickup':
        return 'Foxpost Pickup Point';
      case 'posta-home':
        return 'Magyar Posta Home';
      case 'posta-pickup':
        return 'Magyar Posta Pickup';
      case 'packeta-pickup':
        return 'Packeta Pickup Point';
      default:
        return method || 'Standard Delivery';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/orders"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order #{order.id.slice(0, 8)}
              </h1>
              <p className="text-gray-500 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            
            <div className="flex items-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="ml-2">{order.status}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Order Items
                </h2>
              </div>
              
              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.id} className="p-6 flex items-center space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      {item.productImageUrl ? (
                        <img
                          src={item.productImageUrl}
                          alt={item.productName || 'Product'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-product.svg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.productName || 'Unknown Product'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        SKU: {item.productSku || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(item.unitPriceHuf)}
                      </p>
                      {item.discountAppliedHuf > 0 && (
                        <p className="text-sm text-green-600">
                          -{formatPrice(item.discountAppliedHuf)} discount
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Total: {formatPrice((item.unitPriceHuf - item.discountAppliedHuf) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(order.subtotalHuf)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className={`${order.deliveryFeeHuf === 0 ? 'text-green-600 font-medium' : 'text-gray-900'}`}>
                    {order.deliveryFeeHuf === 0 ? 'FREE' : formatPrice(order.deliveryFeeHuf)}
                  </span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-base font-medium">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">{formatPrice(order.totalHuf)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Delivery Information
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Delivery Method</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {getDeliveryMethodName(order.deliveryMethod || '')}
                  </p>
                </div>
                
                {order.deliveryAddress && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Delivery Address
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.deliveryAddress}
                    </p>
                  </div>
                )}
                
                {order.pickupPointId && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Pickup Point</p>
                    <p className="text-sm text-gray-600 mt-1">
                      ID: {order.pickupPointId}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Information
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                {order.barionPaymentId && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payment ID</p>
                    <p className="text-sm text-gray-600 mt-1 font-mono">
                      {order.barionPaymentId}
                    </p>
                  </div>
                )}
                
                {order.barionStatus && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payment Status</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.barionStatus}
                    </p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium text-gray-900">Order Status</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{order.status}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
