import React, { useState } from 'react';
import {
  LifeBuoy,
  MapPin,
  Camera,
  AlertTriangle,
  Send,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  ShieldAlert,
  Clock,
} from 'lucide-react';
import { CitizenIncidentReport, EmergencyCategory, LanguageCode } from '../types';
import { soundManager } from '../utils/audio';

interface CitizenReportingProps {
  reports: CitizenIncidentReport[];
  onSubmitReport: (report: CitizenIncidentReport) => void;
  language: LanguageCode;
  soundEnabled: boolean;
}

export const CitizenReporting: React.FC<CitizenReportingProps> = ({
  reports,
  onSubmitReport,
  soundEnabled,
}) => {
  const [category, setCategory] = useState<EmergencyCategory>('Trapped persons');
  const [location, setLocation] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  const [peopleAffected, setPeopleAffected] = useState(4);
  const [description, setDescription] = useState(
    'Water level rising above 1.5m on ground floor. Elderly couple and infant trapped on terrace roof.'
  );
  const [contactPhone, setContactPhone] = useState('+91 98490 12345');
  const [hasImage, setHasImage] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<CitizenIncidentReport | null>(null);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Your browser does not support GPS location.');
      return;
    }

    setIsGettingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const coordinates = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

        // Show coordinates immediately, even if address lookup fails.
        setLocation(coordinates);

        try {
          // Reverse-geocode the GPS coordinates into a human-readable city/country.
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            { headers: { Accept: 'application/json' } }
          );

          if (!response.ok) {
            throw new Error('Address lookup failed');
          }

          const data: {
            address?: {
              city?: string;
              town?: string;
              village?: string;
              municipality?: string;
              county?: string;
              state_district?: string;
              state?: string;
              country?: string;
            };
          } = await response.json();

          const address = data.address;
          const city = address?.city || address?.town || address?.village ||
            address?.municipality || address?.county || address?.state_district || address?.state;
          const country = address?.country;
          const place = [city, country].filter(Boolean).join(', ');

          setLocation(place ? `${place} (${coordinates})` : coordinates);
        } catch (error) {
          // Keep the GPS coordinates usable if the reverse-geocoding service is unavailable.
          setLocation(coordinates);
          setLocationError('City lookup was unavailable; GPS coordinates were added instead.');
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('Please allow location access in your browser.');
        } else if (error.code === error.TIMEOUT) {
          setLocationError('Location request timed out. Please try again.');
        } else {
          setLocationError('Could not get your location. Please try again.');
        }
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (soundEnabled) soundManager.playAlertChime();

    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      // AI Severity assessment
      let aiPriority: 'Urgent' | 'High' | 'Medium' | 'Low' = 'High';
      let aiAction = 'Dispatched rescue unit to location with high priority.';
      let aiAdvice = 'Move to highest elevation. Avoid touching electrical switches. Signal rescue helicopters with white cloth.';

      if (category === 'Trapped persons' || category === 'Medical emergency' || peopleAffected >= 4) {
        aiPriority = 'Urgent';
        aiAction = 'Priority 1 Rescue Mission auto-assigned to NDRF Watercraft Unit #2.';
      }

      const newRep: CitizenIncidentReport = {
        id: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
        category,
        location,
        peopleAffected,
        description,
        timestamp: timeStr,
        status: 'Dispatched',
        aiPriority,
        aiRecommendedAction: aiAction,
        aiSafetyAdviceForCitizen: aiAdvice,
        contactPhone,
        hasImageAttachment: hasImage,
      };

      onSubmitReport(newRep);
      setSubmittedReport(newRep);
      setIsSubmitting(false);

      if (soundEnabled) soundManager.playBeep(980);
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-2xl gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold font-mono tracking-wide text-white flex items-center gap-2">
              <LifeBuoy className="w-5 h-5 text-rose-400" />
              CITIZEN EMERGENCY REPORTING & DISTRESS SOS
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
              AI TRIAGE ENGINE ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Crowdsourced distress reporting with automated NLP classification, risk ranking & instant survivor guidance
          </p>
        </div>

        <button
          onClick={() => {
            if (soundEnabled) soundManager.playEmergencySiren(1.2);
            getCurrentLocation();
            setCategory('Trapped persons');
            setDescription('EMERGENCY SOS: Imminent danger. Immediate rescue required at device location.');
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-transform active:scale-95 cursor-pointer"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>🚨 AUTO-FILL INSTANT GPS SOS</span>
        </button>
      </div>

      {/* Grid: Form & Submitted Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Container */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800 p-5 sm:p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <span>File Incident Distress Form</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Step 1 of 1</span>
            </div>

            {/* Row 1: Category & People Affected */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1.5">Emergency Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EmergencyCategory)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="Trapped persons">👥 Trapped Persons / Rescue Needed</option>
                  <option value="Flood">🌊 Severe Flooding / Water Inundation</option>
                  <option value="Fire">🔥 Fire / Wildfire Spread</option>
                  <option value="Medical emergency">🚑 Critical Medical / Injury</option>
                  <option value="Building collapse">🏢 Structural Damage / Collapse</option>
                  <option value="Power failure">⚡ Power Grid / Infrastructure Outage</option>
                  <option value="Other">⚠️ Other Urgent Hazard</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1.5">Estimated People Affected / Trapped</label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={peopleAffected}
                  onChange={(e) => setPeopleAffected(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Row 2: Location & Contact Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1.5">Incident Location or GPS Coordinates</label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 pl-8 focus:outline-none focus:border-cyan-500"
                    placeholder="Enter street, landmark or GPS coordinates..."
                  />
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 absolute left-2.5 top-3" />
                </div>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="mt-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isGettingLocation ? 'Getting your location...' : '📍 Use Current Location'}
                </button>
                {locationError && (
                  <p role="alert" className="mt-2 text-xs text-rose-400">{locationError}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1.5">Distress Callback Contact Phone</label>
                <div className="relative">
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 pl-8 focus:outline-none focus:border-cyan-500"
                  />
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 top-3" />
                </div>
              </div>
            </div>

            {/* Row 3: Description */}
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5">
                Situation Description & Immediate Hazards
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-3 focus:outline-none focus:border-rose-500 font-sans leading-relaxed"
                placeholder="Describe current hazard, water level, smoke density, injuries, special medical needs..."
              />
            </div>

            {/* Row 4: Attachment simulated toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2.5">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-300">Attach Damage Photo or Geotagged Video</span>
              </div>
              <label className="flex items-center gap-2 text-xs text-cyan-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasImage}
                  onChange={(e) => setHasImage(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-0"
                />
                <span>Simulated Damage Image Attached</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs tracking-wider uppercase shadow-xl border border-red-400 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Transmitting to Dispatch & Running AI Triage...' : 'Submit Emergency Report to Command'}</span>
            </button>
          </form>

          {/* AI Immediate Survival Guidance Banner when submitted */}
          {submittedReport && (
            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-indigo-950/70 to-slate-900 border border-indigo-500/50 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-500/30">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>AI Triage Verified & Team Dispatched: {submittedReport.id}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                  {submittedReport.aiPriority} PRIORITY
                </span>
              </div>

              <div className="text-xs text-slate-200">
                <strong className="text-cyan-300">Automated Dispatch Directive: </strong>
                {submittedReport.aiRecommendedAction}
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-emerald-300 leading-relaxed">
                <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Immediate Survival Guidance For You:</span>
                </div>
                {submittedReport.aiSafetyAdviceForCitizen}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Live Queue of Crowdsourced Reports */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Live Emergency Incident Queue</span>
            </h3>
            <span className="text-xs font-mono text-cyan-400">{reports.length} Reports</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-cyan-400">{rep.id}</span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                      rep.aiPriority === 'Urgent'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {rep.aiPriority}
                  </span>
                </div>

                <div className="font-bold text-white text-xs">{rep.category}</div>
                <p className="text-[11px] text-slate-300 leading-snug">{rep.description}</p>

                <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <span className="truncate">{rep.location}</span>
                  <span className="text-cyan-400 shrink-0">{rep.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
