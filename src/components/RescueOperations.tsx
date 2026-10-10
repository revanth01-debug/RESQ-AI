import React, { useState } from 'react';
import {
  Ambulance,
  Navigation,
  Shield,
  Flame,
  LifeBuoy,
  PhoneCall,
  CheckCircle2,
  Clock,
  Radio,
  Send,
  AlertTriangle,
  Users,
} from 'lucide-react';
import { RescueTeam, RescueTeamStatus, LanguageCode } from '../types';
import { translations } from '../i18n';
import { soundManager } from '../utils/audio';

interface RescueOperationsProps {
  teams: RescueTeam[];
  onUpdateTeamStatus: (id: string, status: RescueTeamStatus, assignment?: string) => void;
  language: LanguageCode;
  soundEnabled: boolean;
}

export const RescueOperations: React.FC<RescueOperationsProps> = ({
  teams,
  onUpdateTeamStatus,
  language,
  soundEnabled,
}) => {
  const t = translations[language];

  const [selectedTeamId, setSelectedTeamId] = useState<string | undefined>(teams[0]?.id);
  const [dispatchTarget, setDispatchTarget] = useState('Sector 4 Delta Basin — Roof Evac');
  const [dispatchNotes, setDispatchNotes] = useState('Priority 1 swift-water boat extraction for 4 trapped civilians.');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);
  const selectedTeam = teams.find((team) => team.id === selectedTeamId) ?? teams[0];
  const teamsOnMission = teams.filter((team) =>
    ['Active', 'En Route', 'Dispatched', 'On-Site', 'In-Transit'].includes(team.status)
  ).length;

  const handleDispatch = () => {
    if (!selectedTeam) return;

    setIsDispatching(true);
    if (soundEnabled) soundManager.playBeep(920);

    setTimeout(() => {
      onUpdateTeamStatus(selectedTeam.id, 'Dispatched', dispatchTarget);
      setIsDispatching(false);
      setDispatchSuccess(true);
      if (soundEnabled) soundManager.playAlertChime();
      setTimeout(() => setDispatchSuccess(false), 4000);
    }, 1000);
  };

  if (!selectedTeam) {
    return (
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 text-sm text-slate-400">
        No rescue teams are currently registered.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-2xl gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold font-mono tracking-wide text-white flex items-center gap-2">
              <Ambulance className="w-5 h-5 text-blue-400" />
              TACTICAL RESCUE FLEET & COMMAND DISPATCH
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
              RADIO DISPATCH ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time telemetry, equipment readiness, active mission assignment & survivor extraction metrics
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
            Active Fleet: <span className="text-cyan-400 font-bold">{teams.length} Units</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
            On Mission: <span className="text-amber-400 font-bold">{teamsOnMission} Units</span>
          </span>
        </div>
      </div>

      {/* Grid: Dispatch Controller & Teams Fleet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Fleet Units Grid */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Registered Field Rescue Units</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Select a unit to dispatch</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {teams.map((t) => {
              const isSelected = selectedTeam.id === t.id;
              const isDispatched = t.status === 'Dispatched' || t.status === 'On-Site';
              const isAvail = t.status === 'Available';

              return (
                <div
                  key={t.id}
                  id={`rescue-team-card-${t.id}`}
                  onClick={() => {
                    if (soundEnabled) soundManager.playBeep(780);
                    setSelectedTeamId(t.id);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-br from-blue-950/80 to-slate-900 border-blue-500/60 shadow-lg ring-1 ring-blue-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
                    <span className="font-mono text-[11px] font-bold text-cyan-400">{t.id}</span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                        isAvail
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isDispatched
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-white">{t.name}</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{t.type} • {t.personnelCount} Operators</div>

                  <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs font-mono">
                    <div className="text-slate-400 text-[11px]">
                      Location: <span className="text-slate-200">{t.currentLocation ?? t.location ?? 'Location unavailable'}</span>
                    </div>
                    {t.assignedZone && (
                      <div className="text-amber-300 text-[11px]">
                        Target: <span className="font-semibold">{t.assignedZone}</span>
                      </div>
                    )}
                    <div className="text-slate-400 text-[10px] truncate">
                      Gear: {t.equipment?.join(', ') ?? t.vehicles ?? 'Not reported'}
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Contact: {t.contactRadio ?? 'Not reported'}</span>
                    <span className="text-emerald-400 font-semibold">{t.rescuedCount ?? 0} Citizens Rescued</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Instant Mission Dispatch Controller */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>Mission Dispatch Console</span>
              </h3>
              <span className="text-xs font-mono text-cyan-400 font-bold">{selectedTeam.name.split(' ')[0]}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs">
              <div className="text-slate-400">Target Selected Unit:</div>
              <div className="font-bold text-white text-sm">{selectedTeam.name}</div>
              <div className="text-cyan-400 font-mono text-[11px]">
                Status: {selectedTeam.status} • {selectedTeam.personnelCount} Specialists Ready
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5">Destination Incident / Hazard Zone</label>
              <select
                value={dispatchTarget}
                onChange={(e) => setDispatchTarget(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Sector 4 Delta Basin — Roof Evac">Sector 4 Delta Basin (4 Trapped Civilians)</option>
                <option value="North Ridge Forest Margin — Fire Break">North Ridge Forest Margin (Fire Containment)</option>
                <option value="Old Town Market Collapse — Debris Search">Old Town Market Collapse (Canine Acoustic Search)</option>
                <option value="Industrial Corridor — Ammonia Containment">Industrial Corridor Chemical Leak</option>
                <option value="Civic Hospital Perimeter — Patient Evac">Civic Hospital Emergency Transport</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5">Mission Tactical Directives</label>
              <textarea
                rows={3}
                value={dispatchNotes}
                onChange={(e) => setDispatchNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-3 focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
                placeholder="Specify entry approach, safety perimeter, medical triage priority..."
              />
            </div>

            {/* Change Status Fast Buttons */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400 block">Fast Status Override:</span>
              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                {(['Available', 'In-Transit', 'On-Site'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      if (soundEnabled) soundManager.playBeep(850);
                      onUpdateTeamStatus(selectedTeam.id, st);
                    }}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 font-semibold text-center transition-colors cursor-pointer"
                  >
                    Set {st}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleDispatch}
              disabled={isDispatching}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isDispatching ? 'Transmitting Encrypted Radio Vector...' : 'Transmit Mission Orders to Fleet'}</span>
            </button>

            {dispatchSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Mission directive acknowledged by {selectedTeam.name}. En route.</span>
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
            Encrypted UHF Radio: Frequency 462.575 MHz • APCO-25 Protocol Synchronized.
          </div>
        </div>
      </div>
    </div>
  );
};
