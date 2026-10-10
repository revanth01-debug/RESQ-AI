import React from 'react';
import {
  AlertTriangle,
  Radio,
  Volume2,
  VolumeX,
  X,
  Send,
  Building2,
  Ambulance,
  LifeBuoy,
  Users,
  Compass,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface EmergencyModeModalProps {
  isOpen: boolean;
  onDeactivate: () => void;
  onBroadcastAllAlerts: () => void;
  soundEnabled: boolean;
}

export const EmergencyModeModal: React.FC<EmergencyModeModalProps> = ({
  isOpen,
  onDeactivate,
  onBroadcastAllAlerts,
  soundEnabled,
}) => {
  if (!isOpen) return null;

  const handleCitywideBroadcast = () => {
    if (soundEnabled) soundManager.playEmergencySiren(2.5);
    onBroadcastAllAlerts();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl rounded-sm bg-[#05050A] border-2 border-red-600 p-5 sm:p-6 space-y-4 overflow-hidden">
        {/* Top Warning Banner */}
        <div className="flex items-center justify-between pb-3 border-b border-red-600/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-sm bg-red-600 text-white flex items-center justify-center font-bold animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-red-400 font-mono text-[10px] font-bold uppercase tracking-widest">
                  CRITICAL INCIDENT PROTOCOL ENGAGED
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-mono text-white uppercase tracking-tight">
                Emergency Command Override Active
              </h2>
            </div>
          </div>

          <button
            onClick={onDeactivate}
            className="px-3 py-1.5 rounded-sm bg-slate-900 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Disengage Override
          </button>
        </div>

        {/* Live Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-2.5 rounded-sm bg-[#0A0A16] border border-slate-800 border-l-2 border-l-red-500 text-center">
            <span className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-widest block">Hazard Status</span>
            <span className="text-lg font-bold font-mono text-red-500">RED CRITICAL</span>
          </div>
          <div className="p-2.5 rounded-sm bg-[#0A0A16] border border-slate-800 border-l-2 border-l-orange-500 text-center">
            <span className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-widest block">People At Risk</span>
            <span className="text-lg font-bold font-mono text-orange-400">12,450</span>
          </div>
          <div className="p-2.5 rounded-sm bg-[#0A0A16] border border-slate-800 border-l-2 border-l-blue-500 text-center">
            <span className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-widest block">NDRF Units</span>
            <span className="text-lg font-bold font-mono text-blue-400">8 DISPATCHED</span>
          </div>
          <div className="p-2.5 rounded-sm bg-[#0A0A16] border border-slate-800 border-l-2 border-l-emerald-500 text-center">
            <span className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-widest block">Trauma Centers</span>
            <span className="text-lg font-bold font-mono text-emerald-400">SURGE READY</span>
          </div>
        </div>

        {/* Rapid Override Actions */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
            Tactical Action Directives:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={handleCitywideBroadcast}
              className="p-3 rounded-sm bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center space-x-3 transition-transform active:scale-95 text-left cursor-pointer"
            >
              <Radio className="w-5 h-5 shrink-0 animate-pulse" />
              <div>
                <div className="font-bold font-mono uppercase text-xs">1-Click Citywide Evac Broadcast</div>
                <div className="text-[10px] text-red-100 font-normal mt-0.5">SMS, Sirens & Radio Broadcast to 24,000+ residents</div>
              </div>
            </button>

            <button
              onClick={() => {
                if (soundEnabled) soundManager.playBeep(980);
                soundManager.speak('All reserve rescue boats and helicopter squadrons mobilized.', 'en-US');
              }}
              className="p-3 rounded-sm bg-slate-900 hover:bg-slate-850 text-white border border-slate-700 font-bold text-xs flex items-center space-x-3 text-left cursor-pointer"
            >
              <Ambulance className="w-5 h-5 shrink-0 text-blue-400" />
              <div>
                <div className="font-bold font-mono uppercase text-xs text-blue-400">Mobilize All Reserve NDRF Units</div>
                <div className="text-[10px] text-slate-400 font-normal mt-0.5">Deploy motorized inflatable rafts & aerial recon</div>
              </div>
            </button>

            <button
              onClick={() => {
                if (soundEnabled) soundManager.playBeep(980);
                soundManager.speak('Hospital trauma bays locked and surgical teams prepped.', 'en-US');
              }}
              className="p-3 rounded-sm bg-slate-900 hover:bg-slate-850 text-white border border-slate-700 font-bold text-xs flex items-center space-x-3 text-left cursor-pointer"
            >
              <Building2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <div>
                <div className="font-bold font-mono uppercase text-xs text-emerald-400">Lock All Hospital Trauma Bays</div>
                <div className="text-[10px] text-slate-400 font-normal mt-0.5">Reserve ICU beds & blood bank inventory</div>
              </div>
            </button>

            <button
              onClick={() => {
                if (soundEnabled) soundManager.playBeep(980);
                soundManager.speak('Emergency radio repeater network synchronized on 462.575 MHz.', 'en-US');
              }}
              className="p-3 rounded-sm bg-slate-900 hover:bg-slate-850 text-white border border-slate-700 font-bold text-xs flex items-center space-x-3 text-left cursor-pointer"
            >
              <Compass className="w-5 h-5 shrink-0 text-orange-400" />
              <div>
                <div className="font-bold font-mono uppercase text-xs text-orange-400">Synchronize Mesh Radio Net</div>
                <div className="text-[10px] text-slate-400 font-normal mt-0.5">Switch all field repeaters to UHF channel 1 Duplex</div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase">
          <span>Active Command: National Incident Grid (NIMS)</span>
          <button
            onClick={onDeactivate}
            className="text-orange-400 hover:text-orange-300 font-bold tracking-wider cursor-pointer"
          >
            Return to Normal Monitoring →
          </button>
        </div>
      </div>
    </div>
  );
};
