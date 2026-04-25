export interface Campaign {
  id: string;
  name: string;
  queueId: string;
}

export interface Alert {
  name: string;
  status: string;
  status_name: string;
  source: string;
  elapsed: number;
  threshold: number;
  level: 'info' | 'warning' | 'critical';
}

export interface QueueResponse {
  queueId: string;
  name: string;
  alerts: Alert[];
  stats: {
    total: number;
    connected: number;
  };
  metrics: {
    interacting: number;
    waiting: number;
  };
}