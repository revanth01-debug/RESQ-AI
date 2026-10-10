import React, { useState } from 'react';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  RefreshCw,
  Truck,
  Plus,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ResourceStock, LanguageCode } from '../types';
import { translations } from '../i18n';
import { soundManager } from '../utils/audio';

interface ResourceManagementProps {
  resources: ResourceStock[];
  language: LanguageCode;
  soundEnabled: boolean;
}

export const ResourceManagement: React.FC<ResourceManagementProps> = ({
  resources,
  language,
  soundEnabled,
}) => {
  const t = translations[language];

  const [stockList, setStockList] = useState<ResourceStock[]>(resources);
  const [replenishingId, setReplenishingId] = useState<string | null>(null);

  const handleReplenish = (id: string) => {
    setReplenishingId(id);
    if (soundEnabled) soundManager.playAlertChime();

    setTimeout(() => {
      setStockList((prev) =>
        prev.map((r) => {
          if (r.id === id) {
            return {
              ...r,
              quantity: Math.min(r.quantity + Math.round(r.targetThreshold * 0.4), r.targetThreshold * 1.2),
              status: 'Adequate' as const,
              burnRateHoursRemaining: 72,
            };
          }
          return r;
        })
      );
      setReplenishingId(null);
      if (soundEnabled) soundManager.playBeep(980);
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-2xl gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold font-mono tracking-wide text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-violet-400" />
              EMERGENCY LOGISTICS & SUPPLY STOCKPILE DEPOT
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30 font-bold">
              INVENTORY TELEMETRY SYNCED
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Predictive consumption burn-rates, automated convoy re-ordering & critical relief equipment distribution
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
            Depot Hubs: <span className="text-cyan-400 font-bold">4 Regional Centers</span>
          </span>
        </div>
      </div>

      {/* Grid of Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stockList.map((res) => {
          const isCritical = res.status === 'Critical';
          const isLow = res.status === 'Low';
          const fillPercent = Math.min(Math.round((res.quantity / res.targetThreshold) * 100), 100);

          return (
            <div
              key={res.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                isCritical
                  ? 'bg-rose-950/30 border-rose-500/40 text-rose-100 shadow-rose-950/30'
                  : isLow
                  ? 'bg-amber-950/20 border-amber-500/40 text-amber-100'
                  : 'bg-slate-900/80 border-slate-800 text-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
                  <span className="text-xs font-mono text-cyan-400 font-semibold">{res.category}</span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                      isCritical
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                        : isLow
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {res.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-base font-bold text-white">{res.item}</div>
                <div className="text-2xl font-black font-mono text-cyan-300 mt-1">
                  {res.quantity.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-slate-400">{res.unit}</span>
                </div>

                {/* Progress bar to target threshold */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Stock Level</span>
                    <span>Target: {res.targetThreshold.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCritical ? 'bg-rose-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${fillPercent}%` }}
                    />
                  </div>
                </div>

                {/* Burn rate */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Depletion Vector:</span>
                    <span className={isCritical ? 'text-rose-400 font-bold' : 'text-amber-300'}>
                      {res.burnRateHoursRemaining}h remaining
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    Depot: {res.depotLocation}
                  </div>
                </div>
              </div>

              {/* Order Replenishment Button */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => handleReplenish(res.id)}
                  disabled={replenishingId === res.id}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700 cursor-pointer disabled:opacity-50"
                >
                  <Truck className={`w-3.5 h-3.5 ${replenishingId === res.id ? 'animate-bounce' : ''}`} />
                  <span>{replenishingId === res.id ? 'Dispatching Convoy...' : '+ Dispatch Relief Resupply'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
