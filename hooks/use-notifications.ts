'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Alert } from '@/lib/types';
import { formatElapsedTime } from '@/lib/time-utils';

type NotifyParams = {
  alert: Alert;
  campaignName: string;
};

export function useNotifications() {
  const [permission, setPermission] =
    useState<NotificationPermission>('default');

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
    ({ alert, campaignName }: NotifyParams) => {
      if (permission !== 'granted') return;

      const title = `⚠️ Alerta de Tiempo Excedido`;

      const body = `${alert.name} - ${campaignName}
${alert.status_name}: ${formatElapsedTime(alert.elapsed)} (Límite: ${alert.threshold} min)`;

      const notification = new Notification(title, {
        body,
        icon: '/icon.svg',
        tag: alert.name,
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