import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { kostoloRegistrations } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { Ticket } from 'lucide-react';
import { KostoloList } from '@/components/admin/kostolo-list';

export const dynamic = 'force-dynamic';

export default async function KostoloPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    redirect('/auth/signin');
  }

  const registrations = await db
    .select()
    .from(kostoloRegistrations)
    .orderBy(desc(kostoloRegistrations.createdAt));

  const total = registrations.length;
  const marketingOptIns = registrations.filter((r) => r.acceptedMarketing).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Kóstoló Regisztrációk</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            A /kostolo oldalon kiállított kóstolójegyek és marketing hozzájárulások
          </p>
        </div>
        <Ticket className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 border-l-4 border-gray-400">
          <div className="text-sm text-gray-500 dark:text-gray-400">Összes regisztráció</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{total}</div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 border-l-4 border-green-500">
          <div className="text-sm text-gray-500 dark:text-gray-400">Marketing hozzájárulás</div>
          <div className="text-2xl font-bold text-green-600">{marketingOptIns}</div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <div className="text-sm text-gray-500 dark:text-gray-400">Hozzájárulási arány</div>
          <div className="text-2xl font-bold text-blue-600">
            {total > 0 ? Math.round((marketingOptIns / total) * 100) : 0}%
          </div>
        </div>
      </div>

      <KostoloList registrations={registrations} />
    </div>
  );
}
