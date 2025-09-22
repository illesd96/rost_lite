import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';

// Load appropriate environment file based on environment
if (process.env.NODE_ENV !== 'production') {
  // Try to load environment-specific files first, then fallback to .env.local
  if (process.env.VERCEL_ENV === 'preview') {
    config({ path: '.env.staging' });
  } else {
    config({ path: '.env.local' });
  }
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
  verbose: true,
  strict: true,
} satisfies Config;
