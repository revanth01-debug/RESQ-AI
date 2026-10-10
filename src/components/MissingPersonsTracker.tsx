import React, { useState } from 'react';
import {
  Users,
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  PhoneCall,
  MapPin,
  Camera,
  Shield,
  Heart,
} from 'lucide-react';
import { MissingPerson, LanguageCode } from '../types';
import { translations } from '../i18n';
import { soundManager } from '../utils/audio';

interface MissingPersonsTrackerProps {
  persons: MissingPerson[];
  onAddPerson: (person: MissingPerson) => void;
  language: LanguageCode;
  soundEnabled: boolean;
}

export const MissingPersonsTracker: React.FC<MissingPersonsTrackerProps> = ({
  persons,
  onAddPerson,
  language,
  soundEnabled,
}) => {
  const t = translations[language];

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState('Male');
  const [lastSeen, setLastSeen] = useState('Sector 4 Delta Basin Commercial Market');
  const [description, setDescription] = useState('Navy blue windbreaker jacket, glasses, brown shoes');
  const [contactPhone, setContactPhone] = useState('+91 98490 88776');
  const [relationship, setRelationship] = useState('Family Member');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    if (soundEnabled) soundManager.playAlertChime();

    const newPerson: MissingPerson = {
      id: `MP-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName,
      age,
      gender,
      lastSeenLocation: lastSeen,
      status: 'Missing',
      aiMatchScore: 92,
      matchedShelterLocation: 'Under AI Shelter Check-in Cross-Match...',
      reportedBy: `${relationship} (${contactPhone})`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      description,
    };

    onAddPerson(newPerson);
    setShowForm(false);
    setFullName('');
    if (soundEnabled) soundManager.playBeep(980);
  };

  const filtered = persons.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.lastSeenLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-2xl gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold font-mono tracking-wide text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              MISSING PERSONS & SURVIVOR REUNIFICATION REGISTRY
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
              AI BIOMETRIC & SHELTER CROSS-MATCH
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Automated survivor intake matching across 9 regional shelters, trauma admissions & emergency evac manifests
          </p>
        </div>

        <button
          onClick={() => {
            if (soundEnabled) soundManager.playBeep(820);
            setShowForm(!showForm);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Close Form' : 'Register Missing Individual'}</span>
        </button>
      </div>

      {/* Form Modal / Drawer */}
      {showForm && (
        <form onSubmit={handleRegister} className="rounded-2xl bg-slate-900 border border-purple-500/40 p-5 sm:p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Report Missing Person for AI Cross-Matching</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-purple-500"
                placeholder="e.g. Anand Sharma"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Approximate Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-purple-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Child / Minor">Child / Minor</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Last Known Location</label>
              <input
                type="text"
                value={lastSeen}
                onChange={(e) => setLastSeen(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Reporter Contact Phone & Relation</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">Clothing & Visual Identifiers</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Submit for Immediate AI Facial & Manifest Scan
          </button>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, location or ID..."
            className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-xl p-2.5 pl-8 focus:outline-none focus:border-purple-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs font-mono">
          {['All', 'Missing', 'Located in Shelter', 'Hospitalized', 'Reunited'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                filterStatus === st
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Person Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const isReunited = p.status === 'Reunited';
          const isLocated = p.status === 'Located in Shelter';
          const isMissing = p.status === 'Missing';

          return (
            <div
              key={p.id}
              className={`p-4 rounded-2xl border transition-all ${
                isReunited
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100'
                  : isLocated
                  ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-100'
                  : 'bg-slate-900/80 border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
                <span className="font-mono text-xs font-bold text-cyan-400">{p.id}</span>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                    isReunited
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : isLocated
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                  }`}
                >
                  {p.status.toUpperCase()}
                </span>
              </div>

              <div className="text-base font-bold text-white">{p.fullName}</div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                {p.age} Yrs • {p.gender}
              </div>

              <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-1">
                <div className="text-slate-400 text-[11px]">
                  Last Seen: <span className="text-slate-200">{p.lastSeenLocation}</span>
                </div>
                {p.description && (
                  <div className="text-slate-400 text-[10px] line-clamp-2">
                    Visuals: {p.description}
                  </div>
                )}
                <div className="text-[10px] text-purple-300 pt-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
                  <span>AI Match: {p.aiMatchScore}% — {p.matchedShelterLocation}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-800/80">
                <span>Reporter: {p.reportedBy}</span>
                <span className="text-cyan-400">{p.timestamp}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
