import React from 'react';
import { ScreenType, StationData } from '../types';

interface WeatherScreenProps {
  selectedStation: StationData;
  onNavigate: (screen: ScreenType) => void;
  onOpenAlarm: () => void;
  onShare: () => void;
  theme?: 'dark' | 'light';
}

export const WeatherScreen: React.FC<WeatherScreenProps> = ({
  selectedStation,
  onNavigate,
  onOpenAlarm,
  onShare,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

  const hourlyData = [
    { time: 'Now', temp: 28, icon: 'wb_sunny', wind: '14k', aqi: 148, aqiColor: '#f59e0b' },
    { time: '4 PM', temp: 28, icon: 'partly_cloudy_day', wind: '13k', aqi: 152, aqiColor: '#f59e0b' },
    { time: '5 PM', temp: 27, icon: 'cloud', wind: '11k', aqi: 158, aqiColor: '#f59e0b' },
    { time: '6 PM', temp: 25, icon: 'wb_twilight', wind: 'Sunset 6:18', aqi: 165, aqiColor: '#ef4444' },
    { time: '7 PM', temp: 24, icon: 'nights_stay', wind: '10k', aqi: 170, aqiColor: '#ef4444' },
    { time: '8 PM', temp: 23, icon: 'clear_night', wind: '8k', aqi: 175, aqiColor: '#ef4444' }
  ];

  const weekData = [
    { day: 'Today', icon: 'wb_sunny', precip: '0%', min: 22, max: 33, aqi: 148, aqiColor: '#f59e0b' },
    { day: 'Fri', icon: 'wb_sunny', precip: '0%', min: 23, max: 34, aqi: 168, aqiColor: '#f59e0b' },
    { day: 'Sat', icon: 'cloud', precip: '10%', min: 21, max: 31, aqi: 135, aqiColor: '#f59e0b' },
    { day: 'Sun', icon: 'rainy', precip: '45%', min: 19, max: 28, aqi: 78, aqiColor: '#10b981' },
    { day: 'Mon', icon: 'air', precip: '15%', min: 18, max: 27, aqi: 65, aqiColor: '#10b981' },
    { day: 'Tue', icon: 'wb_sunny', precip: '5%', min: 20, max: 30, aqi: 112, aqiColor: '#f59e0b' },
    { day: 'Wed', icon: 'wb_sunny', precip: '0%', min: 21, max: 32, aqi: 128, aqiColor: '#f59e0b' }
  ];

  return (
    <div className={`flex flex-col w-full max-w-md mx-auto space-y-4 pb-28 px-4 pt-3 transition-colors duration-300 ${
      isLight ? 'text-[#1f1f1f]' : 'text-[#dde2f8]'
    }`}>
      {/* Top Location Bar */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('location')}
            className="flex items-center gap-1.5 text-left group cursor-pointer"
          >
            <span
              className={`material-symbols-outlined text-[20px] ${isLight ? 'text-[#0b57d0]' : 'text-primary'}`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              location_on
            </span>
            <span className={`font-headline-sm text-lg font-bold transition-colors ${
              isLight ? 'text-[#1f1f1f] group-hover:text-[#0b57d0]' : 'text-white group-hover:text-primary'
            }`}>
              {selectedStation.name}, India
            </span>
            <span className={`material-symbols-outlined text-[16px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
              keyboard_arrow_down
            </span>
          </button>

          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
            isLight ? 'bg-emerald-50 text-[#137333] border border-emerald-200' : 'bg-secondary/15 text-secondary'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isLight ? 'bg-[#137333]' : 'bg-secondary'}`} />
            Live Sensors
          </span>
        </div>

        <p className={`text-xs pl-6 ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
          Thursday, 3:30 PM • Hyperlocal Station ({selectedStation.subName.split('·')[0].trim()})
        </p>
      </div>

      {/* Hero Temperature Card */}
      <div className={`relative overflow-hidden rounded-3xl p-5 shadow-xl border transition-all ${
        isLight
          ? 'bg-white border-[#dadce0] shadow-[0_1px_4px_rgba(60,64,67,0.12)] text-[#1f1f1f]'
          : 'bg-[#191f2f] border-white/10 text-white'
      }`}>
        {!isLight && (
          <>
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#f59e0b]/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-sky-cyan/10 blur-2xl pointer-events-none" />
          </>
        )}

        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className={`font-display-hero-mobile text-5xl font-extrabold tracking-tight ${
                  isLight ? 'text-[#1f1f1f]' : 'text-white'
                }`}>
                  {selectedStation.temp}°<span className={`text-3xl font-medium ${
                    isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'
                  }`}>C</span>
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                Feels like <strong className={isLight ? 'text-[#1f1f1f]' : 'text-white'}>{selectedStation.feelsLike}°C</strong> • H: 33° | L: 22°
              </p>
            </div>

            {/* Weather Art Graphic */}
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-[#f9ab00]">
                  partly_cloudy_day
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isLight ? 'bg-amber-100 text-amber-800' : 'bg-[#f59e0b]/20 text-[#f59e0b]'
              }`}>
                Hazy
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className={`flex items-center gap-1.5 font-bold text-sm ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
              <span className="material-symbols-outlined text-[18px] text-[#f9ab00]">wb_sunny</span>
              <span>Partly Cloudy &amp; Hazy Sunshine</span>
            </div>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
              {selectedStation.weatherDesc}
            </p>
          </div>

          {/* Quick Sub-Metric Badges */}
          <div className={`grid grid-cols-3 gap-2 pt-2 border-t ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
            <div className={`flex flex-col p-2 rounded-2xl text-center border ${
              isLight ? 'bg-[#f8fafd] border-[#dadce0]' : 'bg-[#151b2b] border-white/5'
            }`}>
              <span className={`text-[10px] flex items-center justify-center gap-1 ${
                isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'
              }`}>
                <span className="material-symbols-outlined text-[13px] text-[#f9ab00]">air</span>
                AQI Impact
              </span>
              <span className="text-sm font-bold text-[#f9ab00] mt-0.5">
                {selectedStation.aqi} <span className="text-[10px] font-normal">Mod</span>
              </span>
            </div>

            <div className={`flex flex-col p-2 rounded-2xl text-center border ${
              isLight ? 'bg-[#f8fafd] border-[#dadce0]' : 'bg-[#151b2b] border-white/5'
            }`}>
              <span className={`text-[10px] flex items-center justify-center gap-1 ${
                isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'
              }`}>
                <span className={`material-symbols-outlined text-[13px] ${isLight ? 'text-[#0b57d0]' : 'text-sky-cyan'}`}>
                  water_drop
                </span>
                Precip
              </span>
              <span className={`text-sm font-bold mt-0.5 ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                0% <span className={`text-[10px] font-normal ${isLight ? 'text-[#747775]' : 'text-[#88929b]'}`}>Dry</span>
              </span>
            </div>

            <div className={`flex flex-col p-2 rounded-2xl text-center border ${
              isLight ? 'bg-[#f8fafd] border-[#dadce0]' : 'bg-[#151b2b] border-white/5'
            }`}>
              <span className={`text-[10px] flex items-center justify-center gap-1 ${
                isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'
              }`}>
                <span className="material-symbols-outlined text-[13px] text-[#f9ab00]">wb_twilight</span>
                Sunset
              </span>
              <span className={`text-sm font-bold mt-0.5 ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                6:18 PM
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Atmospheric Correlation Banner */}
      <div className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-colors ${
        isLight
          ? 'bg-[#e8f0fe] border-[#c2e7ff] text-[#001d35]'
          : 'bg-[#191f2f] border-white/10 text-[#bec8d2]'
      }`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
          isLight ? 'bg-[#c2e7ff] text-[#0b57d0]' : 'bg-sky-cyan/20 text-sky-cyan'
        }`}>
          <span className="material-symbols-outlined text-[18px]">cell_tower</span>
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] uppercase font-bold tracking-wider ${
              isLight ? 'text-[#0b57d0]' : 'text-sky-cyan'
            }`}>
              Atmospheric Correlation
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#f9ab00]" />
          </div>
          <p className={`text-xs mt-0.5 leading-snug ${isLight ? 'text-[#001d35]' : 'text-[#bec8d2]'}`}>
            Stagnant wind conditions expected tonight, which may cause AQI to increase slightly.
            Consider indoor ventilation before 7 PM.
          </p>
        </div>
      </div>

      {/* Hourly Timeline */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className={`material-symbols-outlined text-[18px] ${isLight ? 'text-[#0b57d0]' : 'text-primary'}`}>
              schedule
            </span>
            <span className={`font-headline-sm text-sm font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
              Hourly Timeline
            </span>
          </div>
          <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
            24-hour cycle
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {hourlyData.map((hour, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center justify-between p-3 rounded-2xl min-w-[76px] text-center border shrink-0 transition-all ${
                idx === 0
                  ? isLight
                    ? 'bg-[#e8f0fe] border-[#0b57d0] shadow-xs'
                    : 'bg-[#242a3a] border-sky-cyan/40 shadow-md'
                  : isLight
                  ? 'bg-white border-[#dadce0] shadow-xs'
                  : 'bg-[#191f2f] border-white/5'
              }`}
            >
              <span className={`text-[11px] font-semibold ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                {hour.time}
              </span>
              <span className="material-symbols-outlined text-2xl text-[#f9ab00] my-2">
                {hour.icon}
              </span>
              <span className={`text-sm font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                {hour.temp}°
              </span>
              <span className={`text-[10px] mt-1 ${isLight ? 'text-[#747775]' : 'text-[#88929b]'}`}>
                {hour.wind}
              </span>
              <span
                className="mt-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold"
                style={{ backgroundColor: `${hour.aqiColor}20`, color: hour.aqiColor }}
              >
                {hour.aqi}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Atmospheric Details Grid (6 Cards) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className={`font-headline-sm text-sm font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
            Atmospheric Details
          </span>
          <span className={`text-[10px] font-semibold ${isLight ? 'text-[#137333]' : 'text-secondary'}`}>
            Hyperlocal Calibrated
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Humidity */}
          <div className={`p-3.5 rounded-2xl border flex flex-col justify-between shadow-xs transition-colors ${
            isLight ? 'bg-white border-[#dadce0]' : 'bg-[#191f2f] border-white/5'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs flex items-center gap-1 ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                <span className={`material-symbols-outlined text-[15px] ${isLight ? 'text-[#0b57d0]' : 'text-sky-cyan'}`}>
                  water_drop
                </span>
                Humidity
              </span>
              <span className={`w-2 h-2 rounded-full ${isLight ? 'bg-[#0b57d0]' : 'bg-sky-cyan'}`} />
            </div>
            <div className="my-2">
              <span className={`font-telemetry-num text-2xl font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                {selectedStation.humidity}%
              </span>
              <p className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                Dew point {selectedStation.dewPoint}°C
              </p>
            </div>
            <div className={`w-full h-1 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-[#33394a]'}`}>
              <div
                className={`h-full rounded-full ${isLight ? 'bg-[#0b57d0]' : 'bg-sky-cyan'}`}
                style={{ width: `${selectedStation.humidity}%` }}
              />
            </div>
          </div>

          {/* Air Pressure */}
          <div className={`p-3.5 rounded-2xl border flex flex-col justify-between shadow-xs transition-colors ${
            isLight ? 'bg-white border-[#dadce0]' : 'bg-[#191f2f] border-white/5'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs flex items-center gap-1 ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                <span className={`material-symbols-outlined text-[15px] ${isLight ? 'text-[#137333]' : 'text-secondary'}`}>
                  compress
                </span>
                Air Pressure
              </span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                isLight ? 'bg-emerald-50 text-[#137333]' : 'bg-secondary/15 text-secondary'
              }`}>
                Steady
              </span>
            </div>
            <div className="my-2">
              <span className={`font-telemetry-num text-2xl font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                {selectedStation.pressure}
              </span>
              <p className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                hPa • Normal barometric
              </p>
            </div>
            <div className={`w-full h-1 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-[#33394a]'}`}>
              <div className={`h-full rounded-full w-[65%] ${isLight ? 'bg-[#137333]' : 'bg-secondary'}`} />
            </div>
          </div>

          {/* Visibility */}
          <div className={`p-3.5 rounded-2xl border flex flex-col justify-between shadow-xs transition-colors ${
            isLight ? 'bg-white border-[#dadce0]' : 'bg-[#191f2f] border-white/5'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs flex items-center gap-1 ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                <span className="material-symbols-outlined text-[15px] text-[#f9ab00]">visibility</span>
                Visibility
              </span>
              <span className="w-2 h-2 rounded-full bg-[#f9ab00]" />
            </div>
            <div className="my-2">
              <span className={`font-telemetry-num text-2xl font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                {selectedStation.visibility}
              </span>
              <p className="text-[10px] text-[#e37400]">km • Reduced due to haze</p>
            </div>
            <div className={`w-full h-1 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-[#33394a]'}`}>
              <div className="h-full bg-[#f9ab00] rounded-full w-[45%]" />
            </div>
          </div>

          {/* Wind & Gusts */}
          <div className={`p-3.5 rounded-2xl border flex flex-col justify-between shadow-xs transition-colors ${
            isLight ? 'bg-white border-[#dadce0]' : 'bg-[#191f2f] border-white/5'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs flex items-center gap-1 ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                <span className={`material-symbols-outlined text-[15px] ${isLight ? 'text-[#0b57d0]' : 'text-primary'}`}>
                  air
                </span>
                Wind &amp; Gusts
              </span>
              <span className={`text-[10px] font-bold ${isLight ? 'text-[#0b57d0]' : 'text-primary'}`}>
                {selectedStation.windDir}
              </span>
            </div>
            <div className="my-2">
              <span className={`font-telemetry-num text-2xl font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                {selectedStation.windSpeed}
              </span>
              <p className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                km/h • Gusts up to 22 km/h
              </p>
            </div>
            <div className={`w-full h-1 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-[#33394a]'}`}>
              <div className={`h-full rounded-full w-[40%] ${isLight ? 'bg-[#0b57d0]' : 'bg-primary'}`} />
            </div>
          </div>

          {/* UV Index */}
          <div className={`p-3.5 rounded-2xl border flex flex-col justify-between shadow-xs transition-colors ${
            isLight ? 'bg-white border-[#dadce0]' : 'bg-[#191f2f] border-white/5'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs flex items-center gap-1 ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                <span className="material-symbols-outlined text-[15px] text-[#f9ab00]">wb_sunny</span>
                UV Index
              </span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                isLight ? 'bg-amber-100 text-amber-800' : 'bg-[#f59e0b]/15 text-[#f59e0b]'
              }`}>
                Moderate
              </span>
            </div>
            <div className="my-2">
              <span className={`font-telemetry-num text-2xl font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                {selectedStation.uvIndex}{' '}
                <span className={`text-xs font-normal ${isLight ? 'text-[#747775]' : 'text-[#88929b]'}`}>of 11</span>
              </span>
              <p className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                Sun protection recommended
              </p>
            </div>
            <div className={`w-full h-1 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-[#33394a]'}`}>
              <div className="h-full bg-[#f9ab00] rounded-full w-[45%]" />
            </div>
          </div>

          {/* Cloud Cover */}
          <div className={`p-3.5 rounded-2xl border flex flex-col justify-between shadow-xs transition-colors ${
            isLight ? 'bg-white border-[#dadce0]' : 'bg-[#191f2f] border-white/5'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs flex items-center gap-1 ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                <span className={`material-symbols-outlined text-[15px] ${isLight ? 'text-[#0b57d0]' : 'text-primary'}`}>
                  cloud
                </span>
                Cloud Cover
              </span>
              <span className={`w-2 h-2 rounded-full ${isLight ? 'bg-[#0b57d0]' : 'bg-primary'}`} />
            </div>
            <div className="my-2">
              <span className={`font-telemetry-num text-2xl font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                {selectedStation.cloudCover}%
              </span>
              <p className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                Scattered cirrus layer
              </p>
            </div>
            <div className={`w-full h-1 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-[#33394a]'}`}>
              <div
                className={`h-full rounded-full ${isLight ? 'bg-[#0b57d0]' : 'bg-primary'}`}
                style={{ width: `${selectedStation.cloudCover}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Weather & AQI Outlook */}
      <div className={`flex flex-col gap-2 rounded-3xl p-4 border shadow-md transition-all ${
        isLight ? 'bg-white border-[#dadce0] shadow-[0_1px_4px_rgba(60,64,67,0.12)]' : 'bg-[#191f2f] border-white/10'
      }`}>
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-1.5">
            <span className={`material-symbols-outlined text-[18px] ${isLight ? 'text-[#0b57d0]' : 'text-primary'}`}>
              calendar_month
            </span>
            <h3 className={`font-headline-sm text-sm font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
              7-Day Weather &amp; AQI Outlook
            </h3>
          </div>
          <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>Trends</span>
        </div>

        <div className={`flex flex-col divide-y ${isLight ? 'divide-slate-100' : 'divide-white/5'}`}>
          {weekData.map((day, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between gap-2">
              <span className={`w-12 text-xs font-semibold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>{day.day}</span>
              <div className="flex items-center gap-1 w-14">
                <span className="material-symbols-outlined text-[18px] text-[#f9ab00]">
                  {day.icon}
                </span>
                <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>{day.precip}</span>
              </div>

              {/* Min-Max Bar */}
              <div className="flex-1 flex items-center gap-1.5">
                <span className={`text-[10px] w-5 text-right ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>{day.min}°</span>
                <div className={`flex-1 h-1.5 rounded-full overflow-hidden relative ${
                  isLight ? 'bg-slate-200' : 'bg-[#2f3445]'
                }`}>
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-[#f9ab00]"
                    style={{
                      marginLeft: `${((day.min - 16) / 20) * 100}%`,
                      width: `${((day.max - day.min) / 20) * 100}%`
                    }}
                  />
                </div>
                <span className={`text-[10px] font-bold w-5 ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>{day.max}°</span>
              </div>

              {/* AQI Badge */}
              <div
                className="w-14 text-center py-0.5 rounded-full text-[10px] font-bold"
                style={{ backgroundColor: `${day.aqiColor}20`, color: day.aqiColor }}
              >
                {day.aqi} AQI
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optimal Outdoor Hours Alert Card */}
      <div className={`p-4 rounded-3xl border space-y-3 shadow-md transition-all ${
        isLight ? 'bg-white border-[#dadce0] shadow-[0_1px_4px_rgba(60,64,67,0.12)]' : 'bg-[#191f2f] border-white/10'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`material-symbols-outlined ${isLight ? 'text-[#137333]' : 'text-secondary'}`}>
              nest_eco_leaf
            </span>
            <span className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>Optimal Outdoor Hours</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            isLight ? 'bg-emerald-50 text-[#137333] border border-emerald-200' : 'bg-secondary/15 text-secondary'
          }`}>
            Clear Window
          </span>
        </div>

        <p className={`text-xs leading-relaxed ${isLight ? 'text-[#444746]' : 'text-[#bec8d2]'}`}>
          The best window for outdoor walks or athletic running today is{' '}
          <strong className={isLight ? 'text-[#1f1f1f]' : 'text-white'}>5:00 AM – 6:30 AM tomorrow</strong>, before particulate
          concentration settles in the boundary layer.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={onOpenAlarm}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              isLight
                ? 'bg-[#f0f4f9] hover:bg-[#e2e8f0] text-[#137333] border-[#dadce0]'
                : 'bg-[#242a3a] hover:bg-[#33394a] text-white border-white/5'
            }`}
          >
            <span className={`material-symbols-outlined text-[16px] ${isLight ? 'text-[#137333]' : 'text-secondary'}`}>alarm</span>
            <span>Set Clean Air Alarm</span>
          </button>

          <button
            type="button"
            onClick={onShare}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              isLight
                ? 'bg-[#f0f4f9] hover:bg-[#e2e8f0] text-[#0b57d0] border-[#dadce0]'
                : 'bg-[#242a3a] hover:bg-[#33394a] text-white border-white/5'
            }`}
          >
            <span className={`material-symbols-outlined text-[16px] ${isLight ? 'text-[#0b57d0]' : 'text-sky-cyan'}`}>share</span>
            <span>Share Outlook</span>
          </button>
        </div>
      </div>

      {/* Next Step: 72-Hour Prediction & Radar */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => onNavigate('prediction')}
          className={`w-full py-3.5 px-6 rounded-full font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer ${
            isLight
              ? 'bg-[#0b57d0] hover:bg-[#1a73e8] text-white shadow-md'
              : 'bg-gradient-to-r from-sky-cyan to-primary text-[#00344d] hover:brightness-110 shadow-lg'
          }`}
        >
          <span>View 72-Hour Prediction &amp; Radar</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
