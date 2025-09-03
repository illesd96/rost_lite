# Premium WebShop

A modern, secure webshop application built with Next.js 14, featuring closed-circuit access, Barion payment integration, and comprehensive admin features.

## 🚀 Features

- **Closed Circuit Access**: Only logged-in users can access the shop
- **Product Gallery**: Multiple images per product with zoom and lightbox
- **File Upload**: Drag & drop image upload for products
- **Smart Cart**: Automatic discount calculations and delivery fee management
- **Multiple Delivery**: Own delivery + Hungarian services (Foxpost, Posta, Packeta)
- **Secure Payment**: Barion API with Azonnali Utalás (instant payment)
- **Order Management**: Complete order tracking and details
- **Admin Panel**: Product management, order tracking, user management
- **Keep-Alive Strategy**: Optimized for Vercel serverless deployment
- **Responsive Design**: Beautiful UI with TailwindCSS

## 🛠️ Tech Stack

- **Frontend & Backend**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js with credentials provider
- **Payments**: Barion API (Hungarian payment gateway)
- **Styling**: TailwindCSS
- **Cart Management**: react-use-cart
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or cloud)
- Barion account for payment processing

## 🚀 Quick Start

### 1. Clone and Install

\`\`\`bash
git clone <repository-url>
cd WebShop
npm install
\`\`\`

### 2. Environment Setup

Create a \`.env.local\` file in the root directory:

\`\`\`env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/webshop"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Barion Payment
BARION_POSKEY="your-barion-pos-key"
BARION_ENV="test" # or "prod"
BARION_BASE_URL="https://api.test.barion.com"

# App Settings
DELIVERY_FEE_HUF=1500
FREE_DELIVERY_THRESHOLD_HUF=15000
KEEP_ALIVE_INTERVAL_MINUTES=15
\`\`\`

### 3. Database Setup

\`\`\`bash
# Generate and run migrations
npm run db:generate
npm run db:migrate

# Or push schema directly (for development)
npm run db:push
\`\`\`

### 4. Seed Sample Data

\`\`\`bash
# Start the development server
npm run dev

# In another terminal, seed the database
curl -X POST http://localhost:3000/api/seed
\`\`\`

### 5. Access the Application

- **Landing Page**: http://localhost:3000
- **Admin Login**: admin@webshop.com / admin123
- **Customer Login**: customer@example.com / customer123

## 🏗️ Project Structure

\`\`\`
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── shop/              # Shop pages
│   ├── cart/              # Cart page
│   └── admin/             # Admin panel
├── components/            # React components
│   ├── ui/                # UI components
│   ├── shop/              # Shop-specific components
│   └── providers/         # Context providers
├── lib/                   # Utilities and configurations
│   ├── db/                # Database schema and connection
│   ├── auth.ts            # NextAuth configuration
│   └── utils.ts           # Helper functions
└── types/                 # TypeScript type definitions
\`\`\`

## 🔑 Default Accounts

After seeding, you can use these accounts:

**Admin Account**
- Email: admin@webshop.com
- Password: admin123
- Access: Full admin panel access

**Customer Account**
- Email: customer@example.com  
- Password: customer123
- Access: Shop and order management

## 💳 Payment Integration

The app integrates with Barion (Hungarian payment gateway):

1. **Test Environment**: Use Barion's sandbox for development
2. **Webhook Handling**: Automatic order status updates
3. **Secure Processing**: Server-side payment session creation

## 🚀 Deployment

### Vercel Deployment

1. **Database**: Set up Vercel Postgres or use external PostgreSQL
2. **Environment Variables**: Configure all required env vars in Vercel dashboard
3. **Deploy**: 
   \`\`\`bash
   npm run build
   vercel --prod
   \`\`\`

### Environment Variables for Production

Ensure these are set in your production environment:
- \`DATABASE_URL\`
- \`NEXTAUTH_SECRET\`
- \`NEXTAUTH_URL\`
- \`BARION_POSKEY\`
- \`BARION_ENV=prod\`
- \`BARION_BASE_URL=https://api.barion.com\`

## 🔧 Development Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
\`\`\`

## 📊 Key Features Details

### Keep-Alive Strategy
- Prevents Vercel serverless cold starts
- Cross-tab coordination via BroadcastChannel
- Configurable ping intervals

### Discount System
- Automatic quantity-based discounts
- Per-product discount thresholds
- Real-time price calculations

### Delivery Management
- Hungary-only delivery
- Configurable delivery fees
- Free delivery thresholds

### Security
- Protected routes with middleware
- Role-based access control
- Secure password hashing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🚀 GitHub Deployment

### 1. Initialize Repository
```bash
git init
git add .
git commit -m "Initial commit: Premium WebShop"
```

### 2. Push to GitHub
```bash
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel
1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy with one click

See `DEPLOYMENT.md` for detailed deployment instructions.

## 🆘 Support

For support or questions:
- Check the documentation
- Review the code comments
- Open an issue on GitHub

---

**Happy Shopping! 🛒**
