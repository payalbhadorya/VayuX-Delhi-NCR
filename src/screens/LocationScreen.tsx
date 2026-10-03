import React, { useState } from 'react';
import { ASSET_IMAGES, STATIONS } from '../data/stations';
import { StationData } from '../types';
import { SupportedLanguage, LANGUAGES, getTranslation } from '../utils/i18n';

interface LocationScreenProps {
  selectedStation: StationData;
  onSelectStation: (station: StationData) => void;
  onContinue: () => void;
  onBack?: () => void;
  onShare?: () => void;
  avatarUrl?: string;
  onOpenMap?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  language?: SupportedLanguage;
  onSelectLanguage?: (lang: SupportedLanguage) => void;
}

export const LocationScreen: React.FC<LocationScreenProps> = ({
  selectedStation,
  onSelectStation,
  onContinue,
  onBack,
  onShare,
  avatarUrl,
  onOpenMap,
  theme = 'dark',
  onToggleTheme,
  language = 'en',
  onSelectLanguage
}) => {
  const isLight = theme === 'light';
  const t = getTranslation(language);

  const [searchQuery, setSearchQuery] = useState('');
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'locked'>('idle');
  const [langToast, setLangToast] = useState<string | null>(null);

  const handleLanguageChange = (langCode: SupportedLanguage) => {
    if (onSelectLanguage) {
      onSelectLanguage(langCode);
      const name = langCode === 'en' ? 'English' : langCode === 'hi' ? 'हिंदी (Hindi)' : 'मराठी (Marathi)';
      setLangToast(name);
      setTimeout(() => setLangToast(null), 2200);
    }
  };

  const filteredStations = STATIONS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEnableGps = () => {
    setGpsStatus('locating');
    setTimeout(() => {
      setGpsStatus('locked');
      // Set to closest station (Connaught Place)
      const closest = STATIONS[0];
      onSelectStation(closest);
      // After providing location take me to home screen
      setTimeout(() => {
        onContinue();
      }, 450);
    }, 700);
  };

  const handleSelectStationAndProceed = (station: StationData) => {
    onSelectStation(station);
    // After providing location take me to home screen
    onContinue();
  };

  // Helper for status translation
  const translateStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'good':
      case 'pristine':
        return t.statusGood;
      case 'moderate':
        return t.statusModerate;
      case 'unhealthy':
        return t.statusUnhealthy;
      case 'severe':
      case 'hazardous':
        return t.statusHazardous;
      default:
        return status;
    }
  };

  return (
    <div className={`relative flex flex-col w-full min-h-screen pb-28 transition-colors duration-300 ${
      isLight ? 'bg-[#f8fafd] text-[#1f1f1f]' : 'bg-[#0d1322] text-[#dde2f8]'
    }`}>
      {/* Toast Notification when Language Changes */}
      {langToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in duration-200">
          <div className={`px-4 py-2 rounded-full shadow-lg text-xs font-bold flex items-center gap-2 border ${
            isLight
              ? 'bg-[#0b57d0] text-white border-[#0b57d0]'
              : 'bg-sky-cyan text-[#00344d] border-sky-cyan'
          }`}>
            <span className="material-symbols-outlined text-[16px]">translate</span>
            <span>Language changed to {langToast}</span>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <header className={`sticky top-0 w-full z-40 backdrop-blur-xl border-b transition-colors ${
        isLight
          ? 'bg-white/95 border-[#dadce0] text-[#1f1f1f] shadow-xs'
          : 'bg-[#0d1322]/85 border-white/5 text-[#dde2f8]'
      }`}>
        <div className={`px-4 pt-1 flex justify-between items-center text-[11px] font-medium tracking-tight ${
          isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'
        }`}>
          <span className={`font-semibold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>09:41</span>
          <div className="flex items-center gap-1.5 opacity-80">
            <span className="material-symbols-outlined text-[14px]">signal_cellular_alt</span>
            <span className="material-symbols-outlined text-[14px]">wifi</span>
            <span className="material-symbols-outlined text-[15px]">battery_full</span>
          </div>
        </div>

        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                  isLight ? 'bg-[#f0f4f9] hover:bg-[#e2e8f0] text-[#1f1f1f]' : 'bg-[#191f2f] hover:bg-[#33394a] text-white'
                }`}
                aria-label="Go back"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
            )}
            <img alt="VayuX Logo" className="h-8 w-8 object-contain rounded-xl shadow-xs border border-black/5 dark:border-white/10" src={ASSET_IMAGES.logo} />
            <h1 className={`font-headline-sm font-bold tracking-tight ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
              {t.stationDetail}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {onShare && (
              <button
                type="button"
                onClick={onShare}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                  isLight ? 'bg-[#f0f4f9] hover:bg-[#e2e8f0] text-[#444746]' : 'bg-[#191f2f] hover:bg-[#33394a] text-[#bec8d2] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">share</span>
              </button>
            )}
            <img
              alt="Profile"
              className={`w-8 h-8 rounded-full object-cover shadow-xs ${
                isLight ? 'border-2 border-[#0b57d0]' : 'border border-white/20 bg-white'
              }`}
              src={avatarUrl || ASSET_IMAGES.avatar}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-md mx-auto px-4 pt-3 flex flex-col space-y-4">
        {/* ========================================================
            LANGUAGE PREFERENCE BAR (English, Hindi, Marathi)
            ======================================================== */}
        <section className={`p-3.5 rounded-3xl border transition-all ${
          isLight
            ? 'bg-white border-[#dadce0] shadow-[0_1px_4px_rgba(60,64,67,0.1)]'
            : 'bg-[#151b2b] border-white/10 shadow-lg'
        }`}>
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                isLight ? 'bg-[#e8f0fe] text-[#0b57d0]' : 'bg-sky-cyan/20 text-sky-cyan'
              }`}>
                <span className="material-symbols-outlined text-[17px]">translate</span>
              </div>
              <div>
                <h3 className={`text-xs sm:text-sm font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                  {t.languageBarTitle}
                </h3>
                <span className={`text-[10px] block ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                  {t.languageSub}
                </span>
              </div>
            </div>

            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              isLight
                ? 'bg-[#e8f0fe] text-[#0b57d0] border border-[#c2e7ff]'
                : 'bg-primary/20 text-primary border border-primary/30'
            }`}>
              {language === 'en' ? 'English' : language === 'hi' ? 'हिंदी' : 'मराठी'}
            </span>
          </div>

          {/* 3-Language Segmented Buttons */}
          <div className={`grid grid-cols-3 gap-1.5 p-1 rounded-2xl border ${
            isLight ? 'bg-[#f0f4f9] border-[#dadce0]' : 'bg-[#080e1d]/80 border-white/5'
          }`}>
            {LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? isLight
                        ? 'bg-[#0b57d0] text-white shadow-sm ring-1 ring-[#0b57d0]'
                        : 'bg-sky-cyan text-[#00344d] shadow-md font-extrabold ring-1 ring-sky-cyan'
                      : isLight
                      ? 'text-[#444746] hover:bg-white hover:text-[#0b57d0]'
                      : 'text-[#bec8d2] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="text-[13px]">{lang.code === 'en' ? '🇬🇧' : '🇮🇳'}</span>
                  <span>{lang.nativeName}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Header Section */}
        <div className="pt-0.5 pb-0.5">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-2 border ${
            isLight
              ? 'bg-[#e8f0fe] border-[#c2e7ff] text-[#0b57d0]'
              : 'bg-[#191f2f] border-white/5 text-secondary'
          }`}>
            <span className={`w-2 h-2 rounded-full animate-pulse ${isLight ? 'bg-[#0b57d0]' : 'bg-secondary'}`} />
            <span className="text-[11px] font-semibold tracking-wider uppercase">
              {t.hyperlocalRadar}
            </span>
          </div>
          <h2 className={`font-headline-lg-mobile text-2xl sm:text-3xl font-bold tracking-tight ${
            isLight ? 'text-[#1f1f1f]' : 'text-white'
          }`}>
            {t.locationTitle}
          </h2>
          <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
            {t.locationSubtitle}
          </p>
        </div>

        {/* GPS Auto-Detect Card (Google Maps Style) */}
        <div className="w-full">
          <button
            type="button"
            onClick={handleEnableGps}
            className={`w-full text-left group relative overflow-hidden rounded-2xl p-4 shadow-sm transition-all active:scale-[0.99] border cursor-pointer ${
              isLight
                ? 'bg-white border-[#dadce0] shadow-[0_1px_3px_rgba(60,64,67,0.12)] hover:border-[#0b57d0]'
                : 'bg-[#242a3a]/90 hover:bg-[#33394a]/90 border-white/10 backdrop-blur-xl'
            }`}
          >
            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`relative w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center ${
                  isLight ? 'bg-[#e8f0fe] text-[#0b57d0]' : 'bg-sky-cyan/20 text-sky-cyan'
                }`}>
                  <span className={`absolute inset-0 rounded-xl animate-ping opacity-75 ${
                    isLight ? 'bg-[#c2e7ff]' : 'bg-sky-cyan/20'
                  }`} />
                  <span className="material-symbols-outlined text-[26px] relative z-10">near_me</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm sm:text-base font-bold tracking-tight truncate ${
                      isLight ? 'text-[#1f1f1f]' : 'text-white'
                    }`}>
                      {t.useCurrentLocation}
                    </span>
                    <span className={`material-symbols-outlined text-[16px] ${isLight ? 'text-[#0b57d0]' : 'text-primary'}`}>
                      verified
                    </span>
                  </div>
                  <p className={`text-xs truncate mt-0.5 ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                    {gpsStatus === 'locked'
                      ? t.gpsLocked
                      : gpsStatus === 'locating'
                      ? t.detectingGps
                      : t.tapToLocate}
                  </p>
                </div>
              </div>

              <div
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs transition-colors ${
                  gpsStatus === 'locked'
                    ? isLight ? 'bg-emerald-100 text-[#137333]' : 'bg-secondary text-[#00344d]'
                    : gpsStatus === 'locating'
                    ? isLight ? 'bg-[#c2e7ff] text-[#001d35] animate-pulse' : 'bg-sky-cyan/80 text-[#00344d] animate-pulse'
                    : isLight ? 'bg-[#0b57d0] text-white hover:bg-[#1a73e8]' : 'bg-primary text-[#00344d] group-hover:bg-sky-cyan'
                }`}
              >
                {gpsStatus === 'locked' ? '✓' : gpsStatus === 'locating' ? '...' : t.useCurrentLocation}
              </div>
            </div>
          </button>
        </div>

        {/* Search Input Capsule (Google Search Pill) */}
        <div className="w-full">
          <div className={`relative flex items-center w-full rounded-full transition-all border ${
            isLight
              ? 'bg-white border-[#dadce0] shadow-[0_1px_6px_rgba(32,33,36,0.18)] focus-within:border-[#0b57d0]'
              : 'bg-[#151b2b] focus-within:bg-[#191f2f] border-white/5 shadow-inner'
          }`}>
            <span className={`material-symbols-outlined text-[22px] ml-4 flex-shrink-0 ${
              isLight ? 'text-[#0b57d0]' : 'text-[#bec8d2]'
            }`}>
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchStationPlaceholder}
              className={`w-full bg-transparent px-3 py-3 text-sm focus:outline-none ${
                isLight ? 'text-[#1f1f1f] placeholder:text-[#747775]' : 'text-white placeholder:text-[#88929b]'
              }`}
            />
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className={`p-2 mr-2 cursor-pointer ${isLight ? 'text-[#5f6368] hover:text-[#1f1f1f]' : 'text-[#bec8d2] hover:text-white'}`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {searchQuery ? 'close' : 'mic'}
              </span>
            </button>
          </div>
        </div>

        {/* Hyperlocal Map Radar Preview Card */}
        <div className="w-full">
          <div className={`relative rounded-2xl overflow-hidden shadow-md border ${
            isLight ? 'bg-white border-[#dadce0]' : 'bg-[#242a3a] border-white/10'
          }`}>
            <div
              className="w-full h-40 bg-cover bg-center relative"
              style={{ backgroundImage: `url('${ASSET_IMAGES.mapPreview}')` }}
            >
              <div className={`absolute inset-0 ${
                isLight
                  ? 'bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent'
                  : 'bg-gradient-to-t from-[#080e1d] via-[#151b2b]/40 to-transparent'
              }`} />

              {/* Live Sensors Radar Pins Overlay */}
              <div className="absolute inset-0 p-3.5 flex flex-col justify-between pointer-events-none">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#080e1d]/85 backdrop-blur-md text-[11px] font-medium text-white border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                    {t.interactiveMap}
                  </span>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#080e1d]/80 backdrop-blur-md text-[#bec8d2] text-[11px]">
                    <span className="material-symbols-outlined text-[14px]">tune</span>
                    2.5 km
                  </div>
                </div>

                {/* Pulsing Radar Map Pins */}
                <div className="relative w-full h-16">
                  {/* Pin 1: Connaught Place */}
                  <button
                    type="button"
                    onClick={() => handleSelectStationAndProceed(STATIONS[0])}
                    className="absolute left-1/3 bottom-1 flex flex-col items-center pointer-events-auto cursor-pointer"
                  >
                    <div className="px-2 py-0.5 rounded-md bg-[#f59e0b] text-[#080e1d] text-xs font-bold shadow-md flex items-center gap-1">
                      <span>180</span>
                      <span className="text-[9px] uppercase font-normal opacity-90">AQI</span>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] ring-4 ring-[#f59e0b]/30 mt-0.5" />
                  </button>

                  {/* Pin 2: Anand Vihar */}
                  <button
                    type="button"
                    onClick={() => handleSelectStationAndProceed(STATIONS[1])}
                    className="absolute right-1/4 top-0 flex flex-col items-center pointer-events-auto cursor-pointer"
                  >
                    <div className="px-1.5 py-0.5 rounded-md bg-[#ef4444] text-white text-[11px] font-bold">
                      245
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444] ring-2 ring-[#ef4444]/40 mt-0.5" />
                  </button>

                  {/* Pin 3: RK Puram */}
                  <button
                    type="button"
                    onClick={() => handleSelectStationAndProceed(STATIONS[2])}
                    className="absolute left-8 top-1 flex flex-col items-center pointer-events-auto cursor-pointer"
                  >
                    <div className="px-1.5 py-0.5 rounded-md bg-[#f59e0b] text-[#080e1d] text-[11px] font-bold">
                      165
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] ring-2 ring-[#f59e0b]/30 mt-0.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer indicator of the map tile */}
            <div className={`px-3.5 py-2.5 flex items-center justify-between border-t ${
              isLight ? 'bg-white border-[#dadce0]' : 'bg-[#151b2b] border-white/5'
            }`}>
              <div className={`flex items-center gap-1.5 text-xs ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                <span className={`material-symbols-outlined text-[16px] ${isLight ? 'text-[#0b57d0]' : 'text-primary'}`}>
                  my_location
                </span>
                <span>{t.tapPinHint}</span>
              </div>
              <button
                type="button"
                onClick={onOpenMap}
                className={`text-xs font-bold flex items-center gap-1 cursor-pointer hover:underline ${
                  isLight ? 'text-[#0b57d0]' : 'text-primary hover:text-white'
                }`}
              >
                <span>{t.viewFullMap}</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </button>
            </div>
          </div>
        </div>

        {/* Nearby & Popular Hyperlocal Stations List */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className={`font-headline-sm text-sm font-bold tracking-tight ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
              {t.nearbyStations}
            </h3>
            <span className={`text-[11px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
              {t.liveTelemetry}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {filteredStations.map((station) => {
              const isSelected = selectedStation.id === station.id;
              return (
                <div
                  key={station.id}
                  onClick={() => handleSelectStationAndProceed(station)}
                  className={`w-full text-left relative overflow-hidden rounded-2xl p-3.5 transition-all shadow-xs cursor-pointer border ${
                    isSelected
                      ? isLight
                        ? 'bg-[#e8f0fe] border-[#0b57d0] shadow-sm'
                        : 'bg-[#242a3a]/95 border-sky-cyan/40 shadow-md'
                      : isLight
                      ? 'bg-white hover:bg-[#f0f4f9] border-[#dadce0]'
                      : 'bg-[#191f2f]/70 hover:bg-[#242a3a]/80 border-white/5'
                  }`}
                >
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected
                            ? isLight ? 'bg-[#0b57d0] text-white' : 'bg-primary text-[#00344d]'
                            : isLight ? 'bg-[#f0f4f9] text-[#5f6368]' : 'bg-[#2f3445] text-[#bec8d2]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {isSelected ? 'check_circle' : 'location_on'}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-sm font-semibold truncate ${
                            isSelected && isLight ? 'text-[#001d35] font-bold' : isLight ? 'text-[#1f1f1f]' : 'text-white'
                          }`}>
                            {station.name}
                          </span>
                          {isSelected && (
                            <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                              isLight ? 'bg-[#c2e7ff] text-[#001d35]' : 'bg-primary/20 text-primary'
                            }`}>
                              Active
                            </span>
                          )}
                        </div>
                        <p className={`text-xs truncate ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                          {station.subName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="flex flex-col items-end">
                        <div
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold"
                          style={{
                            backgroundColor: `${station.aqiColor}20`,
                            color: station.aqiColor
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: station.aqiColor }}
                          />
                          <span className="font-telemetry-num text-sm">{station.aqi}</span>
                          <span className="text-[10px] font-normal">{translateStatus(station.aqiStatus)}</span>
                        </div>
                        <span className={`text-[10px] mt-0.5 ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                          {station.temp}°C · PM2.5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hyperlocal Insight Micro-card */}
        <div className={`w-full p-3.5 rounded-2xl flex items-center gap-3 border ${
          isLight ? 'bg-[#f0f4f9] border-[#dadce0] text-[#1f1f1f]' : 'bg-[#151b2b] border-white/5 text-[#bec8d2]'
        }`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isLight ? 'bg-emerald-100 text-[#137333]' : 'bg-secondary/15 text-secondary'
          }`}>
            <span className="material-symbols-outlined text-[18px]">nest_eco_leaf</span>
          </div>
          <p className={`text-xs ${isLight ? 'text-[#444746]' : 'text-[#bec8d2]'}`}>
            {t.satelliteDesc.slice(0, 100)}...
          </p>
        </div>
      </main>

      {/* Fixed Bottom CTA Bar with Blur Backdrop */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 px-4 py-3 pb-safe border-t backdrop-blur-xl ${
        isLight ? 'bg-white/95 border-[#dadce0] shadow-lg' : 'bg-[#0d1322]/90 border-white/5'
      }`}>
        <div className="max-w-md mx-auto w-full">
          <button
            type="button"
            onClick={onContinue}
            className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-headline-sm font-bold text-sm transition-all shadow-md active:scale-[0.98] cursor-pointer ${
              isLight
                ? 'bg-[#0b57d0] hover:bg-[#1a73e8] text-white shadow-[#0b57d0]/20'
                : 'bg-primary text-[#00344d] hover:bg-sky-cyan shadow-lg'
            }`}
          >
            <span>{t.navHome} ({t.stationActive})</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
