'use client';

import { Bell, BellOff, Check, X } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useNotifications } from '@/hooks/use-notifications';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function NotificationControls() {
  const { notificationsEnabled, setNotificationsEnabled } = useAppStore();
  const { permission, requestPermission, isSupported } = useNotifications();

  const handleToggle = async () => {
    if (!notificationsEnabled && permission !== 'granted') {
      const granted = await requestPermission();
      if (granted) {
        setNotificationsEnabled(true);
      }
    } else {
      setNotificationsEnabled(!notificationsEnabled);
    }
  };

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-gray-800/50 px-3 py-2 text-sm text-gray-500">
        <BellOff className="h-4 w-4" />
        <span>Notificaciones no soportadas</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={handleToggle}
        variant="outline"
        className={cn(
          'gap-2 transition-all',
          notificationsEnabled
            ? 'border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-300'
            : 'border-gray-600 text-gray-400 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400'
        )}
      >
        {notificationsEnabled ? (
          <>
            <Bell className="h-4 w-4" />
            <span>Notificaciones ON</span>
            <Check className="h-3 w-3" />
          </>
        ) : (
          <>
            <BellOff className="h-4 w-4" />
            <span>Notificaciones OFF</span>
          </>
        )}
      </Button>

      {permission === 'denied' && (
        <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">
          <X className="h-3 w-3" />
          <span>Permisos denegados en el navegador</span>
        </div>
      )}
    </div>
  );
}
