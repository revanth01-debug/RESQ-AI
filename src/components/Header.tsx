import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Radio,
  Clock,
  Globe2,
  UserCheck,
  Zap,
  Volume2,
  VolumeX,
  PlayCircle,
  Flame,
  Waves,
  Activity,
  AlertTriangle,
  Menu,
  Sparkles,
} from 'lucide-react';
import { UserRole, LanguageCode } from '../types';
import { translations } from '../i18n';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  emergencyMode: boolean;
  toggleEmergencyMode: () => void;
  openDemoSimulation: () => void;
  openDisasterSelector: () => void;
  toggleSidebar: () => void;
  sidebarOpen: boolean;
  onNavigateHome: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setRole,
  language,
  setLanguage,
  emergencyMode,
  toggleEmergencyMode,
  openDemoSimulation,
  openDisasterSelector,
  toggleSidebar,
  sidebarOpen,
  onNavigateHome,
  soundEnabled,
  setSoundEnabled,
}) => {
  const [time, setTime] = useState<string>('');
  const t = translations[language];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      id="resq-main-header"
      className={`sticky top-0 z-50 transition-colors duration-300 border-b ${
        emergencyMode
          ? 'bg-rose-950/95 border-rose-600 shadow-[0_4px_30px_rgba(225,29,72,0.4)]'
          : 'bg-[#0A0A16] border-slate-800 text-slate-100 shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Menu & Brand Identity */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            id="header-sidebar-toggle-btn"
            onClick={toggleSidebar}
            className="p-2 rounded-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500"
            title="Toggle Navigation Menu"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            id="resq-brand-logo"
            onClick={onNavigateHome}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-sm font-bold text-xl text-white transition-transform duration-200 group-hover:scale-105 ${
                emergencyMode
                  ? 'bg-red-600 animate-pulse'
                  : 'bg-orange-600'
              }`}
            >
              R
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold tracking-tighter leading-none uppercase text-white font-sans">
                  RESQ <span className={emergencyMode ? 'text-rose-400' : 'text-orange-500'}>AI</span>
                </h1>
                <span className="hidden lg:inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-sm text-[10px] font-mono font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>OPERATIONAL</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase mt-0.5 hidden sm:block">
                Disaster Response Command
              </p>
            </div>
          </div>
        </div>

        {/* Center: Status & Local Time Monospace Displays */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest leading-none mb-1">
              System Status
            </span>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-mono text-emerald-400 font-bold">OPERATIONAL</span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest leading-none mb-1">
              Local Time
            </span>
            <span className="text-xs sm:text-sm font-mono text-slate-200 font-semibold tracking-wider">
              {time ? `${time} UTC` : '14:38:22 UTC'}
            </span>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Audio toggle */}
          <button
            id="header-sound-toggle"
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) soundManager.playBeep(880);
            }}
            className={`p-2 rounded-sm border text-xs transition-colors ${
              soundEnabled
                ? 'bg-slate-900 text-orange-400 border-orange-500/40'
                : 'bg-[#0A0A16] text-slate-500 border-slate-800'
            }`}
            title={soundEnabled ? 'Emergency Audio Enabled' : 'Audio Muted'}
            aria-label="Sound Toggle"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Language Switcher */}
          <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-sm">
            <Globe2 className="w-3.5 h-3.5 text-slate-400 ml-2 hidden sm:block" />
            <select
              id="header-language-select"
              value={language}
              onChange={(e) => {
                const l = e.target.value as LanguageCode;
                setLanguage(l);
                if (soundEnabled) soundManager.playBeep(980);
              }}
              className="bg-transparent text-xs text-slate-200 font-medium px-2 py-1.5 focus:outline-none cursor-pointer uppercase tracking-tight"
            >
              <option value="English" className="bg-slate-900 text-slate-200">EN</option>
              <option value="Telugu" className="bg-slate-900 text-slate-200">తెలుగు (TE)</option>
              <option value="Hindi" className="bg-slate-900 text-slate-200">हिंदी (HI)</option>
            </select>
          </div>

          {/* Role Switcher */}
          <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-sm">
            <UserCheck className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <select
              id="header-role-select"
              value={currentRole}
              onChange={(e) => {
                setRole(e.target.value as UserRole);
                if (soundEnabled) soundManager.playBeep(700);
              }}
              className="bg-transparent text-xs text-orange-400 font-medium px-2 py-1.5 focus:outline-none cursor-pointer uppercase tracking-tight font-mono"
            >
              <option value="administrator" className="bg-slate-900 text-slate-200">Admin (Command)</option>
              <option value="responder" className="bg-slate-900 text-slate-200">Responder (Field)</option>
              <option value="citizen" className="bg-slate-900 text-slate-200">Citizen (Public)</option>
            </select>
          </div>

          {/* Scenario Presentation Player button */}
          <button
            id="header-flashflood-demo-btn"
            onClick={() => {
              if (soundEnabled) soundManager.playAlertChime();
              openDemoSimulation();
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-sm text-xs font-bold bg-slate-900 text-orange-400 border border-orange-500/40 hover:bg-slate-800 hover:border-orange-500 transition-all uppercase tracking-wider"
            title="Launch 18-step Automated Flash Flood Simulation Scenario"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Scenario Demo</span>
            <span className="sm:hidden">Demo</span>
          </button>

          {/* Disaster Preset Simulator */}
          <button
            id="header-disaster-selector-btn"
            onClick={() => {
              if (soundEnabled) soundManager.playBeep(660);
              openDisasterSelector();
            }}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors uppercase tracking-wider"
            title="Simulate Flood, Earthquake, Cyclone, Fire"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulate Disasters</span>
          </button>

          {/* 🚨 Geometric Balance Emergency Mode Button */}
          <button
            id="header-emergency-mode-toggle-btn"
            onClick={() => {
              if (!emergencyMode && soundEnabled) soundManager.playEmergencySiren(2.0);
              else if (soundEnabled) soundManager.playBeep(440);
              toggleEmergencyMode();
            }}
            className={`px-3.5 py-2 rounded-sm text-xs font-bold transition-all cursor-pointer uppercase tracking-wider flex items-center space-x-1.5 ${
              emergencyMode
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg animate-pulse border border-rose-400'
                : 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm'
            }`}
          >
            <span>🚨</span>
            <span className="hidden sm:inline">
              {emergencyMode ? 'EMERGENCY ACTIVE' : 'ACTIVATE EMERGENCY MODE'}
            </span>
            <span className="sm:hidden">{emergencyMode ? 'ACTIVE' : 'EMERGENCY'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
