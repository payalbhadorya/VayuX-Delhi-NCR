import React from 'react';
import { ASSET_IMAGES } from '../data/stations';
import { ScreenType, StationData } from '../types';

interface AQIScreenProps {
  selectedStation: StationData;
  onNavigate: (screen: ScreenType) => void;
  onOpenCam: () => void;
  onOpenQr: () => void;
  onTriggerShare: () => void;
  theme?: 'dark' | 'light';
}

export const AQIScreen: React.FC<AQIScreenProps> = ({
  selectedStation,
  onNavigate,
  onOpenCam,
  onOpenQr,
  onTriggerShare,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

  return (
    <div className={`flex flex-col w-full max-w-md mx-auto space-y-4 pb-28 px-4 pt-3 transition-colors duration-300 ${
      isLight ? 'text-[#1f1f1f]' : 'text-[#dde2f8]'
    }`}>
      {/* Station Selector Bar */}
      <div className={`flex items-center justify-between p-3 rounded-2xl shadow-md border transition-all ${
        isLight
          ? 'bg-white border-[#dadce0] shadow-[0_1px_3px_rgba(60,64,67,0.12)] text-[#1f1f1f]'
          : 'bg-[#191f2f]/80 backdrop-blur-xl border-white/5 text-white'
      }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isLight ? 'bg-amber-50 text-amber-600' : 'bg-[#f59e0b]/15 text-[#f59e0b]'
          }`}>
            <span className="material-symbols-outlined text-[20px]">sensors</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className={`font-headline-sm text-sm sm:text-base font-bold truncate ${
                isLight ? 'text-[#1f1f1f]' : 'text-white'
              }`}>
                {selectedStation.name}
              </span>
              <span
                className="inline-flex w-2 h-2 rounded-full animate-pulse shrink-0"
                style={{ backgroundColor: selectedStation.aqiColor }}
              />
            </div>
            <span className={`text-[11px] truncate ${
              isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'
            }`}>
              Station ID #{selectedStation.id.toUpperCase().slice(0, 5)} • Calibrated 3m ago
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('location')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 shrink-0 cursor-pointer ${
            isLight
              ? 'bg-[#e8f0fe] hover:bg-[#d2e3fc] text-[#0b57d0]'
              : 'bg-[#33394a]/70 hover:bg-[#33394a] text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
          <span>Switch</span>
        </button>
      </div>

      {/* Hero AQI Summary Card */}
      <section className={`relative overflow-hidden rounded-3xl p-5 shadow-xl border transition-all ${
        isLight
          ? 'bg-white border-[#dadce0] shadow-[0_1px_4px_rgba(60,64,67,0.12)] text-[#1f1f1f]'
          : 'bg-[#242a3a]/90 backdrop-blur-2xl border-white/10 text-white'
      }`}>
        {!isLight && (
          <>
            <div
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20"
              style={{ backgroundColor: selectedStation.aqiColor }}
            />
            <div className="absolute -bottom-16 -left-12 w-40 h-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          </>
        )}

        <div className="relative z-10 flex flex-col gap-4">
          {/* Main Metric Row */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className={`text-[10px] uppercase font-bold tracking-wider ${
                isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'
              }`}>
                Live Ambient Metric
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className={`font-display-hero-mobile text-4xl sm:text-5xl tracking-tight font-extrabold ${
                  isLight ? 'text-[#1f1f1f]' : 'text-white'
                }`}>
                  {selectedStation.aqi}
                </span>
                <span className={`text-xs font-semibold ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                  CPCB India
                </span>
              </div>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full w-fit mt-1 text-xs font-bold"
                style={{
                  backgroundColor: `${selectedStation.aqiColor}20`,
                  color: selectedStation.aqiColor
                }}
              >
                <span className="material-symbols-outlined text-[15px]">warning</span>
                <span>{selectedStation.aqiStatus} Air Quality</span>
              </div>
            </div>

            {/* Radial Micro Dial */}
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
                <circle
                  cx="36"
                  cy="36"
                  r="30"
                  fill="transparent"
                  stroke={isLight ? '#f0f4f9' : '#2f3445'}
                  strokeWidth="6"
                />
                <circle
                  cx="36"
                  cy="36"
                  r="30"
                  fill="transparent"
                  stroke={selectedStation.aqiColor}
                  strokeDasharray="188.5"
                  strokeDashoffset={188.5 * (1 - Math.min(selectedStation.aqi / 300, 0.9))}
                  strokeLinecap="round"
                  strokeWidth="6.5"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ color: selectedStation.aqiColor }}
                >
                  air
                </span>
                <span className={`text-[10px] font-bold ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                  Stage 3
                </span>
              </div>
            </div>
          </div>

          {/* Segmented Scale Gradient Bar */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className={`flex justify-between items-center text-[11px] ${
              isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'
            }`}>
              <span>Good (0)</span>
              <span className="font-bold" style={{ color: selectedStation.aqiColor }}>
                {selectedStation.aqi} (Now)
              </span>
              <span>Severe (300+)</span>
            </div>

            <div className={`relative w-full h-2.5 rounded-full overflow-hidden flex p-0.5 ${
              isLight ? 'bg-slate-200' : 'bg-[#2f3445]'
            }`}>
              <div className="h-full w-[17%] bg-aqi-good rounded-l-full" />
              <div className="h-full w-[17%] bg-secondary" />
              <div className="h-full w-[33%] bg-aqi-moderate relative">
                <div className="absolute right-3 -top-0.5 bottom-0.5 w-1.5 bg-white rounded-full shadow-[0_0_8px_#ffffff]" />
              </div>
              <div className="h-full w-[18%] bg-aqi-unhealthy" />
              <div className="h-full w-[15%] bg-aqi-very-unhealthy rounded-r-full" />
            </div>

            <div className={`grid grid-cols-5 text-center text-[10px] pt-0.5 ${
              isLight ? 'text-[#747775]' : 'text-[#bec8d2]'
            }`}>
              <span>0-50</span>
              <span>51-100</span>
              <span className="text-[#f59e0b] font-bold">101-200</span>
              <span>201-300</span>
              <span>301+</span>
            </div>
          </div>

          {/* 24-Hour Trend Graph Card Embedded */}
          <div className={`rounded-2xl p-3.5 flex flex-col gap-2 border transition-colors ${
            isLight ? 'bg-[#f8fafd] border-[#dadce0]' : 'bg-[#151b2b]/80 border-white/5'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={`material-symbols-outlined text-[18px] ${isLight ? 'text-[#0b57d0]' : 'text-primary'}`}>
                  show_chart
                </span>
                <span className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                  24-Hour Trend
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#ef4444] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />
                <span>Peak: 210 (8 AM)</span>
              </div>
            </div>

            {/* Inline SVG Area Chart */}
            <div className="w-full h-28 relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 90">
                <defs>
                  <linearGradient id="aqiAreaGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity={isLight ? 0.35 : 0.45} />
                    <stop offset="60%" stopColor="#F59E0B" stopOpacity={isLight ? 0.08 : 0.1} />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Gridlines */}
                <line x1="0" x2="320" y1="20" y2="20" stroke={isLight ? '#e0e3e7' : '#33394a'} strokeDasharray="3,3" strokeWidth="0.75" />
                <line x1="0" x2="320" y1="50" y2="50" stroke={isLight ? '#e0e3e7' : '#33394a'} strokeDasharray="3,3" strokeWidth="0.75" />
                <line x1="0" x2="320" y1="80" y2="80" stroke={isLight ? '#e0e3e7' : '#33394a'} strokeDasharray="3,3" strokeWidth="0.75" />

                {/* Area Fill */}
                <path
                  d="M 0,65 Q 40,55 80,48 T 140,15 T 190,42 T 250,38 T 320,32 L 320,90 L 0,90 Z"
                  fill="url(#aqiAreaGrad)"
                />

                {/* Trend Line */}
                <path
                  d="M 0,65 Q 40,55 80,48 T 140,15 T 190,42 T 250,38 T 320,32"
                  fill="none"
                  stroke="#F59E0B"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                />

                {/* Peak Point (8 AM = x:140, y:15) */}
                <circle cx="140" cy="15" r="4.5" fill="#EF4444" stroke="#ffffff" strokeWidth="1.5" />

                {/* Current Point (Now = x:316, y:32) */}
                <circle cx="316" cy="32" r="4" fill={isLight ? '#0b57d0' : '#0EA5E9'} stroke="#ffffff" strokeWidth="1.5" />
              </svg>
            </div>

            <div className={`flex justify-between text-[10px] px-1 ${
              isLight ? 'text-[#747775]' : 'text-[#bec8d2]'
            }`}>
              <span>Yesterday 10 AM</span>
              <span className="text-[#ef4444] font-medium">8 AM (Peak)</span>
              <span>12 PM</span>
              <span className={`font-bold ${isLight ? 'text-[#0b57d0]' : 'text-primary'}`}>
                Now ({selectedStation.aqi})
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Hyperlocal Atmospheric Camera Teaser */}
      <div className={`relative overflow-hidden rounded-2xl p-3 flex items-center gap-3 shadow-md border transition-all ${
        isLight ? 'bg-white border-[#dadce0] text-[#1f1f1f]' : 'bg-[#242a3a] border-white/5 text-white'
      }`}>
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative bg-black">
          <img
            alt="Skyline Camera"
            className="w-full h-full object-cover"
            src={ASSET_IMAGES.skylineCam}
          />
          <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <div className={`flex items-center gap-1.5 text-xs font-semibold ${
            isLight ? 'text-[#0b57d0]' : 'text-primary'
          }`}>
            <span className="material-symbols-outlined text-[15px]">videocam</span>
            <span>Skyline Cam DL-04</span>
          </div>
          <span className={`text-sm font-bold truncate ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
            Delhi Gate North Axis
          </span>
          <span className={`text-xs truncate ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
            Visibility: 4.2 km • Haze layer at 350m
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenCam}
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer ${
            isLight
              ? 'bg-[#f0f4f9] hover:bg-[#e2e8f0] text-[#0b57d0]'
              : 'bg-[#33394a] hover:bg-sky-cyan hover:text-[#00344d] text-white'
          }`}
          title="Open Skyline Cam"
        >
          <span className="material-symbols-outlined text-[18px]">open_in_full</span>
        </button>
      </div>

      {/* Pollutant Breakdown (7 Analyzed) */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <span className={`font-headline-md text-base font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
            Pollutant Breakdown
          </span>
          <span className={`text-xs ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
            7 Analyzed
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* PM2.5 (High) */}
          <div className={`rounded-2xl p-3.5 flex flex-col justify-between gap-2 shadow-xs border transition-colors ${
            isLight ? 'bg-white border-[#dadce0]' : 'bg-[#191f2f] border-white/5'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>PM2.5</span>
              <span className="px-2 py-0.5 rounded-full bg-aqi-unhealthy/15 text-aqi-unhealthy text-[10px] font-bold">
                High
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className={`font-telemetry-num text-lg font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                  {selectedStation.pm25}
                </span>
                <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>µg/m³</span>
              </div>
              <span className="text-[10px] text-[#88929b]">Safe limit: ≤ 30</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-[#33394a]'}`}>
              <div className="h-full bg-aqi-unhealthy rounded-full w-[82%]" />
            </div>
          </div>

          {/* PM10 (Moderate) */}
          <div className={`rounded-2xl p-3.5 flex flex-col justify-between gap-2 shadow-xs border transition-colors ${
            isLight ? 'bg-white border-[#dadce0]' : 'bg-[#191f2f] border-white/5'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>PM10</span>
              <span className="px-2 py-0.5 rounded-full bg-aqi-moderate/15 text-aqi-moderate text-[10px] font-bold">
                Moderate
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className={`font-telemetry-num text-lg font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                  {selectedStation.pm10}
                </span>
                <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>µg/m³</span>
              </div>
              <span className="text-[10px] text-[#88929b]">Safe limit: ≤ 60</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-[#33394a]'}`}>
              <div className="h-full bg-aqi-moderate rounded-full w-[65%]" />
            </div>
          </div>

          {/* CO (Good) */}
          <div className={`rounded-2xl p-3.5 flex flex-col justify-between gap-2 shadow-xs border transition-colors ${
            isLight ? 'bg-white border-[#dadce0]' : 'bg-[#191f2f] border-white/5'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>CO (Monoxide)</span>
              <span className="px-2 py-0.5 rounded-full bg-aqi-good/15 text-aqi-good text-[10px] font-bold">
                Good
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className={`font-telemetry-num text-lg font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                  {selectedStation.co}
                </span>
                <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>mg/m³</span>
              </div>
              <span className="text-[10px] text-[#88929b]">Safe limit: ≤ 2.0</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-[#33394a]'}`}>
              <div className="h-full bg-aqi-good rounded-full w-[45%]" />
            </div>
          </div>

          {/* CO2 (Normal) */}
          <div className={`rounded-2xl p-3.5 flex flex-col justify-between gap-2 shadow-xs border transition-colors ${
            isLight ? 'bg-white border-[#dadce0]' : 'bg-[#191f2f] border-white/5'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>CO₂ (Dioxide)</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary/15 text-secondary text-[10px] font-bold">
                Normal
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className={`font-telemetry-num text-lg font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                  {selectedStation.co2}
                </span>
                <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>ppm</span>
              </div>
              <span className="text-[10px] text-[#88929b]">Standard ambient</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-[#33394a]'}`}>
              <div className="h-full bg-secondary rounded-full w-[38%]" />
            </div>
          </div>

          {/* O3 (Good) */}
          <div className={`rounded-2xl p-3.5 flex flex-col justify-between gap-2 shadow-xs border transition-colors ${
            isLight ? 'bg-white border-[#dadce0]' : 'bg-[#191f2f] border-white/5'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>O₃ (Ozone)</span>
              <span className="px-2 py-0.5 rounded-full bg-aqi-good/15 text-aqi-good text-[10px] font-bold">
                Good
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className={`font-telemetry-num text-lg font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                  {selectedStation.o3}
                </span>
                <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>µg/m³</span>
              </div>
              <span className="text-[10px] text-[#88929b]">Safe limit: ≤ 100</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-[#33394a]'}`}>
              <div className="h-full bg-aqi-good rounded-full w-[32%]" />
            </div>
          </div>

          {/* SO2 (Excellent) */}
          <div className={`rounded-2xl p-3.5 flex flex-col justify-between gap-2 shadow-xs border transition-colors ${
            isLight ? 'bg-white border-[#dadce0]' : 'bg-[#191f2f] border-white/5'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>SO₂ (Sulfur)</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-[10px] font-bold">
                Excellent
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className={`font-telemetry-num text-lg font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                  {selectedStation.so2}
                </span>
                <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>µg/m³</span>
              </div>
              <span className="text-[10px] text-[#88929b]">Safe limit: ≤ 40</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-[#33394a]'}`}>
              <div className="h-full bg-secondary rounded-full w-[22%]" />
            </div>
          </div>

          {/* NO2 (Moderate) - 2 cols */}
          <div className={`col-span-2 rounded-2xl p-3.5 flex items-center justify-between shadow-xs border transition-colors ${
            isLight ? 'bg-white border-[#dadce0]' : 'bg-[#191f2f] border-white/5'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isLight ? 'bg-amber-50 text-amber-600' : 'bg-[#f59e0b]/15 text-[#f59e0b]'
              }`}>
                <span className="material-symbols-outlined text-[20px]">bubble_chart</span>
              </div>
              <div className="flex flex-col">
                <span className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                  NO₂ (Nitrogen Dioxide)
                </span>
                <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                  Safe limit: ≤ 80 µg/m³
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-baseline gap-1">
                <span className={`font-telemetry-num text-base font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                  {selectedStation.no2}
                </span>
                <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>µg/m³</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#f59e0b]/15 text-[#f59e0b] text-[10px] font-bold">
                Moderate
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Actionable Health Advisory Section */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <span className={`font-headline-md text-base font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
            Actionable Advisory
          </span>
          <span className="text-xs text-[#f59e0b] font-semibold">Caution advised</span>
        </div>

        <div className="flex flex-col gap-2">
          {/* Advisory 1 */}
          <div className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-colors ${
            isLight ? 'bg-white border-[#dadce0] shadow-xs' : 'bg-[#191f2f] hover:bg-[#242a3a] border-white/5'
          }`}>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              isLight ? 'bg-amber-50 text-amber-600' : 'bg-[#f59e0b]/15 text-[#f59e0b]'
            }`}>
              <span className="material-symbols-outlined text-[22px]">masks</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                Wear an N95 Mask
              </span>
              <span className={`text-[11px] leading-snug ${isLight ? 'text-[#444746]' : 'text-[#bec8d2]'}`}>
                Wear an N95 mask if outdoors for long periods, especially along high-traffic corridors.
              </span>
            </div>
          </div>

          {/* Advisory 2 */}
          <div className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-colors ${
            isLight ? 'bg-white border-[#dadce0] shadow-xs' : 'bg-[#191f2f] hover:bg-[#242a3a] border-white/5'
          }`}>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              isLight ? 'bg-[#e8f0fe] text-[#0b57d0]' : 'bg-primary/15 text-primary'
            }`}>
              <span className="material-symbols-outlined text-[22px]">fitness_center</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                Move Exercise Indoors
              </span>
              <span className={`text-[11px] leading-snug ${isLight ? 'text-[#444746]' : 'text-[#bec8d2]'}`}>
                Prefer indoor activities when air quality is poor; avoid intense outdoor cardio workouts.
              </span>
            </div>
          </div>

          {/* Advisory 3 */}
          <div className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-colors ${
            isLight ? 'bg-white border-[#dadce0] shadow-xs' : 'bg-[#191f2f] hover:bg-[#242a3a] border-white/5'
          }`}>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              isLight ? 'bg-slate-100 text-slate-700' : 'bg-tertiary-container/20 text-[#bec6e0]'
            }`}>
              <span className="material-symbols-outlined text-[22px]">window</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                Keep Windows Shut
              </span>
              <span className={`text-[11px] leading-snug ${isLight ? 'text-[#444746]' : 'text-[#bec8d2]'}`}>
                Close windows to reduce outdoor pollution entering the building; run HEPA air filtration.
              </span>
            </div>
          </div>

          {/* Advisory 4 */}
          <div className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-colors ${
            isLight ? 'bg-white border-[#dadce0] shadow-xs' : 'bg-[#191f2f] hover:bg-[#242a3a] border-white/5'
          }`}>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              isLight ? 'bg-red-50 text-red-600' : 'bg-aqi-unhealthy/15 text-aqi-unhealthy'
            }`}>
              <span className="material-symbols-outlined text-[22px]">elderly</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                Sensitive Groups Alert
              </span>
              <span className={`text-[11px] leading-snug ${isLight ? 'text-[#444746]' : 'text-[#bec8d2]'}`}>
                Individuals with asthma, elderly adults, and young children should strictly limit outdoor exposure.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Hyperlocal Sensor Details & Device Telemetry */}
      <div className={`rounded-2xl p-4 flex items-center justify-between border transition-colors ${
        isLight ? 'bg-[#f0f4f9] border-[#dadce0] text-[#1f1f1f]' : 'bg-[#151b2b] border-white/5 text-white'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isLight ? 'bg-white text-[#0b57d0] shadow-xs' : 'bg-[#33394a] text-primary'
          }`}>
            <span className="material-symbols-outlined text-[20px]">device_thermostat</span>
          </div>
          <div className="flex flex-col">
            <span className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
              Atmospheric Readings
            </span>
            <span className={`text-[11px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
              {selectedStation.temp}°C • {selectedStation.humidity}% Humidity • Wind {selectedStation.windSpeed} km/h {selectedStation.windDir}
            </span>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
          isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-secondary/20 text-secondary'
        }`}>
          Laser PMS
        </span>
      </div>

      {/* Export & Share Report Actions */}
      <div className="flex flex-col gap-2 pt-1 pb-2">
        <button
          type="button"
          onClick={onTriggerShare}
          className={`w-full py-3.5 px-6 rounded-full font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer ${
            isLight
              ? 'bg-[#0b57d0] hover:bg-[#1a73e8] text-white shadow-md'
              : 'bg-primary text-[#00344d] hover:bg-sky-cyan shadow-lg'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">share</span>
          <span>Share Live Air Quality Report</span>
        </button>

        <div className={`flex items-center justify-center gap-4 text-xs pt-1 ${
          isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'
        }`}>
          <button
            type="button"
            onClick={() => alert('Downloaded 24-hour PDF telemetry log for ' + selectedStation.name)}
            className={`flex items-center gap-1 transition-colors cursor-pointer ${
              isLight ? 'hover:text-[#1f1f1f]' : 'hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Download PDF (24h Summary)</span>
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={onOpenQr}
            className={`flex items-center gap-1 transition-colors cursor-pointer ${
              isLight ? 'hover:text-[#1f1f1f]' : 'hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
            <span>Station QR</span>
          </button>
        </div>

        {/* CTA to next screen: Weather */}
        <button
          type="button"
          onClick={() => onNavigate('weather')}
          className={`w-full mt-2 py-3 px-4 rounded-2xl flex items-center justify-between text-xs font-semibold cursor-pointer border transition-all ${
            isLight
              ? 'bg-white hover:bg-[#f0f4f9] text-[#1f1f1f] border-[#dadce0] shadow-xs'
              : 'bg-[#242a3a] hover:bg-[#33394a] text-white border-white/5'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className={`material-symbols-outlined text-[18px] ${isLight ? 'text-[#0b57d0]' : 'text-primary'}`}>
              cloud
            </span>
            <span>View Full Weather Forecast</span>
          </span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
