import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { modernShopOrders, orderDeliverySchedule, orderPaymentGroups } from '@/lib/db/schema';
import { OrderState, CONSTANTS } from '@/types/modern-shop';
import { formatCurrency, getDateFromIndex, getMondayDate } from '@/lib/modern-shop-utils';

// Helper function to generate order number
function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const timestamp = now.getTime().toString().slice(-4); // Last 4 digits of timestamp
  
  return `ROSTI-${year}${month}${day}-${timestamp}`;
}

// Helper function to calculate pricing
function calculatePricing(orderState: OrderState) {
  const CONSTANTS = {
    UNIT_PRICE: 1490,
    SHIPPING_FEE_HIGH: 5700,
    SHIPPING_FEE_LOW: 3700,
    FREE_SHIPPING_THRESHOLD: 50
  };

  const { quantity, schedule, appliedCoupon, billingData } = orderState;
  
  let unitPrice = CONSTANTS.UNIT_PRICE;
  let shippingFee = 0;
  let discountAmount = 0;

  // Calculate base shipping fee (per delivery)
  if (quantity <= 25) {
    shippingFee = CONSTANTS.SHIPPING_FEE_HIGH;
  } else if (quantity < CONSTANTS.FREE_SHIPPING_THRESHOLD) {
    shippingFee = CONSTANTS.SHIPPING_FEE_LOW;
  } else {
    shippingFee = 0;
  }

  // Apply coupon discounts (simplified - in production you'd fetch from database)
  if (appliedCoupon) {
    if (appliedCoupon === 'private1234' && billingData.type === 'private' && quantity <= 20) {
      unitPrice = 1250; // Special unit price
      shippingFee = 1700; // Fixed shipping
      discountAmount = (CONSTANTS.UNIT_PRICE - unitPrice) * quantity + (shippingFee > 1700 ? shippingFee - 1700 : 0);
    } else if (appliedCoupon === 'teszt114db' || appliedCoupon === 'mastercard1234') {
      if (shippingFee > 1700) {
        discountAmount = shippingFee - 1700;
        shippingFee = 1700;
      }
    }
  }

  // Calculate totals - multiply by number of delivery dates
  const subtotalPerDelivery = unitPrice * quantity;
  const subtotal = subtotalPerDelivery * schedule.length;
  const totalShippingFee = shippingFee * schedule.length;
  const totalAmount = subtotal + totalShippingFee;

  return {
    unitPrice,
    subtotal,
    shippingFee: totalShippingFee,
    discountAmount: discountAmount * schedule.length,
    totalAmount
  };
}

// Helper function to create payment groups
function createPaymentGroups(orderState: OrderState, orderId: string, totalAmount: number) {
  const { paymentPlan, schedule } = orderState;
  const groups: any[] = [];
  
  // Constants for date calculations
  const CONSTANTS = {
    START_DATE: new Date()
  };

  if (paymentPlan === 'full') {
    // Single payment for full amount
    const today = new Date();
    groups.push({
      orderId,
      groupNumber: 1,
      amount: totalAmount,
      dueDate: today.toISOString().split('T')[0], // Convert to YYYY-MM-DD string
      status: 'pending' as const,
      description: 'Teljes összeg egyszeri fizetése'
    });
  } else if (paymentPlan === 'monthly') {
    // Group deliveries by calendar month
    const deliverysByMonth = new Map<string, { deliveries: number[], totalAmount: number }>();
    const amountPerDelivery = Math.round(totalAmount / schedule.length);
    
    schedule.forEach((deliveryIndex, index) => {
      const deliveryDate = getDateFromIndex(CONSTANTS.START_DATE, deliveryIndex);
      const monthKey = `${deliveryDate.getFullYear()}-${String(deliveryDate.getMonth() + 1).padStart(2, '0')}`;
      
      if (!deliverysByMonth.has(monthKey)) {
        deliverysByMonth.set(monthKey, { deliveries: [], totalAmount: 0 });
      }
      
      const monthData = deliverysByMonth.get(monthKey)!;
      monthData.deliveries.push(index);
      // Each delivery in this month adds its full amount
      monthData.totalAmount += amountPerDelivery;
    });

    // Create payment groups by month
    let groupNumber = 1;
    Array.from(deliverysByMonth.entries()).forEach(([monthKey, monthData]) => {
      const [year, month] = monthKey.split('-');
      const dueDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      
      groups.push({
        orderId,
        groupNumber: groupNumber++,
        amount: monthData.totalAmount,
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'pending' as const,
        description: `${year}. ${month}. havi fizetés (${monthData.deliveries.length} szállítás)`
      });
    });
  } else if (paymentPlan === 'delivery') {
    // Payment per delivery
    const deliveryAmount = Math.round(totalAmount / schedule.length);
    const lastDeliveryAmount = totalAmount - (deliveryAmount * (schedule.length - 1));

    schedule.forEach((deliveryIndex, index) => {
      const startDate = new Date(); // You might want to get this from constants
      const deliveryDate = getDateFromIndex(startDate, deliveryIndex);
      const dueDate = new Date(deliveryDate);
      dueDate.setDate(dueDate.getDate() - 1); // Due day before delivery
      
      groups.push({
        orderId,
        groupNumber: index + 1,
        amount: index === schedule.length - 1 ? lastDeliveryAmount : deliveryAmount,
        dueDate: dueDate.toISOString().split('T')[0], // Convert to YYYY-MM-DD string
        status: 'pending' as const,
        description: `${index + 1}. szállítás fizetése (${deliveryDate.toLocaleDateString('hu-HU')})`
      });
    });
  }

  return groups;
}

// Helper function to create delivery packages
function createDeliveryPackages(orderState: OrderState, orderId: string, pricing: any) {
  const { quantity, schedule } = orderState;
  const packages: any[] = [];
  
  // Each delivery gets the FULL quantity (not split)
  const bottlesPerDelivery = quantity;
  
  // Calculate amount per delivery - each delivery gets the full product amount
  const amountPerDelivery = pricing.unitPrice * quantity;

  schedule.forEach((deliveryIndex, index) => {
    const startDate = new Date(); // You might want to get this from constants
    const deliveryDate = getDateFromIndex(startDate, deliveryIndex);
    const isMonday = deliveryDate.getDay() === 1;
    
    packages.push({
      orderId,
      deliveryDate: deliveryDate.toISOString().split('T')[0], // Convert to YYYY-MM-DD string
      deliveryIndex,
      isMonday,
      quantity: bottlesPerDelivery, // Full quantity for each delivery
      amount: amountPerDelivery, // Full amount for each delivery
      status: 'scheduled' as const,
      packageNumber: index + 1,
      totalPackages: schedule.length
    });
  });

  return packages;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { orderState }: { orderState: OrderState } = await req.json();

    if (!orderState) {
      return NextResponse.json({ message: 'Order state is required' }, { status: 400 });
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Calculate pricing
    const pricing = calculatePricing(orderState);

    // Create the main order
    const [newOrder] = await db.insert(modernShopOrders).values({
      userId: session.user.id,
      orderNumber,
      quantity: orderState.quantity,
      unitPrice: pricing.unitPrice,
      shippingFee: pricing.shippingFee,
      totalAmount: pricing.totalAmount,
      deliverySchedule: orderState.schedule,
      deliveryDatesCount: orderState.schedule.length,
      paymentPlan: orderState.paymentPlan,
      paymentMethod: orderState.paymentMethod,
      appliedCoupon: orderState.appliedCoupon || null,
      discountAmount: pricing.discountAmount,
      billingData: orderState.billingData,
      status: 'confirmed',
      confirmedAt: new Date()
    }).returning();

    // Create payment groups
    const paymentGroups = createPaymentGroups(orderState, newOrder.id, pricing.totalAmount);
    if (paymentGroups.length > 0) {
      await db.insert(orderPaymentGroups).values(paymentGroups);
    }

    // Create delivery packages
    const deliveryPackages = createDeliveryPackages(orderState, newOrder.id, pricing);
    if (deliveryPackages.length > 0) {
      await db.insert(orderDeliverySchedule).values(deliveryPackages);
    }

    // Return success response with order details
    return NextResponse.json({
      success: true,
      order: {
        id: newOrder.id,
        orderNumber: newOrder.orderNumber,
        totalAmount: pricing.totalAmount,
        paymentGroups: paymentGroups.length,
        deliveryPackages: deliveryPackages.length,
        status: newOrder.status
      },
      message: 'Rendelés sikeresen létrehozva!'
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { message: 'Hiba történt a rendelés létrehozása során.' },
      { status: 500 }
    );
  }
}
