import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });

export type User = typeof schema.users.$inferSelect;
export type NewUser = typeof schema.users.$inferInsert;
export type Product = typeof schema.products.$inferSelect;
export type NewProduct = typeof schema.products.$inferInsert;
export type Order = typeof schema.orders.$inferSelect;
export type NewOrder = typeof schema.orders.$inferInsert;
export type OrderItem = typeof schema.orderItems.$inferSelect;
export type NewOrderItem = typeof schema.orderItems.$inferInsert;
