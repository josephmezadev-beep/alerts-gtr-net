'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AlertAgent } from '@/lib/types';
import { formatElapsedTime } from '@/lib/time-utils';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    }
    return false;
  }, []);

  const sendNotification = useCallback(
    (agent: AlertAgent) => {
      if (permission !== 'granted') return;

      const title = `⚠️ Alerta de Tiempo Excedido`;
      const body = `${agent.name} - ${agent.campaignName}\n${agent.displayPresence}: ${formatElapsedTime(agent.elapsedMinutes)} (Límite: ${agent.threshold} min)`;

      const notification = new Notification(title, {
        body,
        icon: '/icon.svg',
        tag: agent.id,
        requireInteraction: true,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      setTimeout(() => notification.close(), 10000);
    },
    [permission]
  );

  return {
    permission,
    requestPermission,
    sendNotification,
    isSupported: typeof window !== 'undefined' && 'Notification' in window,
  };
}
