# 🔧 Vercel Environment Variables Checklist

## ❌ Current Issue:
Your staging deployment is connecting to `127.0.0.1:5432` instead of your Neon database.

## ✅ Solution Steps:

### 1. **Get Neon Connection String**
- [ ] Go to Neon dashboard → `rosti-test` database
- [ ] Copy the connection string (looks like: `postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require`)

### 2. **Set Vercel Environment Variables**
Go to Vercel → Your Project → Settings → Environment Variables

**CRITICAL**: Set these for **"Preview"** environment (not Production):

```env
DATABASE_URL=postgresql://your-neon-connection-string
NEXTAUTH_SECRET=generate-32-character-random-string
NEXTAUTH_URL=https://your-staging-url.vercel.app
BARION_POSKEY=your-barion-test-key
BARION_ENV=test
BARION_BASE_URL=https://api.test.barion.com
BLOB_READ_WRITE_TOKEN=your-blob-token
DELIVERY_FEE_HUF=1500
FREE_DELIVERY_THRESHOLD_HUF=15000
NODE_ENV=production
VERCEL_ENV=preview
```

### 3. **Verify Environment Selection**
- [ ] Make sure you select **"Preview"** (not Production or Development)
- [ ] Each variable should show "Preview" in the environment column

### 4. **Redeploy**
After setting variables:
- [ ] Go to Vercel → Deployments
- [ ] Click "Redeploy" on your latest staging deployment
- OR
- [ ] Push a new commit to your staging branch

### 5. **Check Deployment Logs**
- [ ] Go to Vercel → Functions → View Function Logs
- [ ] Look for database connection messages
- [ ] Should show "remote" instead of "localhost"

## 🔍 **Troubleshooting:**

### If still getting localhost connection:
1. **Double-check environment**: Variables must be set for "Preview" environment
2. **Redeploy**: Environment changes require a new deployment
3. **Check logs**: Look for our database connection debug messages

### If getting different database error:
1. **Check connection string**: Must include `?sslmode=require`
2. **Verify database**: Make sure you ran the SQL schema in Neon
3. **Test connection**: Try connecting from your local machine first

### If build fails:
1. **Check all variables**: All required variables must be set
2. **Check syntax**: No extra spaces or quotes in environment variables
3. **Check limits**: Make sure you haven't hit Vercel's environment variable limits

## 🎯 **Expected Result:**
After completing these steps, your deployment logs should show:
```
Database connection environment: {
  NODE_ENV: 'production',
  VERCEL_ENV: 'preview', 
  hasDatabase: true,
  databaseHost: 'remote'
}
```

## 📞 **Need Help?**
If you're still having issues:
1. Check the exact error message in Vercel deployment logs
2. Verify your Neon database is accessible
3. Make sure all environment variables are correctly set for "Preview"

---
**Next Step**: Set the environment variables in Vercel and redeploy!
