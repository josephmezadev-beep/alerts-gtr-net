'use client';

import { useEffect, useCallback, useState } from 'react';
import {
  RefreshCw,
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

import { useAppStore } from '@/lib/store';
import { useNotifications } from '@/hooks/use-notifications';
import { CampaignGroup } from './campaign-group';
import { NotificationControls } from './notification-controls';
import { Button } from '@/components/ui/button';

type BackendQueueResponse = {
  queueId: string;
  name: string;
  alerts: any[];
  stats: { total: number; connected: number };
  metrics: { interacting: number; waiting: number };
};

export function AlertsPage() {
  const {
    alerts,
    setAlerts,
    notificationsEnabled,
    notifiedAgents,
    addNotifiedAgent,
  } = useAppStore();

  const { sendNotification } = useNotifications();

  const [mounted, setMounted] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queuesData, setQueuesData] = useState<BackendQueueResponse[]>([]);

  // -----------------------------
  // FIX HYDRATION
  // -----------------------------
  useEffect(() => {
    setMounted(true);
  }, []);

  // -----------------------------
  // FETCH ALERTS
  // -----------------------------
  const fetchAlerts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`
      );

      if (!res.ok) throw new Error('Error backend');

      const data: BackendQueueResponse[] = await res.json();
      console.log(data);

      setQueuesData(data);

      // -----------------------------------------
      // 🔥 ALERTS + NOTIFICATIONS (SIN FLATMAP)
      // -----------------------------------------
      const normalizedAlerts: any[] = [];

      for (const queue of data) {
        const alerts = queue.alerts ?? [];

        for (const alert of alerts) {
          if (!alert?.name) continue;

          normalizedAlerts.push(alert);

          // -----------------------------
          // 🔔 NOTIFICATIONS
          // -----------------------------
          if (notificationsEnabled) {
            if (!notifiedAgents.has(alert.name)) {
              sendNotification({
                alert,
                campaignName: queue.name,
              });

              addNotifiedAgent(alert.name);
            }
          }
        }
      }

      setAlerts(normalizedAlerts);
    } catch (e) {
      console.log(e);
      setError('Error al obtener datos');
    } finally {
      setIsLoading(false);
    }
  }, [
    notificationsEnabled,
    notifiedAgents,
    sendNotification,
    addNotifiedAgent,
    setAlerts,
  ]);

  // -----------------------------
  // INIT + POLLING
  // -----------------------------
  useEffect(() => {
    if (!mounted) return;

    fetchAlerts();

    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, [mounted, fetchAlerts]);

  const totalAlerts = alerts.length;

  // -----------------------------
  // IMPORTANT: evita SSR mismatch
  // -----------------------------
  if (!mounted) return null;

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-4">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            Centro de Alertas {totalAlerts > 0 && `(${totalAlerts})`}
          </h1>

          <div className="flex gap-2">
            <NotificationControls />

            <Button onClick={fetchAlerts} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <RefreshCw />
              )}
              Actualizar
            </Button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 flex items-center gap-2 text-red-400">
            <XCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* CONTENT */}
        {queuesData.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <CheckCircle2 className="h-10 w-10 text-green-400" />
            <p>Sin alertas</p>
          </div>
        ) : (
          <div className="space-y-6">
            {queuesData.map((queue) => (
              <CampaignGroup
                key={queue.queueId}
                campaignName={queue.name}
                agents={queue.alerts}
                stats={queue.stats}
                queueMetrics={queue.metrics}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}