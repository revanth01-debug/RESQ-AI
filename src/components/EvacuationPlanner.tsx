import React, { useEffect, useState } from 'react';
import {
  Compass,
  MapPin,
  Home,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  RefreshCw,
  Navigation,
  Slash,
} from 'lucide-react';

import { EvacuationRoute, Shelter, LanguageCode } from '../types';
import { translations } from '../i18n';
import { soundManager } from '../utils/audio';

interface EvacuationPlannerProps {
  routes?: EvacuationRoute[];
  shelters?: Shelter[];
  language: LanguageCode;
  soundEnabled: boolean;
  onNavigateToMap: () => void;
}

export const EvacuationPlanner: React.FC<EvacuationPlannerProps> = ({
  routes,
  shelters,
  language,
  soundEnabled,
  onNavigateToMap,
}) => {
  const t = translations[language];

  // Protect against missing or invalid input data.
  const safeRoutes: EvacuationRoute[] = Array.isArray(routes) ? routes : [];
  const safeShelters: Shelter[] = Array.isArray(shelters) ? shelters : [];

  const [routeState, setRouteState] =
    useState<EvacuationRoute[]>(safeRoutes);

  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(
    safeRoutes[0]?.id ?? null
  );

  const [isRecomputing, setIsRecomputing] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);
  const [recommendedRouteId, setRecommendedRouteId] = useState<string | null>(
    null
  );

  // Keep local routes synchronized when parent data changes.
  useEffect(() => {
    const nextRoutes: EvacuationRoute[] = Array.isArray(routes)
      ? routes
      : [];

    setRouteState(nextRoutes);
    setRecommendedRouteId(null);

    setSelectedRouteId((currentId) => {
      if (nextRoutes.some((route) => route.id === currentId)) {
        return currentId;
      }

      return nextRoutes[0]?.id ?? null;
    });
  }, [routes]);

  const selectedRoute = routeState.find(
    (route) => route.id === selectedRouteId
  );

  const handleSimulateBlockage = () => {
    if (routeState.length === 0) {
      setAiNotice(
        'No evacuation routes are currently available. Please load route data first.'
      );
      return;
    }

    const routeToBlock =
      routeState.find(
        (route) =>
          route.id === selectedRouteId && route.status === 'Clear & Open'
      ) ?? routeState.find((route) => route.status === 'Clear & Open');

    if (!routeToBlock) {
      setAiNotice(
        'No clear corridor is available to simulate a blockage. Verify current conditions with emergency authorities.'
      );
      return;
    }

    setIsRecomputing(true);

    if (soundEnabled) {
      soundManager.playAlertChime();
    }

    window.setTimeout(() => {
      const updatedRoutes = routeState.map((route) => {
        if (route.id === routeToBlock.id) {
          return {
            ...route,
            status: 'Flooded / Blocked' as const,
            trafficStatus: 'IMPASSABLE — corridor blocked during simulation.',
            hazardNote:
              'Simulated blockage. Do not enter; verify real-world conditions with authorities.',
          };
        }

        return route;
      });

      setRouteState(updatedRoutes);

      const recommendedRoute =
        updatedRoutes.find((route) => route.status === 'Clear & Open') ??
        updatedRoutes.find((route) => route.status === 'Emergency Escort Only');

      setSelectedRouteId(recommendedRoute?.id ?? null);
      setRecommendedRouteId(recommendedRoute?.id ?? null);

      setIsRecomputing(false);

      setAiNotice(
        recommendedRoute
          ? `DEMO ROUTE UPDATE: ${routeToBlock.name} is simulated as blocked. ${recommendedRoute.name} is shown as an alternative${recommendedRoute.status === 'Emergency Escort Only' ? ' with emergency escort only' : ''}. This is a simulation; verify current road conditions with emergency authorities.`
          : `DEMO ROUTE UPDATE: ${routeToBlock.name} is simulated as blocked and no clear or escort-only alternative is available. Do not use a route without confirmation from emergency authorities.`
      );

      if (soundEnabled) {
        soundManager.playBeep(940);
      }
    }, 1200);
  };

  const handleResetRoutes = () => {
    const nextRoutes: EvacuationRoute[] = Array.isArray(routes)
      ? routes
      : [];

    setRouteState(nextRoutes);
    setSelectedRouteId(nextRoutes[0]?.id ?? null);
    setRecommendedRouteId(null);
    setAiNotice(null);
    setIsRecomputing(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-2xl gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-bold font-mono tracking-wide text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-teal-400" />
              INTELLIGENT EVACUATION &amp; SAFE HAVEN DISPATCH
            </h2>

            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold">
              DYNAMIC HAZARD ROUTING
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-2">
            Evacuation route and shelter overview. Route conditions shown here
            may be simulated and must be verified before real-world use.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleSimulateBlockage}
            disabled={isRecomputing || routeState.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/40 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />

            <span>
              {isRecomputing
                ? 'Updating Routes...'
                : 'Simulate Corridor Blockage & Auto-Reroute'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleResetRoutes}
            disabled={isRecomputing}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reset Routes"
            aria-label="Reset routes"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Simulation notice */}
      {aiNotice && (
        <div
          role="status"
          className="p-4 rounded-2xl bg-amber-950/70 border border-amber-500/50 flex items-start gap-3 text-xs text-amber-200"
        >
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />

          <div className="space-y-1">
            <div className="font-bold text-white">
              Route Advisory
            </div>

            <p className="leading-relaxed">{aiNotice}</p>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Routes */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 gap-3">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Navigation className="w-4 h-4 text-cyan-400" />
                <span>Computed Evacuation Corridors</span>
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Origin: {selectedRoute?.originZone || 'No route selected'}
              </p>
            </div>

            <span className="text-xs font-mono text-cyan-400">
              {routeState.length} Corridors
            </span>
          </div>

          {routeState.length === 0 ? (
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-5">
              <AlertTriangle className="w-6 h-6 text-amber-400 mb-2" />

              <h4 className="text-sm font-bold text-white">
                No Evacuation Routes Available
              </h4>

              <p className="text-xs text-slate-400 mt-2">
                The planner has not received any route data. Check the route
                data supplied by the parent component.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {routeState.map((route) => {
                const isSelected = selectedRouteId === route.id;
                const isBlocked = route.status === 'Flooded / Blocked';
                const isClear = route.status === 'Clear & Open';
                const isEscortOnly = route.status === 'Emergency Escort Only';
                const waypoints = [route.originZone, route.destinationShelter];

                return (
                  <div
                    key={route.id}
                    id={`evac-route-${route.id}`}
                    onClick={() => {
                      if (soundEnabled) {
                        soundManager.playBeep(800);
                      }

                      setSelectedRouteId(route.id);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedRouteId(route.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-teal-950/70 to-slate-900 border-teal-500/50 shadow-md ring-1 ring-teal-500/30'
                        : isBlocked
                        ? 'bg-rose-950/20 border-rose-900/40 opacity-75'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800/80">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-white">
                          {route.name}
                        </span>

                        {route.id === recommendedRouteId && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {isEscortOnly
                              ? 'DEMO ALTERNATIVE — ESCORT REQUIRED'
                              : 'RECOMMENDED IN DEMO'}
                          </span>
                        )}

                        {isBlocked && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                            <Slash className="w-3 h-3" />
                            ROAD BLOCKED
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono">
                        <span className="text-cyan-400 font-bold">
                          {route.distanceKm} km
                        </span>

                        <span className="text-slate-500">•</span>

                        <span className="text-white font-bold">
                          {isBlocked
                            ? 'No safe ETA'
                            : `${route.estimatedTransitMinutes} mins ETA`}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono pt-1">
                      <div>
                        <span className="text-slate-400 block text-[10px]">
                          Target Safe Shelter:
                        </span>

                        <span className="text-white font-semibold line-clamp-1">
                          {route.destinationShelter || 'Not specified'}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">
                          Route Status:
                        </span>

                        <span
                          className={
                            isBlocked
                              ? 'text-rose-400 font-bold'
                              : isClear
                              ? 'text-emerald-400 font-bold'
                              : 'text-slate-300'
                          }
                        >
                          {route.status}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">
                          Road Conditions:
                        </span>

                        <span
                          className={
                            isBlocked
                              ? 'text-rose-400 font-bold'
                              : isEscortOnly
                              ? 'text-amber-400 font-bold'
                              : 'text-slate-300'
                          }
                        >
                          {route.trafficStatus}
                        </span>
                      </div>
                    </div>

                    {/* Waypoints */}
                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400 overflow-x-auto custom-scrollbar pb-1">
                      <span className="font-bold text-slate-300 shrink-0">
                        Corridor Nodes:
                      </span>

                      {waypoints.length > 0 ? (
                        waypoints.map((waypoint, index) => (
                          <span
                            key={`${route.id}-waypoint-${index}`}
                            className="flex items-center gap-1 shrink-0"
                          >
                            <span className="text-slate-200">
                              {waypoint}
                            </span>

                            {index < waypoints.length - 1 && (
                              <ArrowRight className="w-3 h-3 text-slate-600" />
                            )}
                          </span>
                        ))
                      ) : (
                        <span className="italic text-slate-500">
                          No route endpoints available
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onNavigateToMap}
              disabled={!selectedRoute}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MapPin className="w-3.5 h-3.5" />

              <span>View Selected Corridor on Tactical Map →</span>
            </button>
          </div>
        </div>

        {/* Shelters */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-xl space-y-4 flex flex-col">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Home className="w-4 h-4 text-emerald-400" />
                <span>Designated Evacuation Shelters</span>
              </h3>

              <span className="text-xs font-mono text-emerald-400">
                {safeShelters.length} Facilities
              </span>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto custom-scrollbar pr-1 mt-3">
              {safeShelters.length === 0 ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs text-slate-400">
                    No shelter information is available.
                  </p>
                </div>
              ) : (
                safeShelters.map((shelter) => {
                  const capacity = Number(shelter.capacity) || 0;
                  const occupancy = Number(shelter.currentOccupancy) || 0;
                  const availableSpots = Math.max(0, capacity - occupancy);

                  const occupancyPercent =
                    capacity > 0
                      ? Math.min(
                          100,
                          Math.round((occupancy / capacity) * 100)
                        )
                      : 0;

                  const isFull = occupancyPercent >= 90;

                  return (
                    <div
                      key={shelter.id}
                      className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-white text-xs truncate">
                          {shelter.name || 'Unnamed shelter'}
                        </span>

                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                            isFull
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {occupancyPercent}% Occupied
                        </span>
                      </div>

                      <div className="text-slate-400 font-mono text-[11px]">
                        {shelter.location || 'Location not provided'}
                      </div>

                      {/* Capacity */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                          <span>Occupancy</span>

                          <span>
                            {occupancy} / {capacity} spots
                          </span>
                        </div>

                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isFull
                                ? 'bg-rose-500'
                                : occupancyPercent > 70
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${occupancyPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Available resources */}
                      <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400 font-mono pt-1">
                        <div>
                          Food:{' '}
                          <span className="text-white">
                            {shelter.foodSuppliesDays} Days
                          </span>
                        </div>

                        <div>
                          Water:{' '}
                          <span className="text-white">
                            {shelter.waterSuppliesDays} Days
                          </span>
                        </div>

                        <div>
                          Medical Post:{' '}
                          <span className="text-emerald-400">
                            {shelter.medicalSupport ? 'Available' : 'No'}
                          </span>
                        </div>

                        <div>
                          Spots Free:{' '}
                          <span className="text-cyan-400">
                            {availableSpots}
                          </span>
                        </div>

                        <div>
                          Contact:{' '}
                          <span className="text-slate-300">
                            {shelter.contactPhone || 'Not provided'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-auto p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-400 shrink-0" />

            <span>
              Verify shelter availability and road conditions with emergency
              authorities before relying on them.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvacuationPlanner;