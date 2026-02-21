import { pgTable, uuid, text, integer, boolean, timestamp, check, varchar, date, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  password: text('password'), // For credentials auth
  role: text('role').notNull().default('customer'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User billing data for modern shop
export const userBillingData = pgTable('user_billing_data', {
  userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  data: text('data').notNull(), // JSON string of billing data
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User addresses table for delivery and billing
export const userAddresses = pgTable('user_addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: text('type').notNull(), // 'delivery' or 'billing'
  isDefault: boolean('is_default').notNull().default(false),
  
  // Personal/Company info
  isCompany: boolean('is_company').notNull().default(false),
  companyName: text('company_name'),
  contactPerson: text('contact_person'),
  
  // Hungarian tax information (for companies)
  taxNumber: text('tax_number'), // Adószám (8 digits)
  vatNumber: text('vat_number'), // EU VAT number (HU + 8 digits)
  registrationNumber: text('registration_number'), // Cégjegyzékszám
  
  // Address details
  fullName: text('full_name').notNull(),
  email: text('email'),
  phone: text('phone'),
  
  // Hungarian address format
  country: text('country').notNull().default('Hungary'),
  postalCode: text('postal_code').notNull(), // 4 digits
  city: text('city').notNull(),
  district: text('district'), // Kerület (for Budapest)
  streetAddress: text('street_address').notNull(),
  houseNumber: text('house_number'), 
  floor: text('floor'), // Emelet
  door: text('door'), // Ajtó
  
  // Additional notes
  notes: text('notes'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  sku: text('sku').unique().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  imageUrl: text('image_url'), // Primary product image URL (for backward compatibility)
  images: text('images'), // JSON array of image URLs (max 5)
  basePriceHuf: integer('base_price_huf').notNull(),
  onSale: boolean('on_sale').notNull().default(false),
  salePriceHuf: integer('sale_price_huf'),
  discountThreshold: integer('discount_threshold').default(5), // Quantity for discount
  discountPercentage: integer('discount_percentage').default(10), // Percentage off
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  status: text('status').notNull().default('PENDING'),
  subtotalHuf: integer('subtotal_huf').notNull(),
  deliveryFeeHuf: integer('delivery_fee_huf').notNull(),
  totalHuf: integer('total_huf').notNull(),
  deliveryMethod: text('delivery_method').default('own-delivery'), // Delivery option ID
  deliveryAddress: text('delivery_address'), // For home delivery
  pickupPointId: text('pickup_point_id'), // For pickup points
  deliveryDate: timestamp('delivery_date'), // Scheduled delivery date
  barionPaymentId: text('barion_payment_id'),
  barionStatus: text('barion_status'),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
  unitPriceHuf: integer('unit_price_huf').notNull(),
  discountAppliedHuf: integer('discount_applied_huf').notNull().default(0),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  addresses: many(userAddresses),
}));

export const userAddressesRelations = relations(userAddresses, ({ one }) => ({
  user: one(users, {
    fields: [userAddresses.userId],
    references: [users.id],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

// QR Code Analytics table
export const qrCodeVisits = pgTable('qr_code_visits', {
  id: uuid('id').defaultRandom().primaryKey(),
  page: varchar('page', { length: 50 }).notNull(), // '/osszetevok' or '/'
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  userAgent: text('user_agent'),
  ipAddress: varchar('ip_address', { length: 45 }), // IPv6 compatible
  referrer: text('referrer'),
  isDirectVisit: boolean('is_direct_visit').default(true).notNull(),
  sessionId: varchar('session_id', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Shop Settings table (feature toggles for the storefront)
export const shopSettings = pgTable('shop_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: varchar('key', { length: 100 }).unique().notNull(),
  value: text('value').notNull(),
  label: text('label'),
  description: text('description'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Delivery Settings table
export const deliverySettings = pgTable('delivery_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  deliveryDays: text('delivery_days').notNull().default('["monday","wednesday"]'), // JSON array of days
  weeksInAdvance: integer('weeks_in_advance').notNull().default(4), // How many weeks in advance to show
  cutoffHours: integer('cutoff_hours').notNull().default(24), // Hours before delivery to stop accepting orders
  isActive: boolean('is_active').notNull().default(true),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Modern Shop Orders
export const modernShopOrders = pgTable('modern_shop_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  orderNumber: varchar('order_number', { length: 50 }).unique().notNull(),
  
  // Order details
  quantity: integer('quantity').notNull(),
  unitPrice: integer('unit_price').notNull(), // Price per unit in HUF
  shippingFee: integer('shipping_fee').notNull().default(0),
  totalAmount: integer('total_amount').notNull(),
  
  // Schedule and delivery
  deliverySchedule: jsonb('delivery_schedule').notNull(), // Array of delivery date indices
  deliveryDatesCount: integer('delivery_dates_count').notNull(),
  
  // Payment details
  paymentPlan: varchar('payment_plan', { length: 20 }).notNull(), // 'full', 'monthly', 'delivery'
  paymentMethod: varchar('payment_method', { length: 20 }).notNull(), // 'transfer', 'cash'
  appliedCoupon: varchar('applied_coupon', { length: 50 }),
  discountAmount: integer('discount_amount').default(0),
  
  // Billing information (stored as JSON for flexibility)
  billingData: jsonb('billing_data').notNull(),
  
  // Order status
  status: varchar('status', { length: 20 }).default('pending'), // 'pending', 'confirmed', 'processing', 'delivered', 'cancelled'
  notes: text('notes'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  confirmedAt: timestamp('confirmed_at'),
  deliveredAt: timestamp('delivered_at')
});

// Order Payment Groups (for different payment plans)
export const orderPaymentGroups = pgTable('order_payment_groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => modernShopOrders.id, { onDelete: 'cascade' }).notNull(),
  groupNumber: integer('group_number').notNull(),
  amount: integer('amount').notNull(),
  dueDate: date('due_date').notNull(),
  status: varchar('status', { length: 20 }).default('pending'), // 'pending', 'paid', 'overdue', 'cancelled'
  description: text('description'),
  paidAt: timestamp('paid_at'),
  // Billing tracking fields
  billCreated: boolean('bill_created').default(false).notNull(),
  billCreatedAt: timestamp('bill_created_at'),
  billSent: boolean('bill_sent').default(false).notNull(),
  billSentAt: timestamp('bill_sent_at'),
  billNumber: varchar('bill_number', { length: 50 }), // Invoice/bill reference number
  billNotes: text('bill_notes'), // Notes about the bill
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Order Delivery Schedule
export const orderDeliverySchedule = pgTable('order_delivery_schedule', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => modernShopOrders.id, { onDelete: 'cascade' }).notNull(),
  deliveryDate: date('delivery_date').notNull(),
  deliveryIndex: integer('delivery_index').notNull(), // Original schedule index
  isMonday: boolean('is_monday').notNull().default(true), // true for Monday, false for Tuesday
  quantity: integer('quantity').notNull(),
  amount: integer('amount').notNull(), // Amount for this specific delivery
  packageNumber: integer('package_number').notNull(),
  totalPackages: integer('total_packages').notNull(),
  status: varchar('status', { length: 20 }).default('scheduled'), // 'scheduled', 'delivered', 'cancelled', 'rescheduled'
  deliveryNotes: text('delivery_notes'),
  deliveredAt: timestamp('delivered_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Relations for modern shop orders
export const modernShopOrdersRelations = relations(modernShopOrders, ({ one, many }) => ({
  user: one(users, {
    fields: [modernShopOrders.userId],
    references: [users.id],
  }),
  paymentGroups: many(orderPaymentGroups),
  deliverySchedule: many(orderDeliverySchedule),
}));

export const orderPaymentGroupsRelations = relations(orderPaymentGroups, ({ one }) => ({
  order: one(modernShopOrders, {
    fields: [orderPaymentGroups.orderId],
    references: [modernShopOrders.id],
  }),
}));

export const orderDeliveryScheduleRelations = relations(orderDeliverySchedule, ({ one }) => ({
  order: one(modernShopOrders, {
    fields: [orderDeliverySchedule.orderId],
    references: [modernShopOrders.id],
  }),
}));