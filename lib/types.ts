// =====================================================
// CONFIGURACIÓN DE CAMPAÑAS
// =====================================================

// Tipo de fuente para determinar de dónde obtener el estado
// 'presence' = usa .presence.presenceDefinition.systemPresence con modifiedDate
// 'routingStatus' = usa .routingStatus.status con startTime
export type StatusSource = 'presence' | 'routingStatus';

export interface Campaign {
  id: string;
  name: string;
  url: string;
}

// Configuración de qué estados monitorear y de qué fuente
export interface StatusMonitorConfig {
  // El valor del estado a buscar (ej: 'Meal', 'IDLE', 'Available')
  statusValue: string;
  // De dónde obtener el estado
  source: StatusSource;
  // Nombre para mostrar en la UI
  displayName: string;
  // Umbral en minutos después del cual se genera alerta
  thresholdMinutes: number;
  // Color para la card
  color: string;
}

// =====================================================
// RESPUESTA DE LA API
// =====================================================

export interface PresenceDefinition {
  id: string;
  systemPresence: string;
  selfUri: string;
}

export interface Presence {
  source: string;
  presenceDefinition: PresenceDefinition;
  message: string;
  modifiedDate: string;
}

export interface RoutingStatus {
  status: string;
  startTime: string;
}

export interface User {
  name: string;
  presence: Presence;
  routingStatus?: RoutingStatus;
}

export interface AgentEntity {
  user: User;
}

export interface QueueResponse {
  entities: AgentEntity[];
}

// =====================================================
// ALERTAS
// =====================================================

export interface AlertAgent {
  id: string;
  name: string;
  campaignName: string;
  campaignId: string;
  systemPresence: string;
  displayPresence: string;
  modifiedDate: string;
  elapsedMinutes: number;
  threshold: number;
  source: StatusSource;
}

// Legacy - para compatibilidad
export interface PresenceConfig {
  systemPresence: string;
  displayName: string;
  thresholdMinutes: number;
  color: string;
}
