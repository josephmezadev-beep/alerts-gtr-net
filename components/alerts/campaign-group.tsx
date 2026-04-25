'use client';

import { Radio, Users } from 'lucide-react';
import type { Alert } from '@/lib/types';
import { AlertCard } from './alert-card';

interface CampaignGroupProps {
  campaignName: string;
  agents: Alert[];
  stats?: {
    total: number;
    connected: number;
  };
  queueMetrics?: {
    interacting: number;
    waiting: number;
  };
}

export function CampaignGroup({ campaignName, agents, stats, queueMetrics }: CampaignGroupProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 ring-1 ring-blue-500/30">
          <Radio className="h-4 w-4 text-blue-400" />
        </div>
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-100">{campaignName}</h2>
          <div className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-red-400">
            <Users className="h-3 w-3" />
            <span>{agents.length} alerta{agents.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div className="flex gap-3 text-gray-400">
          <span>
            👥 <span className="text-green-400">{stats?.connected ?? 0}</span>/{stats?.total ?? 0}
          </span>

          <span>📞 {queueMetrics?.interacting ?? 0}</span>

          <span>⏳ {queueMetrics?.waiting ?? 0}</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <AlertCard key={agent.name} agent={agent} />
        ))}
      </div>
    </div>
  );
}
