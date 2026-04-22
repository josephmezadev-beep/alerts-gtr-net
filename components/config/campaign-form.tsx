'use client';

import { useState } from 'react';
import { Plus, Link2, Tag, Trash2, Radio } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Campaign } from '@/lib/types';

export function CampaignForm() {
  const { campaigns, addCampaign, removeCampaign } = useAppStore();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const handleAdd = () => {
    if (!name || !url) return;

    const newCampaign: Campaign = {
      id: crypto.randomUUID(),
      name: name.trim(),
      url: url.trim(),
    };

    addCampaign(newCampaign);
    setName('');
    setUrl('');
  };

  return (
    <Card className="border-cyan-500/20 bg-gray-900/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-500/10 p-2 ring-1 ring-blue-500/30">
            <Radio className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-lg text-gray-100">Campañas</CardTitle>
            <CardDescription className="text-gray-400">
              Agrega las campañas que deseas monitorear
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre de la campaña (ej: C2C Privado)"
              className="border-gray-700 bg-gray-800/50 pl-10 text-gray-200 placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20"
            />
          </div>
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="URL de la API (ej: https://api.mypurecloud.com/api/v2/...)"
              className="border-gray-700 bg-gray-800/50 pl-10 font-mono text-sm text-gray-200 placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20"
            />
          </div>
          <Button
            onClick={handleAdd}
            disabled={!name || !url}
            className="w-full bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Campaña
          </Button>
        </div>

        {campaigns.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-400">Campañas configuradas ({campaigns.length})</h4>
            <div className="space-y-2">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="group flex items-center justify-between rounded-lg border border-gray-700/50 bg-gray-800/30 p-3 transition-all hover:border-cyan-500/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-cyan-500" />
                    <div>
                      <p className="font-medium text-gray-200">{campaign.name}</p>
                      <p className="max-w-md truncate font-mono text-xs text-gray-500">
                        {campaign.url}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => removeCampaign(campaign.id)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 opacity-0 transition-opacity hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {campaigns.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-700 bg-gray-800/20 p-6 text-center">
            <Radio className="mx-auto h-8 w-8 text-gray-600" />
            <p className="mt-2 text-sm text-gray-500">
              No hay campañas configuradas. Agrega una campaña para comenzar.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
