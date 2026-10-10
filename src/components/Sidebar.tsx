import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  AlertOctagon,
  Cpu,
  Megaphone,
  Compass,
  Ambulance,
  Building2,
  Package,
  Users,
  MessageSquare,
  BarChart3,
  Smartphone,
  Sliders,
  X,
  Radio,
  Flame,
  Shield,
  Activity,
} from 'lucide-react';
import { UserRole, LanguageCode } from '../types';
import { translations } from '../i18n';
import { soundManager } from '../utils/audio';

export type TabId =
  | 'overview'
  | 'map'
  | 'emergencies'
  | 'ai-detection'
  | 'alerts'
  | 'evacuation'
  | 'rescue'
  | 'hospitals'
  | 'resources'
  | 'missing'
  | 'communication'
  | 'analytics'
  | 'citizen-portal'
  | 'landing';

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  currentRole: UserRole;
  activeIncidentsCount: number;
  criticalAlertsCount: number;
  pendingSosCount: number;
  soundEnabled: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  language,
  currentRole,
  activeIncidentsCount,
  criticalAlertsCount,
  pendingSosCount,
  soundEnabled,
}) => {
  const t = translations[language];

  const menuItems = [
    {
      id: 'overview' as TabId,
      label: 'Overview Dashboard',
      icon: LayoutDashboard,
      badge: null,
      color: 'text-cyan-400',
    },
    {
      id: 'map' as TabId,
      label: 'Live Disaster Map',
      icon: MapPin,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      color: 'text-emerald-400',
    },
    {
      id: 'emergencies' as TabId,
      label: 'Emergencies & Reports',
      icon: AlertOctagon,
      badge: `${pendingSosCount + activeIncidentsCount}`,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      color: 'text-rose-400',
    },
    {
      id: 'ai-detection' as TabId,
      label: 'AI Disaster Detection',
      icon: Cpu,
      badge: '95% AI',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      color: 'text-indigo-400',
    },
    {
      id: 'alerts' as TabId,
      label: 'Emergency Alerts',
      icon: Megaphone,
      badge: `${criticalAlertsCount}`,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      color: 'text-amber-400',
    },
    {
      id: 'evacuation' as TabId,
      label: 'Evacuation Planner',
      icon: Compass,
      badge: null,
      color: 'text-teal-400',
    },
    {
      id: 'rescue' as TabId,
      label: 'Rescue Operations',
      icon: Ambulance,
      badge: '8 Teams',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      color: 'text-blue-400',
    },
    {
      id: 'hospitals' as TabId,
      label: 'Hospitals & Triage',
      icon: Building2,
      badge: '18 Available',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      color: 'text-emerald-400',
    },
    {
      id: 'resources' as TabId,
      label: 'Resource Management',
      icon: Package,
      badge: 'Supply Track',
      badgeColor: 'bg-slate-700 text-slate-300',
      color: 'text-violet-400',
    },
    {
      id: 'missing' as TabId,
      label: 'Missing & Survivors',
      icon: Users,
      badge: 'AI Match',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      color: 'text-purple-400',
    },
    {
      id: 'communication' as TabId,
      label: 'Comms & Radio Dispatch',
      icon: MessageSquare,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
      color: 'text-sky-400',
    },
    {
      id: 'analytics' as TabId,
      label: 'Admin Analytics',
      icon: BarChart3,
      badge: null,
      color: 'text-fuchsia-400',
    },
    {
      id: 'citizen-portal' as TabId,
      label: 'Citizen Mobile SOS',
      icon: Smartphone,
      badge: '1-Tap',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
      color: 'text-red-400',
    },
  ];

  const handleSelect = (tab: TabId) => {
    if (soundEnabled) soundManager.playBeep(750);
    setActiveTab(tab);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="resq-sidebar-navigation"
        className={`fixed top-16 bottom-0 left-0 z-40 w-56 bg-[#0A0A16] border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          <div className="px-2 pt-1 pb-2 text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center justify-between">
            <span>Navigation</span>
            <span className="text-[9px] bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded-sm text-orange-400 font-mono font-bold uppercase">
              {currentRole}
            </span>
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-sm text-xs font-medium transition-all text-left group ${
                  isActive
                    ? 'bg-slate-800 text-white border-l-2 border-orange-500 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-orange-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded-sm border font-bold ${
                      item.badgeColor || 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Session Box from Geometric Balance spec */}
        <div className="p-3 border-t border-slate-800 bg-[#080812]">
          <div className="text-[10px] text-slate-500 mb-1.5 uppercase font-bold tracking-widest">
            Session
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-slate-800 border border-slate-700 rounded-sm flex items-center justify-center text-[10px] font-bold text-orange-400">
              {currentRole === 'administrator' ? 'A' : currentRole === 'responder' ? 'R' : 'C'}
            </div>
            <div className="text-xs text-slate-300 font-mono truncate">
              {currentRole === 'administrator' ? 'Admin: Command HQ' : currentRole === 'responder' ? 'Unit: Field Lead' : 'Citizen: Public App'}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
