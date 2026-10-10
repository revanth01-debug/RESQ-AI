import React, { useState } from 'react';
import {
  Building2,
  Ambulance,
  HeartPulse,
  Activity,
  PhoneCall,
  Bed,
  Droplet,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
} from 'lucide-react';
import { Hospital, LanguageCode } from '../types';
import { translations } from '../i18n';
import { soundManager } from '../utils/audio';

interface HospitalCoordinationProps {
  hospitals: Hospital[];
  language: LanguageCode;
  soundEnabled: boolean;
}

export const HospitalCoordination: React.FC<HospitalCoordinationProps> = ({
  hospitals,
  language,
  soundEnabled,
}) => {
  const t = translations[language];

  const [selectedHospitalId, setSelectedHospitalId] = useState<string | undefined>(hospitals[0]?.id);
  const [divertedHospitalIds, setDivertedHospitalIds] = useState<Set<string>>(new Set());
  const [patientTriageSeverity, setPatientTriageSeverity] = useState<'Red (Immediate)' | 'Yellow (Delayed)' | 'Green (Minor)'>('Red (Immediate)');
  const [patientCount, setPatientCount] = useState(2);
  const [dispatchConfirmed, setDispatchConfirmed] = useState(false);
  const selectedHospital = hospitals.find((hospital) => hospital.id === selectedHospitalId) ?? hospitals[0];

  const toggleDivert = (id: string) => {
    if (soundEnabled) soundManager.playBeep(600);
    setDivertedHospitalIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDispatchAmbulance = () => {
    if (soundEnabled) soundManager.playAlertChime();
    setDispatchConfirmed(true);
    setTimeout(() => setDispatchConfirmed(false), 4000);
  };

  const totalBedsAvailable = hospitals.reduce((acc, h) => acc + h.availableBeds, 0);
  const totalIcuAvailable = hospitals.reduce((acc, h) => acc + (h.icuBedsAvailable ?? h.icuAvailable ?? 0), 0);

  if (!selectedHospital) {
    return (
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 text-sm text-slate-400">
        No hospitals are currently registered.
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
              <Building2 className="w-5 h-5 text-emerald-400" />
              HOSPITAL SURGE & CASUALTY TRIAGE COORDINATION
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              REGIONAL HEALTH NETWORK SYNCED
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time trauma capacity, ICU availability, Blood bank reserves & smart ambulance casualty routing
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
            Total Free Beds: <span className="text-emerald-400 font-bold">{totalBedsAvailable}</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
            Free ICU: <span className="text-cyan-400 font-bold">{totalIcuAvailable}</span>
          </span>
        </div>
      </div>

      {/* Grid: Hospitals List & Patient Routing Dispatch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Hospital Facilities Grid */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-400" />
              <span>Regional Trauma Facilities</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">{hospitals.length} Active Centers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hospitals.map((h) => {
              const isSelected = selectedHospital.id === h.id;
              const isDiverting = divertedHospitalIds.has(h.id);
              const occPercent = h.totalBeds > 0
                ? Math.min(100, Math.max(0, Math.round(((h.totalBeds - h.availableBeds) / h.totalBeds) * 100)))
                : 0;

              return (
                <div
                  key={h.id}
                  id={`hospital-card-${h.id}`}
                  onClick={() => {
                    if (soundEnabled) soundManager.playBeep(760);
                    setSelectedHospitalId(h.id);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-br from-emerald-950/70 to-slate-900 border-emerald-500/60 shadow-lg ring-1 ring-emerald-500/30'
                      : isDiverting
                      ? 'bg-rose-950/20 border-rose-900/40 opacity-75'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
                    <span className="font-bold text-sm text-white truncate max-w-[180px]">{h.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDivert(h.id);
                      }}
                      className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold transition-colors ${
                        isDiverting
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {isDiverting ? 'DIVERTING' : h.status}
                    </button>
                  </div>

                  <div className="text-xs text-slate-400 font-mono">{h.address}</div>

                  {/* Bed Occupancy Bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Bed Capacity</span>
                      <span className="text-emerald-400 font-bold">
                        {h.availableBeds} Free / {h.totalBeds} Total
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          occPercent > 90 ? 'bg-rose-500' : occPercent > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${occPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Key Stats */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Bed className="w-3.5 h-3.5 text-cyan-400" />
                      <span>ICU Free: <strong className="text-white">{h.icuBedsAvailable ?? h.icuAvailable ?? 0}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Ambulance className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Ambulances: <strong className="text-white">{h.ambulancesStationed ?? h.ambulancesAvailable ?? 0}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Droplet className="w-3.5 h-3.5 text-rose-400" />
                      <span>Blood O-: <strong className="text-white">{h.bloodSupplyUnits?.['O-'] ?? 'N/A'}{h.bloodSupplyUnits?.['O-'] === undefined ? '' : 'u'}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
                      <span className="truncate">{h.emergencyPhone ?? h.contact ?? 'Not reported'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Smart Casualty Routing Controller */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Ambulance className="w-4 h-4 text-cyan-400" />
                <span>Patient Ambulance Routing</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400">AI TRIAGE</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs">
              <div className="text-slate-400">Destination Hospital:</div>
              <div className="font-bold text-white text-sm">{selectedHospital.name}</div>
              <div className="text-emerald-400 font-mono text-[11px]">
                {selectedHospital.availableBeds} General Beds • {selectedHospital.icuBedsAvailable ?? selectedHospital.icuAvailable ?? 0} ICU Available
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5">Triage Severity Class</label>
              <select
                value={patientTriageSeverity}
                onChange={(e) => setPatientTriageSeverity(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="Red (Immediate)">🔴 Red (Immediate Life Threat / Resuscitation)</option>
                <option value="Yellow (Delayed)">🟡 Yellow (Delayed / Major Fracture or Trauma)</option>
                <option value="Green (Minor)">🟢 Green (Minor / Walking Wounded)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5">Casualty Influx Count</label>
              <input
                type="number"
                min={1}
                max={20}
                value={patientCount}
                onChange={(e) => setPatientCount(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-cyan-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong>AI Bed Lock: </strong>
                <span>Automatic reservation for trauma surgical team and oxygen replenishment upon dispatch.</span>
              </div>
            </div>

            <button
              onClick={handleDispatchAmbulance}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Route Ambulance & Pre-Alert Trauma Ward</span>
            </button>

            {dispatchConfirmed && (
              <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Ambulance Unit 8 dispatched to {selectedHospital.name}. Trauma bay prepped.</span>
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
            Direct telemetry integration with National Health Telematics.
          </div>
        </div>
      </div>
    </div>
  );
};
