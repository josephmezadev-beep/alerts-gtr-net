'use client';

import { Clock, Info, Database, Radio } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { STATUS_MONITOR_CONFIG, CAMPAIGNS_CONFIG } from '@/lib/presence-config';

export function PresenceThresholdsInfo() {
  const presenceStatuses = STATUS_MONITOR_CONFIG.filter((c) => c.source === 'presence');
  const routingStatuses = STATUS_MONITOR_CONFIG.filter((c) => c.source === 'routingStatus');

  return (
    <div className="space-y-6">
      {/* Campañas configuradas */}
      <Card className="border-cyan-500/20 bg-gray-900/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-500/10 p-2 ring-1 ring-cyan-500/30">
              <Radio className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-100">Campañas Configuradas</CardTitle>
              <CardDescription className="text-gray-400">
                {CAMPAIGNS_CONFIG.length} campañas monitoreadas
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {CAMPAIGNS_CONFIG.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center gap-3 rounded-lg border border-gray-700/50 bg-gray-800/30 p-3"
              >
                <div className="h-2 w-2 rounded-full bg-cyan-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-200">{campaign.name}</p>
                  {/* <p className="max-w-md truncate font-mono text-xs text-gray-500">
                    {campaign.url}
                  </p> */}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Umbrales de tiempo */}
      <Card className="border-amber-500/20 bg-gray-900/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-500/10 p-2 ring-1 ring-amber-500/30">
              <Info className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-100">Umbrales de Tiempo</CardTitle>
              <CardDescription className="text-gray-400">
                Tiempos máximos permitidos por cada estado antes de generar una alerta
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Estados desde Presence */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-400" />
              <h4 className="text-sm font-medium text-blue-400">
                Desde presence.presenceDefinition.systemPresence
              </h4>
              <span className="text-xs text-gray-500">(usa modifiedDate)</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {presenceStatuses.map((config) => (
                <div
                  key={config.statusValue}
                  className="flex items-center gap-3 rounded-lg border border-gray-700/50 bg-gray-800/30 p-3"
                >
                  <div className={`h-3 w-3 rounded-full ${config.color}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-200">{config.displayName}</p>
                    <p className="text-xs text-gray-500">{config.statusValue}</p>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span className="text-sm font-medium">{config.thresholdMinutes} min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estados desde Routing Status */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Database className="h-4 w-4 text-purple-400" />
              <h4 className="text-sm font-medium text-purple-400">
                Desde routingStatus.status
              </h4>
              <span className="text-xs text-gray-500">(usa startTime)</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {routingStatuses.map((config) => (
                <div
                  key={config.statusValue}
                  className="flex items-center gap-3 rounded-lg border border-gray-700/50 bg-gray-800/30 p-3"
                >
                  <div className={`h-3 w-3 rounded-full ${config.color}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-200">{config.displayName}</p>
                    <p className="text-xs text-gray-500">{config.statusValue}</p>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span className="text-sm font-medium">{config.thresholdMinutes} min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
