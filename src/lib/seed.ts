import { db } from './db';
import { users } from './db/schema';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  try {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    
    await db.insert(users).values({
      email: 'dani.illes96@gmail.com',
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

  } catch (error) {
    throw error;
  }
}
