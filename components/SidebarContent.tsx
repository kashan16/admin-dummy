'use client';

import {
  Calendar,
  LayoutDashboard,
  ShoppingCart,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/reservations', label: 'Reservations', icon: Calendar },
  { href: '/admin/customers', label: 'Customers', icon: Users },
];

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {nav.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== '/' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={[
              'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
              active
                ? 'bg-[#FB7185] text-white shadow-sm'
                : 'text-rose-900/80 hover:bg-rose-200/60 hover:text-rose-900',
            ].join(' ')}
          >
            <item.icon
              className={[
                'h-4 w-4 shrink-0',
                active ? 'text-white' : 'text-rose-700',
              ].join(' ')}
            />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
