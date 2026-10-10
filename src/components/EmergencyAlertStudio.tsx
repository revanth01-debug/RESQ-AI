import React, { useState } from 'react';
import {
  Megaphone,
  Radio,
  Send,
  Sparkles,
  Volume2,
  CheckCircle2,
  Smartphone,
  Mail,
  Tv,
  BellRing,
  AlertTriangle,
  RefreshCw,
  Globe2,
  Users,
} from 'lucide-react';
import { EmergencyAlert, DisasterType, LanguageCode } from '../types';
import { translations } from '../i18n';
import { soundManager } from '../utils/audio';

interface EmergencyAlertStudioProps {
  alerts: EmergencyAlert[];
  onBroadcastNewAlert: (newAlert: EmergencyAlert) => void;
  language: LanguageCode;
  soundEnabled: boolean;
}

export const EmergencyAlertStudio: React.FC<EmergencyAlertStudioProps> = ({
  alerts,
  onBroadcastNewAlert,
  language,
  soundEnabled,
}) => {
  const t = translations[language];

  const [alertType, setAlertType] = useState<
    'Warning' | 'Evacuation' | 'Shelter information' | 'Medical emergency' | 'Missing person' | 'All-clear'
  >('Evacuation');
  const [disasterType, setDisasterType] = useState<DisasterType>('Flood');
  const [targetZone, setTargetZone] = useState('Sector 4 Delta Basin (Zone A)');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(language);

  const [message, setMessage] = useState(
    '⚠️ FLASH FLOOD WARNING: Residents in low-lying Delta Basin areas are advised to evacuate immediately and move to designated shelters. Use Elevated Ring Road East.'
  );

  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    'SMS',
    'Push notification',
    'Emergency siren',
    'Web notification',
    'Public display',
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Available delivery channels
  const allChannels = [
    { id: 'SMS', label: 'Cellular SMS Broadcast', icon: Smartphone },
    { id: 'Push notification', label: 'Mobile App Push Alerts', icon: BellRing },
    { id: 'Emergency siren', label: 'Municipal Audible Sirens', icon: Radio },
    { id: 'Web notification', label: 'Web & Desktop Broadcast', icon: Globe2 },
    { id: 'Public display', label: 'Highway & Metro Digital VMS', icon: Tv },
    { id: 'Email', label: 'Agency & NGO Email Dispatch', icon: Mail },
  ];

  // AI Auto-Craft Message
  const handleAiCraftMessage = async () => {
    setIsGenerating(true);
    if (soundEnabled) soundManager.playBeep(940);
    try {
      const res = await fetch('/api/gemini/craft-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertType,
          disasterType,
          zone: targetZone,
          language: selectedLanguage,
        }),
      });
      const data = await res.json();
      if (data.message) {
        setMessage(data.message);
      }
      if (soundEnabled) soundManager.playAlertChime();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Broadcast Alert Simulation
  const handleSendAlert = () => {
    setIsBroadcasting(true);
    if (soundEnabled) soundManager.playEmergencySiren(1.5);

    setTimeout(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      const newAlert: EmergencyAlert = {
        id: `alt-${Date.now()}`,
        title: `${alertType.toUpperCase()} — ${disasterType.toUpperCase()}`,
        alertType,
        disasterType,
        severity: alertType === 'Evacuation' ? 'Critical' : 'High Risk',
        zones: [targetZone],
        message,
        channels: selectedChannels,
        timestamp: timeString,
        deliveryStats: {
          smsPercent: 96,
          pushPercent: 99,
          peopleReached: 24850,
        },
        status: 'Active',
      };

      onBroadcastNewAlert(newAlert);
      setIsBroadcasting(false);
      setBroadcastSuccess(true);
      if (soundEnabled) soundManager.playAlertChime();

      // Speak alert for accessibility if English
      if (selectedLanguage === 'English') {
        soundManager.speak(message, 'en-US');
      } else if (selectedLanguage === 'Hindi') {
        soundManager.speak(message, 'hi-IN');
      } else if (selectedLanguage === 'Telugu') {
        soundManager.speak(message, 'te-IN');
      }

      setTimeout(() => setBroadcastSuccess(false), 5000);
    }, 1200);
  };

  const toggleChannel = (cId: string) => {
    if (selectedChannels.includes(cId)) {
      setSelectedChannels(selectedChannels.filter((c) => c !== cId));
    } else {
      setSelectedChannels([...selectedChannels, cId]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-2xl gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold font-mono tracking-wide text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-rose-400" />
              EMERGENCY ALERT BROADCAST STUDIO
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
              MULTI-CHANNEL DISPATCH
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Simulate instantaneous warning distribution across SMS, Push, Sirens, Digital Billboards, and Radio
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => soundManager.speak(message, 'en-US')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            title="Read Alert via Text-To-Speech"
          >
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Audio Preview (TTS)</span>
          </button>
        </div>
      </div>

      {/* Broadcast Composer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Configurator */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>Compose Emergency Warning Bulletin</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Channel Count: {selectedChannels.length}</span>
          </div>

          {/* Row 1: Alert Type, Disaster Type, Target Zone */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5">Alert Classification</label>
              <select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="Evacuation">🚨 Mandatory Evacuation</option>
                <option value="Warning">⚠️ Warning Advisory</option>
                <option value="Shelter information">🏠 Shelter Directive</option>
                <option value="Medical emergency">🚑 Medical Triage Surge</option>
                <option value="Missing person">👥 Missing Person Alert</option>
                <option value="All-clear">✅ All-Clear / Safe</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5">Disaster Type</label>
              <select
                value={disasterType}
                onChange={(e) => setDisasterType(e.target.value as DisasterType)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="Flood">Flood / Inundation</option>
                <option value="Forest fire">Forest Fire / Wildfire</option>
                <option value="Earthquake">Earthquake</option>
                <option value="Cyclone">Cyclone / Typhoon</option>
                <option value="Landslide">Landslide</option>
                <option value="Industrial accident">Industrial Chemical</option>
                <option value="Building collapse">Building Collapse</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5">Target Sector / Zone</label>
              <select
                value={targetZone}
                onChange={(e) => setTargetZone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="Sector 4 Delta Basin (Zone A)">Sector 4 Delta Basin (Zone A)</option>
                <option value="North Ridge Forest Area (Zone B)">North Ridge Forest (Zone B)</option>
                <option value="Old Town District (Zone C)">Old Town District (Zone C)</option>
                <option value="Industrial Corridor (Zone D)">Industrial Corridor (Zone D)</option>
                <option value="ALL SECTORS (Citywide)">ALL METRO SECTORS (Citywide)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Delivery Channels */}
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-2">
              Broadcast Delivery Channels (Simulated)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {allChannels.map((chan) => {
                const Icon = chan.icon;
                const isSelected = selectedChannels.includes(chan.id);
                return (
                  <button
                    key={chan.id}
                    onClick={() => toggleChannel(chan.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-950/40 border-rose-500/50 text-white font-semibold shadow-xs'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 opacity-60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-rose-400' : 'text-slate-500'}`} />
                    <span className="truncate">{chan.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 3: Message Textarea & AI Crafter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono text-slate-300 font-bold">
                Emergency Alert Broadcast Text
              </label>

              <div className="flex items-center gap-2">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as LanguageCode)}
                  className="bg-slate-950 border border-slate-800 text-[11px] text-cyan-400 px-2 py-1 rounded-lg"
                >
                  <option value="English">English</option>
                  <option value="Hindi">हिंदी (Hindi)</option>
                  <option value="Telugu">తెలుగు (Telugu)</option>
                </select>

                <button
                  onClick={handleAiCraftMessage}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{isGenerating ? 'Synthesizing...' : 'AI Auto-Craft Alert'}</span>
                </button>
              </div>
            </div>

            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-sm text-white rounded-xl p-3.5 font-sans leading-relaxed focus:outline-none focus:border-rose-500"
              placeholder="Enter official emergency instructions, evacuation paths, or safety notices..."
            />
          </div>

          {/* Big Broadcast Button */}
          <div>
            <button
              id="send-emergency-alert-main-btn"
              onClick={handleSendAlert}
              disabled={isBroadcasting || !message.trim() || selectedChannels.length === 0}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black tracking-wider text-sm shadow-xl shadow-red-900/40 border border-red-400 transition-all transform active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className={`w-5 h-5 ${isBroadcasting ? 'animate-bounce' : ''}`} />
              <span>{isBroadcasting ? 'TRANSMITTING MULTI-CHANNEL BROADCAST...' : 'SEND EMERGENCY ALERT'}</span>
            </button>
          </div>

          {/* Success Banner */}
          {broadcastSuccess && (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-between text-xs text-emerald-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">Emergency Broadcast Successfully Dispatched!</div>
                  <div>SMS (96%), Push (99%), Sirens Triggered. 24,850 citizens notified in 1.2s.</div>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/20 px-2 py-1 rounded text-emerald-300 font-bold">
                DELIVERED
              </span>
            </div>
          )}
        </div>

        {/* Right Col: Live Delivery Statistics & History */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Simulated Reach & Delivery KPIs</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-400">
                REAL-TIME
              </span>
            </div>

            {/* Metrics */}
            <div className="space-y-3 pt-2">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs text-slate-300 font-mono mb-1">
                  <span>SMS Delivery Rate</span>
                  <span className="text-emerald-400 font-bold">94%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94%' }} />
                </div>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs text-slate-300 font-mono mb-1">
                  <span>Mobile Push Notifications</span>
                  <span className="text-cyan-400 font-bold">98%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: '98%' }} />
                </div>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs text-slate-300 font-mono mb-1">
                  <span>Audible Siren Activation</span>
                  <span className="text-rose-400 font-bold">100% (4 Arrays)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Total People Reached</span>
                <span className="text-2xl font-mono font-black text-white">21,430 Citizens</span>
              </div>
            </div>

            {/* Active Alert History Feed */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                Recent Broadcast Logs
              </h4>
              <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                {alerts.map((al) => (
                  <div
                    key={al.id}
                    className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-[11px] truncate">{al.title}</span>
                      <span className="font-mono text-[10px] text-cyan-400">{al.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{al.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] text-slate-400">
            Note: Prototype mode simulates high-throughput cellular cell broadcasts and public digital siren gateways.
          </div>
        </div>
      </div>
    </div>
  );
};
