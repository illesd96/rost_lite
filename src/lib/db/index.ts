import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not set. Please set it in your environment variables.'
  );
}

console.log('Database connection environment:', {
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_ENV: process.env.VERCEL_ENV,
  hasDatabase: !!connectionString,
  databaseHost: connectionString.includes('localhost') ? 'localhost' : 'remote'
});

// Configure postgres client based on environment
const clientConfig: postgres.Options<{}> = {
  prepare: false, // Disable prefetch as it is not supported for "Transaction" pool mode
};

// Add SSL configuration for production/staging environments
if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'preview') {
  clientConfig.ssl = process.env.DATABASE_URL?.includes('localhost') ? false : 'require';
}

const client = postgres(connectionString, clientConfig);
export const db = drizzle(client, { schema });

export type User = typeof schema.users.$inferSelect;
export type NewUser = typeof schema.users.$inferInsert;
export type Product = typeof schema.products.$inferSelect;
export type NewProduct = typeof schema.products.$inferInsert;
export type Order = typeof schema.orders.$inferSelect;
export type NewOrder = typeof schema.orders.$inferInsert;
export type OrderItem = typeof schema.orderItems.$inferSelect;
export type NewOrderItem = typeof schema.orderItems.$inferInsert;
