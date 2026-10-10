import React, { useState } from 'react';
import {
  Cpu,
  Radio,
  Sparkles,
  RefreshCw,
  Waves,
  CloudRain,
  Flame,
  Activity,
  Wind,
  Share2,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  SlidersHorizontal,
} from 'lucide-react';
import { SensorTelemetry, DisasterType, LanguageCode } from '../types';
import { translations } from '../i18n';
import { soundManager } from '../utils/audio';

interface AIDetectionEngineProps {
  sensors: SensorTelemetry[];
  language: LanguageCode;
  soundEnabled: boolean;
  onDispatchAlert: () => void;
}

export const AIDetectionEngine: React.FC<AIDetectionEngineProps> = ({
  sensors,
  language,
  soundEnabled,
  onDispatchAlert,
}) => {
  const t = translations[language];

  const [selectedDisaster, setSelectedDisaster] = useState<DisasterType>('Flood');
  const [isScanning, setIsScanning] = useState(false);
  const [detectionResult, setDetectionResult] = useState({
    threatDetected: true,
    type: 'Flood',
    confidence: 94,
    risk: 'CRITICAL',
    anomaly: 'Rapid hydrological surge (+48mm/hr rainfall & +1.42m river crest)',
    action: 'Initiate mandatory evacuation for low-lying sectors and mobilize swift-water rescue teams.',
    timelinePrediction: 'Peak impact expected in 1h 45m. High risk of embankment breach.',
  });

  const handleRunScan = async () => {
    setIsScanning(true);
    if (soundEnabled) soundManager.playBeep(980);
    try {
      const res = await fetch('/api/gemini/threat-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sensorData: sensors,
          disasterType: selectedDisaster,
        }),
      });
      const data = await res.json();
      setDetectionResult({
        threatDetected: data.threatDetected ?? true,
        type: data.type || selectedDisaster,
        confidence: data.confidence || 95,
        risk: data.risk || 'CRITICAL',
        anomaly: data.anomaly || 'Sensor anomalies detected exceeding safe operational thresholds.',
        action: data.action || 'Activate emergency response protocols and notify local rescue units.',
        timelinePrediction: data.timelinePrediction || 'Peak impact within 2 hours. High alert maintained.',
      });
      if (soundEnabled) soundManager.playAlertChime();
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const incomingFeeds = [
    { name: 'Weather Radar & Doppler', count: '14 Active Arrays', icon: CloudRain, color: 'text-cyan-400' },
    { name: 'Satellite Earth Thermal (MODIS)', count: '4 High-Res Passes/hr', icon: Flame, color: 'text-amber-400' },
    { name: 'IoT River & Soil Sensors', count: '86 Live Node Probes', icon: Waves, color: 'text-blue-400' },
    { name: 'Social NLP Pulse Analyzer', count: '1,420 Posts/min', icon: Share2, color: 'text-purple-400' },
    { name: 'Emergency 911/112 Acoustic Feeds', count: '42 Distress Streams', icon: PhoneCall, color: 'text-rose-400' },
    { name: 'Crowdsourced Citizen Reports', count: '18 Geotagged Uploads', icon: Activity, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-2xl gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold font-mono tracking-wide text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              AI DISASTER DETECTION ENGINE
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
              NEURAL INFERENCE ONLINE
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Continuous multi-modal telemetry fusion: Weather sensors, Satellites, IoT probes, Social NLP & Citizen feeds
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDisaster}
            onChange={(e) => setSelectedDisaster(e.target.value as DisasterType)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 font-semibold px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="Flood">Flood Modeling</option>
            <option value="Forest fire">Wildfire Thermal</option>
            <option value="Earthquake">Seismic Fault</option>
            <option value="Cyclone">Cyclone Radar</option>
            <option value="Industrial accident">Chemical Dispersion</option>
            <option value="Landslide">Slope Inclinometer</option>
          </select>

          <button
            onClick={handleRunScan}
            disabled={isScanning}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Processing Feeds...' : 'Run Deep AI Scan'}</span>
          </button>
        </div>
      </div>

      {/* Main Threat Detection Result Hero Card */}
      <div className="relative rounded-2xl bg-gradient-to-br from-rose-950/60 via-slate-900/90 to-slate-900 border border-rose-500/40 p-5 sm:p-6 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-rose-500/30 gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-lg shadow-rose-600/30 animate-pulse">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold">
                  AI THREAT DETECTION ALERT
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Rapid Water-Level Surge & Flood Risk Detected in Zone A
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block">AI CONFIDENCE</span>
                <span className="text-2xl font-black font-mono text-cyan-400">{detectionResult.confidence}%</span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block">RISK LEVEL</span>
                <span className="text-xl font-black font-mono text-rose-400">{detectionResult.risk}</span>
              </div>
            </div>
          </div>

          {/* Anomaly & Recommended Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-mono text-amber-400 font-bold uppercase flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Detected Sensor Anomaly
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">{detectionResult.anomaly}</p>
              <div className="text-[11px] font-mono text-slate-400 pt-1">
                Timeline: <span className="text-cyan-300 font-semibold">{detectionResult.timelinePrediction}</span>
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                AI Recommended Operational Directive
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">{detectionResult.action}</p>
              <div className="pt-2">
                <button
                  onClick={onDispatchAlert}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Initiate Multi-Channel Broadcast Alert →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Animated AI processing bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Telemetry Pipeline: 6 Active Multimodal Streams Ingesting</span>
          </div>
          <span className="text-cyan-400">Model: Gemini 3.7 Flash Engine</span>
        </div>
      </div>

      {/* Synchronized Multi-Modal Ingestion Streams */}
      <div className="space-y-3">
        <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400" />
          <span>Synchronized Telemetry Ingestion Channels</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {incomingFeeds.map((feed, idx) => {
            const Icon = feed.icon;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${feed.color}`} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white line-clamp-1">{feed.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{feed.count}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Sensor Telemetry Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          <span>Live Field IoT & Doppler Telemetry Nodes</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensors.map((sensor) => {
            const isCrit = sensor.status === 'Critical';
            const isWarn = sensor.status === 'Warning';
            return (
              <div
                key={sensor.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCrit
                    ? 'bg-rose-950/30 border-rose-600/40 text-rose-100'
                    : isWarn
                    ? 'bg-amber-950/20 border-amber-600/40 text-amber-100'
                    : 'bg-slate-900/80 border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
                  <span className="font-mono text-[11px] text-cyan-400 font-bold">{sensor.id}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      isCrit
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : isWarn
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {sensor.status}
                  </span>
                </div>

                <div className="text-sm font-bold text-white">{sensor.name}</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">{sensor.location}</div>

                <div className="mt-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-xs font-mono font-bold text-white">{sensor.value}</div>
                  <div className="text-[10px] text-cyan-400 font-mono mt-1">
                    Rate of change: {sensor.rateOfChange}
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Sensor Type: {sensor.type}</span>
                  <span>Ping: {sensor.lastPing}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
