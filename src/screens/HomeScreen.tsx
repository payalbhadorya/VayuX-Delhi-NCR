import React, { useState } from 'react';
import { ASSET_IMAGES, STATIONS } from '../data/stations';
import { STUBBLE_FIRE_DATA } from '../data/stubbleFireData';
import { ScreenType, StationData } from '../types';
import { SupportedLanguage, getTranslation } from '../utils/i18n';

interface HomeScreenProps {
  selectedStation: StationData;
  onSelectStation: (station: StationData) => void;
  onNavigate: (screen: ScreenType) => void;
  theme?: 'dark' | 'light';
  onOpenFireDetails?: () => void;
  onOpenMap?: () => void;
  language?: SupportedLanguage;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  selectedStation,
  onSelectStation,
  onNavigate,
  theme = 'dark',
  onOpenFireDetails,
  onOpenMap,
  language = 'en'
}) => {
  const isLight = theme === 'light';
  const t = getTranslation(language);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncTimeText, setSyncTimeText] = useState('Updated 4 mins ago • Validated by CPCB');
  const [activeChip, setActiveChip] = useState('central');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncTimeText('Updated just now • Validated by CPCB');
    }, 800);
  };

  const handleChipClick = (chipKey: string, stationId: string) => {
    setActiveChip(chipKey);
    const station = STATIONS.find((s) => s.id === stationId);
    if (station) {
      onSelectStation(station);
    }
  };

  // SVG Gauge calculation: 180 on a 0-500 scale ~ 36%
  const gaugePercent = Math.min(Math.max(selectedStation.aqi / 400, 0.1), 0.95);
  const strokeDashoffset = 251.3 * (1 - gaugePercent);

  return (
    <div className={`flex flex-col w-full max-w-md mx-auto space-y-4 pb-28 px-4 pt-3 transition-colors duration-300 ${
      isLight ? 'text-[#1f1f1f]' : 'text-[#dde2f8]'
    }`}>
      {/* Location & Quick Update Meta */}
      <div className="flex flex-col gap-1 px-0.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={`material-symbols-outlined text-[20px] flex-shrink-0 ${
                isLight ? 'text-[#0b57d0]' : 'text-primary'
              }`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              location_on
            </span>
            <h2 className={`font-headline-sm text-lg font-bold truncate ${
              isLight ? 'text-[#1f1f1f]' : 'text-white'
            }`}>
              {selectedStation.name}, India
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('location')}
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 transition-colors cursor-pointer border ${
                isLight
                  ? 'bg-[#e8f0fe] text-[#0b57d0] hover:bg-[#d2e3fc] border-[#c2e7ff]'
                  : 'bg-[#242a3a] text-primary hover:bg-[#33394a] border-white/5'
              }`}
            >
              Change
            </button>
          </div>

          <button
            type="button"
            onClick={handleSync}
            aria-label="Refresh telemetry"
            className={`w-8 h-8 rounded-full flex items-center justify-center active:scale-95 transition-all cursor-pointer border ${
              isLight
                ? 'bg-[#f0f4f9] hover:bg-[#e2e8f0] text-[#444746] border-[#dadce0]'
                : 'bg-[#191f2f] hover:bg-[#242a3a] text-[#bec8d2] border-white/5'
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${isSyncing ? 'animate-spin text-[#0b57d0]' : ''}`}>
              sync
            </span>
          </button>
        </div>

        <div className={`flex items-center gap-1.5 text-xs pl-0.5 ${
          isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'
        }`}>
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: selectedStation.aqiColor }}
          />
          <span className={isLight ? 'text-[#5f6368]' : 'text-[#bec6e0]'}>{syncTimeText}</span>
        </div>
      </div>

      {/* Sleek Location Search Bar & Filter Chips (Google Search Pill Style) */}
      <div className="flex flex-col gap-2">
        <div className="relative flex items-center w-full">
          <span className={`material-symbols-outlined absolute left-3.5 text-[20px] pointer-events-none ${
            isLight ? 'text-[#5f6368]' : 'text-[#88929b]'
          }`}>
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search locality, sector or sensor ID..."
            className={`w-full h-11 pl-10 pr-11 rounded-full text-xs sm:text-sm focus:outline-none transition-all border ${
              isLight
                ? 'bg-white text-[#1f1f1f] placeholder:text-[#747775] border-[#dadce0] focus:border-[#0b57d0] shadow-[0_1px_6px_rgba(32,33,36,0.18)]'
                : 'bg-[#151b2b] text-white placeholder:text-[#88929b] border-white/5 focus:bg-[#191f2f]'
            }`}
          />
          <button
            type="button"
            onClick={() => onNavigate('location')}
            aria-label="Locate me"
            className={`absolute right-1.5 w-8 h-8 rounded-full flex items-center justify-center active:scale-95 transition-all cursor-pointer ${
              isLight
                ? 'bg-[#e8f0fe] text-[#0b57d0] hover:bg-[#d2e3fc]'
                : 'bg-primary/10 text-primary hover:bg-primary/20'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">my_location</span>
          </button>
        </div>

        {/* Station Selection Filter Chips (Google M3 Chips Style) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => handleChipClick('central', 'connaught-place')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors border ${
              activeChip === 'central'
                ? isLight
                  ? 'bg-[#c2e7ff] text-[#001d35] border-transparent shadow-xs'
                  : 'bg-sky-cyan/20 text-primary border-sky-cyan/40'
                : isLight
                ? 'bg-white text-[#444746] hover:text-[#1f1f1f] border-[#dadce0]'
                : 'bg-[#151b2b] text-[#bec8d2] hover:text-white border-white/5'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-[#001d35]' : 'bg-primary'}`} />
            <span>Central Monitored</span>
          </button>

          <button
            type="button"
            onClick={() => handleChipClick('anand', 'anand-vihar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors border ${
              activeChip === 'anand'
                ? isLight
                  ? 'bg-[#c2e7ff] text-[#001d35] border-transparent shadow-xs'
                  : 'bg-sky-cyan/20 text-primary border-sky-cyan/40'
                : isLight
                ? 'bg-white text-[#444746] hover:text-[#1f1f1f] border-[#dadce0]'
                : 'bg-[#151b2b] text-[#bec8d2] hover:text-white border-white/5'
            }`}
          >
            <span>Anand Vihar</span>
          </button>

          <button
            type="button"
            onClick={() => handleChipClick('lodhi', 'lodhi-road')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors border ${
              activeChip === 'lodhi'
                ? isLight
                  ? 'bg-[#c2e7ff] text-[#001d35] border-transparent shadow-xs'
                  : 'bg-sky-cyan/20 text-primary border-sky-cyan/40'
                : isLight
                ? 'bg-white text-[#444746] hover:text-[#1f1f1f] border-[#dadce0]'
                : 'bg-[#151b2b] text-[#bec8d2] hover:text-white border-white/5'
            }`}
          >
            <span>Lodhi Road</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('location')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer border ${
              isLight
                ? 'bg-white text-[#444746] hover:text-[#1f1f1f] border-[#dadce0]'
                : 'bg-[#151b2b] text-[#bec8d2] hover:text-white border-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">tune</span>
            <span>Sensors</span>
          </button>
        </div>
      </div>

      {/* Hero AQI Meter Card (Google Weather Style in Day Mode) */}
      <div className={`relative overflow-hidden rounded-3xl p-5 shadow-xl border transition-colors duration-300 ${
        isLight ? 'bg-white border-[#dadce0] shadow-[0_1px_3px_0_rgba(60,64,67,0.12),0_1px_2px_0_rgba(60,64,67,0.06)]' : 'bg-[#191f2f] border-white/10'
      }`}>
        {!isLight && (
          <>
            <div
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20"
              style={{ backgroundColor: selectedStation.aqiColor }}
            />
            <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
          </>
        )}

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center justify-between w-full mb-1">
            <span className={`text-[11px] uppercase tracking-wider font-semibold ${
              isLight ? 'text-[#5f6368]' : 'text-[#bec6e0]'
            }`}>
              {t.airQualityIndex}
            </span>
            <span
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{
                backgroundColor: `${selectedStation.aqiColor}20`,
                color: selectedStation.aqiColor
              }}
            >
              <span className="material-symbols-outlined text-[14px]">warning</span>
              <span>{selectedStation.aqiStatus === 'Good' ? t.statusGood : selectedStation.aqiStatus === 'Moderate' ? t.statusModerate : selectedStation.aqiStatus === 'Unhealthy' ? t.statusUnhealthy : selectedStation.aqiStatus}</span>
            </span>
          </div>

          {/* Semi-Circular Vector Radial Gauge */}
          <div className="relative w-56 h-32 flex items-end justify-center my-2">
            <svg className="w-56 h-28 overflow-visible" viewBox="0 0 200 100">
              <defs>
                <linearGradient id="aqiArcTrack" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="35%" stopColor="#F59E0B" />
                  <stop offset="70%" stopColor="#F97316" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
              </defs>

              {/* Background Arc */}
              <path
                d="M 20 90 A 80 80 0 0 1 180 90"
                fill="none"
                stroke={isLight ? '#f0f4f9' : '#242a3a'}
                strokeLinecap="round"
                strokeWidth="12"
              />

              {/* Progress Arc */}
              <path
                d="M 20 90 A 80 80 0 0 1 180 90"
                fill="none"
                stroke="url(#aqiArcTrack)"
                strokeDasharray="251.3"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                strokeWidth="12"
                className="transition-all duration-700 ease-out"
              />

              {/* Needle marker */}
              <circle
                cx={20 + 160 * gaugePercent}
                cy={90 - 70 * Math.sin(Math.PI * gaugePercent)}
                r="5"
                fill={selectedStation.aqiColor}
                stroke={isLight ? '#ffffff' : '#0d1322'}
                strokeWidth="2"
              />
            </svg>

            {/* Metric Display Centered in Gauge sweep */}
            <div className="absolute bottom-0 flex flex-col items-center leading-none">
              <span className={`font-display-hero-mobile text-4xl sm:text-5xl font-extrabold tracking-tight ${
                isLight ? 'text-[#1f1f1f]' : 'text-white'
              }`}>
                {selectedStation.aqi}
              </span>
              <span className={`text-[11px] mt-1 font-medium ${
                isLight ? 'text-[#5f6368]' : 'text-[#bec6e0]'
              }`}>
                AQI • US Standard
              </span>
            </div>
          </div>

          <p className={`text-xs sm:text-sm max-w-xs mt-2 ${
            isLight ? 'text-[#444746]' : 'text-[#bec8d2]'
          }`}>
            Air quality is acceptable; however, sensitive groups may experience mild respiratory irritation.
          </p>

          {/* Range indicator pill strip */}
          <div className={`w-full grid grid-cols-4 gap-1.5 mt-4 pt-3 rounded-2xl p-2 border ${
            isLight ? 'bg-[#f8fafd] border-[#dadce0]' : 'bg-[#151b2b]/70 border-white/5'
          }`}>
            <div className="flex flex-col items-center">
              <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec6e0]'}`}>0-50</span>
              <span className="w-full h-1 rounded-full bg-aqi-good mt-1 opacity-40" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-[#f59e0b] font-bold">51-200</span>
              <span className="w-full h-1 rounded-full bg-[#f59e0b] mt-1" />
            </div>
            <div className="flex flex-col items-center">
              <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec6e0]'}`}>201-300</span>
              <span className="w-full h-1 rounded-full bg-aqi-unhealthy-sensitive mt-1 opacity-40" />
            </div>
            <div className="flex flex-col items-center">
              <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec6e0]'}`}>300+</span>
              <span className="w-full h-1 rounded-full bg-aqi-unhealthy mt-1 opacity-40" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Weather Ribbon (4 Uniform Symmetric Cards) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className={`font-headline-sm text-sm font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
            Local Atmosphere
          </span>
          <button
            type="button"
            onClick={() => onNavigate('weather')}
            className={`text-[11px] font-semibold hover:underline cursor-pointer ${
              isLight ? 'text-[#0b57d0]' : 'text-sky-cyan'
            }`}
          >
            Live Microclimate →
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Temperature */}
          <div className={`flex flex-col items-center justify-center p-2.5 rounded-2xl text-center border h-20 ${
            isLight ? 'bg-white border-[#dadce0] shadow-xs' : 'bg-[#191f2f] border-white/5'
          }`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
              isLight ? 'bg-amber-100 text-amber-700' : 'bg-primary/15 text-primary'
            }`}>
              <span className="material-symbols-outlined text-[16px]">partly_cloudy_day</span>
            </div>
            <span className={`font-telemetry-num text-sm font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
              {selectedStation.temp}°C
            </span>
            <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec6e0]'}`}>Cloudy</span>
          </div>

          {/* Humidity */}
          <div className={`flex flex-col items-center justify-center p-2.5 rounded-2xl text-center border h-20 ${
            isLight ? 'bg-white border-[#dadce0] shadow-xs' : 'bg-[#191f2f] border-white/5'
          }`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
              isLight ? 'bg-[#e8f0fe] text-[#0b57d0]' : 'bg-sky-cyan/15 text-sky-cyan'
            }`}>
              <span className="material-symbols-outlined text-[16px]">humidity_percentage</span>
            </div>
            <span className={`font-telemetry-num text-sm font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
              {selectedStation.humidity}%
            </span>
            <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec6e0]'}`}>Humidity</span>
          </div>

          {/* Wind Speed */}
          <div className={`flex flex-col items-center justify-center p-2.5 rounded-2xl text-center border h-20 ${
            isLight ? 'bg-white border-[#dadce0] shadow-xs' : 'bg-[#191f2f] border-white/5'
          }`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
              isLight ? 'bg-emerald-100 text-[#137333]' : 'bg-secondary/15 text-secondary'
            }`}>
              <span className="material-symbols-outlined text-[16px]">air</span>
            </div>
            <span className={`font-telemetry-num text-sm font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
              {selectedStation.windSpeed}
            </span>
            <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec6e0]'}`}>km/h {selectedStation.windDir}</span>
          </div>

          {/* UV Index */}
          <div className={`flex flex-col items-center justify-center p-2.5 rounded-2xl text-center border h-20 ${
            isLight ? 'bg-white border-[#dadce0] shadow-xs' : 'bg-[#191f2f] border-white/5'
          }`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
              isLight ? 'bg-amber-100 text-amber-700' : 'bg-[#f59e0b]/15 text-[#f59e0b]'
            }`}>
              <span className="material-symbols-outlined text-[16px]">wb_sunny</span>
            </div>
            <span className={`font-telemetry-num text-sm font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
              {selectedStation.uvIndex}
            </span>
            <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec6e0]'}`}>Moderate</span>
          </div>
        </div>
      </div>

      {/* 72-Hour AQI Trend Forecast (Symmetric & Uniform) */}
      <div className={`flex flex-col gap-2 rounded-3xl p-4 shadow-md border ${
        isLight ? 'bg-white border-[#dadce0] shadow-xs' : 'bg-[#191f2f] border-white/10'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className={`material-symbols-outlined text-[18px] ${isLight ? 'text-[#0b57d0]' : 'text-primary'}`}>
              trending_up
            </span>
            <h3 className={`font-headline-sm text-sm font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
              72-Hour AQI Trend
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('prediction')}
            className={`text-[11px] flex items-center gap-0.5 font-semibold hover:underline cursor-pointer ${
              isLight ? 'text-[#137333]' : 'text-secondary'
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">south_east</span>
            <span>Improving</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-1">
          {selectedStation.forecast72h.map((dayItem, idx) => (
            <div
              key={idx}
              className={`flex flex-col p-2.5 rounded-2xl relative overflow-hidden border ${
                idx === 0
                  ? isLight
                    ? 'bg-[#e8f0fe] border-[#c2e7ff]'
                    : 'bg-[#242a3a] border-white/10'
                  : isLight
                  ? 'bg-[#f8fafd] border-[#dadce0]'
                  : 'bg-[#151b2b] border-white/5'
              }`}
            >
              <div
                className="w-1 h-full absolute left-0 top-0"
                style={{
                  backgroundColor:
                    idx === 0 ? '#F59E0B' : idx === 1 ? '#F59E0B' : '#4edea3'
                }}
              />
              <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec6e0]'}`}>
                {dayItem.day}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className={`font-headline-md text-lg font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                  {dayItem.aqi}
                </span>
              </div>
              <span
                className="text-[10px] font-semibold"
                style={{
                  color: idx === 2 ? (isLight ? '#137333' : '#10b981') : '#f59e0b'
                }}
              >
                {dayItem.status}
              </span>
              <div className={`w-full rounded-full h-1.5 mt-2 ${isLight ? 'bg-slate-200' : 'bg-[#2f3445]'}`}>
                <div
                  className="h-1.5 rounded-full"
                  style={{
                    backgroundColor: idx === 2 ? '#10b981' : '#f59e0b',
                    width: `${Math.min((dayItem.aqi / 250) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Pollutant Information Grid (2x2 Symmetric Tiles) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className={`font-headline-sm text-sm font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
            Key Pollutants
          </span>
          <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec6e0]'}`}>
            µg/m³ &amp; ppb
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* PM2.5 Card */}
          <div className={`flex flex-col justify-between p-3.5 rounded-2xl relative border ${
            isLight ? 'bg-white border-[#dadce0] shadow-xs' : 'bg-[#191f2f] border-white/5'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>PM2.5</span>
              <span className="px-2 py-0.5 rounded-full bg-aqi-unhealthy-sensitive/20 text-aqi-unhealthy-sensitive text-[10px] font-bold">
                Sensitive
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`font-telemetry-num text-xl font-extrabold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                {selectedStation.pm25}
              </span>
              <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec6e0]'}`}>µg/m³</span>
            </div>
            <div className={`flex items-center gap-1.5 mt-2 text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-aqi-unhealthy-sensitive" />
              <span>Dominant pollutant</span>
            </div>
          </div>

          {/* PM10 Card */}
          <div className={`flex flex-col justify-between p-3.5 rounded-2xl relative border ${
            isLight ? 'bg-white border-[#dadce0] shadow-xs' : 'bg-[#191f2f] border-white/5'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>PM10</span>
              <span className="px-2 py-0.5 rounded-full bg-[#f59e0b]/20 text-[#f59e0b] text-[10px] font-bold">
                Moderate
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`font-telemetry-num text-xl font-extrabold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                {selectedStation.pm10}
              </span>
              <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec6e0]'}`}>µg/m³</span>
            </div>
            <div className={`flex items-center gap-1.5 mt-2 text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
              <span>Coarse dust particles</span>
            </div>
          </div>

          {/* NO2 Card */}
          <div className={`flex flex-col justify-between p-3.5 rounded-2xl relative border ${
            isLight ? 'bg-white border-[#dadce0] shadow-xs' : 'bg-[#191f2f] border-white/5'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>NO₂</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isLight ? 'bg-emerald-100 text-[#137333]' : 'bg-aqi-good/20 text-aqi-good'
              }`}>
                Good
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`font-telemetry-num text-xl font-extrabold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                {selectedStation.no2}
              </span>
              <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec6e0]'}`}>ppb</span>
            </div>
            <div className={`flex items-center gap-1.5 mt-2 text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-[#137333]' : 'bg-aqi-good'}`} />
              <span>Traffic exhaust index</span>
            </div>
          </div>

          {/* O3 Card */}
          <div className={`flex flex-col justify-between p-3.5 rounded-2xl relative border ${
            isLight ? 'bg-white border-[#dadce0] shadow-xs' : 'bg-[#191f2f] border-white/5'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>O₃</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isLight ? 'bg-emerald-100 text-[#137333]' : 'bg-aqi-good/20 text-aqi-good'
              }`}>
                Good
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`font-telemetry-num text-xl font-extrabold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                {selectedStation.o3}
              </span>
              <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec6e0]'}`}>ppb</span>
            </div>
            <div className={`flex items-center gap-1.5 mt-2 text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-[#137333]' : 'bg-aqi-good'}`} />
              <span>Ground-level ozone</span>
            </div>
          </div>
        </div>
      </div>

      {/* Health Guidance Card (Google Assistant Style) */}
      <div className={`flex flex-col p-4 rounded-3xl gap-3 shadow-md border ${
        isLight ? 'bg-white border-[#dadce0] shadow-xs' : 'bg-[#191f2f] border-white/10'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isLight ? 'bg-amber-100 text-amber-700' : 'bg-[#f59e0b]/20 text-[#f59e0b]'
            }`}>
              <span className="material-symbols-outlined text-[15px]">health_and_safety</span>
            </div>
            <h3 className={`font-headline-sm text-sm font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
              {t.hyperlocalAdvisory}
            </h3>
          </div>
          <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec6e0]'}`}>Active Advice</span>
        </div>

        <div className="flex flex-col gap-2">
          <div className={`flex items-center gap-3 p-2.5 rounded-2xl border ${
            isLight ? 'bg-[#f8fafd] border-[#dadce0]' : 'bg-[#151b2b] border-white/5'
          }`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
              isLight ? 'bg-[#e8f0fe] text-[#0b57d0]' : 'bg-[#33394a] text-primary'
            }`}>
              <span className="material-symbols-outlined text-[19px]">masks</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                {t.maskRecommended}
              </span>
              <span className={`text-[11px] truncate ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                {t.maskDesc}
              </span>
            </div>
          </div>

          <div className={`flex items-center gap-3 p-2.5 rounded-2xl border ${
            isLight ? 'bg-[#f8fafd] border-[#dadce0]' : 'bg-[#151b2b] border-white/5'
          }`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
              isLight ? 'bg-amber-100 text-amber-700' : 'bg-[#33394a] text-[#f59e0b]'
            }`}>
              <span className="material-symbols-outlined text-[19px]">window</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                {t.exerciseCaution}
              </span>
              <span className={`text-[11px] truncate ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                {t.exerciseDesc}
              </span>
            </div>
          </div>

          <div className={`flex items-center gap-3 p-2.5 rounded-2xl border ${
            isLight ? 'bg-[#f8fafd] border-[#dadce0]' : 'bg-[#151b2b] border-white/5'
          }`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
              isLight ? 'bg-emerald-100 text-[#137333]' : 'bg-[#33394a] text-secondary'
            }`}>
              <span className="material-symbols-outlined text-[19px]">mode_fan</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                {t.purifierRecommended}
              </span>
              <span className={`text-[11px] truncate ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                {t.purifierDesc}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Atmospheric Context Image */}
      <div className={`relative overflow-hidden rounded-3xl shadow-md border ${
        isLight ? 'bg-white border-[#dadce0]' : 'bg-[#191f2f] border-white/10'
      }`}>
        <div
          className="w-full h-36 bg-cover bg-center"
          style={{ backgroundImage: `url('${ASSET_IMAGES.aerialSkyline}')` }}
        >
          <div className="w-full h-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col justify-end">
            <span className="text-[10px] text-sky-cyan uppercase font-extrabold tracking-wider">
              Hyperlocal Satellite Observation
            </span>
            <span className="font-headline-sm text-sm font-bold text-white">
              Central Delhi Haze Index: Moderate
            </span>
          </div>
        </div>
      </div>

      {/* SATELLITE OBSERVATION: NASA FIRMS (SUBTLE / CLEAN SCIENTIFIC TELEMETRY AT BOTTOM) */}
      <div className={`p-4 rounded-3xl border transition-all duration-200 ${
        isLight
          ? 'bg-white border-[#dadce0] shadow-[0_1px_3px_rgba(60,64,67,0.08)] text-[#1f1f1f]'
          : 'bg-[#151b2b] border-white/10 text-[#dde2f8]'
      }`}>
        <div className={`flex items-center justify-between pb-2 border-b ${
          isLight ? 'border-slate-100' : 'border-white/5'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isLight ? 'bg-[#f0f4f9] text-[#444746]' : 'bg-white/5 text-[#bec8d2]'
            }`}>
              <span className="material-symbols-outlined text-[18px]">satellite_alt</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  isLight ? 'text-[#5f6368]' : 'text-[#88929b]'
                }`}>
                  {t.satelliteFirms}
                </span>
                <span className={`text-[10px] ${isLight ? 'text-[#747775]' : 'text-[#88929b]'}`}>
                  · VIIRS 375m
                </span>
              </div>
              <h3 className={`text-xs sm:text-sm font-semibold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                {t.thermalAnomalies}
              </h3>
            </div>
          </div>

          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
            isLight
              ? 'bg-[#f1f3f4] text-[#3c4043] border-[#dadce0]'
              : 'bg-white/5 text-[#bec8d2] border-white/10'
          }`}>
            1,428 Detected
          </span>
        </div>

        {/* 3-Part Metric Ribbon - Subtle & Non-Colorful */}
        <div className="grid grid-cols-3 gap-2 pt-2.5">
          <div className={`p-2.5 rounded-2xl text-center border ${
            isLight ? 'bg-[#f8fafd] border-[#dadce0]' : 'bg-[#191f2f] border-white/5'
          }`}>
            <span className={`text-[10px] block ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
              {t.activeHotspots}
            </span>
            <span className={`font-telemetry-num text-sm sm:text-base font-bold block mt-0.5 ${
              isLight ? 'text-[#1f1f1f]' : 'text-white'
            }`}>
              1,428
            </span>
            <span className={`text-[9px] ${isLight ? 'text-[#747775]' : 'text-[#88929b]'}`}>
              Active Nodes
            </span>
          </div>

          <div className={`p-2.5 rounded-2xl text-center border ${
            isLight ? 'bg-[#f8fafd] border-[#dadce0]' : 'bg-[#191f2f] border-white/5'
          }`}>
            <span className={`text-[10px] block ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
              {t.aqiImpact}
            </span>
            <span className={`font-telemetry-num text-sm sm:text-base font-bold block mt-0.5 ${
              isLight ? 'text-[#1f1f1f]' : 'text-white'
            }`}>
              +68 AQI
            </span>
            <span className={`text-[9px] ${isLight ? 'text-[#747775]' : 'text-[#88929b]'}`}>
              Regional Plume
            </span>
          </div>

          <div className={`p-2.5 rounded-2xl text-center border ${
            isLight ? 'bg-[#f8fafd] border-[#dadce0]' : 'bg-[#191f2f] border-white/5'
          }`}>
            <span className={`text-[10px] block ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
              {t.plumeDrift}
            </span>
            <span className={`font-telemetry-num text-sm sm:text-base font-bold block mt-0.5 ${
              isLight ? 'text-[#1f1f1f]' : 'text-white'
            }`}>
              14 km/h
            </span>
            <span className={`text-[9px] ${isLight ? 'text-[#747775]' : 'text-[#88929b]'}`}>
              NW to SE
            </span>
          </div>
        </div>

        <p className={`text-xs leading-relaxed pt-2 ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
          {t.satelliteDesc}
        </p>

        {/* Clean, Non-Colorful Action Buttons */}
        <div className="flex items-center gap-2 pt-1.5">
          <button
            type="button"
            onClick={onOpenFireDetails}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              isLight
                ? 'bg-[#f8fafd] hover:bg-[#f0f4f9] text-[#1f1f1f] border-[#dadce0]'
                : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">insights</span>
            <span>{t.viewThermalData}</span>
          </button>

          <button
            type="button"
            onClick={onOpenMap || (() => onNavigate('prediction'))}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              isLight
                ? 'bg-[#f8fafd] hover:bg-[#f0f4f9] text-[#1f1f1f] border-[#dadce0]'
                : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">map</span>
            <span>{t.mapHotzones}</span>
          </button>
        </div>
      </div>

      {/* Deep Dive Action Cards */}
      <div className="flex flex-col gap-2 pt-1 pb-2">
        <button
          type="button"
          onClick={() => onNavigate('aqi')}
          className={`w-full py-3.5 px-4 rounded-2xl flex items-center justify-between active:scale-[0.99] transition-all cursor-pointer border ${
            isLight
              ? 'bg-white hover:bg-[#f0f4f9] text-[#1f1f1f] border-[#dadce0] shadow-xs'
              : 'bg-[#242a3a] hover:bg-[#33394a] text-white border-white/5'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isLight ? 'bg-[#e8f0fe] text-[#0b57d0]' : 'bg-primary/15 text-primary'
            }`}>
              <span className="material-symbols-outlined text-[18px]">query_stats</span>
            </div>
            <div className="flex flex-col text-left">
              <span className={`text-xs sm:text-sm font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                {t.exploreDetailedAQI}
              </span>
              <span className={`text-[11px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec6e0]'}`}>
                PM2.5, PM10, NO₂, CO &amp; SO₂
              </span>
            </div>
          </div>
          <span className={`material-symbols-outlined text-[18px] ${isLight ? 'text-[#747775]' : 'text-[#bec6e0]'}`}>
            arrow_forward_ios
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('weather')}
          className={`w-full py-3.5 px-4 rounded-2xl flex items-center justify-between active:scale-[0.99] transition-all cursor-pointer border ${
            isLight
              ? 'bg-white hover:bg-[#f0f4f9] text-[#1f1f1f] border-[#dadce0] shadow-xs'
              : 'bg-[#242a3a] hover:bg-[#33394a] text-white border-white/5'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isLight ? 'bg-emerald-100 text-[#137333]' : 'bg-secondary/15 text-secondary'
            }`}>
              <span className="material-symbols-outlined text-[18px]">radar</span>
            </div>
            <div className="flex flex-col text-left">
              <span className={`text-xs sm:text-sm font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                {t.checkWeatherAlerts}
              </span>
              <span className={`text-[11px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec6e0]'}`}>
                {t.weatherDesc}
              </span>
            </div>
          </div>
          <span className={`material-symbols-outlined text-[18px] ${isLight ? 'text-[#747775]' : 'text-[#bec6e0]'}`}>
            arrow_forward_ios
          </span>
        </button>
      </div>
    </div>
  );
};

