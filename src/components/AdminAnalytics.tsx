import React from 'react';
import {
  BarChart3,
  Activity,
  CheckCircle2,
  Clock,
  Users,
  Shield,
  Zap,
  Radio,
  Server,
  Cpu,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { LanguageCode } from '../types';
import { translations } from '../i18n';

interface AdminAnalyticsProps {
  language: LanguageCode;
  soundEnabled: boolean;
}

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({
  language,
  soundEnabled,
}) => {
  const t = translations[language];

  const responseTimeData = [
    { hour: '18:00', avgResponseMins: 6.8, incidentsCount: 4 },
    { hour: '19:00', avgResponseMins: 5.2, incidentsCount: 9 },
    { hour: '20:00', avgResponseMins: 4.6, incidentsCount: 15 },
    { hour: '21:00', avgResponseMins: 3.9, incidentsCount: 22 },
    { hour: '22:00 (Peak)', avgResponseMins: 3.4, incidentsCount: 31 },
  ];

  const resourceDistribution = [
    { name: 'Water Rescue Boats', value: 34, color: '#38bdf8' },
    { name: 'Ambulance Units', value: 28, color: '#10b981' },
    { name: 'Fire & Hazmat Pods', value: 16, color: '#f97316' },
    { name: 'Air-Rescue Choppers', value: 4, color: '#a855f7' },
    { name: 'Mobile Generators', value: 18, color: '#eab308' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-2xl gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold font-mono tracking-wide text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-fuchsia-400" />
              SYSTEM TELEMETRY & COMMAND POST-INCIDENT ANALYTICS
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 font-bold">
              SYSTEM KPI REPORT
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Automated evaluation of dispatch response velocity, fleet utilization & system availability
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>99.98% System Uptime</span>
        </div>
      </div>

      {/* System Infrastructure Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>AI Inference Latency</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">184 ms</div>
          <div className="text-[10px] text-emerald-400">Gemini 3.7 Flash Engine</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Avg. Dispatch Time</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">3.4 mins</div>
          <div className="text-[10px] text-emerald-400">62% faster than baseline</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Citizens Evacuated</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">12,450</div>
          <div className="text-[10px] text-cyan-400">Zero Critical Failures</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Network Reliability</span>
            <Server className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">99.98%</div>
          <div className="text-[10px] text-emerald-400">Mesh & Cellular Redundant</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Velocity Chart */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white">Emergency Response Velocity (Minutes to On-Site)</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
              5-HOUR TREND
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
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
                  dataKey="avgResponseMins"
                  name="Avg Response Time (Mins)"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="incidentsCount"
                  name="Concurrent Incidents"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resource Distribution Pie Chart */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white">Deployed Relief Equipment & Fleet Units</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800">
              100 UNITS
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resourceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {resourceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
