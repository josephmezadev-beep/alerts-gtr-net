'use client';

import { User, Clock, AlertTriangle } from 'lucide-react';
import type { Alert } from '@/lib/types';
import { formatElapsedTime } from '@/lib/time-utils';
import { cn } from '@/lib/utils';

interface AlertCardProps {
  agent: Alert;
}

// UI helper (solo visual)
function getLevelStyles(level?: string) {
  switch (level) {
    case 'critical':
      return {
        border: 'border-red-500/50',
        glow: 'shadow-red-500/20',
        badge: 'bg-red-500/20 text-red-400',
        dot: 'bg-red-500',
      };

    case 'warning':
      return {
        border: 'border-green-500/40',
        glow: 'shadow-green-500/10',
        badge: 'bg-green-500/20 text-green-400',
        dot: 'bg-green-500',
      };

    default:
      return {
        border: 'border-blue-500/20',
        glow: 'shadow-blue-500/10',
        badge: 'bg-blue-500/20 text-blue-400',
        dot: 'bg-blue-500',
      };
  }
}

export function AlertCard({ agent }: AlertCardProps) {
  const styles = getLevelStyles(agent.level);

  const overTime = agent.elapsed - agent.threshold;

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border bg-gray-900/80 p-4 transition-all duration-300 hover:shadow-lg',
        styles.border,
        styles.glow
      )}
    >
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/5 blur-2xl transition-all group-hover:bg-white/10" />

      <div className="relative">
        {/* HEADER */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 ring-2 ring-white/10">
              <User className="h-5 w-5 text-gray-400" />
            </div>

            <div>
              <h3 className="font-semibold text-gray-100 leading-tight">
                {agent.name}
              </h3>
              <p className="text-xs text-gray-400">{agent.status_name}</p>
            </div>
          </div>

          <div className={cn('rounded-full px-2 py-1 text-xs', styles.badge)}>
            <AlertTriangle className="mr-1 inline h-3 w-3" />
            +{overTime} min
          </div>
        </div>

        {/* STATUS ROW */}
        <div className="flex items-center justify-between rounded-lg bg-gray-800/50 px-3 py-2">
          <div className="flex items-center gap-2">
            <div className={cn('h-2 w-2 animate-pulse rounded-full', styles.dot)} />
            <span className="text-sm font-medium text-gray-300">
              {agent.status_name}
            </span>
          </div>

          <div className="flex items-center gap-1 text-gray-400">
            <Clock className="h-3.5 w-3.5" />
            <span className="font-mono text-sm font-semibold text-white">
              {formatElapsedTime(agent.elapsed)}
            </span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>Límite: {agent.threshold ?? '-'} seg</span>
          <span className="text-gray-400">
            Exceso: {formatElapsedTime(overTime) ?? '-'}
          </span>
        </div>
      </div>

      {/* bottom accent */}
      <div className={cn('absolute bottom-0 left-0 h-1 w-full', styles.dot)} />
    </div>
  );
}