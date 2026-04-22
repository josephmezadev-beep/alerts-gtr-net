'use client';

import { useState } from 'react';
import { Key, Eye, EyeOff, Check, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function TokenForm() {
  const { token, setToken } = useAppStore();
  const [inputToken, setInputToken] = useState(token);
  const [showToken, setShowToken] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setToken(inputToken);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setInputToken('');
    setToken('');
  };

  return (
    <Card className="border-cyan-500/20 bg-gray-900/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-cyan-500/10 p-2 ring-1 ring-cyan-500/30">
            <Key className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <CardTitle className="text-lg text-gray-100">Token de Autorización</CardTitle>
            <CardDescription className="text-gray-400">
              Ingresa el token para autenticar las solicitudes a la API de PureCloud
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Input
            type={showToken ? 'text' : 'password'}
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            placeholder="Bearer xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            className="border-gray-700 bg-gray-800/50 pr-10 font-mono text-sm text-gray-200 placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20"
          />
          <button
            type="button"
            onClick={() => setShowToken(!showToken)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-cyan-400"
          >
            {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={!inputToken || saved}
            className="flex-1 bg-cyan-600 text-white hover:bg-cyan-500 disabled:bg-gray-700"
          >
            {saved ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Guardado
              </>
            ) : (
              'Guardar Token'
            )}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reiniciar
          </Button>
        </div>

        {token && (
          <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2 ring-1 ring-green-500/30">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span className="text-sm text-green-400">Token configurado correctamente</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
