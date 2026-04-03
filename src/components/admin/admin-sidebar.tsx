'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  Settings,
  Truck,
  FileText,
  BookOpen,
  Building2
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Cégek', href: '/admin/companies', icon: Building2 },
  { name: 'Deliveries', href: '/admin/deliveries', icon: Truck },
  { name: 'Billing', href: '/admin/billing', icon: FileText },
  { name: 'Modern Orders', href: '/admin/modern-orders', icon: Package },
  { name: 'Blog', href: '/admin/blog', icon: BookOpen },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-950/50 border-r dark:border-gray-800 min-h-screen">
      <nav className="mt-6 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
