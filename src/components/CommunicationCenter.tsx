import React, { useState } from 'react';
import {
  MessageSquare,
  Radio,
  Send,
  Users,
  Shield,
  Ambulance,
  Flame,
  Volume2,
  CheckCircle2,
  Clock,
  Sparkles,
  PhoneCall,
} from 'lucide-react';
import { CommunicationMessage, LanguageCode } from '../types';
import { translations } from '../i18n';
import { soundManager } from '../utils/audio';

interface CommunicationCenterProps {
  messages: CommunicationMessage[];
  onSendMessage: (msg: CommunicationMessage) => void;
  language: LanguageCode;
  soundEnabled: boolean;
}

export const CommunicationCenter: React.FC<CommunicationCenterProps> = ({
  messages,
  onSendMessage,
  language,
  soundEnabled,
}) => {
  const t = translations[language];

  const [activeChannel, setActiveChannel] = useState<'All' | 'NDRF' | 'Fire' | 'Medical' | 'Police'>('All');
  const [inputText, setInputText] = useState('');
  const [senderAgency, setSenderAgency] = useState('Command Central (HQ)');
  const [priority, setPriority] = useState<'Urgent' | 'High' | 'Normal'>('Normal');

  const channels = [
    { id: 'All', label: 'All Inter-Agency Traffic', icon: Radio },
    { id: 'NDRF', label: 'NDRF Water Rescue Net', icon: Shield },
    { id: 'Fire', label: 'Fire & Hazmat Dispatch', icon: Flame },
    { id: 'Medical', label: 'Trauma & Ambulance Net', icon: Ambulance },
    { id: 'Police', label: 'Police Traffic & Perimeter', icon: Users },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (soundEnabled) soundManager.playBeep(880);

    const newMsg: CommunicationMessage = {
      id: `COM-${Date.now()}`,
      sender: senderAgency,
      channel: activeChannel === 'All' ? 'Command' : activeChannel,
      message: inputText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      priority,
    };

    onSendMessage(newMsg);
    setInputText('');
  };

  const handleQuickDirective = (txt: string, prio: 'Urgent' | 'High') => {
    if (soundEnabled) soundManager.playBeep(940);
    const newMsg: CommunicationMessage = {
      id: `COM-${Date.now()}`,
      sender: senderAgency,
      channel: 'Command',
      message: txt,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      priority: prio,
    };
    onSendMessage(newMsg);
  };

  const filtered = messages.filter((m) => {
    if (activeChannel === 'All') return true;
    return m.channel.toLowerCase().includes(activeChannel.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-2xl gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold font-mono tracking-wide text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-sky-400" />
              INTER-AGENCY TACTICAL RADIO & DISPATCH COMMS
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold">
              ENCRYPTED RADIO NET ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time cross-service dispatch channels: NDRF, Fire/Hazmat, Trauma Medical, Police & NGOs
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>462.575 MHz DUPLEX ONLINE</span>
        </div>
      </div>

      {/* Grid: Channels & Live Chat Box */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Col: Channel Switcher & Quick Command Presets */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 shadow-xl space-y-2">
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold mb-2">
              Tactical Radio Frequencies
            </h3>
            {channels.map((chan) => {
              const Icon = chan.icon;
              const isActive = activeChannel === chan.id;
              return (
                <button
                  key={chan.id}
                  onClick={() => {
                    if (soundEnabled) soundManager.playBeep(780);
                    setActiveChannel(chan.id as any);
                  }}
                  className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{chan.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Command Directives */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 shadow-xl space-y-2.5">
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">
              Instant Command Directives
            </h3>

            {[
              { text: '🚨 ALL UNITS: Sector 4 lowlands under mandatory evacuation order.', prio: 'Urgent' as const },
              { text: '🚑 MEDICAL DISPATCH: Pre-position 4 extra ambulances at Civic Stadium.', prio: 'High' as const },
              { text: '🚁 AIR SQUADRON: Prepare chopper hoist extraction on 2nd Ave terrace.', prio: 'Urgent' as const },
              { text: '⚠️ HAZMAT: Seal off perimeter around chemical warehouse 12.', prio: 'High' as const },
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickDirective(preset.text, preset.prio)}
                className="w-full p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-200 text-left transition-colors cursor-pointer"
              >
                {preset.text}
              </button>
            ))}
          </div>
        </div>

        {/* Right 3 Cols: Message Thread & Compose */}
        <div className="lg:col-span-3 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between overflow-hidden min-h-[500px]">
          {/* Thread Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-sm text-white">Channel: {activeChannel} Frequency Stream</span>
            </div>
            <span className="text-xs font-mono text-slate-400">{filtered.length} Dispatches Logged</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[420px] custom-scrollbar">
            {filtered.map((msg) => {
              const isUrgent = msg.priority === 'Urgent';
              const isHigh = msg.priority === 'High';

              return (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-xl border space-y-1 text-xs ${
                    isUrgent
                      ? 'bg-rose-950/40 border-rose-500/40 text-rose-100'
                      : isHigh
                      ? 'bg-amber-950/30 border-amber-500/40 text-amber-100'
                      : 'bg-slate-950/70 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-cyan-400">{msg.sender}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {msg.channel}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <span
                        className={`font-bold ${
                          isUrgent ? 'text-rose-400' : isHigh ? 'text-amber-400' : 'text-slate-400'
                        }`}
                      >
                        {msg.priority.toUpperCase()}
                      </span>
                      <span className="text-slate-500">{msg.timestamp}</span>
                    </div>
                  </div>

                  <p className="pt-1 text-slate-100 leading-relaxed font-sans">{msg.message}</p>
                </div>
              );
            })}
          </div>

          {/* Compose Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950/90 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-mono">
              <select
                value={senderAgency}
                onChange={(e) => setSenderAgency(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-200 px-2 py-1 rounded-lg"
              >
                <option value="Command Central (HQ)">Command Central (HQ)</option>
                <option value="NDRF Ops Unit #1">NDRF Ops Unit #1</option>
                <option value="Trauma Medical Dispatch">Trauma Medical Dispatch</option>
                <option value="State Fire Control">State Fire Control</option>
              </select>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 text-cyan-400 px-2 py-1 rounded-lg"
              >
                <option value="Normal">Normal Priority</option>
                <option value="High">High Priority</option>
                <option value="Urgent">🚨 Urgent Flash Alert</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type tactical message or dispatch directive to field units..."
                className="flex-1 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
