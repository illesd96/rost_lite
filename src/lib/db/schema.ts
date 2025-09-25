import { pgTable, uuid, text, integer, boolean, timestamp, check, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  password: text('password'), // For credentials auth
  role: text('role').notNull().default('customer'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
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