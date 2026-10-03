import React, { useState } from 'react';
import { MAP_ZONES, MapZone } from '../data/mapZones';

interface MapViewerProps {
  onClose?: () => void;
  isModal?: boolean;
  theme?: 'dark' | 'light';
  onSelectStation?: (zoneName: string) => void;
}

export const MapViewer: React.FC<MapViewerProps> = ({
  onClose,
  isModal = false,
  theme = 'dark',
  onSelectStation
}) => {
  const isLight = theme === 'light';
  const [filter, setFilter] = useState<'all' | 'hotzones' | 'greenzones'>('all');
  const [showSmokePlume, setShowSmokePlume] = useState(true);
  const [selectedZone, setSelectedZone] = useState<MapZone>(MAP_ZONES[0]);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  const displayedZones = MAP_ZONES.filter((z) => {
    if (filter === 'hotzones') return z.type === 'hotzone';
    if (filter === 'greenzones') return z.type === 'greenzone';
    return true;
  });

  const hotzonesCount = MAP_ZONES.filter((z) => z.type === 'hotzone').length;
  const greenzonesCount = MAP_ZONES.filter((z) => z.type === 'greenzone').length;

  return (
    <div className={`relative flex flex-col w-full h-full rounded-3xl overflow-hidden shadow-2xl transition-colors duration-300 ${
      isLight ? 'bg-[#f8fafd] text-[#1f1f1f]' : 'bg-[#080e1d] text-white'
    }`}>
      {/* Top Map Control Bar */}
      <div className={`flex items-center justify-between p-3.5 border-b backdrop-blur-xl z-20 transition-colors ${
        isLight
          ? 'bg-white/95 border-[#dadce0] shadow-[0_1px_3px_0_rgba(60,64,67,0.12)]'
          : 'bg-[#151b2b]/90 border-white/10'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#ea4335] via-[#fbbc04] to-[#34a853] p-[2px] shadow-sm flex items-center justify-center">
            <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${
              isLight ? 'bg-white text-[#1a73e8]' : 'bg-[#0f172a] text-white'
            }`}>
              <span className="material-symbols-outlined text-[20px]">map</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className={`font-headline-sm font-bold text-sm sm:text-base leading-tight ${
                isLight ? 'text-[#202124]' : 'text-white'
              }`}>
                Delhi NCR Atmospheric Basin Map
              </h2>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-extrabold uppercase ${
                isLight ? 'bg-[#1a73e8] text-white' : 'bg-sky-500 text-white'
              }`}>
                LIVE
              </span>
            </div>
            <p className={`text-[11px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
              5 High-Risk Hotzones vs 5 Natural Green Sanctuaries
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Zoom controls */}
          <div className={`flex items-center rounded-full p-0.5 border ${
            isLight
              ? 'bg-[#f1f3f4] border-[#dadce0] shadow-sm'
              : 'bg-black/20 border-white/10'
          }`}>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.6))}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs active:scale-95 cursor-pointer transition-colors ${
                isLight ? 'hover:bg-white text-[#3c4043]' : 'hover:bg-white/10 text-white'
              }`}
              title="Zoom In"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs active:scale-95 cursor-pointer transition-colors ${
                isLight ? 'hover:bg-white text-[#3c4043]' : 'hover:bg-white/10 text-white'
              }`}
              title="Zoom Out"
            >
              <span className="material-symbols-outlined text-[16px]">remove</span>
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(1.0)}
              className={`px-1.5 text-[10px] font-mono rounded-full h-7 flex items-center cursor-pointer transition-colors ${
                isLight ? 'hover:bg-white text-[#3c4043]' : 'hover:bg-white/10 text-white'
              }`}
              title="Reset Zoom"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
          </div>

          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                isLight ? 'bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#3c4043]' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Quick Indicators */}
      <div className={`px-3 py-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar border-b z-20 text-xs ${
        isLight ? 'bg-[#f8fafd] border-[#dadce0]' : 'bg-[#111827]/90 border-white/5'
      }`}>
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
              filter === 'all'
                ? isLight
                  ? 'bg-[#1a73e8] text-white shadow-sm'
                  : 'bg-sky-500 text-white shadow-sm'
                : isLight
                ? 'bg-white text-[#3c4043] hover:bg-[#f1f3f4] border border-[#dadce0]'
                : 'bg-white/5 text-[#bec8d2] hover:text-white'
            }`}
          >
            All Zones (10)
          </button>

          <button
            type="button"
            onClick={() => setFilter('hotzones')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
              filter === 'hotzones'
                ? isLight
                  ? 'bg-[#d93025] text-white shadow-sm'
                  : 'bg-[#ef4444] text-white shadow-sm'
                : isLight
                ? 'bg-[#fce8e6] text-[#c5221f] hover:bg-[#fad2cf] border border-[#fad2cf]'
                : 'bg-[#ef4444]/15 text-[#ef4444] hover:bg-[#ef4444]/25'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
            <span>Hotzones ({hotzonesCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('greenzones')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
              filter === 'greenzones'
                ? isLight
                  ? 'bg-[#1e8e3e] text-white shadow-sm'
                  : 'bg-[#10b981] text-white shadow-sm'
                : isLight
                ? 'bg-[#e6f4ea] text-[#137333] hover:bg-[#ceead6] border border-[#ceead6]'
                : 'bg-[#10b981]/15 text-[#10b981] hover:bg-[#10b981]/25'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">park</span>
            <span>Green Sinks ({greenzonesCount})</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowSmokePlume(!showSmokePlume)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all shrink-0 cursor-pointer border ${
            showSmokePlume
              ? isLight
                ? 'bg-[#e37400] text-white border-[#e37400] shadow-sm'
                : 'bg-orange-500 text-white border-orange-500 shadow-sm'
              : isLight
              ? 'bg-white text-[#5f6368] border-[#dadce0]'
              : 'bg-white/5 text-[#88929b] border-white/10'
          }`}
          title="Toggle Satellite Stubble Burning Smoke Drift Corridor"
        >
          <span className="material-symbols-outlined text-[14px]">air</span>
          <span>Stubble Smoke Plume</span>
        </button>
      </div>

      {/* Cartographic Interactive Canvas Area */}
      <div className={`relative flex-1 w-full min-h-[360px] max-h-[500px] overflow-hidden select-none ${
        isLight ? 'bg-[#e8eaed]' : 'bg-[#080e1d]'
      }`}>
        {/* Transformable Canvas Container for Zoom */}
        <div
          className="relative w-full h-full transition-transform duration-200 origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Base Vector Cartography SVG */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1000 750"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Radial Gradients for Hotzones */}
              <radialGradient id="hotzone-gradient-severe" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={isLight ? '0.75' : '0.85'} />
                <stop offset="50%" stopColor="#f97316" stopOpacity={isLight ? '0.4' : '0.45'} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="hotzone-gradient-hazardous" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={isLight ? '#c5221f' : '#7f1d1d'} stopOpacity={isLight ? '0.85' : '0.95'} />
                <stop offset="40%" stopColor={isLight ? '#d93025' : '#b91c1c'} stopOpacity={isLight ? '0.55' : '0.6'} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>

              {/* Radial Gradients for Green Zones */}
              <radialGradient id="greenzone-gradient-pristine" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={isLight ? '#137333' : '#10b981'} stopOpacity={isLight ? '0.75' : '0.85'} />
                <stop offset="50%" stopColor={isLight ? '#1e8e3e' : '#059669'} stopOpacity={isLight ? '0.35' : '0.4'} />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </radialGradient>

              {/* Stubble smoke corridor linear gradient */}
              <linearGradient id="smoke-plume-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isLight ? '#d93025' : '#ef4444'} stopOpacity={isLight ? '0.5' : '0.65'} />
                <stop offset="60%" stopColor={isLight ? '#ea8600' : '#f97316'} stopOpacity={isLight ? '0.28' : '0.35'} />
                <stop offset="100%" stopColor={isLight ? '#795548' : '#78350f'} stopOpacity="0.05" />
              </linearGradient>

              {/* Regional Grid Pattern */}
              <pattern id="basin-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke={isLight ? '#dadce0' : '#1e293b'}
                  strokeWidth="0.8"
                />
              </pattern>
            </defs>

            {/* Grid */}
            <rect width="1000" height="750" fill="url(#basin-grid)" opacity={isLight ? '0.5' : '0.4'} />

            {/* Delhi NCR State Boundary Outline (Google Maps Day vs Night style) */}
            <path
              d="M 120 180 Q 280 80 500 120 T 820 160 Q 920 340 850 560 T 680 710 Q 420 740 240 680 T 110 460 Z"
              fill={isLight ? '#f8f9fa' : '#0c1322'}
              stroke={isLight ? '#bdc1c6' : '#334155'}
              strokeWidth="2.5"
              strokeDasharray={isLight ? 'none' : '6 4'}
            />

            {/* River Yamuna Flow Vector (Google Maps Blue in Day Mode) */}
            <path
              d="M 480 90 Q 510 220 540 330 T 570 480 Q 640 590 730 720"
              fill="none"
              stroke={isLight ? '#aadaff' : '#0284c7'}
              strokeWidth="16"
              strokeLinecap="round"
              opacity={isLight ? '0.85' : '0.5'}
            />
            {/* Inner River Core */}
            <path
              d="M 480 90 Q 510 220 540 330 T 570 480 Q 640 590 730 720"
              fill="none"
              stroke={isLight ? '#76bdfa' : '#38bdf8'}
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.95"
            />
            <text x="560" y="270" fill={isLight ? '#1a73e8' : '#7dd3fc'} fontSize="13" fontWeight="bold" opacity="0.85" transform="rotate(70 560 270)">
              Yamuna River Flow →
            </text>

            {/* Ring Roads Arterial System (Google Maps Highway yellow/white styling in Day Mode) */}
            {/* Outer Ring Road */}
            <ellipse
              cx="510"
              cy="430"
              rx="290"
              ry="240"
              fill="none"
              stroke={isLight ? '#fcd6a4' : '#334155'}
              strokeWidth={isLight ? '4' : '2'}
              strokeDasharray={isLight ? 'none' : '4 6'}
            />
            {/* Inner Ring Road */}
            <ellipse
              cx="510"
              cy="430"
              rx="180"
              ry="150"
              fill="none"
              stroke={isLight ? '#ffffff' : '#475569'}
              strokeWidth={isLight ? '3.5' : '2.5'}
            />
            <text x="510" y="275" fill={isLight ? '#5f6368' : '#94a3b8'} fontSize="11" fontWeight={isLight ? '600' : 'normal'} textAnchor="middle" opacity="0.8">
              Inner Ring Road
            </text>

            {/* Stubble Burning Wind Dispersion Smoke Funnel */}
            {showSmokePlume && (
              <g className="transition-opacity duration-300">
                {/* Wind transport trajectory polygon */}
                <path
                  d="M 60 40 L 420 180 L 800 680 L 380 720 Z"
                  fill="url(#smoke-plume-gradient)"
                  opacity={isLight ? '0.35' : '0.35'}
                />

                {/* Animated Streamline Arrows */}
                <g stroke={isLight ? '#e37400' : '#f97316'} strokeWidth="2.5" strokeDasharray="12 14" opacity="0.85">
                  <path d="M 80 60 Q 300 240 580 480" className="animate-pulse" />
                  <path d="M 120 120 Q 360 310 650 540" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
                  <path d="M 160 180 Q 420 380 720 600" className="animate-pulse" style={{ animationDelay: '0.8s' }} />
                </g>

                {/* Plume Origin Capsule Marker */}
                <g transform="translate(140, 90)">
                  <rect x="-95" y="-18" width="190" height="36" rx="18" fill={isLight ? '#d93025' : '#ef4444'} opacity="0.95" />
                  <text x="0" y="5" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">
                    🔥 NW Stubble Plume (14 km/h)
                  </text>
                </g>
              </g>
            )}

            {/* Render Map Zones on SVG */}
            {displayedZones.map((zone) => {
              const cx = zone.x * 10;
              const cy = zone.y * 7.5;
              const r = zone.radius * 2.8;
              const isSelected = selectedZone.id === zone.id;

              return (
                <g key={zone.id} className="cursor-pointer" onClick={() => setSelectedZone(zone)}>
                  {/* Heatmap Area Radial Aura */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={
                      zone.type === 'hotzone'
                        ? zone.aqi >= 300
                          ? 'url(#hotzone-gradient-hazardous)'
                          : 'url(#hotzone-gradient-severe)'
                        : 'url(#greenzone-gradient-pristine)'
                    }
                    className="transition-all duration-300"
                    opacity={isSelected ? 1.0 : (isLight ? 0.75 : 0.8)}
                  />

                  {/* Pulsing Concentric Ring */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r * 0.75}
                    fill="none"
                    stroke={zone.aqiColor}
                    strokeWidth={isSelected ? '3' : '1.5'}
                    strokeDasharray={zone.type === 'greenzone' ? '6 4' : '3 3'}
                    className="animate-pulse"
                    opacity={isSelected ? '0.9' : '0.6'}
                  />

                  {/* Center Node Pin */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 20 : 16}
                    fill={zone.aqiColor}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 3.5 : 2}
                    className="transition-all duration-200 drop-shadow-md"
                  />

                  {/* Node AQI Number */}
                  <text
                    x={cx}
                    y={cy + 4.5}
                    fill="#ffffff"
                    fontSize={isSelected ? '12' : '11'}
                    fontWeight="800"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                    textAnchor="middle"
                  >
                    {zone.aqi}
                  </text>

                  {/* Floating Label Capsule (Google Maps pill in Day Mode) */}
                  <g transform={`translate(${cx}, ${cy - (isSelected ? 32 : 26)})`}>
                    <rect
                      x="-65"
                      y="-12"
                      width="130"
                      height="24"
                      rx="12"
                      fill={isLight ? '#ffffff' : '#0f172a'}
                      stroke={isLight ? '#dadce0' : zone.aqiColor}
                      strokeWidth={isSelected ? '2' : '1'}
                      opacity={isLight ? '0.98' : '0.95'}
                      className="drop-shadow-sm"
                    />
                    <text
                      x="0"
                      y="4"
                      fill={isLight ? '#202124' : '#ffffff'}
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {zone.name.split('&')[0].trim().slice(0, 18)}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Compass & Scale Overlay */}
          <div className="absolute top-3 right-3 z-10 flex flex-col items-center pointer-events-none">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center border shadow-md ${
              isLight ? 'bg-white/95 text-[#1a73e8] border-[#dadce0]' : 'bg-[#151b2b]/90 text-white border-white/10'
            }`}>
              <span className="material-symbols-outlined text-[20px] text-sky-500">north</span>
            </div>
            <span className={`text-[9px] font-bold mt-0.5 tracking-wider ${isLight ? 'text-[#5f6368]' : 'text-white'}`}>
              TRUE N
            </span>
          </div>

          {/* Map Layer Legend (Floating Bottom Left) */}
          <div className={`absolute bottom-3 left-3 z-10 p-2.5 rounded-2xl border shadow-lg backdrop-blur-md text-[11px] ${
            isLight
              ? 'bg-white/95 border-[#dadce0] text-[#3c4043] shadow-[0_1px_3px_0_rgba(60,64,67,0.15)]'
              : 'bg-[#151b2b]/85 border-white/10 text-[#bec8d2]'
          }`}>
            <div className={`font-bold text-[10px] uppercase tracking-wider mb-1 ${isLight ? 'text-[#70757a]' : 'text-slate-400'}`}>
              Zone Intensity Scale
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#10b981] shadow" />
                <span className="font-medium">Green Zone (AQI 0-60)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ef4444] shadow" />
                <span className="font-medium">Severe Hotzone (AQI 200-300)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#7f1d1d] shadow" />
                <span className="font-medium">Hazardous Stubble Arc (300+)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Zone Deep Intelligence Panel */}
      {selectedZone && (
        <div className={`p-4 border-t z-20 transition-colors ${
          isLight ? 'bg-white border-[#dadce0] text-[#1f1f1f]' : 'bg-[#151b2b] border-white/10 text-white'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              {/* Category Icon Badge */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-white"
                style={{ backgroundColor: selectedZone.aqiColor }}
              >
                <span className="material-symbols-outlined text-[24px]">
                  {selectedZone.type === 'hotzone' ? 'local_fire_department' : 'park'}
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase text-white shadow-xs"
                    style={{ backgroundColor: selectedZone.aqiColor }}
                  >
                    {selectedZone.type === 'hotzone' ? 'CRITICAL HOTZONE' : 'CLEAN AIR SANCTUARY'}
                  </span>
                  <span className={`text-[11px] font-semibold ${isLight ? 'text-[#1a73e8]' : 'text-sky-cyan'}`}>
                    {selectedZone.aqiStatus} Air Quality
                  </span>
                </div>

                <h3 className={`font-headline-sm text-base sm:text-lg font-bold truncate mt-0.5 ${
                  isLight ? 'text-[#202124]' : 'text-white'
                }`}>
                  {selectedZone.name}
                </h3>
                <p className={`text-xs truncate ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                  {selectedZone.subTitle}
                </p>
              </div>
            </div>

            {/* AQI Metric Highlight */}
            <div className="text-right shrink-0">
              <span className={`text-[10px] uppercase font-bold block ${isLight ? 'text-[#5f6368]' : 'text-[#88929b]'}`}>
                Live AQI
              </span>
              <span
                className="font-telemetry-num text-3xl sm:text-4xl font-extrabold block leading-none mt-0.5"
                style={{ color: selectedZone.aqiColor }}
              >
                {selectedZone.aqi}
              </span>
              <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#88929b]'}`}>
                US EPA Std
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar (3 Col) */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-1">
            <div className={`p-2 rounded-xl text-center border ${
              isLight ? 'bg-[#f8fafd] border-[#dadce0]' : 'bg-[#191f2f] border-white/5'
            }`}>
              <span className={`text-[10px] block ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                PM2.5 Mass
              </span>
              <span className={`font-telemetry-num text-sm sm:text-base font-bold ${
                isLight ? 'text-[#1f1f1f]' : 'text-white'
              }`}>
                {selectedZone.pm25} <span className="text-[10px] font-normal text-[#88929b]">µg/m³</span>
              </span>
            </div>

            <div className={`p-2 rounded-xl text-center border ${
              isLight ? 'bg-[#f8fafd] border-[#dadce0]' : 'bg-[#191f2f] border-white/5'
            }`}>
              <span className={`text-[10px] block ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                PM10 Inhalable
              </span>
              <span className={`font-telemetry-num text-sm sm:text-base font-bold ${
                isLight ? 'text-[#1f1f1f]' : 'text-white'
              }`}>
                {selectedZone.pm10} <span className="text-[10px] font-normal text-[#88929b]">µg/m³</span>
              </span>
            </div>

            <div className={`p-2 rounded-xl text-center border ${
              isLight ? 'bg-[#f8fafd] border-[#dadce0]' : 'bg-[#191f2f] border-white/5'
            }`}>
              <span className={`text-[10px] block ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                {selectedZone.type === 'hotzone' ? 'Nearby Fires' : 'Canopy Filter'}
              </span>
              <span
                className="font-telemetry-num text-xs sm:text-sm font-bold truncate block"
                style={{ color: selectedZone.aqiColor }}
              >
                {selectedZone.activeFiresNearby
                  ? `${selectedZone.activeFiresNearby} fires`
                  : selectedZone.canopyFilterRate || 'High Sink'}
              </span>
            </div>
          </div>

          {/* Health & Environmental Directive */}
          <div className={`mt-2.5 p-3 rounded-2xl flex items-start gap-2 border ${
            selectedZone.type === 'hotzone'
              ? isLight
                ? 'bg-[#fce8e6] border-[#fad2cf] text-[#c5221f]'
                : 'bg-[#ef4444]/10 border-[#ef4444]/30 text-[#ef4444]'
              : isLight
              ? 'bg-[#e6f4ea] border-[#ceead6] text-[#137333]'
              : 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]'
          }`}>
            <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">
              {selectedZone.type === 'hotzone' ? 'warning' : 'task_alt'}
            </span>
            <div className="text-xs leading-snug">
              <span className="font-bold block">
                {selectedZone.type === 'hotzone' ? 'Hazard Directive:' : 'Clean Air Window:'}
              </span>
              <span className={isLight ? 'text-[#3c4043]' : 'text-white/90'}>
                {selectedZone.healthAdvice}
              </span>
              {selectedZone.cleanWindow && (
                <div className={`mt-1 font-semibold ${isLight ? 'text-[#1a73e8]' : 'text-sky-cyan'}`}>
                  🕒 Best Hours: {selectedZone.cleanWindow}
                </div>
              )}
            </div>
          </div>

          {/* Action Row */}
          {onSelectStation && (
            <div className="mt-3 flex items-center justify-end">
              <button
                type="button"
                onClick={() => onSelectStation(selectedZone.name)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                  isLight
                    ? 'text-white bg-[#1a73e8] hover:bg-[#1557b0]'
                    : 'text-[#00344d] bg-sky-cyan hover:bg-[#38bdf8]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">my_location</span>
                <span>Monitor This Specific Node</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
