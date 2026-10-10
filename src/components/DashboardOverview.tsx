import React, { useState } from 'react';
import {
  AlertTriangle,
  Users,
  Ambulance,
  Building2,
  Home,
  LifeBuoy,
  BellRing,
  Sparkles,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  Radio,
  Clock,
  Compass,
  MapPin,
  CheckCircle,
  TrendingUp,
  Cpu,
  ChevronRight,
} from 'lucide-react';
import {
  DisasterZone,
  EmergencyAlert,
  RescueTeam,
  TimelineEvent,
  CitizenIncidentReport,
  LanguageCode,
} from '../types';
import { TabId } from './Sidebar';
import { translations } from '../i18n';
import { soundManager } from '../utils/audio';

interface DashboardOverviewProps {
  zones: DisasterZone[];
  alerts: EmergencyAlert[];
  rescueTeams: RescueTeam[];
  timeline: TimelineEvent[];
  incidentReports: CitizenIncidentReport[];
  onNavigate: (tab: TabId) => void;
  language: LanguageCode;
  soundEnabled: boolean;
  onSelectZone: (zone: DisasterZone) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  zones,
  alerts,
  rescueTeams,
  timeline,
  incidentReports,
  onNavigate,
  language,
  soundEnabled,
  onSelectZone,
}) => {
  const t = translations[language];

  // AI Situation Summary State
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>(
    'Severe flooding detected across Sector 4 Delta Basin with river stage cresting at +2.8m above flood stage. Concurrently, a secondary wildfire flank in North Ridge is experiencing 38km/h wind shifts towards residential margins. Old Town commercial collapse response active with acoustic canine units. 34 rescue teams deployed across 5 active sectors.'
  );
  const [aiActions, setAiActions] = useState<string[]>([
    'Enforce mandatory evacuation of Sector 4 lowlands via Elevated Ring Road East.',
    'Pre-position 20 additional watercraft and flood rescue kits at Civic Sports Complex Shelter.',
    'Issue synchronized multi-lingual emergency broadcast alerts to 28,000+ residents.',
    'Divert civilian traffic off the submerged Grand River Underpass and Market Street ramps.',
  ]);
  const [aiConfidence, setAiConfidence] = useState<number>(96);
  const [threatLevel, setThreatLevel] = useState<string>('CRITICAL');

  // Trigger Gemini API Situation Summary
  const handleGenerateSummary = async () => {
    setGeneratingSummary(true);
    if (soundEnabled) soundManager.playBeep(920);
    try {
      const activeZone = zones.find((z) => z.severity === 'Critical') || zones[0];
      const res = await fetch('/api/gemini/situation-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incident: {
            type: activeZone.disasterType,
            location: activeZone.name,
            severity: activeZone.severity,
            peopleAtRisk: 12450,
          },
          telemetry: { riverStage: '+2.8m', rainfall: '68mm/h', windSpeed: '38km/h' },
          resources: { rescueTeams: 34, hospitals: 18, shelters: 9 },
        }),
      });
      const data = await res.json();
      if (data.summary) {
        setAiSummary(data.summary);
      }
      if (data.recommendedActions && Array.isArray(data.recommendedActions)) {
        setAiActions(data.recommendedActions);
      }
      if (data.aiConfidence) {
        setAiConfidence(data.aiConfidence);
      }
      if (data.threatLevel) {
        setThreatLevel(data.threatLevel);
      }
      if (soundEnabled) soundManager.playAlertChime();
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingSummary(false);
    }
  };

  const totalPeopleAtRisk = zones.reduce((acc, z) => acc + z.affectedPopulation, 0);
  const totalEmergencyRequests = incidentReports.length + 39; // simulated live count

  return (
    <div className="space-y-4 pb-8">
      {/* Top Banner: LIVE EMERGENCY MONITORING */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#0A0A16] border border-slate-800 p-4 rounded-sm gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-sm bg-orange-600/20 border border-orange-500/40 text-orange-400 flex items-center justify-center font-bold">
            <Radio className="w-5 h-5 animate-pulse text-orange-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold font-mono tracking-tighter uppercase text-white">
                Live Disaster Command Grid
              </h2>
              <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-widest">
                ACTIVE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase font-medium tracking-widest mt-0.5">
              Multi-Hazard Telemetry • Real-Time AI Early Warning System
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="overview-quick-map-btn"
            onClick={() => onNavigate('map')}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span>Tactical Map</span>
          </button>
          <button
            id="overview-broadcast-alert-btn"
            onClick={() => onNavigate('alerts')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-sm bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>Broadcast Alert</span>
          </button>
        </div>
      </div>

      {/* Main KPI Animated Counter Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
        {[
          {
            title: t.activeEmergencies,
            value: `${zones.length}`,
            unit: 'ZONES',
            subtitle: '5 High Risk',
            icon: AlertTriangle,
            highlight: 'border-l-2 border-red-500',
            valColor: 'text-red-500',
            tab: 'map' as TabId,
          },
          {
            title: t.peopleAtRisk,
            value: totalPeopleAtRisk.toLocaleString(),
            unit: 'PEOPLE',
            subtitle: 'Evacuation active',
            icon: Users,
            highlight: 'border-l-2 border-orange-500',
            valColor: 'text-orange-400',
            tab: 'evacuation' as TabId,
          },
          {
            title: t.rescueTeamsActive,
            value: '34',
            unit: 'TEAMS',
            subtitle: '8 Rapid NDRF',
            icon: Ambulance,
            highlight: 'border-l-2 border-blue-500',
            valColor: 'text-blue-400',
            tab: 'rescue' as TabId,
          },
          {
            title: t.hospitalsAvailable,
            value: '18',
            unit: 'CENTERS',
            subtitle: '135 Free Beds',
            icon: Building2,
            highlight: 'border-l-2 border-emerald-500',
            valColor: 'text-emerald-400',
            tab: 'hospitals' as TabId,
          },
          {
            title: t.sheltersOpen,
            value: '9',
            unit: 'SHELTERS',
            subtitle: '78% Occupancy',
            icon: Home,
            highlight: 'border-l-2 border-teal-500',
            valColor: 'text-teal-400',
            tab: 'evacuation' as TabId,
          },
          {
            title: t.emergencyRequests,
            value: `${totalEmergencyRequests}`,
            unit: 'SOS',
            subtitle: '4 Urgent triage',
            icon: LifeBuoy,
            highlight: 'border-l-2 border-purple-500',
            valColor: 'text-purple-400',
            tab: 'emergencies' as TabId,
          },
          {
            title: t.criticalAlerts,
            value: `${alerts.length}`,
            unit: 'ACTIVE',
            subtitle: '98% Delivery',
            icon: BellRing,
            highlight: 'border-l-2 border-amber-500',
            valColor: 'text-amber-400',
            tab: 'alerts' as TabId,
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              id={`overview-kpi-card-${i}`}
              onClick={() => onNavigate(card.tab)}
              className={`rounded-sm bg-[#0A0A16] border border-slate-800 ${card.highlight} p-3 flex flex-col justify-between transition-all hover:bg-slate-900 cursor-pointer group`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">
                  {card.title}
                </span>
                <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-orange-400 transition-colors" />
              </div>

              <div>
                <div className={`text-xl font-bold font-mono tracking-tight ${card.valColor}`}>
                  {card.value}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center justify-between">
                  <span>{card.subtitle}</span>
                  <span className="text-[9px] text-slate-600 font-bold">{card.unit}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: AI Situation Summary + Interactive Live Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: AI Situation Summary Panel */}
        <div className="lg:col-span-2 rounded-sm bg-[#0A0A16] border border-slate-800 p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 opacity-15 pointer-events-none geometric-grid-pattern" />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-sm bg-orange-600/20 border border-orange-500/40 text-orange-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center space-x-2">
                    <span>AI Detection & Situation Engine</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-orange-950/80 text-orange-400 border border-orange-800/60 uppercase">
                      Gemini 2.5
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                    Real-Time Autonomous Threat Classification & Directive Synthesis
                  </p>
                </div>
              </div>

              {/* Confidence & Threat badges */}
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono px-2 py-1 rounded-sm bg-slate-900 border border-slate-800 text-slate-300">
                  CONFIDENCE: <span className="text-orange-400 font-bold">{aiConfidence}%</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-sm bg-red-500/20 border border-red-500/40 text-red-400 uppercase">
                  {threatLevel}
                </span>
              </div>
            </div>

            {/* Tactical Narrative Text */}
            <div className="p-3.5 rounded-sm bg-[#05050A] border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans border-l-2 border-orange-500">
              {aiSummary}
            </div>

            {/* Recommended Actions List */}
            <div className="mt-4 space-y-2">
              <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Immediate Strategic Directives:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {aiActions.map((act, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-sm bg-slate-900 border border-slate-800 flex items-start space-x-2 text-xs text-slate-300"
                  >
                    <span className="w-4 h-4 rounded-sm bg-orange-600/20 text-orange-400 border border-orange-500/30 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-snug text-slate-300">{act}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 relative z-10">
            <button
              id="dashboard-generate-summary-btn"
              onClick={handleGenerateSummary}
              disabled={generatingSummary}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-sm bg-slate-900 hover:bg-slate-800 text-orange-400 border border-orange-500/40 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${generatingSummary ? 'animate-spin' : ''}`} />
              <span>{generatingSummary ? 'Synthesizing...' : 'Re-Analyze Grid'}</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                id="dashboard-goto-evac-btn"
                onClick={() => onNavigate('evacuation')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-sm bg-slate-900 hover:bg-slate-800 text-teal-400 border border-slate-800 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Evac Routes</span>
              </button>

              <button
                id="dashboard-goto-rescue-btn"
                onClick={() => onNavigate('rescue')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-sm bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Ambulance className="w-3.5 h-3.5" />
                <span>Dispatch Teams</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Active Disaster Zones Radar */}
        <div className="rounded-sm bg-[#0A0A16] border border-slate-800 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
              <h3 className="font-bold text-white text-xs uppercase tracking-widest flex items-center space-x-2">
                <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                <span>Monitored Hazard Zones</span>
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-slate-900 text-slate-400 border border-slate-800 font-bold">
                {zones.length} ZONES
              </span>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
              {zones.map((z) => {
                const isCrit = z.severity === 'Critical';
                const isHigh = z.severity === 'High Risk';
                return (
                  <div
                    key={z.id}
                    id={`dashboard-zone-${z.id}`}
                    onClick={() => {
                      onSelectZone(z);
                      onNavigate('map');
                    }}
                    className={`p-2.5 rounded-sm border transition-all cursor-pointer hover:border-orange-500/60 ${
                      isCrit
                        ? 'bg-[#080812] border-l-2 border-l-red-500 border-slate-800 text-red-200'
                        : isHigh
                        ? 'bg-[#080812] border-l-2 border-l-orange-500 border-slate-800 text-orange-200'
                        : 'bg-[#080812] border-l-2 border-l-emerald-500 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white truncate max-w-[170px]">
                        {z.name}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded-sm font-bold uppercase ${
                          isCrit
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : isHigh
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {z.severity}
                      </span>
                    </div>

                    <div className="mt-1.5 grid grid-cols-2 gap-1 text-[10px] text-slate-400 font-mono">
                      <div>TYPE: <span className="text-slate-200 font-semibold">{z.disasterType}</span></div>
                      <div>RISK: <span className="text-orange-400 font-bold">{z.affectedPopulation.toLocaleString()}</span></div>
                      <div>TEAMS: <span className="text-blue-400 font-bold">{z.activeTeamsCount}</span></div>
                      <div>SOS: <span className="text-red-400 font-bold">{z.emergencyRequests}</span></div>
                    </div>

                    <div className="mt-1.5 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="truncate">{z.weatherCondition}</span>
                      <span className="text-orange-400 flex items-center space-x-0.5 uppercase font-bold text-[9px] tracking-wider">
                        Inspect <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onNavigate('map')}
            className="w-full mt-3 py-2 rounded-sm bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold uppercase tracking-wider text-center transition-colors border border-slate-700 cursor-pointer"
          >
            Launch Interactive Tactical Map →
          </button>
        </div>
      </div>

      {/* Bottom Section: Real-time Incident Timeline & Rapid SOS Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Timeline Panel */}
        <div className="rounded-sm bg-[#0A0A16] border border-slate-800 p-4">
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
            <h3 className="font-bold text-white text-xs uppercase tracking-widest flex items-center space-x-2">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span>Tactical Incident Log</span>
            </h3>
            <span className="text-[9px] font-mono text-emerald-400 flex items-center space-x-1 uppercase font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE FEED</span>
            </span>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
            {timeline.map((event) => (
              <div key={event.id} className="relative pl-5 pb-2 border-l border-slate-800 last:border-l-0">
                <div className="absolute -left-[4px] top-0.5 w-2 h-2 rounded-sm bg-orange-500" />
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold text-orange-400">{event.time}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-sm bg-slate-900 text-slate-400 border border-slate-800 uppercase">
                    {event.category}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-white mt-0.5">{event.title}</h5>
                <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{event.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Citizen SOS Feed */}
        <div className="rounded-sm bg-[#0A0A16] border border-slate-800 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
              <h3 className="font-bold text-white text-xs uppercase tracking-widest flex items-center space-x-2">
                <LifeBuoy className="w-3.5 h-3.5 text-red-500" />
                <span>Live SOS Citizen Queue</span>
              </h3>
              <button
                onClick={() => onNavigate('emergencies')}
                className="text-[10px] font-mono text-orange-400 hover:text-orange-300 font-bold uppercase tracking-wider cursor-pointer"
              >
                View All ({incidentReports.length}) →
              </button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
              {incidentReports.map((inc) => (
                <div
                  key={inc.id}
                  className="p-2.5 rounded-sm bg-[#05050A] border border-slate-800 border-l-2 border-l-red-500 flex items-start justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-red-400 text-[10px]">{inc.id}</span>
                      <span className="font-bold text-white text-xs truncate">{inc.category}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-sm bg-red-500/20 text-red-400 border border-red-500/30 font-bold uppercase">
                        {inc.aiPriority}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] line-clamp-1">{inc.description}</p>
                    <div className="text-[10px] text-slate-500 font-mono flex items-center space-x-3">
                      <span>📍 {inc.location}</span>
                      <span>👥 {inc.peopleAffected} Affected</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-orange-400 font-bold block">
                      {inc.timestamp}
                    </span>
                    <button
                      onClick={() => onNavigate('emergencies')}
                      className="mt-1.5 px-2 py-1 rounded-sm bg-slate-900 hover:bg-slate-800 text-orange-400 border border-orange-500/40 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Dispatch
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('emergencies')}
            className="w-full mt-3 py-2 rounded-sm bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold uppercase tracking-wider text-center transition-colors border border-slate-700 cursor-pointer"
          >
            + File New Citizen Emergency Report
          </button>
        </div>
      </div>
    </div>
  );
};
