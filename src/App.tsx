import React, { useState, useEffect } from 'react';
import {
  Header,
} from './components/Header';
import {
  Sidebar,
  TabId,
} from './components/Sidebar';
import {
  LandingPage,
} from './components/LandingPage';
import {
  DashboardOverview,
} from './components/DashboardOverview';
import {
  LiveDisasterMap,
} from './components/LiveDisasterMap';
import {
  AIDetectionEngine,
} from './components/AIDetectionEngine';
import {
  PredictiveAnalytics,
} from './components/PredictiveAnalytics';
import {
  EmergencyAlertStudio,
} from './components/EmergencyAlertStudio';
import {
  CitizenReporting,
} from './components/CitizenReporting';
import {
  EvacuationPlanner,
} from './components/EvacuationPlanner';
import {
  RescueOperations,
} from './components/RescueOperations';
import {
  HospitalCoordination,
} from './components/HospitalCoordination';
import {
  ResourceManagement,
} from './components/ResourceManagement';
import {
  MissingPersonsTracker,
} from './components/MissingPersonsTracker';
import {
  CommunicationCenter,
} from './components/CommunicationCenter';
import {
  AdminAnalytics,
} from './components/AdminAnalytics';
import {
  CitizenMobileView,
} from './components/CitizenMobileView';
import {
  EmergencyModeModal,
} from './components/EmergencyModeModal';
import {
  FlashFloodDemoModal,
} from './components/FlashFloodDemoModal';
import {
  SimulationDisasterSelectorModal,
} from './components/SimulationDisasterSelectorModal';
import {
  AIAssistantWidget,
} from './components/AIAssistantWidget';

import {
  UserRole,
  LanguageCode,
  DisasterZone,
  MapMarker,
  EmergencyAlert,
  RescueTeam,
  RescueTeamStatus,
  Hospital,
  Shelter,
  EvacuationRoute,
  CitizenIncidentReport,
  SensorTelemetry,
  ResourceStock,
  MissingPerson,
  CommunicationMessage,
  TimelineEvent,
  DisasterType,
} from './types';

import {
  initialDisasterZones,
  initialMapMarkers,
  initialAlerts,
  initialRescueTeams,
  initialHospitals,
  initialShelters,
  initialEvacuationRoutes,
  initialCitizenReports,
  initialSensorTelemetry,
  initialResourceStocks,
  initialMissingPersons,
  initialCommunicationMessages,
  initialTimelineEvents,
} from './mockData';

import { soundManager } from './utils/audio';

export default function App() {
  // Global Application State
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [currentRole, setCurrentRole] = useState<UserRole>('administrator');
  const [language, setLanguage] = useState<LanguageCode>('English');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modals state
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [demoSimulationOpen, setDemoSimulationOpen] = useState(false);
  const [disasterSelectorOpen, setDisasterSelectorOpen] = useState(false);

  // Entities state
  const [zones, setZones] = useState<DisasterZone[]>(initialDisasterZones);
  const [markers, setMarkers] = useState<MapMarker[]>(initialMapMarkers);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>(initialAlerts);
  const [rescueTeams, setRescueTeams] = useState<RescueTeam[]>(initialRescueTeams);
  const [hospitals, setHospitals] = useState<Hospital[]>(initialHospitals);
  const [shelters, setShelters] = useState<Shelter[]>(initialShelters);
  const [routes, setRoutes] = useState<EvacuationRoute[]>(initialEvacuationRoutes);
  const [incidentReports, setIncidentReports] = useState<CitizenIncidentReport[]>(initialCitizenReports);
  const [sensors, setSensors] = useState<SensorTelemetry[]>(initialSensorTelemetry);
  const [resources, setResources] = useState<ResourceStock[]>(initialResourceStocks);
  const [missingPersons, setMissingPersons] = useState<MissingPerson[]>(initialMissingPersons);
  const [messages, setMessages] = useState<CommunicationMessage[]>(initialCommunicationMessages);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(initialTimelineEvents);

  // Selected Map Zone
  const [selectedZone, setSelectedZone] = useState<DisasterZone | null>(null);

  // Automatically adapt default view based on role
  useEffect(() => {
    if (currentRole === 'citizen' && activeTab !== 'citizen-portal' && activeTab !== 'landing') {
      setActiveTab('citizen-portal');
    }
  }, [currentRole]);

  // Handlers for dynamic actions
  const handleBroadcastNewAlert = (newAlert: EmergencyAlert) => {
    setAlerts((prev) => [newAlert, ...prev]);
    // Add to timeline
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setTimeline((prev) => [
      {
        id: `tl-${Date.now()}`,
        time: timeStr,
        title: `BROADCAST: ${newAlert.title}`,
        category: 'Alert',
        description: newAlert.message,
        severity: newAlert.severity,
      },
      ...prev,
    ]);
  };

  const handleUpdateRescueTeam = (id: string, status: RescueTeamStatus, assignment?: string) => {
    setRescueTeams((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, assignedZone: assignment || t.assignedZone } : t))
    );
  };

  const handleSubmitCitizenReport = (rep: CitizenIncidentReport) => {
    setIncidentReports((prev) => [rep, ...prev]);
    // Add citizen marker to map
    const newMarker: MapMarker = {
      id: `mark-${rep.id}`,
      name: `${rep.id}: ${rep.category}`,
      type: 'citizen_sos',
      position: { x: 38 + (Math.random() * 6 - 3), y: 44 + (Math.random() * 6 - 3) },
      status: `Distress SOS: ${rep.peopleAffected} persons`,
      details: rep.description,
    };
    setMarkers((prev) => [...prev, newMarker]);

    // Add to timeline
    setTimeline((prev) => [
      {
        id: `tl-${Date.now()}`,
        time: rep.timestamp,
        title: `CITIZEN SOS: ${rep.id} (${rep.category})`,
        category: 'Citizen SOS',
        description: rep.description,
        severity: rep.aiPriority === 'Urgent' ? 'Critical' : 'High Risk',
      },
      ...prev,
    ]);
  };

  const handleAddMissingPerson = (p: MissingPerson) => {
    setMissingPersons((prev) => [p, ...prev]);
  };

  const handleSendMessage = (msg: CommunicationMessage) => {
    setMessages((prev) => [...prev, msg]);
  };

  // Preset Scenario Switcher
  const handleSelectDisasterPreset = (type: DisasterType, title: string) => {
    if (type === 'Earthquake') {
      setZones([
        {
          id: 'zone-eq-1',
          name: 'Old Town Commercial District — Epicenter',
          disasterType: 'Earthquake',
          severity: 'Critical',
          center: { x: 58, y: 64 },
          radius: 18,
          affectedPopulation: 16500,
          activeTeamsCount: 12,
          emergencyRequests: 28,
          weatherCondition: 'Seismic Aftershocks (M4.8)',
          waterLevelOrRiskVal: 'Intensity VIII — Severe Structural Damage',
          nearestHospital: 'Metro Trauma General Hospital (1.2km)',
          aiRiskAssessment: 'Critical structural compromise in unreinforced masonry buildings. High gas leak risk.',
        },
        ...zones.slice(1),
      ]);
    } else if (type === 'Forest fire') {
      setZones([
        {
          id: 'zone-fire-1',
          name: 'North Ridge Forest Margin — Active Flank',
          disasterType: 'Forest fire',
          severity: 'Critical',
          center: { x: 74, y: 26 },
          radius: 20,
          affectedPopulation: 6200,
          activeTeamsCount: 9,
          emergencyRequests: 14,
          weatherCondition: '38km/h SW Wind Gusts, 12% Humidity',
          waterLevelOrRiskVal: 'Fire Spread Vector: 2.1km/h NE',
          nearestHospital: 'North Hill Medical Clinic (3.8km)',
          aiRiskAssessment: 'Rapid crown fire progression towards Ridge residential estates. Dense PM2.5 smoke hazard.',
        },
        ...zones.slice(1),
      ]);
    } else {
      // Default back to Flood or active
      setZones(initialDisasterZones);
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setTimeline((prev) => [
      {
        id: `tl-${Date.now()}`,
        time: timeStr,
        title: `SCENARIO SHIFT: ${title}`,
        category: 'Simulation',
        description: `Disaster simulation model switched to ${type}. Map coordinates and threat vectors updated.`,
        severity: 'Critical',
      },
      ...prev,
    ]);
  };

  const handle1TapSosFromMobile = (loc: string, desc: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newReport: CitizenIncidentReport = {
      id: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
      category: 'Trapped persons',
      location: loc,
      peopleAffected: 1,
      description: desc,
      timestamp: timeStr,
      status: 'Dispatched',
      aiPriority: 'Urgent',
      aiRecommendedAction: 'Immediate 1-tap beacon received. NDRF Unit #2 dispatched to GPS pin.',
      aiSafetyAdviceForCitizen: 'Rescuers are en route. Stay on highest accessible elevated structure.',
      contactPhone: '+91 98490 00000',
    };

    handleSubmitCitizenReport(newReport);
  };

  return (
    <div className="min-h-screen bg-[#05050A] text-slate-100 font-sans selection:bg-orange-600 selection:text-white flex flex-col justify-between">
      {/* Top Application Header */}
      <Header
        currentRole={currentRole}
        setRole={setCurrentRole}
        language={language}
        setLanguage={setLanguage}
        emergencyMode={emergencyMode}
        toggleEmergencyMode={() => setEmergencyMode(!emergencyMode)}
        openDemoSimulation={() => setDemoSimulationOpen(true)}
        openDisasterSelector={() => setDisasterSelectorOpen(true)}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
        onNavigateHome={() => setActiveTab('landing')}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Body Container with Collapsible Sidebar */}
      <div className="flex flex-1 relative">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          language={language}
          currentRole={currentRole}
          activeIncidentsCount={zones.length}
          criticalAlertsCount={alerts.length}
          pendingSosCount={incidentReports.length}
          soundEnabled={soundEnabled}
        />

        {/* Main Content View Container */}
        <main className="flex-1 min-w-0 transition-all duration-300 lg:pl-56 p-3 sm:p-5 lg:p-6 max-w-7xl mx-auto pb-16">
          {activeTab === 'landing' && (
            <LandingPage
              onNavigate={(tab) => setActiveTab(tab)}
              onLaunchDemoScenario={() => setDemoSimulationOpen(true)}
              language={language}
              soundEnabled={soundEnabled}
            />
          )}

          {activeTab === 'overview' && (
            <DashboardOverview
              zones={zones}
              alerts={alerts}
              rescueTeams={rescueTeams}
              timeline={timeline}
              incidentReports={incidentReports}
              onNavigate={(tab) => setActiveTab(tab)}
              language={language}
              soundEnabled={soundEnabled}
              onSelectZone={(z) => setSelectedZone(z)}
            />
          )}

          {activeTab === 'map' && (
            <LiveDisasterMap
              zones={zones}
              markers={markers}
              selectedZone={selectedZone}
              setSelectedZone={setSelectedZone}
              onNavigate={(tab) => setActiveTab(tab)}
              language={language}
              soundEnabled={soundEnabled}
            />
          )}

          {activeTab === 'ai-detection' && (
            <AIDetectionEngine
              sensors={sensors}
              language={language}
              soundEnabled={soundEnabled}
              onDispatchAlert={() => setActiveTab('alerts')}
            />
          )}

          {activeTab === 'analytics' && (
            <PredictiveAnalytics language={language} soundEnabled={soundEnabled} />
          )}

          {activeTab === 'alerts' && (
            <EmergencyAlertStudio
              alerts={alerts}
              onBroadcastNewAlert={handleBroadcastNewAlert}
              language={language}
              soundEnabled={soundEnabled}
            />
          )}

          {activeTab === 'emergencies' && (
            <CitizenReporting
              reports={incidentReports}
              onSubmitReport={handleSubmitCitizenReport}
              language={language}
              soundEnabled={soundEnabled}
            />
          )}

          {activeTab === 'evacuation' && (
            <EvacuationPlanner
              routes={routes}
              shelters={shelters}
              language={language}
              soundEnabled={soundEnabled}
              onNavigateToMap={() => setActiveTab('map')}
            />
          )}

          {activeTab === 'rescue' && (
            <RescueOperations
              teams={rescueTeams}
              onUpdateTeamStatus={handleUpdateRescueTeam}
              language={language}
              soundEnabled={soundEnabled}
            />
          )}

          {activeTab === 'hospitals' && (
            <HospitalCoordination
              hospitals={hospitals}
              language={language}
              soundEnabled={soundEnabled}
            />
          )}

          {activeTab === 'resources' && (
            <ResourceManagement
              resources={resources}
              language={language}
              soundEnabled={soundEnabled}
            />
          )}

          {activeTab === 'missing' && (
            <MissingPersonsTracker
              persons={missingPersons}
              onAddPerson={handleAddMissingPerson}
              language={language}
              soundEnabled={soundEnabled}
            />
          )}

          {activeTab === 'communication' && (
            <CommunicationCenter
              messages={messages}
              onSendMessage={handleSendMessage}
              language={language}
              soundEnabled={soundEnabled}
            />
          )}

          {activeTab === 'citizen-portal' && (
            <CitizenMobileView
              language={language}
              soundEnabled={soundEnabled}
              onTriggerSos={handle1TapSosFromMobile}
            />
          )}
        </main>
      </div>

      {/* Floating 24/7 AI Emergency Assistant Widget */}
      <AIAssistantWidget
        language={language}
        currentRole={currentRole}
        soundEnabled={soundEnabled}
      />

      {/* Emergency Mode Overlay Modal */}
      <EmergencyModeModal
        isOpen={emergencyMode}
        onDeactivate={() => setEmergencyMode(false)}
        onBroadcastAllAlerts={() => {
          handleBroadcastNewAlert({
            id: `alt-crit-${Date.now()}`,
            title: 'CRITICAL DEFCON 1 EVACUATION BROADCAST',
            alertType: 'Evacuation',
            disasterType: 'Flood',
            severity: 'Critical',
            zones: ['ALL CITY SECTORS'],
            message:
              '🚨 CRITICAL EMERGENCY OVERRIDE: Mandatory immediate evacuation of all lowlands. Seek immediate refuge in reinforced shelters.',
            channels: ['SMS', 'Push notification', 'Emergency siren', 'Web notification', 'Public display'],
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            deliveryStats: { smsPercent: 99, pushPercent: 99, peopleReached: 38400 },
            status: 'Active',
          });
          setEmergencyMode(false);
        }}
        soundEnabled={soundEnabled}
      />

      {/* 18-Step Live Flash Flood Simulation Scenario Modal */}
      <FlashFloodDemoModal
        isOpen={demoSimulationOpen}
        onClose={() => setDemoSimulationOpen(false)}
        soundEnabled={soundEnabled}
      />

      {/* Disaster Preset Simulator Modal */}
      <SimulationDisasterSelectorModal
        isOpen={disasterSelectorOpen}
        onClose={() => setDisasterSelectorOpen(false)}
        onSelectPreset={handleSelectDisasterPreset}
        soundEnabled={soundEnabled}
      />

      {/* Geometric Balance Tactical Status Footer */}
      <footer className="h-8 bg-[#0A0A16] border-t border-slate-800 px-4 flex items-center justify-between text-[9px] text-slate-500 font-medium uppercase tracking-widest fixed bottom-0 left-0 right-0 z-30 lg:pl-60">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-slate-400">Active Flooding: Sector 4 Delta</span>
          </div>
          <div className="hidden sm:flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            <span className="text-slate-400">Wildfire: North Ridge (Monitoring)</span>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-400">Earthquake / Seismic: Stable</span>
          </div>
        </div>
        <div className="font-mono text-slate-500 text-[9px]">
          PROTOTYPE SIMULATION — 24/7 AI DISASTER RESPONSE GRID
        </div>
      </footer>
    </div>
  );
}
