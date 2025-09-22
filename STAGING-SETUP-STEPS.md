# 🎯 Staging Setup - Step by Step

Based on your Neon database setup, here's exactly what to do next:

## ✅ **What You've Already Done:**
- ✅ Created `rosti-test` staging database on Neon
- ✅ Created `webshop-production` production database on Neon  
- ✅ Set up environment variables in Vercel
- ✅ Created staging branch

## 🚀 **Next Steps:**

### Step 1: Set Up Staging Database Schema

**Option A: Using our setup script (Recommended)**
```bash
npm run staging:setup
```
This will prompt you for your Neon connection string and automatically set up the database.

**Option B: Manual setup**
```bash
# Copy your connection string from Neon dashboard for rosti-test
export DATABASE_URL="postgresql://your-neon-connection-string"
npm run db:push
```

### Step 2: Configure Vercel Environment Variables

Go to your Vercel project → Settings → Environment Variables and set these for **Preview** environment:

```env
# Database (from your rosti-test Neon database)
DATABASE_URL=postgresql://your-neon-staging-connection-string

# Authentication  
NEXTAUTH_SECRET=generate-a-32-character-secret-for-staging
NEXTAUTH_URL=https://your-staging-preview-url.vercel.app

# Payment (Test mode for staging)
BARION_POSKEY=your-barion-test-pos-key
BARION_ENV=test  
BARION_BASE_URL=https://api.test.barion.com

# Storage (same as production or separate)
BLOB_READ_WRITE_TOKEN=your-blob-token

# App Settings
DELIVERY_FEE_HUF=1500
FREE_DELIVERY_THRESHOLD_HUF=15000
KEEP_ALIVE_INTERVAL_MINUTES=15

# Environment identifiers
NODE_ENV=production
VERCEL_ENV=preview
```

### Step 3: Deploy Staging Branch

```bash
# Commit your changes
git add .
git commit -m "Add staging configuration and database setup"

# Push to staging branch
git push origin staging
```

### Step 4: Verify Staging Deployment

1. Check Vercel dashboard for deployment status
2. Visit your staging URL (should be something like `https://webshop-git-staging-yourusername.vercel.app`)
3. Check deployment logs for database connection success

### Step 5: Test Key Features

- [ ] Homepage loads
- [ ] Products display correctly
- [ ] User registration works
- [ ] Login/logout works
- [ ] Add products to cart
- [ ] Checkout process (test payments)
- [ ] Admin panel access
- [ ] Order management

## 🔧 **Troubleshooting:**

### If database connection fails:
1. Check that `DATABASE_URL` is correctly set in Vercel
2. Verify the connection string includes `?sslmode=require`
3. Check deployment logs in Vercel for specific errors

### If build fails:
1. Check all environment variables are set
2. Look for missing dependencies
3. Verify database is accessible during build

### If authentication fails:
1. Ensure `NEXTAUTH_URL` matches your staging domain
2. Check `NEXTAUTH_SECRET` is set and unique
3. Verify OAuth provider settings if using external auth

## 📊 **Database Management:**

### View your staging data:
```bash
# Set staging DATABASE_URL temporarily
export DATABASE_URL="your-staging-connection-string"
npm run db:studio
```

### Reset staging database (if needed):
```bash
export DATABASE_URL="your-staging-connection-string"  
npm run db:push
```

## 🎯 **Ready for Production?**

Once staging works perfectly:
1. Update production environment variables in Vercel
2. Switch to production Barion credentials
3. Deploy main branch to production
4. Test production thoroughly

## 📞 **Need Help?**

If you encounter issues:
1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Test database connection locally first
4. Check that all required services (Barion, Blob storage) are configured

---

**Current Status:** Ready to run `npm run staging:setup` and configure Vercel environment variables!
