# 🚀 Deployment Guide

## GitHub Setup

### 1. Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: Premium WebShop with Barion integration"
```

### 2. Create GitHub Repository
1. Go to [GitHub](https://github.com/new)
2. Create a new repository (e.g., "premium-webshop")
3. **Don't** initialize with README (we already have files)

### 3. Connect and Push
```bash
git remote add origin https://github.com/yourusername/premium-webshop.git
git branch -M main
git push -u origin main
```

## Vercel Deployment

### 1. Connect to Vercel
1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure project settings

### 2. Environment Variables
In Vercel dashboard, add these environment variables:

**Required:**
```
DATABASE_URL=your-production-database-url
NEXTAUTH_SECRET=your-production-secret-key
NEXTAUTH_URL=https://your-app.vercel.app
BARION_POSKEY=your-production-barion-pos-key
BARION_ENV=prod
BARION_BASE_URL=https://api.barion.com
```

**Optional:**
```
DELIVERY_FEE_HUF=1500
FREE_DELIVERY_THRESHOLD_HUF=15000
BARION_FUNDING_SOURCES=All
```

### 3. Database Setup
1. **Vercel Postgres** (recommended):
   - Add Vercel Postgres integration
   - Use provided `DATABASE_URL`

2. **External PostgreSQL**:
   - Use your existing database
   - Update connection string

### 4. Deploy
```bash
npm run build  # Test build locally first
vercel --prod   # Deploy to production
```

## Production Checklist

### Before Going Live:
- [ ] Update `BARION_ENV=prod`
- [ ] Update `BARION_BASE_URL=https://api.barion.com`
- [ ] Use production Barion POS key
- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Configure production database
- [ ] Test payment flow with real cards
- [ ] Update `NEXTAUTH_URL` to your domain

### Security:
- [ ] All sensitive data in environment variables
- [ ] `.env.local` in `.gitignore`
- [ ] Strong secrets and passwords
- [ ] HTTPS enabled (automatic on Vercel)

### Testing:
- [ ] All features work in production
- [ ] Payment processing works
- [ ] Admin panel accessible
- [ ] Order management functional
- [ ] Email notifications (if implemented)

## Maintenance

### Regular Tasks:
- Monitor Barion payments
- Backup database regularly
- Update dependencies
- Monitor error logs
- Check order processing

### Scaling:
- Database connection pooling
- Image optimization
- CDN for static assets
- Caching strategies
