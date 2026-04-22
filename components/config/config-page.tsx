'use client';

import { TokenForm } from './token-form';
// import { CampaignForm } from './campaign-form';
import { PresenceThresholdsInfo } from './presence-thresholds-info';
import { Zap, Code } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ConfigPage() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-400">
            <Zap className="h-4 w-4" />
            <span>Panel de Configuración</span>
          </div>
          <h1 className="bg-gradient-to-r from-gray-100 via-cyan-200 to-blue-200 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            Configuración del Monitor
          </h1>
          <p className="mt-2 text-gray-400">
            Configura tu token de autorización
          </p>
        </div>

        <div className="grid gap-6">
          <TokenForm />
          
          {/* Formulario de campañas comentado - Las campañas se configuran en código */}
          {/* <CampaignForm /> */}
          
          {/* Información sobre configuración en código */}
          {/* <Card className="border-blue-500/20 bg-gray-900/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/10 p-2 ring-1 ring-blue-500/30">
                  <Code className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg text-gray-100">Configuración de Campañas</CardTitle>
                  <CardDescription className="text-gray-400">
                    Las campañas se configuran directamente en el código
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-gray-800/50 p-4 font-mono text-sm">
                <p className="mb-2 text-gray-400">Archivo: <span className="text-cyan-400">lib/presence-config.ts</span></p>
                <pre className="overflow-x-auto text-xs text-gray-300">
{`// Configurar campañas en CAMPAIGNS_CONFIG
export const CAMPAIGNS_CONFIG: Campaign[] = [
  {
    id: 'c2c-privado',
    name: 'C2C Privado',
    url: 'https://api.mypurecloud.com/...',
  },
  // Agrega más campañas aquí...
];

// Configurar estados en STATUS_MONITOR_CONFIG
export const STATUS_MONITOR_CONFIG = [
  // Estados desde presence.presenceDefinition.systemPresence
  { statusValue: 'Meal', source: 'presence', ... },
  
  // Estados desde routingStatus.status
  { statusValue: 'IDLE', source: 'routingStatus', ... },
];`}
                </pre>
              </div>
            </CardContent>
          </Card> */}

          <PresenceThresholdsInfo />
        </div>
      </div>
    </div>
  );
}
