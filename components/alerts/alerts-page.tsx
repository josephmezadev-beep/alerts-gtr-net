'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { AlertTriangle, RefreshCw, Settings, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { useNotifications } from '@/hooks/use-notifications';
import { getElapsedMinutes } from '@/lib/time-utils';
import {
  CAMPAIGNS_CONFIG,
  getDisplayPresence,
  getThresholdMinutes,
  isStatusMonitored,
} from '@/lib/presence-config';
import type { AlertAgent, QueueResponse, StatusSource } from '@/lib/types';
import { CampaignGroup } from './campaign-group';
import { NotificationControls } from './notification-controls';
import { Button } from '@/components/ui/button';

export function AlertsPage() {
  const {
    token,
    alerts,
    setAlerts,
    notificationsEnabled,
    notifiedAgents,
    addNotifiedAgent,
  } = useAppStore();

  const { sendNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const notifiedAgentsRef = useRef(notifiedAgents);

  useEffect(() => {
    notifiedAgentsRef.current = notifiedAgents;
  }, [notifiedAgents]);

  const processAgent = useCallback(
    (
      entity: QueueResponse['entities'][0],
      campaign: (typeof CAMPAIGNS_CONFIG)[0]
    ): AlertAgent[] => {
      const agentAlerts: AlertAgent[] = [];
      const user = entity.user;

      if (!user?.name) return agentAlerts;

      // -------------------------------------------------
      // Procesar estados desde PRESENCE
      // -------------------------------------------------
      if (user.presence?.presenceDefinition?.systemPresence) {
        const statusValue = user.presence.presenceDefinition.systemPresence;
        const source: StatusSource = 'presence';

        if (isStatusMonitored(statusValue, source)) {
          const modifiedDate = user.presence.modifiedDate;
          const elapsedMinutes = getElapsedMinutes(modifiedDate);
          const threshold = getThresholdMinutes(statusValue, source);

          if (threshold > 0 && elapsedMinutes > threshold) {
            const agentId = `${campaign.id}-${user.name}-presence-${statusValue}`;

            agentAlerts.push({
              id: agentId,
              name: user.name,
              campaignName: campaign.name,
              campaignId: campaign.id,
              systemPresence: statusValue,
              displayPresence: getDisplayPresence(statusValue, source),
              modifiedDate,
              elapsedMinutes,
              threshold,
              source,
            });
          }
        }
      }

      // -------------------------------------------------
      // Procesar estados desde ROUTING STATUS
      // -------------------------------------------------
      if (user.routingStatus?.status) {
        const statusValue = user.routingStatus.status;
        const source: StatusSource = 'routingStatus';

        if (isStatusMonitored(statusValue, source)) {
          const startTime = user.routingStatus.startTime;
          const elapsedMinutes = getElapsedMinutes(startTime);
          const threshold = getThresholdMinutes(statusValue, source);

          if (threshold > 0 && elapsedMinutes > threshold) {
            const agentId = `${campaign.id}-${user.name}-routing-${statusValue}`;

            agentAlerts.push({
              id: agentId,
              name: user.name,
              campaignName: campaign.name,
              campaignId: campaign.id,
              systemPresence: statusValue,
              displayPresence: getDisplayPresence(statusValue, source),
              modifiedDate: startTime,
              elapsedMinutes,
              threshold,
              source,
            });
          }
        }
      }

      return agentAlerts;
    },
    []
  );

  const fetchAlerts = useCallback(async () => {
    if (!token || CAMPAIGNS_CONFIG.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const allAlerts: AlertAgent[] = [];

      for (const campaign of CAMPAIGNS_CONFIG) {
        try {
          const response = await fetch(campaign.url, {
            headers: {
              Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            console.error(`Error fetching ${campaign.name}: ${response.status}`);
            continue;
          }

          const data: QueueResponse = await response.json();

          if (data.entities) {
            for (const entity of data.entities) {
              const agentAlerts = processAgent(entity, campaign);
              allAlerts.push(...agentAlerts);
            }
          }
        } catch (err) {
          console.error(`Error processing ${campaign.name}:`, err);
        }
      }

      setAlerts(allAlerts);
      setLastUpdate(new Date());

      if (notificationsEnabled) {
        for (const agent of allAlerts) {
          if (!notifiedAgentsRef.current.has(agent.id)) {
            sendNotification(agent);
            addNotifiedAgent(agent.id);
          }
        }
      }
    } catch (err) {
      setError('Error al obtener datos. Verifica tu token y conexión.');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token, setAlerts, notificationsEnabled, sendNotification, addNotifiedAgent, processAgent]);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 20000); // Actualiza cada 1 minuto
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  const groupedAlerts = alerts.reduce<Record<string, AlertAgent[]>>((acc, alert) => {
    if (!acc[alert.campaignName]) {
      acc[alert.campaignName] = [];
    }
    acc[alert.campaignName].push(alert);
    return acc;
  }, {});

  const totalAlerts = alerts.length;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 ring-1 ring-amber-500/30">
            <Settings className="h-8 w-8 text-amber-400" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-100">Configuración Requerida</h2>
          <p className="mb-4 text-gray-400">
            Necesitas configurar un token de autorización.
          </p>
          <Link href="/config">
            <Button className="bg-cyan-600 text-white hover:bg-cyan-500">
              <Settings className="mr-2 h-4 w-4" />
              Ir a Configuración
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 ring-1 ring-red-500/30">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <h1 className="bg-gradient-to-r from-gray-100 via-red-200 to-orange-200 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
                Centro de Alertas
              </h1>
              {totalAlerts > 0 && (
                <span className="rounded-full bg-red-500 px-2.5 py-0.5 text-sm font-bold text-white">
                  {totalAlerts}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{CAMPAIGNS_CONFIG.length} campañas configuradas</span>
              {lastUpdate && (
                <span>
                  Última actualización: {lastUpdate.toLocaleTimeString('es-PE')}
                </span>
              )}
              {error && (
                <span className="flex items-center gap-1 text-red-400">
                  <XCircle className="h-3 w-3" />
                  {error}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationControls />
            <Button
              onClick={fetchAlerts}
              disabled={isLoading}
              variant="outline"
              className="gap-2 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Actualizar
            </Button>
          </div>
        </div>

        {totalAlerts === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-700 bg-gray-900/30 py-16">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 ring-1 ring-green-500/30">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-100">Sin Alertas</h2>
            <p className="text-gray-400">
              Todos los agentes están dentro de los tiempos permitidos.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedAlerts).map(([campaignName, agents]) => (
              <CampaignGroup key={campaignName} campaignName={campaignName} agents={agents} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
