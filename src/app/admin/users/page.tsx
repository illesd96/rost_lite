import { db } from '@/lib/db';
import { users, orders } from '@/lib/db/schema';
import { eq, count, desc } from 'drizzle-orm';
import { formatPrice } from '@/lib/utils';
import { UserManagement } from '@/components/admin/user-management';
import { Users, UserPlus } from 'lucide-react';

export default async function AdminUsersPage() {
  // Fetch all users with order statistics
  const allUsers = await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  // Get order statistics for each user
  const userStats = await Promise.all(
    allUsers.map(async (user) => {
      const orderCount = await db
        .select({ count: count() })
        .from(orders)
        .where(eq(orders.userId, user.id));
      
      const totalSpent = await db
        .select({ total: count() })
        .from(orders)
        .where(eq(orders.userId, user.id));

      return {
        ...user,
        orderCount: orderCount[0].count,
        totalSpent: totalSpent[0].total,
      };
    })
  );

  const totalUsers = allUsers.length;
  const adminUsers = allUsers.filter(user => user.role === 'admin').length;
  const customerUsers = allUsers.filter(user => user.role === 'customer').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Users className="w-4 h-4" />
          <span>{totalUsers} total users</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customerUsers}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-gray-900">{adminUsers}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Users ({totalUsers})
          </h2>
        </div>
        
        <UserManagement users={userStats} />
      </div>
    </div>
  );
}
