import React from 'react';
import {
  Waves,
  Activity,
  Flame,
  Wind,
  Building2,
  AlertTriangle,
  Radio,
  X,
  Sparkles,
  Zap,
} from 'lucide-react';
import { DisasterType } from '../types';
import { soundManager } from '../utils/audio';

interface SimulationDisasterSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (disasterType: DisasterType, details: string) => void;
  soundEnabled: boolean;
}

export const SimulationDisasterSelectorModal: React.FC<SimulationDisasterSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
  soundEnabled,
}) => {
  if (!isOpen) return null;

  const presets = [
    {
      type: 'Flood' as DisasterType,
      title: 'Monsoon Flash Flood — Sector 4 River Crest',
      desc: 'Rapid inundation with river cresting at +2.8m above danger mark. 12,450 residents in lowlands require immediate boat evacuation.',
      icon: Waves,
      color: 'from-blue-600 to-cyan-600 text-cyan-300 border-cyan-500/40',
      risk: 'CRITICAL',
    },
    {
      type: 'Earthquake' as DisasterType,
      title: '7.1 Magnitude Urban Earthquake',
      desc: 'Epicenter 12km shallow depth. Multiple structural collapses in Old Town commercial zone. Acoustic canine search and heavy cranes deployed.',
      icon: Activity,
      color: 'from-amber-600 to-orange-600 text-amber-300 border-amber-500/40',
      risk: 'CRITICAL',
    },
    {
      type: 'Forest fire' as DisasterType,
      title: 'North Ridge Wildfire Vector Surge',
      desc: '38km/h shifting winds pushing fire flank towards residential perimeter. Aerial retardant drops active and mandatory fire breaks underway.',
      icon: Flame,
      color: 'from-red-600 to-rose-600 text-rose-300 border-rose-500/40',
      risk: 'HIGH RISK',
    },
    {
      type: 'Cyclone' as DisasterType,
      title: 'Category 4 Cyclone & Storm Surge',
      desc: 'Sustained winds 160km/h with 4.5m coastal storm surge. Complete power grid isolation and reinforced bunker shelters active.',
      icon: Wind,
      color: 'from-teal-600 to-emerald-600 text-teal-300 border-teal-500/40',
      risk: 'CRITICAL',
    },
    {
      type: 'Industrial accident' as DisasterType,
      title: 'Chemical Gas Dispersion Leak',
      desc: 'Anhydrous ammonia tank rupture in Sector D Industrial zone. 3km downwind toxic plume evacuation radius established.',
      icon: AlertTriangle,
      color: 'from-purple-600 to-indigo-600 text-purple-300 border-purple-500/40',
      risk: 'CRITICAL',
    },
    {
      type: 'Landslide' as DisasterType,
      title: 'Mountain Highway Debris Landslide',
      desc: 'Saturated hill slope collapse severing Highway 9 and isolating Sector 7 valley settlements. Heavy earthmovers in route.',
      icon: Zap,
      color: 'from-yellow-600 to-amber-700 text-yellow-300 border-yellow-500/40',
      risk: 'HIGH RISK',
    },
  ];

  const handleSelect = (p: typeof presets[0]) => {
    if (soundEnabled) soundManager.playAlertChime();
    onSelectPreset(p.type, p.title);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl p-6 overflow-hidden flex flex-col justify-between max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                Simulate Disaster Incident Scenarios
              </h3>
              <p className="text-xs text-slate-400">
                Select a catastrophic event archetype to re-calculate tactical map coordinates, telemetry & risk matrices
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 overflow-y-auto custom-scrollbar pr-1">
          {presets.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                id={`simulate-disaster-preset-${idx}`}
                onClick={() => handleSelect(p)}
                className={`p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border ${p.color} transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                      {p.risk}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-white">{p.title}</h4>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{p.desc}</p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-400">
                  <span>Simulate Scenario →</span>
                  <span className="font-mono text-[10px] text-slate-500">{p.type}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 text-center">
          Demonstration model: Switches the tactical map overlay, citizen SOS queue & AI prompt synthesis context.
        </div>
      </div>
    </div>
  );
};
