import React, { useState, useEffect } from 'react';
import { WebGLAtmosphereShader } from '../components/WebGLAtmosphereShader';
import { MapViewer } from '../components/MapViewer';
import { ScreenType, StationData } from '../types';

interface PredictionScreenProps {
  selectedStation: StationData;
  onNavigate: (screen: ScreenType) => void;
  onSelectStation: (station: StationData) => void;
  theme?: 'dark' | 'light';
}

export const PredictionScreen: React.FC<PredictionScreenProps> = ({
  onNavigate,
  onSelectStation,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const [viewMode, setViewMode] = useState<'map' | 'simulation'>('map');
  const [activeLayer, setActiveLayer] = useState<'wind' | 'pm25' | 'aqi' | 'no2'>('wind');
  const [activeAltitude, setActiveAltitude] = useState<'10m' | '500m' | '10km'>('10m');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);
  const [currentTimeStep, setCurrentTimeStep] = useState('Now');
  const [scrubberProgress, setScrubberProgress] = useState(8);
  const [isPinned, setIsPinned] = useState(false);
  const [showNodeCard, setShowNodeCard] = useState(true);

  const [activeNode, setActiveNode] = useState<{
    id: string;
    title: string;
    badge: string;
    badgeClass: string;
    desc: string;
  }>({
    id: 'anand-vihar',
    title: 'Anand Vihar Node #04',
    badge: 'Poor AQI 245',
    badgeClass: 'bg-[#ef4444]/25 text-[#ef4444]',
    desc: 'Thermal inversion cap holding particulate emissions. Wind speed stagnant at 4.1 km/h.'
  });

  const timeStepMap: { [key: string]: number } = {
    'Now': 8,
    '+1h': 24,
    '+3h': 42,
    '+6h': 60,
    '+12h': 78,
    '+24h': 90,
    '+72h': 100
  };

  const handleSelectTimeStep = (step: string) => {
    setCurrentTimeStep(step);
    setScrubberProgress(timeStepMap[step] || 8);
  };

  // Playback timer simulation
  useEffect(() => {
    if (!isPlaying) return;
    const steps = ['Now', '+1h', '+3h', '+6h', '+12h', '+24h', '+72h'];
    const interval = setInterval(() => {
      setCurrentTimeStep((prev) => {
        const nextIdx = (steps.indexOf(prev) + 1) % steps.length;
        const nextStep = steps[nextIdx];
        setScrubberProgress(timeStepMap[nextStep]);
        return nextStep;
      });
    }, 1800 / speedMultiplier);

    return () => clearInterval(interval);
  }, [isPlaying, speedMultiplier]);

  const selectNode = (
    id: string,
    title: string,
    badge: string,
    badgeClass: string,
    desc: string
  ) => {
    setActiveNode({ id, title, badge, badgeClass, desc });
    setShowNodeCard(true);
  };

  return (
    <div className={`relative flex flex-col w-full min-h-screen overflow-hidden select-none pb-24 transition-colors duration-300 ${
      isLight ? 'bg-[#f8fafd] text-[#1f1f1f]' : 'bg-[#0d1322] text-[#dde2f8]'
    }`}>
      {/* Background WebGL Shader Simulation */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <WebGLAtmosphereShader
          layer={activeLayer}
          speedMultiplier={isPlaying ? speedMultiplier * 1.6 : speedMultiplier}
          timeOffset={scrubberProgress * 0.1}
        />
        {/* Scrim overlay */}
        <div className={`absolute inset-0 pointer-events-none ${
          isLight
            ? 'bg-gradient-to-b from-white/70 via-transparent to-white/90'
            : 'bg-gradient-to-b from-[#080e1d]/80 via-transparent to-[#080e1d]/95'
        }`} />
      </div>

      {/* Main HUD Container (Z-10) */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 pt-3 flex flex-col space-y-3">
        {/* View Mode Segmented Controller */}
        <div className={`p-1 rounded-2xl flex items-center gap-1 shadow-lg border backdrop-blur-xl transition-all ${
          isLight ? 'bg-white/95 border-[#dadce0] shadow-[0_1px_4px_rgba(60,64,67,0.12)]' : 'bg-[#151b2b]/95 border-white/10'
        }`}>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              viewMode === 'map'
                ? isLight
                  ? 'bg-[#0b57d0] text-white shadow-xs'
                  : 'bg-gradient-to-r from-sky-500 via-[#f97316] to-[#10b981] text-white shadow-md'
                : isLight
                ? 'text-[#5f6368] hover:text-[#1f1f1f]'
                : 'text-[#bec8d2] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">public</span>
            <span>Map (Hot &amp; Green Zones)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('simulation')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              viewMode === 'simulation'
                ? isLight
                  ? 'bg-[#0b57d0] text-white shadow-xs'
                  : 'bg-sky-500 text-white shadow-md'
                : isLight
                ? 'text-[#5f6368] hover:text-[#1f1f1f]'
                : 'text-[#bec8d2] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">air</span>
            <span>72h Wind Simulation</span>
          </button>
        </div>

        {viewMode === 'map' ? (
          /* Map Interactive Cartography View */
          <div className="w-full flex flex-col space-y-3 animate-in fade-in duration-200">
            <MapViewer
              theme={theme}
              onSelectStation={(zoneName) => {
                const matched = [
                  { name: 'Connaught Place', id: 'connaught-place' },
                  { name: 'Anand Vihar', id: 'anand-vihar' },
                  { name: 'Lodhi Road', id: 'lodhi-road' }
                ].find((s) => zoneName.toLowerCase().includes(s.name.toLowerCase()));
                if (matched && onSelectStation) {
                  const st = {
                    id: matched.id,
                    name: zoneName,
                    subName: 'Selected Basin Node',
                    distance: '1.2 km',
                    aqi: 190,
                    aqiStatus: 'Moderate',
                    aqiColor: '#f59e0b',
                    temperature: 28,
                    humidity: 54,
                    windSpeed: '14 km/h NW',
                    pm25: 145,
                    pm10: 220,
                    no2: 48,
                    so2: 18,
                    co: 1.2,
                    o3: 35
                  } as any;
                  onSelectStation(st);
                }
              }}
            />

            {/* Navigation back to full dashboard */}
            <div className={`p-4 rounded-3xl border shadow-md flex items-center justify-between transition-colors ${
              isLight ? 'bg-white border-[#dadce0] text-[#1f1f1f]' : 'bg-[#151b2b] border-white/10 text-white'
            }`}>
              <div className="flex items-center gap-2.5">
                <span className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                  isLight ? 'bg-[#e8f0fe] text-[#0b57d0]' : 'bg-sky-cyan/20 text-sky-cyan'
                }`}>
                  <span className="material-symbols-outlined text-[20px]">explore</span>
                </span>
                <div>
                  <h4 className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                    Full City Analytics
                  </h4>
                  <p className={`text-[11px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                    Return to primary dashboard
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('home')}
                className={`px-4 py-2 rounded-full font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center gap-1 cursor-pointer ${
                  isLight
                    ? 'bg-[#0b57d0] hover:bg-[#1a73e8] text-white'
                    : 'bg-gradient-to-r from-sky-cyan to-primary text-[#00344d]'
                }`}
              >
                <span>Dashboard</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>
          </div>
        ) : (
          /* 72h Wind Simulation & HUD */
          <>
            {/* Sub-Nav / Radar Status Strip */}
            <div className={`flex items-center justify-between gap-2 backdrop-blur-xl px-4 py-2.5 rounded-full shadow-md border transition-colors ${
              isLight
                ? 'bg-white/90 border-[#dadce0] text-[#1f1f1f]'
                : 'bg-[#1e293b]/70 border-white/10 text-white'
            }`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isLight ? 'bg-[#e8f0fe] text-[#0b57d0]' : 'bg-[#151b2b] text-sky-cyan'
                }`}>
                  <span className="material-symbols-outlined text-[18px]">explore</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold truncate ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                      Delhi NCR Basin
                    </span>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      isLight ? 'bg-emerald-100 text-[#137333]' : 'bg-aqi-good/20 text-secondary'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full animate-ping mr-1 ${isLight ? 'bg-[#137333]' : 'bg-aqi-good'}`} />
                      Live Mesh
                    </span>
                  </div>
                  <span className={`text-[11px] truncate ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                    3,420 Active Optical Nodes
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => alert('Radar auto-aligned to magnetic True North')}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                    isLight
                      ? 'bg-[#f0f4f9] hover:bg-[#e2e8f0] text-[#444746]'
                      : 'bg-[#242a3a]/80 text-white hover:text-sky-cyan'
                  }`}
                  title="Compass alignment"
                >
                  <span className="material-symbols-outlined text-[18px] transform -rotate-45">navigation</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const layers: ('wind' | 'pm25' | 'aqi' | 'no2')[] = ['wind', 'pm25', 'aqi', 'no2'];
                    const nextIdx = (layers.indexOf(activeLayer) + 1) % layers.length;
                    setActiveLayer(layers[nextIdx]);
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                    isLight
                      ? 'bg-[#f0f4f9] hover:bg-[#e2e8f0] text-[#0b57d0]'
                      : 'bg-[#242a3a]/80 text-white hover:text-sky-cyan'
                  }`}
                  title="Cycle Layer"
                >
                  <span className="material-symbols-outlined text-[18px]">layers</span>
                </button>
              </div>
            </div>

            {/* Horizontal Atmospheric Layer Selector (Google M3 Chips) */}
            <div className="w-full overflow-x-auto no-scrollbar py-0.5">
              <div className="flex items-center gap-1.5 whitespace-nowrap px-0.5">
                <button
                  type="button"
                  onClick={() => setActiveLayer('wind')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer border ${
                    activeLayer === 'wind'
                      ? isLight
                        ? 'bg-[#c2e7ff] text-[#001d35] border-transparent font-bold'
                        : 'bg-sky-cyan/25 text-primary border-sky-cyan/40'
                      : isLight
                      ? 'bg-white text-[#444746] border-[#dadce0] hover:bg-[#f0f4f9]'
                      : 'bg-[#191f2f]/80 backdrop-blur-md text-[#bec8d2] hover:text-white border-white/5'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">air</span>
                  <span>Wind Vector Flow</span>
                  {activeLayer === 'wind' && <span className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-[#001d35]' : 'bg-primary'}`} />}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveLayer('pm25')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer border ${
                    activeLayer === 'pm25'
                      ? isLight
                        ? 'bg-red-100 text-red-900 border-transparent font-bold'
                        : 'bg-[#ef4444]/25 text-[#ef4444] border-[#ef4444]/40'
                      : isLight
                      ? 'bg-white text-[#444746] border-[#dadce0] hover:bg-[#f0f4f9]'
                      : 'bg-[#191f2f]/80 backdrop-blur-md text-[#bec8d2] hover:text-white border-white/5'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] text-aqi-unhealthy">blur_on</span>
                  <span>PM2.5 Dispersion</span>
                  {activeLayer === 'pm25' && <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveLayer('aqi')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer border ${
                    activeLayer === 'aqi'
                      ? isLight
                        ? 'bg-amber-100 text-amber-900 border-transparent font-bold'
                        : 'bg-[#f59e0b]/25 text-[#f59e0b] border-[#f59e0b]/40'
                      : isLight
                      ? 'bg-white text-[#444746] border-[#dadce0] hover:bg-[#f0f4f9]'
                      : 'bg-[#191f2f]/80 backdrop-blur-md text-[#bec8d2] hover:text-white border-white/5'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] text-aqi-moderate">grain</span>
                  <span>Composite AQI</span>
                  {activeLayer === 'aqi' && <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveLayer('no2')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer border ${
                    activeLayer === 'no2'
                      ? isLight
                        ? 'bg-purple-100 text-purple-900 border-transparent font-bold'
                        : 'bg-purple-500/25 text-purple-300 border-purple-400/40'
                      : isLight
                      ? 'bg-white text-[#444746] border-[#dadce0] hover:bg-[#f0f4f9]'
                      : 'bg-[#191f2f]/80 backdrop-blur-md text-[#bec8d2] hover:text-white border-white/5'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] text-purple-500">bubble_chart</span>
                  <span>Tropospheric NO₂</span>
                  {activeLayer === 'no2' && <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
                </button>
              </div>
            </div>

            {/* Altitude Cross-Section & Radar Viewport (320px) */}
            <div className={`relative w-full h-[320px] rounded-3xl overflow-hidden shadow-xl border ${
              isLight ? 'bg-white/90 border-[#dadce0]' : 'border-white/10'
            }`}>
              {/* Spatial Grid Backdrop */}
              <div className={`absolute inset-0 backdrop-blur-[2px] pointer-events-none ${
                isLight ? 'bg-white/50' : 'bg-[#080e1d]/40'
              }`}>
                <svg className="w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="radar-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke={isLight ? '#0b57d0' : '#0ea5e9'} strokeWidth="0.5" />
                    </pattern>
                    <radialGradient id="radar-sweep" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.3" />
                      <stop offset="70%" stopColor="#10B981" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#radar-grid)" />
                  <circle cx="50%" cy="50%" r="130" fill="none" stroke={isLight ? '#0b57d0' : '#0ea5e9'} strokeDasharray="4 6" strokeWidth="1" className="opacity-40" />
                  <circle cx="50%" cy="50%" r="70" fill="none" stroke={isLight ? '#0b57d0' : '#0ea5e9'} strokeDasharray="2 4" strokeWidth="1" className="opacity-50" />
                  <circle cx="50%" cy="50%" r="130" fill="url(#radar-sweep)" className="animate-pulse" style={{ animationDuration: '4s' }} />
                </svg>
              </div>

              {/* Altitude Selector (Floating Left Top) */}
              <div className={`absolute top-3 left-3 z-20 flex flex-col gap-1 backdrop-blur-md p-1 rounded-2xl shadow-md border ${
                isLight ? 'bg-white/95 border-[#dadce0]' : 'bg-[#1e293b]/70 border-white/10'
              }`}>
                <button
                  type="button"
                  onClick={() => setActiveAltitude('10m')}
                  className={`text-[10px] font-semibold px-2 py-1 rounded-xl transition-all cursor-pointer ${
                    activeAltitude === '10m'
                      ? isLight ? 'bg-[#0b57d0] text-white shadow-xs' : 'bg-primary text-[#00344d] shadow'
                      : isLight ? 'text-[#5f6368] hover:text-[#1f1f1f]' : 'text-[#bec8d2] hover:text-white'
                  }`}
                >
                  10m Ground
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAltitude('500m')}
                  className={`text-[10px] font-semibold px-2 py-1 rounded-xl transition-all cursor-pointer ${
                    activeAltitude === '500m'
                      ? isLight ? 'bg-[#0b57d0] text-white shadow-xs' : 'bg-primary text-[#00344d] shadow'
                      : isLight ? 'text-[#5f6368] hover:text-[#1f1f1f]' : 'text-[#bec8d2] hover:text-white'
                  }`}
                >
                  500m BL
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAltitude('10km')}
                  className={`text-[10px] font-semibold px-2 py-1 rounded-xl transition-all cursor-pointer ${
                    activeAltitude === '10km'
                      ? isLight ? 'bg-[#0b57d0] text-white shadow-xs' : 'bg-primary text-[#00344d] shadow'
                      : isLight ? 'text-[#5f6368] hover:text-[#1f1f1f]' : 'text-[#bec8d2] hover:text-white'
                  }`}
                >
                  10km Jet
                </button>
              </div>

              {/* Quick Vector Telemetry Compass (Floating Right Top) */}
              <div className={`absolute top-3 right-3 z-20 flex items-center gap-1.5 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-md border ${
                isLight ? 'bg-white/95 border-[#dadce0]' : 'bg-[#1e293b]/70 border-white/10'
              }`}>
                <span className={`material-symbols-outlined text-[15px] animate-pulse ${isLight ? 'text-[#0b57d0]' : 'text-primary'}`}>
                  air
                </span>
                <span className={`font-telemetry-num text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                  14.2 <span className={`text-[10px] font-normal ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>km/h NW</span>
                </span>
              </div>

              {/* Geo-Node 1: Connaught Place */}
              <div
                onClick={() =>
                  selectNode(
                    'connaught-place',
                    'Connaught Place Node #01',
                    'Moderate AQI 180',
                    'bg-[#f59e0b]/25 text-[#f59e0b]',
                    'Urban canyon ventilation active. Traffic aerosol dilution factor: 62%.'
                  )
                }
                className="absolute top-[38%] left-[45%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
              >
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-10 h-10 rounded-full bg-[#f59e0b]/25 animate-ping" />
                  <div className={`w-8 h-8 rounded-full border shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform ${
                    isLight ? 'bg-white border-[#dadce0]' : 'bg-[#242a3a]/90 border-white/10'
                  }`}>
                    <span className="font-telemetry-num text-[11px] font-bold text-[#f59e0b]">180</span>
                  </div>
                  <div className={`absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap backdrop-blur-md px-2 py-0.5 rounded-full shadow-xs border ${
                    isLight ? 'bg-white/95 border-[#dadce0] text-[#1f1f1f]' : 'bg-[#1e293b]/80 border-white/5 text-white'
                  }`}>
                    <span className="text-[10px] font-medium">Connaught Pl.</span>
                  </div>
                </div>
              </div>

              {/* Geo-Node 2: Anand Vihar (Critical Hotspot) */}
              <div
                onClick={() =>
                  selectNode(
                    'anand-vihar',
                    'Anand Vihar Node #04',
                    'Poor AQI 245',
                    'bg-[#ef4444]/25 text-[#ef4444]',
                    'Thermal inversion cap holding particulate emissions. Wind speed stagnant at 4.1 km/h.'
                  )
                }
                className="absolute top-[24%] right-[16%] cursor-pointer z-20 group"
              >
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-11 h-11 rounded-full bg-[#ef4444]/30 animate-pulse" />
                  <div className={`w-8 h-8 rounded-full border shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform ${
                    isLight ? 'bg-white border-[#dadce0]' : 'bg-[#242a3a]/90 border-white/10'
                  }`}>
                    <span className="font-telemetry-num text-[11px] font-bold text-[#ef4444]">245</span>
                  </div>
                  <div className={`absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap backdrop-blur-md px-2 py-0.5 rounded-full shadow-xs border flex items-center gap-1 ${
                    isLight ? 'bg-white/95 border-[#dadce0] text-[#1f1f1f]' : 'bg-[#1e293b]/80 border-white/5 text-white'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                    <span className="text-[10px] font-medium">Anand Vihar</span>
                  </div>
                </div>
              </div>

              {/* Geo-Node 3: Lodhi Pocket */}
              <div
                onClick={() =>
                  selectNode(
                    'lodhi-road',
                    'Lodhi Botanical Sink',
                    'Good AQI 88',
                    'bg-aqi-good/25 text-secondary',
                    'Tree-canopy particulate filtration oasis. Local microclimate is 2.1°C cooler.'
                  )
                }
                className="absolute bottom-[28%] left-[28%] cursor-pointer z-20 group"
              >
                <div className="relative flex items-center justify-center">
                  <div className={`w-8 h-8 rounded-full border shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform ${
                    isLight ? 'bg-white border-[#dadce0]' : 'bg-[#242a3a]/90 border-white/10'
                  }`}>
                    <span className="font-telemetry-num text-[11px] font-bold text-aqi-good">88</span>
                  </div>
                  <div className={`absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap backdrop-blur-md px-2 py-0.5 rounded-full shadow-xs border ${
                    isLight ? 'bg-emerald-50 border-emerald-200 text-[#137333]' : 'bg-aqi-good/20 border-white/5 text-secondary'
                  }`}>
                    <span className="text-[10px] font-semibold">Lodhi Pocket</span>
                  </div>
                </div>
              </div>

              {/* Geo-Node 4: IGI Aerocity */}
              <div
                onClick={() =>
                  selectNode(
                    'igi-aerocity',
                    'IGI Aerocity Corridor',
                    'Moderate AQI 135',
                    'bg-[#f59e0b]/25 text-[#f59e0b]',
                    'High cross-wind dispersion corridor with 18 km/h jet velocity.'
                  )
                }
                className="absolute bottom-[20%] right-[26%] cursor-pointer z-20 group"
              >
                <div className="relative flex items-center justify-center">
                  <div className={`w-7 h-7 rounded-full border shadow-md flex items-center justify-center group-hover:scale-110 transition-transform ${
                    isLight ? 'bg-white border-[#dadce0]' : 'bg-[#242a3a]/90 border-white/10'
                  }`}>
                    <span className="font-telemetry-num text-[10px] font-bold text-[#f59e0b]">135</span>
                  </div>
                  <div className={`absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap backdrop-blur-md px-1.5 py-0.5 rounded-full shadow-xs border ${
                    isLight ? 'bg-white/95 border-[#dadce0] text-[#1f1f1f]' : 'bg-[#1e293b]/80 border-white/5 text-white'
                  }`}>
                    <span className="text-[9px] font-medium">IGI Aerocity</span>
                  </div>
                </div>
              </div>

              {/* Floating Context Callout (Dynamic node detail in Google Maps style) */}
              {showNodeCard && (
                <div className={`absolute bottom-3 left-3 right-3 z-30 backdrop-blur-2xl p-3 rounded-2xl shadow-xl border animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                  isLight
                    ? 'bg-white/95 border-[#dadce0] text-[#1f1f1f]'
                    : 'bg-[#334155]/85 border-white/10 text-white'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-[#ef4444]/20 flex items-center justify-center text-[#ef4444] shrink-0">
                        <span className="material-symbols-outlined text-[16px]">warning</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                            {activeNode.title}
                          </h4>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold ${activeNode.badgeClass}`}>
                            {activeNode.badge}
                          </span>
                        </div>
                        <p className={`text-[11px] mt-0.5 leading-snug ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                          {activeNode.desc}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowNodeCard(false)}
                      className={`p-1 cursor-pointer ${isLight ? 'text-[#5f6368] hover:text-[#1f1f1f]' : 'text-[#bec8d2] hover:text-white'}`}
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4D Time Forecast Scrubber HUD */}
            <div className={`backdrop-blur-xl rounded-2xl p-3.5 shadow-md space-y-2.5 border transition-all ${
              isLight ? 'bg-white/95 border-[#dadce0] text-[#1f1f1f]' : 'bg-[#1e293b]/70 border-white/10 text-white'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center shadow-xs active:scale-95 transition-transform cursor-pointer ${
                      isLight ? 'bg-[#0b57d0] text-white hover:bg-[#1a73e8]' : 'bg-primary text-[#00344d]'
                    }`}
                    title={isPlaying ? 'Pause simulation' : 'Play 72h forecast simulation'}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                  </button>

                  <div className="flex flex-col">
                    <span className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                      Wind &amp; Smog Simulation
                    </span>
                    <span className={`text-[11px] font-medium ${isLight ? 'text-[#0b57d0]' : 'text-sky-cyan'}`}>
                      {currentTimeStep === 'Now'
                        ? 'Now (Realtime Atmospheric Stream)'
                        : `Predictive Forecast (${currentTimeStep} Forward Stream)`}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSpeedMultiplier((prev) => (prev === 1.0 ? 2.0 : 1.0))}
                  className={`px-2 py-1 rounded-lg font-telemetry-num text-xs font-bold transition-colors cursor-pointer border ${
                    isLight
                      ? 'bg-[#f0f4f9] text-[#1f1f1f] border-[#dadce0] hover:bg-[#e2e8f0]'
                      : 'bg-[#151b2b] text-white hover:text-sky-cyan border-white/5'
                  }`}
                >
                  {speedMultiplier.toFixed(1)}x
                </button>
              </div>

              {/* Scrubber Track & Stepper */}
              <div className="relative pt-1 pb-1">
                <div className={`h-1.5 w-full rounded-full overflow-hidden relative ${isLight ? 'bg-slate-200' : 'bg-[#2f3445]'}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isLight
                        ? 'bg-gradient-to-r from-[#0b57d0] to-[#10b981]'
                        : 'bg-gradient-to-r from-sky-cyan via-primary to-secondary'
                    }`}
                    style={{ width: `${scrubberProgress}%` }}
                  />
                </div>

                {/* Timeline Step Labels */}
                <div className={`flex justify-between items-center text-[10px] pt-2 ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                  {['Now', '+1h', '+3h', '+6h', '+12h', '+24h', '+72h'].map((step) => (
                    <button
                      key={step}
                      type="button"
                      onClick={() => handleSelectTimeStep(step)}
                      className={`transition-colors cursor-pointer ${
                        currentTimeStep === step
                          ? isLight ? 'text-[#0b57d0] font-bold scale-110' : 'text-sky-cyan font-bold scale-110'
                          : isLight ? 'hover:text-[#1f1f1f]' : 'hover:text-white'
                      }`}
                    >
                      {step}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Metrics Strip / Live Telemetry Slice */}
            <div className="grid grid-cols-3 gap-2">
              <div className={`backdrop-blur-md rounded-2xl p-3 shadow-xs flex flex-col justify-between border ${
                isLight ? 'bg-white border-[#dadce0]' : 'bg-[#1e293b]/70 border-white/5'
              }`}>
                <span className={`text-[11px] flex items-center gap-1 ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                  <span className={`material-symbols-outlined text-[14px] ${isLight ? 'text-[#0b57d0]' : 'text-primary'}`}>
                    speed
                  </span>
                  Basin AQI
                </span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className={`font-headline-lg-mobile text-2xl font-extrabold tracking-tight ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                    174
                  </span>
                  <span className="text-xs text-[#f59e0b] font-semibold">Mod</span>
                </div>
              </div>

              <div className={`backdrop-blur-md rounded-2xl p-3 shadow-xs flex flex-col justify-between border ${
                isLight ? 'bg-white border-[#dadce0]' : 'bg-[#1e293b]/70 border-white/5'
              }`}>
                <span className={`text-[11px] flex items-center gap-1 ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                  <span className={`material-symbols-outlined text-[14px] ${isLight ? 'text-[#137333]' : 'text-secondary'}`}>
                    compress
                  </span>
                  Barometric
                </span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className={`font-telemetry-num text-xl font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                    1,012
                  </span>
                  <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>hPa</span>
                </div>
              </div>

              <div className={`backdrop-blur-md rounded-2xl p-3 shadow-xs flex flex-col justify-between border ${
                isLight ? 'bg-white border-[#dadce0]' : 'bg-[#1e293b]/70 border-white/5'
              }`}>
                <span className={`text-[11px] flex items-center gap-1 ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                  <span className={`material-symbols-outlined text-[14px] ${isLight ? 'text-[#0b57d0]' : 'text-sky-cyan'}`}>
                    air
                  </span>
                  Ventilation
                </span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className={`font-telemetry-num text-xl font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                    Fair
                  </span>
                  <span className={`text-[10px] font-semibold ${isLight ? 'text-[#137333]' : 'text-aqi-good'}`}>
                    Stable
                  </span>
                </div>
              </div>
            </div>

            {/* 72-Hour Predictive Evolution Curve Card */}
            <div className={`backdrop-blur-xl p-4 border shadow-sm space-y-2.5 rounded-3xl ${
              isLight ? 'bg-white border-[#dadce0] text-[#1f1f1f]' : 'bg-[#191f2f]/85 border-white/10 text-white'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className={`material-symbols-outlined text-[18px] ${isLight ? 'text-[#0b57d0]' : 'text-primary'}`}>
                    insights
                  </span>
                  <h3 className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                    72-Hour Atmospheric Dispersion Model
                  </h3>
                </div>
                <span className={`text-[10px] font-semibold ${isLight ? 'text-[#137333]' : 'text-secondary'}`}>
                  Sentinel-5P AI Mesh
                </span>
              </div>

              <p className={`text-[11px] ${isLight ? 'text-[#444746]' : 'text-[#bec8d2]'}`}>
                High north-westerly wind vector at 14 km/h flushes airborne PM2.5 towards the Yamuna basin by Friday night, lowering overall particulate density by 32%.
              </p>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className={`p-2 rounded-xl text-center border ${
                  isLight ? 'bg-[#f8fafd] border-[#dadce0]' : 'bg-[#151b2b] border-white/5'
                }`}>
                  <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>Peak Haze</span>
                  <p className="text-xs font-bold text-[#ef4444] mt-0.5">Tonight 11 PM</p>
                </div>
                <div className={`p-2 rounded-xl text-center border ${
                  isLight ? 'bg-[#f8fafd] border-[#dadce0]' : 'bg-[#151b2b] border-white/5'
                }`}>
                  <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>Wind Influx</span>
                  <p className={`text-xs font-bold mt-0.5 ${isLight ? 'text-[#0b57d0]' : 'text-primary'}`}>
                    +18 km/h Friday
                  </p>
                </div>
                <div className={`p-2 rounded-xl text-center border ${
                  isLight ? 'bg-[#f8fafd] border-[#dadce0]' : 'bg-[#151b2b] border-white/5'
                }`}>
                  <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>Clean Window</span>
                  <p className={`text-xs font-bold mt-0.5 ${isLight ? 'text-[#137333]' : 'text-secondary'}`}>
                    Sunday 78 AQI
                  </p>
                </div>
              </div>
            </div>

            {/* Action Hub Dock */}
            <div className={`backdrop-blur-2xl rounded-3xl p-4 shadow-md space-y-3 border ${
              isLight ? 'bg-white border-[#dadce0] text-[#1f1f1f]' : 'bg-[#191f2f]/90 border-white/10 text-white'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    isLight ? 'bg-[#e8f0fe] text-[#0b57d0]' : 'bg-sky-cyan/20 text-sky-cyan'
                  }`}>
                    <span className="material-symbols-outlined text-[22px]">public</span>
                  </div>
                  <div>
                    <h4 className={`text-xs sm:text-sm font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                      Atmospheric Telemetry Sync
                    </h4>
                    <p className={`text-[11px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                      Synthesizing Sentinel-5P + Ground IoT Nodes
                    </p>
                  </div>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${isLight ? 'bg-[#137333]' : 'bg-secondary'}`} />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsPinned(!isPinned)}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs font-semibold transition-colors cursor-pointer border ${
                    isPinned
                      ? isLight ? 'bg-emerald-50 text-[#137333] border-emerald-200' : 'bg-secondary/20 text-secondary border-secondary/40'
                      : isLight ? 'bg-[#f0f4f9] text-[#1f1f1f] hover:bg-[#e2e8f0] border-[#dadce0]' : 'bg-[#242a3a] text-white hover:bg-[#33394a] border-white/5'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isPinned ? 'bookmark_added' : 'bookmark_add'}
                  </span>
                  <span>{isPinned ? 'Region Pinned' : 'Pin Region'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full font-bold text-xs shadow-md active:scale-[0.98] transition-all cursor-pointer ${
                    isLight
                      ? 'bg-[#0b57d0] hover:bg-[#1a73e8] text-white shadow-[#0b57d0]/20'
                      : 'bg-gradient-to-r from-sky-cyan to-primary text-[#00344d]'
                  }`}
                >
                  <span>Full Dashboard</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
