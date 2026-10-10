import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Ambulance,
  Building2,
  Users,
  Compass,
  Home,
  LifeBuoy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

interface FlashFloodDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
}

interface ScenarioStep {
  stepNumber: number;
  title: string;
  category: string;
  description: string;
  aiAction: string;
  systemState: {
    threatLevel: 'NORMAL' | 'WARNING' | 'CRITICAL' | 'RECOVERY';
    activeZoneColor: string;
    actionHighlight: string;
  };
  speechScript: string;
}

export const FlashFloodDemoModal: React.FC<FlashFloodDemoModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(4000); // 4s per step

  const steps: ScenarioStep[] = [
    {
      stepNumber: 1,
      title: 'Heavy Inflow & Doppler Radar Saturation',
      category: 'Telemetry Ingestion',
      description: 'Continuous extreme precipitation (>68mm/h) causes rapid hydrological accumulation in Sector 4 river basin.',
      aiAction: 'IoT ultrasonic river sensors detect water crest rate exceeding +0.35m per 15 minutes.',
      systemState: { threatLevel: 'WARNING', activeZoneColor: 'text-amber-400', actionHighlight: 'Sensors Online' },
      speechScript: 'Step 1: Heavy rainfall detected. Ultrasonic river gauges report stage rise +0.35 meters per 15 minutes.',
    },
    {
      stepNumber: 2,
      title: 'AI Multi-Modal Disaster Threat Detection',
      category: 'Neural Inference',
      description: 'Gemini Disaster Inference Engine synthesizes radar Doppler imagery, IoT ultrasound probes, and social NLP telemetry.',
      aiAction: 'Threat identified: Flash Flood Inundation. AI Confidence score: 95.8%. Risk Level: CRITICAL.',
      systemState: { threatLevel: 'CRITICAL', activeZoneColor: 'text-rose-500', actionHighlight: 'AI Anomaly Confirmed' },
      speechScript: 'Step 2: AI threat detection confirmed. Flood risk critical with 95.8 percent confidence.',
    },
    {
      stepNumber: 3,
      title: 'Automated Multi-Channel Warning Broadcast',
      category: 'Public Alerting',
      description: 'System crafts multilingual emergency bulletins and distributes across SMS, Push, Web & Digital Sirens in 1.4s.',
      aiAction: '24,850 citizens notified with clear instructions and safe shelter directions.',
      systemState: { threatLevel: 'CRITICAL', activeZoneColor: 'text-rose-500', actionHighlight: 'Broadcast Dispatched' },
      speechScript: 'Step 3: Multi-channel emergency alerts dispatched via SMS, sirens, and mobile apps to 24,000 residents.',
    },
    {
      stepNumber: 4,
      title: 'Intelligent Evacuation Route Computation',
      category: 'Route Engine',
      description: 'Evacuation algorithm evaluates flood maps and routes traffic along Elevated Ring Road East, avoiding submerged underpasses.',
      aiAction: 'Dynamic route calculated: 4.8 km to Civic Sports Complex Shelter with ETA of 14 minutes.',
      systemState: { threatLevel: 'CRITICAL', activeZoneColor: 'text-teal-400', actionHighlight: 'Corridors Computed' },
      speechScript: 'Step 4: Safe evacuation corridor mapped to Civic Sports Complex shelter, bypassing flooded underpass.',
    },
    {
      stepNumber: 5,
      title: 'Citizen Distress SOS Beacon Received',
      category: 'Civilian Distress',
      description: 'Family of 4 with elderly grandmother and infant reports water rising past 1.5m, trapped on 2nd Avenue terrace roof.',
      aiAction: 'NLP triage classifier assigns Urgent Priority 1 and auto-generates tactical rescue ticket #SOS-4821.',
      systemState: { threatLevel: 'CRITICAL', activeZoneColor: 'text-rose-400', actionHighlight: 'Priority 1 SOS Triaged' },
      speechScript: 'Step 5: High-priority SOS received from trapped family on terrace roof in Sector 4.',
    },
    {
      stepNumber: 6,
      title: 'Tactical Rescue Fleet Dispatch',
      category: 'Command & Dispatch',
      description: 'National Disaster Response Force (NDRF) Swift Water Unit #2 is dispatched with motorized raft and trauma paramedic.',
      aiAction: 'Encrypted UHF dispatch vector transmitted. Team acknowledged; En-route with ETA 8 minutes.',
      systemState: { threatLevel: 'CRITICAL', activeZoneColor: 'text-blue-400', actionHighlight: 'NDRF Unit Dispatched' },
      speechScript: 'Step 6: NDRF swift water rescue team deployed with motorized raft and satellite GPS tracking.',
    },
    {
      stepNumber: 7,
      title: 'Hospital Trauma Ward Surge Alert',
      category: 'Healthcare Triage',
      description: 'System alerts Metro Trauma Center & St. Jude Hospital to pre-reserve 2 trauma resuscitation bays and pediatric beds.',
      aiAction: 'Ambulance Unit 8 synchronized to meet rescue boat at extraction point on North Embankment.',
      systemState: { threatLevel: 'CRITICAL', activeZoneColor: 'text-emerald-400', actionHighlight: 'Trauma Bay Prepped' },
      speechScript: 'Step 7: Trauma hospital alerted. Pediatric and hypothermia stabilization bays locked for incoming casualties.',
    },
    {
      stepNumber: 8,
      title: 'Successful Extraction & Survivor Manifest Sync',
      category: 'Mission Accomplished',
      description: 'All 4 civilians successfully hoisted into rescue boat and transported safely to Civic Sports Complex Shelter.',
      aiAction: 'Biometric registry check-in completed. AI matches separated relatives and notifies family members via SMS.',
      systemState: { threatLevel: 'RECOVERY', activeZoneColor: 'text-emerald-400', actionHighlight: '4 Rescued & Safe' },
      speechScript: 'Step 8: Extraction successful. All survivors checked into safe shelter and reunited with relatives.',
    },
  ];

  const currentStep = steps[currentStepIndex];

  // Auto playback timer
  useEffect(() => {
    let timer: any;
    if (isPlaying && isOpen) {
      timer = setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          goToStep(currentStepIndex + 1);
        } else {
          setIsPlaying(false);
          // Trigger celebration confetti
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }, playbackSpeed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, isOpen, playbackSpeed]);

  const goToStep = (idx: number) => {
    setCurrentStepIndex(idx);
    const step = steps[idx];
    if (soundEnabled) {
      if (idx === steps.length - 1) {
        soundManager.playAlertChime();
      } else {
        soundManager.playBeep(880);
      }
      soundManager.speak(step.speechScript, 'en-US');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl rounded-sm bg-[#05050A] border border-slate-800 overflow-hidden flex flex-col justify-between max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0A0A16] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-sm bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm sm:text-base text-white font-mono uppercase tracking-wider">
                  Flash Flood Simulation Sequence
                </h3>
                <span className="px-2 py-0.5 rounded-sm text-[9px] font-mono bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold uppercase">
                  STEP {currentStep.stepNumber} OF {steps.length}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 uppercase font-medium tracking-wider mt-0.5">
                Automated Walkthrough: End-to-end incident lifecycle from telemetry detection to rescue execution
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsPlaying(false);
              soundManager.stopSpeaking();
              onClose();
            }}
            className="p-1 rounded-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-900 h-1 flex">
          {steps.map((_, i) => (
            <div
              key={i}
              onClick={() => goToStep(i)}
              className={`h-full flex-1 cursor-pointer transition-all ${
                i <= currentStepIndex ? 'bg-orange-500' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Main Step Stage Area */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-orange-400">
                {currentStep.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white uppercase font-mono tracking-tight mt-0.5">
                {currentStep.title}
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-sm bg-[#0A0A16] border border-slate-800 text-slate-300">
                State: <strong className={currentStep.systemState.activeZoneColor}>{currentStep.systemState.threatLevel}</strong>
              </span>
            </div>
          </div>

          {/* Description & AI Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-sm bg-[#0A0A16] border border-slate-800 border-l-2 border-l-slate-700 space-y-1.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">
                Incident Real-World Context:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{currentStep.description}</p>
            </div>

            <div className="p-4 rounded-sm bg-[#0A0A16] border border-slate-800 border-l-2 border-l-orange-500 space-y-1.5">
              <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest font-bold flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3 text-orange-400" />
                <span>RESQ AI Automated Protocol:</span>
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">{currentStep.aiAction}</p>
            </div>
          </div>

          {/* Graphical Step Highlight Indicator */}
          <div className="p-3 rounded-sm bg-[#0A0A16] border border-slate-800 flex items-center justify-between text-[10px] font-mono uppercase text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Active Subsystem: <strong className="text-white font-bold">{currentStep.systemState.actionHighlight}</strong></span>
            </div>
            <span className="text-orange-400 font-bold">Audio Narration Stream Active</span>
          </div>
        </div>

        {/* Bottom Playback Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#0A0A16] flex flex-wrap items-center justify-between gap-3">
          {/* Left: Play/Pause/Prev/Next */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => goToStep(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
              className="px-3 py-1.5 rounded-sm bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-bold font-mono uppercase tracking-wider border border-slate-800 transition-colors disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>

            <button
              onClick={() => {
                const next = !isPlaying;
                setIsPlaying(next);
                if (next && soundEnabled) {
                  soundManager.speak(currentStep.speechScript, 'en-US');
                }
              }}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-sm bg-orange-600 hover:bg-orange-700 text-white font-bold font-mono text-[10px] uppercase tracking-wider transition-transform active:scale-95 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              <span>{isPlaying ? 'PAUSE AUTO-PLAY' : 'AUTO-PLAY DEMO'}</span>
            </button>

            <button
              onClick={() => goToStep(Math.min(steps.length - 1, currentStepIndex + 1))}
              disabled={currentStepIndex === steps.length - 1}
              className="px-3 py-1.5 rounded-sm bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-bold font-mono uppercase tracking-wider border border-slate-800 transition-colors disabled:opacity-40 cursor-pointer"
            >
              Next Step
            </button>

            <button
              onClick={() => goToStep(0)}
              className="p-1.5 rounded-sm bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
              title="Restart Scenario"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right: Narration re-speak & Close */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => soundManager.speak(currentStep.speechScript, 'en-US')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-sm bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[10px] font-bold font-mono uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-orange-400" />
              <span>Repeat Narration</span>
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                soundManager.stopSpeaking();
                onClose();
              }}
              className="px-3 py-1.5 rounded-sm bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold font-mono uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
