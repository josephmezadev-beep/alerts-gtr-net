'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AlertAgent } from './types';

interface AppState {
  token: string;
  alerts: AlertAgent[];
  notificationsEnabled: boolean;
  notifiedAgents: Set<string>;
  setToken: (token: string) => void;
  setAlerts: (alerts: AlertAgent[]) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  addNotifiedAgent: (agentId: string) => void;
  clearNotifiedAgents: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      token: '',
      alerts: [],
      notificationsEnabled: false,
      notifiedAgents: new Set<string>(),
      setToken: (token) => set({ token }),
      setAlerts: (alerts) => set({ alerts }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      addNotifiedAgent: (agentId) =>
        set((state) => {
          const newSet = new Set(state.notifiedAgents);
          newSet.add(agentId);
          return { notifiedAgents: newSet };
        }),
      clearNotifiedAgents: () => set({ notifiedAgents: new Set<string>() }),
    }),
    {
      name: 'callcenter-monitor-storage',
      partialize: (state) => ({
        token: state.token,
        notificationsEnabled: state.notificationsEnabled,
      }),
    }
  )
);
