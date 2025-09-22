# 🔧 Staging Environment Setup Guide

## Overview
This guide helps you set up a proper staging environment on Vercel for testing before production deployment.

## Problem Solved
The error `ECONNREFUSED 127.0.0.1:5432` occurs because your staging deployment tries to connect to a local PostgreSQL database that doesn't exist in Vercel's environment.

## 1. Database Setup for Staging

### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel project dashboard
2. Navigate to the **Storage** tab
3. Create a new **Postgres** database
4. Choose a name like `webshop-staging`
5. Vercel will provide you with a `DATABASE_URL`

### Option B: External Database
1. Set up a staging PostgreSQL database (e.g., on Railway, Supabase, or AWS RDS)
2. Create a database named `webshop_staging`
3. Get the connection string in format: `postgresql://user:password@host:port/database`

## 2. Vercel Environment Variables Setup

### For Staging Branch (Preview Deployments)
In your Vercel project settings → Environment Variables, add these for **Preview** environment:

```env
# Database
DATABASE_URL=postgresql://your-staging-database-url

# Authentication
NEXTAUTH_SECRET=your-staging-secret-at-least-32-characters-long
NEXTAUTH_URL=https://your-staging-preview.vercel.app

# Payment (Test Environment)
BARION_POSKEY=your-barion-test-pos-key
BARION_ENV=test
BARION_BASE_URL=https://api.test.barion.com

# Storage
BLOB_READ_WRITE_TOKEN=your-blob-token

# App Settings
DELIVERY_FEE_HUF=1500
FREE_DELIVERY_THRESHOLD_HUF=15000
KEEP_ALIVE_INTERVAL_MINUTES=15

# Environment Identifiers
NODE_ENV=production
VERCEL_ENV=preview
```

### Important Notes:
- Set these variables for **Preview** environment (not Production)
- Use **Test** Barion environment for staging
- Use a separate staging database
- Generate a different `NEXTAUTH_SECRET` for staging

## 3. Deploy Staging Branch

### Method 1: Automatic (Recommended)
1. Push to your `staging` branch:
   ```bash
   git push origin staging
   ```
2. Vercel will automatically create a preview deployment
3. Check the deployment URL in Vercel dashboard

### Method 2: Manual
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy specific branch:
   ```bash
   vercel --prod --branch staging
   ```

## 4. Database Migration for Staging

After deploying, you need to run migrations on your staging database:

### If using Vercel Postgres:
1. Go to your Vercel project → Storage → Your Database
2. Use the Query tab to run SQL commands
3. Or use the connection details with your local drizzle-kit

### Using Drizzle Kit locally:
```bash
# Set staging DATABASE_URL temporarily
export DATABASE_URL="your-staging-database-url"

# Run migrations
npm run db:push
```

## 5. Testing Your Staging Environment

### Verify Database Connection:
1. Check deployment logs in Vercel
2. Look for the database connection log we added
3. Should show "remote" instead of "localhost"

### Test Key Features:
- [ ] Homepage loads
- [ ] Products display
- [ ] User registration/login
- [ ] Add to cart
- [ ] Checkout process (test mode)
- [ ] Admin panel access
- [ ] Order management

## 6. Branch-Specific Configuration

### For Different Environments:
- `main` branch → Production deployment
- `staging` branch → Staging/Preview deployment
- Local development → `.env.local`

### Environment Variables by Branch:
| Environment | Branch | Database | Barion | NEXTAUTH_URL |
|-------------|--------|----------|---------|--------------|
| Development | any | localhost | test | localhost:3000 |
| Staging | staging | staging DB | test | staging.vercel.app |
| Production | main | prod DB | prod | your-domain.com |

## 7. Troubleshooting

### Common Issues:

**Database Connection Refused:**
- ✅ Check `DATABASE_URL` is set in Vercel environment variables
- ✅ Ensure database allows external connections
- ✅ Verify SSL settings for external databases

**Build Failures:**
- ✅ Check all required environment variables are set
- ✅ Verify database is accessible during build
- ✅ Check Vercel build logs for specific errors

**Authentication Issues:**
- ✅ Set correct `NEXTAUTH_URL` for staging domain
- ✅ Ensure `NEXTAUTH_SECRET` is set and unique
- ✅ Check callback URLs in OAuth providers

## 8. Best Practices

### Security:
- Use different secrets for each environment
- Never commit `.env` files to git
- Use test payment credentials for staging

### Database:
- Keep staging data separate from production
- Regularly refresh staging data from production (sanitized)
- Use database connection pooling for better performance

### Monitoring:
- Check Vercel deployment logs regularly
- Monitor staging database performance
- Set up alerts for staging deployment failures

## 9. Next Steps After Staging Works

1. **Test thoroughly** on staging before production
2. **Set up production** environment variables
3. **Update payment settings** to production for live deployment
4. **Configure custom domain** for production
5. **Set up monitoring** and error tracking

## Quick Fix Summary

The files I've updated:
- ✅ `src/lib/db/index.ts` - Better database connection handling
- ✅ `drizzle.config.ts` - Environment-aware configuration  
- ✅ `vercel.json` - Vercel deployment configuration
- ✅ `env.staging` - Staging environment template
- ✅ `STAGING-DEPLOYMENT.md` - This comprehensive guide

**Your immediate next step:** Set up the environment variables in Vercel as described in section 2.
