import React, { useState } from 'react';
import {
  MapPin,
  Ambulance,
  Flame,
  Shield,
  Building2,
  Home,
  Package,
  Slash,
  LifeBuoy,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Info,
  Navigation,
  Compass,
  AlertTriangle,
  X,
  Send,
  Eye,
  CheckCircle2,
  Radio,
  Clock,
  Sparkles,
} from 'lucide-react';
import { DisasterZone, MapMarker, LanguageCode } from '../types';
import { TabId } from './Sidebar';
import { soundManager } from '../utils/audio';

interface LiveDisasterMapProps {
  zones: DisasterZone[];
  markers: MapMarker[];
  selectedZone: DisasterZone | null;
  setSelectedZone: (zone: DisasterZone | null) => void;
  onNavigate: (tab: TabId) => void;
  language: LanguageCode;
  soundEnabled: boolean;
}

export const LiveDisasterMap: React.FC<LiveDisasterMapProps> = ({
  zones,
  markers,
  selectedZone,
  setSelectedZone,
  onNavigate,
  language,
  soundEnabled,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  // Layer toggles
  const [showZones, setShowZones] = useState(true);
  const [showRescueTeams, setShowRescueTeams] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showBlockedRoads, setShowBlockedRoads] = useState(true);
  const [showEvacRoutes, setShowEvacRoutes] = useState(true);
  const [showCitizenSos, setShowCitizenSos] = useState(true);

  const handleZoneClick = (z: DisasterZone) => {
    if (soundEnabled) soundManager.playBeep(720);
    setSelectedZone(z);
    setSelectedMarker(null);
  };

  const handleMarkerClick = (m: MapMarker) => {
    if (soundEnabled) soundManager.playBeep(840);
    setSelectedMarker(m);
    setSelectedZone(null);
  };

  // Severity styling
  const getZoneFillColor = (sev: string) => {
    switch (sev) {
      case 'Critical':
        return 'rgba(225, 29, 72, 0.28)'; // Red
      case 'High Risk':
        return 'rgba(234, 88, 12, 0.25)'; // Orange
      case 'Warning':
        return 'rgba(234, 179, 8, 0.22)'; // Yellow
      case 'Safe':
      default:
        return 'rgba(16, 185, 129, 0.2)'; // Green
    }
  };

  const getZoneStrokeColor = (sev: string) => {
    switch (sev) {
      case 'Critical':
        return '#f43f5e';
      case 'High Risk':
        return '#f97316';
      case 'Warning':
        return '#eab308';
      case 'Safe':
      default:
        return '#10b981';
    }
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Top Map Header and Filter Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between bg-[#0A0A16] border border-slate-800 p-4 rounded-sm gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base sm:text-lg font-bold font-mono tracking-wider uppercase text-white flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>Tactical Geolocation Grid</span>
            </h2>
            <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
              GPS TELEMETRY SYNCED
            </span>
          </div>
          <p className="text-[10px] text-slate-400 uppercase font-medium tracking-widest mt-0.5">
            Interactive Multi-Layer Incident Coordinates • Fleet Telemetry & Safe Evacuation Corridors
          </p>
        </div>

        {/* Legend pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono font-bold uppercase">
          <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-sm bg-red-500/10 text-red-400 border border-red-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>Critical Zone</span>
          </span>
          <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-sm bg-orange-500/10 text-orange-400 border border-orange-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span>High Risk</span>
          </span>
          <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-sm bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            <span>Warning</span>
          </span>
          <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Safe Corridor</span>
          </span>
        </div>
      </div>

      {/* Layer Toggles Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 bg-[#0A0A16] p-2.5 rounded-sm border border-slate-800 text-xs">
        <span className="text-slate-400 font-mono text-[10px] uppercase tracking-widest font-bold flex items-center space-x-1.5 mr-2">
          <Layers className="w-3.5 h-3.5 text-orange-400" />
          <span>Layers:</span>
        </span>

        {[
          { label: 'Disaster Zones', active: showZones, set: setShowZones, col: 'text-red-400' },
          { label: 'Rescue Teams', active: showRescueTeams, set: setShowRescueTeams, col: 'text-blue-400' },
          { label: 'Hospitals', active: showHospitals, set: setShowHospitals, col: 'text-emerald-400' },
          { label: 'Shelters', active: showShelters, set: setShowShelters, col: 'text-teal-400' },
          { label: 'Blocked Roads', active: showBlockedRoads, set: setShowBlockedRoads, col: 'text-orange-400' },
          { label: 'Evac Routes', active: showEvacRoutes, set: setShowEvacRoutes, col: 'text-cyan-400' },
          { label: 'Citizen SOS', active: showCitizenSos, set: setShowCitizenSos, col: 'text-purple-400' },
        ].map((layer, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (soundEnabled) soundManager.playBeep(900);
              layer.set(!layer.active);
            }}
            className={`px-2.5 py-1 rounded-sm text-[10px] font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
              layer.active
                ? 'bg-slate-900 text-white border border-orange-500/60 shadow-xs'
                : 'bg-slate-950 text-slate-500 border border-slate-800 line-through opacity-60'
            }`}
          >
            <span className={layer.active ? layer.col : ''}>{layer.label}</span>
          </button>
        ))}
      </div>

      {/* Interactive Tactical Map Container */}
      <div className="relative rounded-sm bg-[#05050A] border border-slate-800 overflow-hidden min-h-[580px] sm:min-h-[640px] flex flex-col justify-between">
        {/* Background Grid Pattern & Topographic Map Graphic */}
        <div className="absolute inset-0 select-none pointer-events-none">
          <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="tacticalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tacticalGrid)" />
          </svg>

          {/* Simulated River Network */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* River main channel */}
            <path
              d="M 10,20 Q 30,35 38,45 T 45,70 T 55,95"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2.8"
              strokeOpacity="0.45"
            />
            {/* River tributary */}
            <path
              d="M 65,10 Q 52,30 38,45"
              fill="none"
              stroke="#0369a1"
              strokeWidth="1.8"
              strokeOpacity="0.35"
            />
          </svg>
        </div>

        {/* Vector SVG Map Layer with Zones, Routes, and Clickable Markers */}
        <div className="relative w-full h-[580px] sm:h-[640px] overflow-hidden flex items-center justify-center p-4">
          <div
            className="relative w-full h-full max-w-5xl transition-transform duration-300 origin-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Primary Evacuation Corridors (Green/Blue paths) */}
              {showEvacRoutes && (
                <g id="evacuation-routes-group">
                  {/* Route A: Sector 4 to Civic Center */}
                  <path
                    d="M 38,44 Q 42,48 45,52"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="2 1.5"
                    className="animate-pulse"
                  />
                  {/* Route B: High Ridge to North High Stadium */}
                  <path
                    d="M 74,28 Q 68,34 62,38"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    strokeDasharray="2 1.5"
                  />
                  {/* Route C: Old Town to St. Jude */}
                  <path
                    d="M 55,62 Q 57,59 59,56"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="2 1.5"
                  />
                </g>
              )}

              {/* Blocked Roads Indicators (Red crosshairs on SVG) */}
              {showBlockedRoads && (
                <g id="blocked-corridors-group">
                  <line x1="33" y1="42" x2="37" y2="46" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="33" y1="46" x2="37" y2="42" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="73" y1="25" x2="77" y2="29" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="73" y1="29" x2="77" y2="25" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" />
                </g>
              )}

              {/* Disaster Risk Zones Polygons / Circles */}
              {showZones &&
                zones.map((zone) => {
                  const isSelected = selectedZone?.id === zone.id;
                  return (
                    <g
                      key={zone.id}
                      onClick={() => handleZoneClick(zone)}
                      className="cursor-pointer transition-transform hover:scale-105"
                    >
                      {/* Pulsing hazard perimeter */}
                      <circle
                        cx={zone.center.x}
                        cy={zone.center.y}
                        r={zone.radius}
                        fill={getZoneFillColor(zone.severity)}
                        stroke={getZoneStrokeColor(zone.severity)}
                        strokeWidth={isSelected ? 1.8 : 1.0}
                        strokeDasharray={isSelected ? '2 1' : 'none'}
                        className={zone.severity === 'Critical' ? 'animate-pulse' : ''}
                      />
                      {/* Zone Center Core Pin */}
                      <circle
                        cx={zone.center.x}
                        cy={zone.center.y}
                        r={2.2}
                        fill={getZoneStrokeColor(zone.severity)}
                        stroke="#ffffff"
                        strokeWidth="0.6"
                      />
                      {/* Label Text */}
                      <text
                        x={zone.center.x}
                        y={zone.center.y - zone.radius - 1.5}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="2.6"
                        fontWeight="bold"
                        fontFamily="monospace"
                        className="drop-shadow-md select-none"
                      >
                        {zone.name.split('—')[0]}
                      </text>
                    </g>
                  );
                })}
            </svg>

            {/* DOM Markers Overlaid for Interactive Tooltips & Badges */}
            {markers.map((m) => {
              // Check layer filter
              if (m.type === 'rescue_team' && !showRescueTeams) return null;
              if (m.type === 'ambulance' && !showRescueTeams) return null;
              if (m.type === 'fire_truck' && !showRescueTeams) return null;
              if (m.type === 'police' && !showRescueTeams) return null;
              if (m.type === 'hospital' && !showHospitals) return null;
              if (m.type === 'shelter' && !showShelters) return null;
              if (m.type === 'blocked_road' && !showBlockedRoads) return null;
              if (m.type === 'citizen_sos' && !showCitizenSos) return null;

              const isSelected = selectedMarker?.id === m.id;

              return (
                <div
                  key={m.id}
                  id={`map-marker-${m.id}`}
                  onClick={() => handleMarkerClick(m)}
                  style={{
                    left: `${m.position.x}%`,
                    top: `${m.position.y}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  {/* Marker Icon Pin */}
                  <div
                    className={`p-1.5 rounded-full border shadow-lg transition-transform group-hover:scale-125 ${
                      isSelected ? 'ring-4 ring-cyan-400 scale-125' : ''
                    } ${
                      m.type === 'rescue_team'
                        ? 'bg-blue-600 border-blue-300 text-white'
                        : m.type === 'ambulance'
                        ? 'bg-emerald-600 border-emerald-300 text-white'
                        : m.type === 'fire_truck'
                        ? 'bg-orange-600 border-orange-300 text-white'
                        : m.type === 'police'
                        ? 'bg-indigo-600 border-indigo-300 text-white'
                        : m.type === 'hospital'
                        ? 'bg-rose-600 border-rose-300 text-white'
                        : m.type === 'shelter'
                        ? 'bg-teal-600 border-teal-300 text-white'
                        : m.type === 'blocked_road'
                        ? 'bg-red-700 border-red-400 text-white animate-bounce'
                        : m.type === 'citizen_sos'
                        ? 'bg-purple-600 border-purple-300 text-white animate-ping'
                        : 'bg-slate-700 text-white'
                    }`}
                  >
                    {m.type === 'rescue_team' && <Navigation className="w-3.5 h-3.5" />}
                    {m.type === 'ambulance' && <Ambulance className="w-3.5 h-3.5" />}
                    {m.type === 'fire_truck' && <Flame className="w-3.5 h-3.5" />}
                    {m.type === 'police' && <Shield className="w-3.5 h-3.5" />}
                    {m.type === 'hospital' && <Building2 className="w-3.5 h-3.5" />}
                    {m.type === 'shelter' && <Home className="w-3.5 h-3.5" />}
                    {m.type === 'blocked_road' && <Slash className="w-3.5 h-3.5" />}
                    {m.type === 'citizen_sos' && <LifeBuoy className="w-3.5 h-3.5" />}
                  </div>

                  {/* Tooltip on Hover */}
                  <div className="opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 rounded-md bg-slate-900/95 border border-slate-700 text-[10px] text-slate-100 whitespace-nowrap shadow-xl z-30 font-mono">
                    <div className="font-bold text-cyan-300">{m.name}</div>
                    <div className="text-slate-400">{m.status}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map Control Buttons (Zoom, Recenter) */}
        <div className="absolute top-3 right-3 z-30 flex flex-col space-y-1 bg-[#0A0A16] border border-slate-800 p-1 rounded-sm shadow-md">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.25))}
            className="p-1.5 rounded-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
            className="p-1.5 rounded-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              setSelectedZone(null);
              setSelectedMarker(null);
            }}
            className="p-1.5 rounded-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset Map View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compass Radar Badge */}
        <div className="absolute top-3 left-3 z-30 flex items-center space-x-2 bg-[#0A0A16] border border-slate-800 px-2.5 py-1 rounded-sm shadow-md text-[10px] font-mono text-orange-400 font-bold uppercase">
          <Compass className="w-3.5 h-3.5 text-orange-400" />
          <span>GRID: 17.3850° N, 78.4867° E</span>
        </div>

        {/* Active Incident / Marker Details Modal Bottom Drawer */}
        {(selectedZone || selectedMarker) && (
          <div className="relative z-30 bg-[#0A0A16] border-t border-slate-800 p-4 sm:p-5">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-start justify-between pb-3 mb-3 border-b border-slate-800 gap-3">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-9 h-9 rounded-sm flex items-center justify-center text-white font-bold ${
                      selectedZone?.severity === 'Critical'
                        ? 'bg-red-600'
                        : selectedZone?.severity === 'High Risk'
                        ? 'bg-orange-600'
                        : 'bg-blue-600'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm sm:text-base font-bold font-mono uppercase text-white tracking-wider">
                        {selectedZone ? selectedZone.name : selectedMarker?.name}
                      </h3>
                      {selectedZone && (
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded-sm font-bold uppercase ${
                            selectedZone.severity === 'Critical'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          }`}
                        >
                          {selectedZone.severity}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 uppercase font-mono mt-0.5">
                      {selectedZone ? `HAZARD CATEGORY: ${selectedZone.disasterType}` : selectedMarker?.status}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedZone(null);
                    setSelectedMarker(null);
                  }}
                  className="p-1 rounded-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Zone Details Grid */}
              {selectedZone && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono mb-3">
                  <div className="bg-[#05050A] p-2.5 rounded-sm border border-slate-800 border-l-2 border-l-orange-500">
                    <span className="text-slate-500 text-[9px] block uppercase font-bold tracking-widest">People At Risk</span>
                    <span className="text-orange-400 font-bold text-sm">
                      {selectedZone.affectedPopulation.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-[#05050A] p-2.5 rounded-sm border border-slate-800 border-l-2 border-l-blue-500">
                    <span className="text-slate-500 text-[9px] block uppercase font-bold tracking-widest">Weather & Stage</span>
                    <span className="text-slate-200 font-bold text-sm">
                      {selectedZone.waterLevelOrRiskVal}
                    </span>
                  </div>
                  <div className="bg-[#05050A] p-2.5 rounded-sm border border-slate-800 border-l-2 border-l-emerald-500">
                    <span className="text-slate-500 text-[9px] block uppercase font-bold tracking-widest">Available Teams</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      {selectedZone.activeTeamsCount} Teams On-Site
                    </span>
                  </div>
                  <div className="bg-[#05050A] p-2.5 rounded-sm border border-slate-800 border-l-2 border-l-purple-500">
                    <span className="text-slate-500 text-[9px] block uppercase font-bold tracking-widest">Nearest Hospital</span>
                    <span className="text-white font-bold text-sm line-clamp-1">
                      {selectedZone.nearestHospital}
                    </span>
                  </div>
                </div>
              )}

              {/* AI Risk Assessment Box */}
              {selectedZone && (
                <div className="p-3 rounded-sm bg-[#05050A] border border-slate-800 text-xs text-slate-300 mb-3 flex items-start space-x-2 border-l-2 border-orange-500">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-orange-400 font-mono text-[10px] uppercase tracking-wider block">AI Tactical Threat Assessment: </span>
                    <span className="text-[11px] leading-relaxed text-slate-300">{selectedZone.aiRiskAssessment}</span>
                  </div>
                </div>
              )}

              {/* Marker Specific Details */}
              {selectedMarker && (
                <div className="p-3 rounded-sm bg-[#05050A] border border-slate-800 text-xs text-slate-300 mb-3 space-y-1">
                  <div><strong className="text-white uppercase text-[10px] font-mono">Status:</strong> {selectedMarker.status}</div>
                  {selectedMarker.details && <div><strong className="text-white uppercase text-[10px] font-mono">Telemetry & Notes:</strong> {selectedMarker.details}</div>}
                  {selectedMarker.capacity && <div><strong className="text-orange-400 uppercase text-[10px] font-mono">Capacity:</strong> {selectedMarker.capacity}</div>}
                  {selectedMarker.contact && <div><strong className="text-emerald-400 uppercase text-[10px] font-mono">Dispatch Contact:</strong> {selectedMarker.contact}</div>}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-2">
                <button
                  onClick={() => onNavigate('evacuation')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-sm bg-slate-900 hover:bg-slate-800 text-teal-400 border border-slate-800 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Evacuation Corridor</span>
                </button>

                <button
                  onClick={() => onNavigate('rescue')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-sm bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Dispatch Rescue</span>
                </button>

                <button
                  onClick={() => onNavigate('alerts')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-sm bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast Area Alert</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
