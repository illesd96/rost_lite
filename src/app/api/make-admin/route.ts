import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    const email = 'dani.illes96@gmail.com';
    
    // First try to update existing user
    const result = await db
      .update(users)
      .set({ role: 'admin' })
      .where(eq(users.email, email))
      .returning();

    if (result.length > 0) {
      console.log('✅ Successfully made', email, 'an admin!');
      return NextResponse.json({ 
        message: `Successfully made ${email} an admin!`,
        user: result[0]
      });
    } else {
      // User doesn't exist, create new admin user
      console.log('❌ User not found. Creating new admin user...');
      
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      const newUser = await db
        .insert(users)
        .values({
          email: email,
          password: hashedPassword,
          role: 'admin',
        })
        .returning();
        
      console.log('✅ Created new admin user:', newUser[0]);
      return NextResponse.json({ 
        message: `Created new admin user: ${email}`,
        user: newUser[0]
      });
    }
  } catch (error) {
    console.error('❌ Error making admin:', error);
    return NextResponse.json(
      { error: 'Failed to make admin' },
      { status: 500 }
    );
  }
}

