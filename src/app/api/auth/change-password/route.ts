import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { changePasswordSchema } from '@/lib/validations';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = rateLimit(`change-password:${getClientIp(request)}`, { limit: 5, windowSeconds: 60 });
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nem vagy bejelentkezve' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = changePasswordSchema.parse(body);

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (user.length === 0 || !user[0].password) {
      return NextResponse.json({ error: 'Felhasználó nem található' }, { status: 404 });
    }

    const isCurrentPasswordValid = await bcrypt.compare(validatedData.currentPassword, user[0].password);
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: 'A jelenlegi jelszó helytelen' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 12);

    await db
      .update(users)
      .set({ password: hashedPassword, requirePasswordChange: false })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({ message: 'Jelszó sikeresen megváltoztatva' });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Érvénytelen adatok' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Szerverhiba történt' }, { status: 500 });
  }
}
