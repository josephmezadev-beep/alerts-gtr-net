'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, AlertTriangle, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    href: '/config',
    label: 'Configuración',
    icon: Settings,
  },
  {
    href: '/alerts',
    label: 'Alertas',
    icon: AlertTriangle,
  },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-cyan-500/20 bg-black/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-lg bg-cyan-500/30 blur-md" />
              <Activity className="relative h-8 w-8 text-cyan-400" />
            </div>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-xl font-bold tracking-wider text-transparent">
              GTR MONITOR
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300',
                    isActive
                      ? 'text-cyan-400'
                      : 'text-gray-400 hover:text-cyan-300'
                  )}
                >
                  {isActive && (
                    <div className="absolute inset-0 rounded-lg bg-cyan-500/10 ring-1 ring-cyan-500/30" />
                  )}
                  <Icon
                    className={cn(
                      'relative h-4 w-4 transition-transform duration-300 group-hover:scale-110',
                      isActive && 'text-cyan-400'
                    )}
                  />
                  <span className="relative">{item.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span className="text-xs text-gray-500">ONLINE</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
    </nav>
  );
}
