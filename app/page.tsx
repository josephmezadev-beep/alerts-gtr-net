'use client';

import Link from 'next/link';
import { Settings, AlertTriangle, Activity, Zap, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden pt-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgzNCwgMjExLCAyMzgsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />

      <div className="relative mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-400">
            <Zap className="h-4 w-4" />
            <span>Sistema de Monitoreo en Tiempo Real</span>
          </div>

          <h1 className="mb-6 text-balance bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
            Call Center
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">Monitor Pro</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-balance text-lg text-gray-400">
            Monitorea en tiempo real el estado de tus agentes. Recibe alertas instantáneas
            cuando se excedan los tiempos permitidos por estado.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/config">
              <Button
                size="lg"
                className="gap-2 bg-cyan-600 px-8 text-white shadow-lg shadow-cyan-500/25 hover:bg-cyan-500"
              >
                <Settings className="h-5 w-5" />
                Configurar
              </Button>
            </Link>
            <Link href="/alerts">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-red-500/30 px-8 text-red-400 hover:bg-red-500/10"
              >
                <AlertTriangle className="h-5 w-5" />
                Ver Alertas
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-24 grid gap-6 sm:grid-cols-3">
          <FeatureCard
            icon={<Activity className="h-6 w-6" />}
            title="Monitoreo Continuo"
            description="Actualización automática cada 30 segundos para mantener los datos siempre actualizados."
            color="cyan"
          />
          <FeatureCard
            icon={<Shield className="h-6 w-6" />}
            title="Alertas Inteligentes"
            description="Notificaciones de Windows cuando un agente excede su tiempo permitido por estado."
            color="red"
          />
          <FeatureCard
            icon={<Clock className="h-6 w-6" />}
            title="Tiempos Configurables"
            description="Umbrales personalizados para cada tipo de estado: Comida, Ocupado, Descanso y más."
            color="blue"
          />
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-800/50 px-4 py-2 text-sm text-gray-400">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span>Conectado a PureCloud API</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'cyan' | 'red' | 'blue';
}) {
  const colors = {
    cyan: 'border-cyan-500/20 bg-cyan-500/5 text-cyan-400 ring-cyan-500/30',
    red: 'border-red-500/20 bg-red-500/5 text-red-400 ring-red-500/30',
    blue: 'border-blue-500/20 bg-blue-500/5 text-blue-400 ring-blue-500/30',
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 transition-all hover:border-gray-700">
      <div className={`mb-4 inline-flex rounded-lg p-3 ring-1 ${colors[color]}`}>{icon}</div>
      <h3 className="mb-2 text-lg font-semibold text-gray-100">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
      <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br from-cyan-500/10 to-transparent blur-2xl transition-all group-hover:scale-150" />
    </div>
  );
}
