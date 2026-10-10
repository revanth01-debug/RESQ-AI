import React from 'react';
import {
  ShieldAlert,
  ArrowRight,
  Radio,
  Cpu,
  MapPin,
  Compass,
  Ambulance,
  Bot,
  Package,
  LineChart,
  Activity,
  AlertTriangle,
  Play,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { TabId } from './Sidebar';
import { LanguageCode } from '../types';
import { translations } from '../i18n';
import { soundManager } from '../utils/audio';

interface LandingPageProps {
  onNavigate: (tab: TabId) => void;
  onLaunchDemoScenario: () => void;
  language: LanguageCode;
  soundEnabled: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onLaunchDemoScenario,
  language,
  soundEnabled,
}) => {
  const t = translations[language];

  const features = [
    {
      title: 'AI Disaster Detection',
      desc: 'Real-time multi-modal anomaly scanning across IoT river gauges, satellite thermal feeds, seismographs, and social NLP telemetry.',
      icon: Cpu,
      color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400',
      tab: 'ai-detection' as TabId,
    },
    {
      title: 'Real-Time Emergency Alerts',
      desc: 'AI auto-crafts verified multilingual public warning bulletins and simulates high-throughput delivery across SMS, Push, and Sirens.',
      icon: Radio,
      color: 'from-rose-500/20 to-red-500/20 border-rose-500/30 text-rose-400',
      tab: 'alerts' as TabId,
    },
    {
      title: 'Intelligent Evacuation',
      desc: 'Dynamic AI route computation avoiding flooded lowlands, debris fires, and bridge failures with real-time shelter capacity balancing.',
      icon: Compass,
      color: 'from-teal-500/20 to-emerald-500/20 border-teal-500/30 text-teal-400',
      tab: 'evacuation' as TabId,
    },
    {
      title: 'Live Disaster Map',
      desc: 'Interactive tactical geospatial radar displaying colored risk zones, rescue boats, fire engines, hospitals, blocked roads, and citizen SOS tags.',
      icon: MapPin,
      color: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-400',
      tab: 'map' as TabId,
    },
    {
      title: 'Rescue Team Coordination',
      desc: 'Command-level fleet tracking and rapid mission dispatch for NDRF swift water forces, Hazmat pods, and helicopter extraction squads.',
      icon: Ambulance,
      color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
      tab: 'rescue' as TabId,
    },
    {
      title: 'AI Emergency Assistant',
      desc: '24/7 intelligent conversational safety copilot for trapped citizens and field responders with step-by-step survival protocols.',
      icon: Bot,
      color: 'from-purple-500/20 to-fuchsia-500/20 border-purple-500/30 text-purple-400',
      tab: 'overview' as TabId,
    },
    {
      title: 'Resource Management',
      desc: 'Predictive inventory depletion monitoring for trauma medical kits, clean drinking water, cots, oxygen, and heavy power generators.',
      icon: Package,
      color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30 text-amber-400',
      tab: 'resources' as TabId,
    },
    {
      title: 'Predictive Risk Analysis',
      desc: 'Deep probabilistic neural modeling for 6-hour flood surges, wildfire progression vectors, hospital surge loads, and demographic exposure.',
      icon: LineChart,
      color: 'from-sky-500/20 to-cyan-500/20 border-sky-500/30 text-sky-400',
      tab: 'analytics' as TabId,
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden pb-16">
      {/* Animated Tactical Grid & Radar Backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-cyan-600/30 via-indigo-600/20 to-rose-600/20 rounded-full blur-3xl animate-pulse" />
        {/* Subtle coordinate grid lines */}
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-12">
        {/* Top Operational Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>RESQ AI PLATFORM V2.4 — ADVANCED EMERGENCY ARCHITECTURE</span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-sans text-white leading-none">
            When Every Second Matters,{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
              AI Responds.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* Action Button Group */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
            <button
              id="hero-launch-dashboard-btn"
              onClick={() => {
                if (soundEnabled) soundManager.playBeep(880);
                onNavigate('overview');
              }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>{t.launchDashboard}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-report-emergency-btn"
              onClick={() => {
                if (soundEnabled) soundManager.playBeep(650);
                onNavigate('emergencies');
              }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-sm border border-rose-400 shadow-lg shadow-rose-600/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{t.reportEmergency}</span>
            </button>

            <button
              id="hero-view-map-btn"
              onClick={() => {
                if (soundEnabled) soundManager.playBeep(720);
                onNavigate('map');
              }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 text-slate-200 font-semibold text-sm border border-slate-700 shadow-md backdrop-blur-md transition-all cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{t.viewLiveSituation}</span>
            </button>

            {/* Scenario Presentation Demo Button */}
            <button
              id="hero-scenario-demo-btn"
              onClick={() => {
                if (soundEnabled) soundManager.playAlertChime();
                onLaunchDemoScenario();
              }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-sm border border-amber-500/50 shadow-md transition-all cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span>Play 18-Step Live Simulation</span>
            </button>
          </div>
        </div>

        {/* Live Command Center Visual Preview Card */}
        <div className="mt-14 relative rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-slate-800/80 gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <h3 className="font-mono text-sm uppercase tracking-wider text-slate-200 font-bold">
                INCIDENT RADAR TELEMETRY — REAL-TIME MONITORING
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <span>7 Active Disasters</span>
              <span>•</span>
              <span className="text-cyan-400 font-semibold">12,450 Citizens at Risk</span>
              <span>•</span>
              <span className="text-emerald-400">34 Rescue Units</span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: 'Active Incidents', val: '7', col: 'text-rose-400' },
              { label: 'People at Risk', val: '12,450', col: 'text-amber-400' },
              { label: 'Rescue Teams', val: '34 Active', col: 'text-cyan-400' },
              { label: 'Hospitals Ready', val: '18 Open', col: 'text-emerald-400' },
              { label: 'Shelters Open', val: '9 Centers', col: 'text-teal-400' },
              { label: 'SOS Requests', val: '42 Active', col: 'text-purple-400' },
              { label: 'Alert Reach', val: '98% Multi-ch', col: 'text-blue-400' },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 flex flex-col justify-center text-center"
              >
                <div className={`text-xl font-bold font-mono ${stat.col}`}>{stat.val}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-tight mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Integrated Emergency Response Ecosystem
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Engineered for high-stakes coordination between civilian populations, first responders, and emergency commanders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                id={`feature-card-${idx}`}
                onClick={() => {
                  if (soundEnabled) soundManager.playBeep(800);
                  onNavigate(f.tab);
                }}
                className="group relative rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} border flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {f.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-cyan-300">
                  <span>Explore Module</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
