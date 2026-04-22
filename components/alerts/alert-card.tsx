'use client';

import { User, Clock, AlertTriangle } from 'lucide-react';
import type { AlertAgent } from '@/lib/types';
import { formatElapsedTime } from '@/lib/time-utils';
import { getPresenceColor } from '@/lib/presence-config';
import { cn } from '@/lib/utils';

interface AlertCardProps {
  agent: AlertAgent;
}

export function AlertCard({ agent }: AlertCardProps) {
  const presenceColor = getPresenceColor(agent.systemPresence, agent.source);
  const overTimeMinutes = agent.elapsedMinutes - agent.threshold;

  return (
    <div className="group relative overflow-hidden rounded-lg border border-red-500/30 bg-gray-900/80 p-4 transition-all duration-300 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-red-500/5 blur-2xl transition-all group-hover:bg-red-500/10" />
      
      <div className="relative">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 ring-2 ring-red-500/30">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <div className={cn('absolute -bottom-1 -right-1 h-4 w-4 rounded-full ring-2 ring-gray-900', presenceColor)} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-100 leading-tight">{agent.name}</h3>
              <p className="text-xs text-cyan-400">{agent.campaignName}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-1 text-xs text-red-400">
            <AlertTriangle className="h-3 w-3" />
            <span>+{overTimeMinutes} min</span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-gray-800/50 px-3 py-2">
          <div className="flex items-center gap-2">
            <div className={cn('h-2 w-2 animate-pulse rounded-full', presenceColor)} />
            <span className="text-sm font-medium text-gray-300">{agent.displayPresence}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <Clock className="h-3.5 w-3.5" />
            <span className="font-mono text-sm font-semibold text-red-400">
              {formatElapsedTime(agent.elapsedMinutes)}
            </span>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>Límite: {agent.threshold} min</span>
          <span className="text-red-400">Excedido por {formatElapsedTime(overTimeMinutes)}</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />
    </div>
  );
}
