import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';

// Only load .env.local in development
if (process.env.NODE_ENV !== 'production') {
  config({ path: '.env.local' });
}

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
