import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Alert } from './types';

interface AppState {
  alerts: Alert[];
  notificationsEnabled: boolean;
  notifiedAgents: Set<string>;

  setAlerts: (alerts: Alert[]) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  addNotifiedAgent: (agentId: string) => void;
  clearNotifiedAgents: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      alerts: [],
      notificationsEnabled: false,
      notifiedAgents: new Set<string>(),

      setAlerts: (alerts) => set({ alerts }),

      setNotificationsEnabled: (enabled) =>
        set({ notificationsEnabled: enabled }),

      addNotifiedAgent: (agentId) =>
        set((state) => {
          const newSet = new Set(state.notifiedAgents);
          newSet.add(agentId);
          return { notifiedAgents: newSet };
        }),

      clearNotifiedAgents: () =>
        set({ notifiedAgents: new Set<string>() }),
    }),
    {
      name: 'callcenter-monitor-storage',

      // 👇 ya no guardas token
      partialize: (state) => ({
        notificationsEnabled: state.notificationsEnabled,
      }),
    }
  )
);