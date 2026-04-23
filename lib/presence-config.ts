import type { StatusMonitorConfig, Campaign } from './types';

// =====================================================
// CONFIGURACIÓN DE CAMPAÑAS (HARDCODED)
// Modifica esta lista para agregar o quitar campañas
// =====================================================
export const CAMPAIGNS_CONFIG: Campaign[] = [
  {
    id: 'c2c-privado',
    name: 'C2C Privado',
    url: 'https://api.mypurecloud.com/api/v2/routing/queues/0fd68d9a-be6d-4878-b743-3591f6d9eafc/users?queueId=0fd68d9a-be6d-4878-b743-3591f6d9eafc&pageSize=50&pageNumber=1&joined=true&sortBy=name&sortOrder=asc&expand=routingStatus%2CprimaryPresence%2Cpresence%2C',
    queueId: '0fd68d9a-be6d-4878-b743-3591f6d9eafc'
  },
  {
    id: 'c2c-publico',
    name: 'C2C Publico',
    url: 'https://api.mypurecloud.com/api/v2/routing/queues/565a3fa3-3f67-44e8-8d6d-9cb8a24a7101/users?queueId=565a3fa3-3f67-44e8-8d6d-9cb8a24a7101&pageSize=50&pageNumber=1&joined=true&sortBy=name&sortOrder=asc&expand=routingStatus%2CprimaryPresence%2Cpresence%2C',
    queueId: '565a3fa3-3f67-44e8-8d6d-9cb8a24a7101'
  },
  {
    id: 'rmkt-publico',
    name: 'RMKT Publico',
    url: 'https://api.mypurecloud.com/api/v2/routing/queues/ca4d2353-f97f-4d85-bcd0-32f1484bf3cd/users?queueId=ca4d2353-f97f-4d85-bcd0-32f1484bf3cd&pageSize=50&pageNumber=1&joined=true&sortBy=name&sortOrder=asc&expand=routingStatus%2CprimaryPresence%2Cpresence%2C',
    queueId: 'ca4d2353-f97f-4d85-bcd0-32f1484bf3cd'
  },
  {
    id: 'rmkt-privado',
    name: 'RMKT Privado',
    url: 'https://api.mypurecloud.com/api/v2/routing/queues/c164bddb-4957-4022-b0ba-2a9fc5bbdb53/users?queueId=c164bddb-4957-4022-b0ba-2a9fc5bbdb53&pageSize=50&pageNumber=1&joined=true&sortBy=name&sortOrder=asc&expand=routingStatus%2CprimaryPresence%2Cpresence%2C',
    queueId: 'c164bddb-4957-4022-b0ba-2a9fc5bbdb53'
  },
  {
    id: 'inbound',
    name: 'Inbound',
    url: 'https://api.mypurecloud.com/api/v2/routing/queues/59a585b9-5c12-4152-bc8d-0546d99ce60c/users?queueId=59a585b9-5c12-4152-bc8d-0546d99ce60c&pageSize=50&pageNumber=1&joined=true&sortBy=name&sortOrder=asc&expand=routingStatus%2CprimaryPresence%2Cpresence%2C',
    queueId: '59a585b9-5c12-4152-bc8d-0546d99ce60c'
  },
  // Agrega más campañas aquí...
  // {
  //   id: 'otra-campana',
  //   name: 'Otra Campaña',
  //   url: 'https://api.mypurecloud.com/api/v2/routing/queues/TU-QUEUE-ID/members?expand=presence,routingStatus',
  // },
];

// =====================================================
// CONFIGURACIÓN DE ESTADOS A MONITOREAR
// Aquí defines qué estados generar alertas y de qué fuente
// =====================================================
export const STATUS_MONITOR_CONFIG: StatusMonitorConfig[] = [
  // -------------------------------------------------
  // ESTADOS DESDE presence.presenceDefinition.systemPresence
  // Usan modifiedDate para calcular el tiempo
  // -------------------------------------------------
  {
    statusValue: 'Meal',
    source: 'presence',
    displayName: 'Comida',
    thresholdMinutes: 60,
    color: 'bg-amber-500',
  },
  {
    statusValue: 'Busy',
    source: 'presence',
    displayName: 'Ocupado',
    thresholdMinutes: 15,
    color: 'bg-red-500',
  },
  {
    statusValue: 'Away',
    source: 'presence',
    displayName: 'Ausente',
    thresholdMinutes: 10,
    color: 'bg-orange-500',
  },
  {
    statusValue: 'Break',
    source: 'presence',
    displayName: 'Descanso',
    thresholdMinutes: 15,
    color: 'bg-blue-500',
  },
  {
    statusValue: 'Meeting',
    source: 'presence',
    displayName: 'Reunión',
    thresholdMinutes: 60,
    color: 'bg-cyan-500',
  },
  // EJEMPLO: Available desde presence (si quieres monitorearlo)
  {
    statusValue: 'Available',
    source: 'presence',
    displayName: 'Disponible',
    thresholdMinutes: 1, // 2 horas sin actividad
    color: 'bg-green-500',
  },

  // -------------------------------------------------
  // ESTADOS DESDE routingStatus.status
  // Usan startTime para calcular el tiempo
  // -------------------------------------------------
  {
    statusValue: 'IDLE',
    source: 'routingStatus',
    displayName: 'Ocioso',
    thresholdMinutes: 2,
    color: 'bg-purple-500',
  },
  {
    statusValue: 'Offline',
    source: 'presence',
    displayName: 'Desconectado',
    thresholdMinutes: 1,
    color: 'bg-gray-500',
  },
  // {
  //   statusValue: 'offline',
  //   source: 'presence',
  //   displayName: 'Desconectado',
  //   thresholdMinutes: 10,
  //   color: 'bg-rose-500',
  // },
  // EJEMPLO: Si quieres monitorear INTERACTING
  // {
  //   statusValue: 'INTERACTING',
  //   source: 'routingStatus',
  //   displayName: 'En Interacción',
  //   thresholdMinutes: 30,
  //   color: 'bg-teal-500',
  // },
];

// =====================================================
// FUNCIONES HELPER
// =====================================================

export function getStatusConfig(statusValue: string, source: 'presence' | 'routingStatus'): StatusMonitorConfig | undefined {
  return STATUS_MONITOR_CONFIG.find(
    (config) =>
      config.statusValue.toLowerCase() === statusValue.toLowerCase() &&
      config.source === source
  );
}

export function getDisplayPresence(statusValue: string, source: 'presence' | 'routingStatus'): string {
  const config = getStatusConfig(statusValue, source);
  return config?.displayName || statusValue;
}

export function getThresholdMinutes(statusValue: string, source: 'presence' | 'routingStatus'): number {
  const config = getStatusConfig(statusValue, source);
  return config?.thresholdMinutes ?? -1; // -1 significa no monitorear
}

export function getPresenceColor(statusValue: string, source: 'presence' | 'routingStatus'): string {
  const config = getStatusConfig(statusValue, source);
  return config?.color || 'bg-gray-500';
}

// Verifica si un estado está configurado para ser monitoreado
export function isStatusMonitored(statusValue: string, source: 'presence' | 'routingStatus'): boolean {
  return STATUS_MONITOR_CONFIG.some(
    (config) =>
      config.statusValue.toLowerCase() === statusValue.toLowerCase() &&
      config.source === source
  );
}
