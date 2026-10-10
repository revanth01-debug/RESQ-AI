import React, { useState } from 'react';
import {
  Smartphone,
  AlertTriangle,
  LifeBuoy,
  MapPin,
  Compass,
  Home,
  CheckCircle2,
  PhoneCall,
  Volume2,
  Shield,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Send,
  BookOpen,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../i18n';
import { soundManager } from '../utils/audio';

interface CitizenMobileViewProps {
  language: LanguageCode;
  soundEnabled: boolean;
  onTriggerSos: (location: string, desc: string) => void;
}

export const CitizenMobileView: React.FC<CitizenMobileViewProps> = ({
  language,
  soundEnabled,
  onTriggerSos,
}) => {
  const t = translations[language];

  const [sosSent, setSosSent] = useState(false);
  const [activeGuide, setActiveGuide] = useState<'flood' | 'earthquake' | 'fire' | 'cpr'>('flood');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
    {
      role: 'ai',
      text: 'Hello! I am your AI Emergency Assistant. Are you in immediate danger, trapped, or looking for the nearest safe shelter?',
    },
  ]);
  const [isSendingChat, setIsSendingChat] = useState(false);

  const handleInstantSos = () => {
    setSosSent(true);
    if (soundEnabled) soundManager.playEmergencySiren(2.0);
    onTriggerSos(
      'Live Citizen Device GPS: 17.3850° N, 78.4867° E',
      'CITIZEN 1-TAP DISTRESS SOS: User triggered emergency beacon from mobile portal.'
    );
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userText = chatMessage;
    setChatMessage('');
    setChatHistory((prev) => [...prev, { role: 'user', text: userText }]);
    setIsSendingChat(true);

    if (soundEnabled) soundManager.playBeep(780);

    try {
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, language }),
      });
      const data = await res.json();
      setChatHistory((prev) => [
        ...prev,
        { role: 'ai', text: data.reply || 'Stay calm. Move to higher ground and await rescue teams.' },
      ]);
      if (soundEnabled) soundManager.playBeep(880);
    } catch {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'ai',
          text: 'EMERGENCY PROTOCOL: If water is rising, climb to upper floor or roof. Never touch fallen power lines. Call 112 if phone signal is available.',
        },
      ]);
    } finally {
      setIsSendingChat(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-16">
      {/* Header Pill */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
          <Smartphone className="w-3.5 h-3.5" />
          <span>CITIZEN MOBILE SURVIVAL PORTAL</span>
        </div>
        <h2 className="text-2xl font-black text-white">Emergency Response in Your Hands</h2>
        <p className="text-xs text-slate-400">
          Optimized for low-bandwidth cellular environments & one-handed high-stress touch interaction
        </p>
      </div>

      {/* Huge 1-Tap SOS Distress Trigger */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-950/80 via-slate-900 to-slate-950 border-2 border-rose-600 shadow-2xl text-center space-y-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-400">
            ONE-TOUCH DISTRESS BEACON
          </span>
          <h3 className="text-xl font-extrabold text-white mt-1">Need Immediate Rescue?</h3>
          <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1">
            Press the button below to transmit your GPS coordinates, battery level & emergency beacon directly to all active rescue units.
          </p>
        </div>

        {/* Big Pulse Button */}
        <div className="py-2 flex justify-center">
          <button
            id="mobile-1tap-sos-btn"
            onClick={handleInstantSos}
            disabled={sosSent}
            className={`w-44 h-44 rounded-full font-black text-lg tracking-wider uppercase transition-all transform active:scale-95 flex flex-col items-center justify-center gap-2 shadow-2xl cursor-pointer ${
              sosSent
                ? 'bg-emerald-600 border-4 border-emerald-400 text-white shadow-emerald-600/50'
                : 'bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 hover:scale-105 border-4 border-rose-400 text-white shadow-rose-600/60 animate-pulse'
            }`}
          >
            {sosSent ? (
              <>
                <CheckCircle2 className="w-12 h-12" />
                <span className="text-sm">SOS DISPATCHED!</span>
              </>
            ) : (
              <>
                <LifeBuoy className="w-12 h-12" />
                <span>TAP FOR SOS</span>
                <span className="text-[10px] font-mono font-normal">WITH GPS PIN</span>
              </>
            )}
          </button>
        </div>

        {sosSent ? (
          <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-200 space-y-1">
            <div className="font-bold text-white">Rescue Unit #2 Dispatched to Your GPS Coordinates!</div>
            <div>Estimated Arrival: 14 minutes. Stay calm and signal rescuers if safe.</div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-cyan-400" /> GPS Locked</span>
            <span>•</span>
            <span className="text-emerald-400">Battery: 84%</span>
            <span>•</span>
            <span className="text-cyan-400">Mesh Sync: Active</span>
          </div>
        )}
      </div>

      {/* Nearest Safe Shelter Card */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-teal-400" />
            <h4 className="font-bold text-sm text-white">Nearest Safe Haven / Shelter</h4>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">1.8 KM AWAY</span>
        </div>

        <div className="space-y-1 text-xs">
          <div className="font-bold text-white text-sm">Civic Sports Complex & Shelter Hall</div>
          <div className="text-slate-400 font-mono">104 Stadium Road, Sector 2 Safe Zone</div>
          <div className="text-teal-300 font-mono pt-1">
            Status: Open • 240 Free Cots • Food & Medical Available
          </div>
        </div>

        <button
          onClick={() => soundManager.playBeep(800)}
          className="w-full py-2.5 rounded-xl bg-teal-600/30 hover:bg-teal-600/40 text-teal-200 border border-teal-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>Start Turn-by-Turn Safe Route Navigation</span>
        </button>
      </div>

      {/* 24/7 AI Emergency Safety Copilot */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h4 className="font-bold text-sm text-white">24/7 AI Emergency Assistant</h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
            OFFLINE CAPABLE
          </span>
        </div>

        {/* Chat Message Scroll Area */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 max-h-48 overflow-y-auto custom-scrollbar space-y-2.5 text-xs">
          {chatHistory.map((item, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed ${
                item.role === 'user'
                  ? 'ml-auto bg-cyan-600 text-white rounded-br-none'
                  : 'mr-auto bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}
            >
              {item.text}
            </div>
          ))}
          {isSendingChat && (
            <div className="text-[11px] text-purple-400 font-mono animate-pulse">
              AI Assistant analyzing emergency query...
            </div>
          )}
        </div>

        {/* Fast Action Quick Buttons */}
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          {[
            'How to treat flood water contamination?',
            'What should I pack in a Go-Bag?',
            'How to signal rescue helicopters?',
          ].map((q, qIdx) => (
            <button
              key={qIdx}
              onClick={() => {
                setChatMessage(q);
              }}
              className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 text-left cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Ask safety questions or medical guidance..."
            className="flex-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={isSendingChat || !chatMessage.trim()}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Offline Survival Guides */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <h4 className="font-bold text-sm text-white">Offline Emergency Survival Protocols</h4>
        </div>

        <div className="grid grid-cols-4 gap-2 text-xs font-mono">
          {(['flood', 'earthquake', 'fire', 'cpr'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setActiveGuide(g)}
              className={`p-2 rounded-xl border text-center uppercase transition-all cursor-pointer ${
                activeGuide === g
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 space-y-1.5 leading-relaxed">
          {activeGuide === 'flood' && (
            <>
              <div className="font-bold text-amber-300">Flood Inundation Protocol:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>Never walk, swim, or drive through moving flood waters (15cm can knock you down).</li>
                <li>Turn off main electricity breaker and gas valve before evacuating.</li>
                <li>Climb to highest elevation roof; do NOT get trapped in enclosed attics without exit hatches.</li>
              </ul>
            </>
          )}

          {activeGuide === 'earthquake' && (
            <>
              <div className="font-bold text-amber-300">Earthquake Shake Protocol:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>DROP to your hands and knees. COVER your head and neck under sturdy furniture. HOLD ON.</li>
                <li>Stay away from glass windows, exterior walls, and overhead lighting.</li>
                <li>If outdoors, stay in open areas away from electrical powerlines and buildings.</li>
              </ul>
            </>
          )}

          {activeGuide === 'fire' && (
            <>
              <div className="font-bold text-amber-300">Fire & Smoke Evacuation Protocol:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>Crawl low under smoke — clean air is closest to the floor.</li>
                <li>Feel doors with the back of your hand before opening; if hot, do not open.</li>
                <li>If clothes catch fire: STOP, DROP, and ROLL immediately.</li>
              </ul>
            </>
          )}

          {activeGuide === 'cpr' && (
            <>
              <div className="font-bold text-amber-300">Hands-Only CPR Protocol:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>Check responsiveness and call emergency services (112 / 911).</li>
                <li>Place both hands in center of chest and push hard and fast at 100–120 bpm (to the beat of 'Stayin Alive').</li>
                <li>Allow chest to fully recoil between each compression.</li>
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
