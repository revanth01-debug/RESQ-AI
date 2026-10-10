import React, { useState } from 'react';
import {
  TrendingUp,
  LineChart as LineChartIcon,
  AlertTriangle,
  Clock,
  Sparkles,
  RefreshCw,
  Users,
  Building2,
  Waves,
  Flame,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { LanguageCode } from '../types';
import { translations } from '../i18n';
import { soundManager } from '../utils/audio';

interface PredictiveAnalyticsProps {
  language: LanguageCode;
  soundEnabled: boolean;
}

export const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({
  language,
  soundEnabled,
}) => {
  const t = translations[language];
  const [forecastHorizon, setForecastHorizon] = useState<'6h' | '12h' | '24h'>('6h');

  // Simulated Time-Series Forecast Data
  const floodRainfallData = [
    { time: '21:00 (Now)', rainfallMm: 68, floodProb: 72, waterLevelM: 5.2 },
    { time: '22:00', rainfallMm: 82, floodProb: 84, waterLevelM: 5.9 },
    { time: '23:00 (Peak)', rainfallMm: 95, floodProb: 91, waterLevelM: 6.7 },
    { time: '00:00', rainfallMm: 74, floodProb: 88, waterLevelM: 6.9 },
    { time: '01:00', rainfallMm: 45, floodProb: 76, waterLevelM: 6.4 },
    { time: '02:00', rainfallMm: 28, floodProb: 58, waterLevelM: 5.8 },
  ];

  const evacProgressData = [
    { time: '21:00', atRisk: 12450, evacuated: 3200, shelterCap: 3800 },
    { time: '22:00', atRisk: 12450, evacuated: 6400, shelterCap: 7200 },
    { time: '23:00', atRisk: 12450, evacuated: 9100, shelterCap: 10500 },
    { time: '00:00', atRisk: 12450, evacuated: 11200, shelterCap: 12000 },
    { time: '01:00', atRisk: 12450, evacuated: 12100, shelterCap: 13500 },
    { time: '02:00', atRisk: 12450, evacuated: 12450, shelterCap: 14000 },
  ];

  const hospitalLoadData = [
    { name: 'Metro Trauma', capacity: 250, occupied: 208, incomingProjected: 35 },
    { name: 'St. Jude Center', capacity: 180, occupied: 154, incomingProjected: 22 },
    { name: 'North Hill Med', capacity: 90, occupied: 72, incomingProjected: 14 },
    { name: 'Southwest Gen', capacity: 210, occupied: 175, incomingProjected: 28 },
    { name: 'Apex Burn Clinic', capacity: 80, occupied: 66, incomingProjected: 10 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-2xl gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold font-mono tracking-wide text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              AI PREDICTION & RISK MODELING CENTER
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              PROBABILISTIC FORECASTING
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Multi-variable predictive analytics: Hydrological crests, Wildfire progression vectors & Hospital surge capacity
          </p>
        </div>

        {/* Forecast Horizon Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          {(['6h', '12h', '24h'] as const).map((hz) => (
            <button
              key={hz}
              onClick={() => {
                if (soundEnabled) soundManager.playBeep(850);
                setForecastHorizon(hz);
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                forecastHorizon === hz
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {hz.toUpperCase()} Projection
            </button>
          ))}
        </div>
      </div>

      {/* Top Prediction KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/60 to-slate-900 border border-cyan-500/30">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono text-cyan-300">Flood Probability (Next 6h)</span>
            <Waves className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white">87%</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Peak surge estimated at 23:00 (+1.9m)
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-500/30">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono text-amber-300">Expected Population at Risk</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white">8,400</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across lowlands Sectors 3 & 4
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/60 to-slate-900 border border-rose-500/30">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono text-rose-300">Overall Threat Risk</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black font-mono text-rose-400">CRITICAL</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Evacuation recommended immediately
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono text-emerald-300">Shelter Capacity Sufficiency</span>
            <Building2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white">92%</div>
          <div className="text-[11px] text-slate-400 mt-1">
            4 shelters operating below capacity
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Flood Probability & Rainfall Trend */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Waves className="w-4 h-4 text-cyan-400" />
                <span>Flood Probability & Precipitation Prediction</span>
              </h3>
              <p className="text-xs text-slate-400">Doppler rain accumulation vs Probability curve</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
              NEXT 6 HOURS
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={floodRainfallData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line
                  type="monotone"
                  dataKey="floodProb"
                  name="Flood Probability (%)"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="rainfallMm"
                  name="Rainfall (mm/h)"
                  stroke="#a855f7"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Evacuation Demand vs Shelter Capacity */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>Evacuation Clearance vs Shelter Occupancy</span>
              </h3>
              <p className="text-xs text-slate-400">Cumulative citizens evacuated to safe shelter zones</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-amber-400 border border-slate-800">
              CUMULATIVE
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={evacProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area
                  type="monotone"
                  dataKey="evacuated"
                  name="Evacuated Citizens"
                  stroke="#10b981"
                  fill="rgba(16, 185, 129, 0.2)"
                />
                <Area
                  type="monotone"
                  dataKey="shelterCap"
                  name="Total Shelter Spots"
                  stroke="#0ea5e9"
                  fill="rgba(14, 165, 233, 0.1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Hospital Surge Capacity vs Incoming Trauma Demand */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Regional Hospital Load vs Incoming Emergency Forecast</span>
              </h3>
              <p className="text-xs text-slate-400">Total capacity, active occupancy & projected casualty surge</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800">
              5 FACILITIES
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hospitalLoadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="occupied" name="Current Inpatients" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="incomingProjected" name="Projected Casualty Surge" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="capacity" name="Maximum Licensed Beds" fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
