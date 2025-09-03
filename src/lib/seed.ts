import { db } from './db';
import { products, users } from './db/schema';
import bcrypt from 'bcryptjs';

const sampleProducts = [
  {
    sku: 'PREMIUM-001',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center',
    basePriceHuf: 25000,
    onSale: true,
    salePriceHuf: 20000,
    discountThreshold: 3,
    discountPercentage: 15,
  },
  {
    sku: 'PREMIUM-002',
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking with heart rate monitor, GPS, and smartphone integration. Water-resistant design for all activities.',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center',
    basePriceHuf: 35000,
    onSale: false,
    salePriceHuf: null,
    discountThreshold: 2,
    discountPercentage: 10,
  },
  {
    sku: 'PREMIUM-003',
    name: 'Portable Power Bank',
    description: 'Ultra-fast charging power bank with 20,000mAh capacity. Supports wireless charging and multiple device charging simultaneously.',
    imageUrl: 'https://images.unsplash.com/photo-1609592806821-c2c4af7a0b00?w=400&h=400&fit=crop&crop=center',
    basePriceHuf: 15000,
    onSale: true,
    salePriceHuf: 12000,
    discountThreshold: 5,
    discountPercentage: 20,
  },
];

export async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    
    await db.insert(users).values({
      email: 'admin@webshop.com',
      password: adminPassword,
      role: 'admin',
    }).onConflictDoNothing();

    // Create sample customer
    const customerPassword = await bcrypt.hash('customer123', 12);
    
    await db.insert(users).values({
      email: 'customer@example.com',
      password: customerPassword,
      role: 'customer',
    }).onConflictDoNothing();

    // Insert sample products
    await db.insert(products).values(sampleProducts).onConflictDoNothing();

    console.log('✅ Database seeded successfully!');
    console.log('Admin login: admin@webshop.com / admin123');
    console.log('Customer login: customer@example.com / customer123');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}
