import { db } from './db';
import { users } from './db/schema';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with users only...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    
    await db.insert(users).values({
      email: 'admin@webshop.com',
      password: adminPassword,
      role: 'admin',
    }).onConflictDoNothing();

    // Create test customer 1
    const customer1Password = await bcrypt.hash('customer123', 12);
    
    await db.insert(users).values({
      email: 'customer1@example.com',
      password: customer1Password,
      role: 'customer',
    }).onConflictDoNothing();

    // Create test customer 2
    const customer2Password = await bcrypt.hash('customer456', 12);
    
    await db.insert(users).values({
      email: 'customer2@example.com',
      password: customer2Password,
      role: 'customer',
    }).onConflictDoNothing();

    console.log('✅ Database seeded successfully with users only!');
    console.log('👤 Admin login: admin@webshop.com / admin123');
    console.log('👤 Customer 1 login: customer1@example.com / customer123');
    console.log('👤 Customer 2 login: customer2@example.com / customer456');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}
