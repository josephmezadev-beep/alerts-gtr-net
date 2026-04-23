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

  const [campaignStats, setCampaignStats] = useState<
    Record<string, { total: number; connected: number }>
  >({});

  const [queueMetrics, setQueueMetrics] = useState<
    Record<string, { interacting: number; waiting: number }>
  >({});

  useEffect(() => {
    notifiedAgentsRef.current = notifiedAgents;
  }, [notifiedAgents]);

  // ---------------------------
  // Procesar agentes
  // ---------------------------
  const processAgent = useCallback(
    (entity: QueueResponse['entities'][0], campaign: (typeof CAMPAIGNS_CONFIG)[0]): AlertAgent[] => {
      const agentAlerts: AlertAgent[] = [];
      const user = entity.user;

      if (!user?.name) return agentAlerts;

      if (user.presence?.presenceDefinition?.systemPresence) {
        const statusValue = user.presence.presenceDefinition.systemPresence;
        const source: StatusSource = 'presence';

        if (isStatusMonitored(statusValue, source)) {
          const modifiedDate = user.presence.modifiedDate;
          const elapsedMinutes = getElapsedMinutes(modifiedDate);
          const threshold = getThresholdMinutes(statusValue, source);

          if (threshold > 0 && elapsedMinutes > threshold) {
            if (statusValue === 'Offline' && elapsedMinutes > 5) return agentAlerts;

            agentAlerts.push({
              id: `${campaign.id}-${user.name}-presence-${statusValue}`,
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

      if (user.routingStatus?.status) {
        const statusValue = user.routingStatus.status;
        const source: StatusSource = 'routingStatus';

        if (isStatusMonitored(statusValue, source)) {
          const startTime = user.routingStatus.startTime;
          const elapsedMinutes = getElapsedMinutes(startTime);
          const threshold = getThresholdMinutes(statusValue, source);

          if (threshold > 0 && elapsedMinutes > threshold) {
            agentAlerts.push({
              id: `${campaign.id}-${user.name}-routing-${statusValue}`,
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

  // ---------------------------
  // Fetch métricas de cola
  // ---------------------------
  const fetchQueueMetrics = async (queueId: string) => {
    const response = await fetch(
      '/.netlify/functions/genesys-proxy?url=' +
        encodeURIComponent(
          'https://api.mypurecloud.com/api/v2/analytics/queues/observations/query'
        ),
      {
        method: 'POST',
        headers: {
          Authorization: token.startsWith('Bearer ')
            ? token
            : `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: {
            type: 'and',
            predicates: [
              { type: 'dimension', dimension: 'queueId', operator: 'matches', value: queueId },
              { type: 'dimension', dimension: 'mediaType', operator: 'matches', value: 'voice' },
            ],
          },
          metrics: ['oWaiting', 'oInteracting'],
          groupBy: ['queueId', 'mediaType'],
        }),
      }
    );

    if (!response.ok) return { interacting: 0, waiting: 0 };

    const data = await response.json();
    const results = data.results ?? [];

    let interacting = 0;
    let waiting = 0;

    for (const group of results) {
      for (const metric of group.data ?? []) {
        if (metric.metric === 'oInteracting') {
          interacting += metric.stats?.count ?? 0;
        }
        if (metric.metric === 'oWaiting') {
          waiting += metric.stats?.count ?? 0;
        }
      }
    }

    return { interacting, waiting };
  };

  // ---------------------------
  // Fetch principal
  // ---------------------------
  const fetchAlerts = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const allAlerts: AlertAgent[] = [];
      const stats: Record<string, { total: number; connected: number }> = {};
      const queueStats: Record<string, { interacting: number; waiting: number }> = {};

      await Promise.all(
        CAMPAIGNS_CONFIG.map(async (campaign) => {
          try {
            // 🔥 Fetch cola
            const queueData = await fetchQueueMetrics(campaign.queueId);
            queueStats[campaign.name] = queueData;

            // 🔥 Fetch agentes
            const response = await fetch(
              `/.netlify/functions/genesys-proxy?url=${encodeURIComponent(campaign.url)}`,
              {
                headers: {
                  Authorization: token.startsWith('Bearer ')
                    ? token
                    : `Bearer ${token}`,
                },
              }
            );

            if (!response.ok) return;

            const data: QueueResponse = await response.json();

            for (const entity of data.entities || []) {
              const user = entity.user;

              if (user?.name) {
                if (!stats[campaign.name]) {
                  stats[campaign.name] = { total: 0, connected: 0 };
                }

                stats[campaign.name].total++;

                const presence = user.presence?.presenceDefinition?.systemPresence;
                if (presence && presence !== 'Offline') {
                  stats[campaign.name].connected++;
                }
              }

              allAlerts.push(...processAgent(entity, campaign));
            }
          } catch (err) {
            console.error(`Error en ${campaign.name}`, err);
          }
        })
      );

      setAlerts(allAlerts);
      setCampaignStats(stats);
      setQueueMetrics(queueStats);
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
      setError('Error al obtener datos.');
    } finally {
      setIsLoading(false);
    }
  }, [token, processAgent]);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  const groupedAlerts = alerts.reduce<Record<string, AlertAgent[]>>((acc, alert) => {
    if (!acc[alert.campaignName]) acc[alert.campaignName] = [];
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
            {/* {Object.entries(groupedAlerts).map(([campaignName, agents]) => (
              <CampaignGroup key={campaignName} campaignName={campaignName} agents={agents} stats={campaignStats[campaignName]} />
            ))} */}
            {CAMPAIGNS_CONFIG.map((campaign) => (
              <CampaignGroup
                key={campaign.name}
                campaignName={campaign.name}
                agents={groupedAlerts[campaign.name] || []}
                stats={campaignStats[campaign.name]}
                queueMetrics={queueMetrics[campaign.name]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
