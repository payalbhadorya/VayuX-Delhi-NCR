import React, { useState, useEffect } from 'react';
import { ASSET_IMAGES } from '../data/stations';

interface SplashScreenProps {
  onContinue: () => void;
  theme?: 'dark' | 'light';
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onContinue, theme = 'dark' }) => {
  const isLight = theme === 'light';
  const [progress, setProgress] = useState(78);
  const [statusText, setStatusText] = useState('Syncing atmospheric telemetry...');

  useEffect(() => {
    const stages = [
      { at: 85, text: 'Calibrating micro-sensors...' },
      { at: 94, text: 'Mapping air currents...' },
      { at: 100, text: 'Atmosphere ready' }
    ];

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const next = Math.min(prev + 7, 100);
        const match = stages.find((s) => s.at <= next && s.at > prev);
        if (match) {
          setStatusText(match.text);
        }
        return next;
      });
    }, 450);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      onClick={onContinue}
      className={`relative flex flex-col w-full min-h-screen overflow-hidden select-none cursor-pointer transition-colors duration-300 ${
        isLight ? 'bg-[#f8fafd] text-[#1f1f1f]' : 'bg-[#0d1322] text-[#dde2f8]'
      }`}
    >
      {/* Background Ambience */}
      {isLight ? (
        <>
          <div className="absolute -top-32 -left-20 w-80 h-80 rounded-full bg-blue-100/60 blur-[100px] pointer-events-none" />
          <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-emerald-100/60 blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-amber-100/50 blur-[90px] pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute -top-32 -left-20 w-80 h-80 rounded-full bg-secondary/10 blur-[100px] pointer-events-none" />
          <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-sky-cyan/15 blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-aqi-good/10 blur-[90px] pointer-events-none" />
        </>
      )}

      {/* Top Sensor Telemetry Capsule */}
      <div className="w-full px-5 pt-4 flex items-center justify-between z-10">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md shadow-xs border ${
          isLight
            ? 'bg-white/90 border-[#dadce0] text-[#3c4043]'
            : 'bg-[#191f2f]/60 border-white/5 text-[#bec8d2]'
        }`}>
          <span className={`w-2 h-2 rounded-full animate-ping ${isLight ? 'bg-[#1e8e3e]' : 'bg-secondary'}`} />
          <span className="text-[11px] font-medium tracking-wider uppercase">
            Atmospheric Grid Active
          </span>
        </div>
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md shadow-xs border ${
          isLight
            ? 'bg-white/90 border-[#dadce0] text-[#1a73e8]'
            : 'bg-[#191f2f]/60 border-white/5 text-primary'
        }`}>
          <span className="material-symbols-outlined text-[15px]">satellite_alt</span>
          <span className="text-[11px] font-semibold">v2.4 Live</span>
        </div>
      </div>

      {/* Central Visual Identity Stage */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 z-10 text-center">
        {/* Brand Logo Mark */}
        <div className="relative flex items-center justify-center mb-6">
          <div className={`absolute w-44 h-44 rounded-full blur-2xl animate-pulse ${
            isLight
              ? 'bg-gradient-to-tr from-blue-300/30 via-emerald-300/30 to-amber-300/30'
              : 'bg-gradient-to-tr from-sky-cyan/25 to-secondary/20'
          }`} />

          <div className={`relative w-28 h-28 rounded-3xl p-3 shadow-xl backdrop-blur-xl flex items-center justify-center transform transition-transform duration-500 hover:scale-105 border ${
            isLight
              ? 'bg-white border-[#dadce0] shadow-[0_8px_24px_rgba(60,64,67,0.15)]'
              : 'bg-[#242a3a]/80 border-white/10'
          }`}>
            <img
              src={ASSET_IMAGES.logo}
              alt="VayuX Logo"
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>
        </div>

        {/* Brand Title and Tagline */}
        <div className="space-y-1.5 max-w-xs">
          <div className="flex items-center justify-center gap-1.5">
            <h1 className={`font-headline-lg font-black tracking-tight text-3xl sm:text-4xl ${
              isLight ? 'text-[#202124]' : 'text-white'
            }`}>
              Vayu<span className={isLight ? 'text-[#1a73e8]' : 'text-sky-cyan'}>X</span>
            </h1>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isLight
                ? 'bg-[#e8f0fe] text-[#1a73e8] border border-[#c2e7ff]'
                : 'bg-primary/20 text-primary border border-primary/30'
            }`}>
              PRO
            </span>
          </div>

          <p className={`font-headline-sm font-semibold text-sm ${
            isLight ? 'text-[#3c4043]' : 'text-white/90'
          }`}>
            Precision Hyperlocal Air Telemetry
          </p>

          <p className={`text-xs leading-relaxed max-w-[280px] mx-auto pt-1 ${
            isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'
          }`}>
            Live continuous multi-spectral atmospheric sensing, transboundary stubble smoke radar, and predictive respiratory guidance.
          </p>
        </div>

        {/* Dynamic Loading Meter */}
        <div className="w-full max-w-xs mt-10 space-y-2">
          <div className={`flex items-center justify-between text-xs font-mono ${
            isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'
          }`}>
            <span className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full animate-ping ${isLight ? 'bg-[#1a73e8]' : 'bg-sky-cyan'}`} />
              {statusText}
            </span>
            <span className={`font-bold ${isLight ? 'text-[#1a73e8]' : 'text-white'}`}>{progress}%</span>
          </div>

          {/* Progress Bar Track */}
          <div className={`w-full h-2 rounded-full overflow-hidden p-0.5 border ${
            isLight
              ? 'bg-[#e8eaed] border-[#dadce0]'
              : 'bg-[#151b2b] border-white/10'
          }`}>
            <div
              className={`h-full rounded-full transition-all duration-300 ease-out shadow-sm ${
                isLight
                  ? 'bg-gradient-to-r from-[#1a73e8] via-[#34a853] to-[#ea4335]'
                  : 'bg-gradient-to-r from-sky-cyan via-secondary to-primary'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Tap to Enter Cue */}
        <div className="mt-8">
          <button
            type="button"
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-2 mx-auto cursor-pointer ${
              isLight
                ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white shadow-[0_2px_6px_rgba(26,115,232,0.3)]'
                : 'bg-gradient-to-r from-sky-cyan to-primary text-[#00344d] hover:brightness-110'
            }`}
          >
            <span>Tap to Enter Dashboard</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Bottom Authority Endorsement */}
      <div className={`w-full py-4 text-center z-10 text-[11px] border-t backdrop-blur-sm ${
        isLight
          ? 'bg-white/80 border-[#dadce0] text-[#5f6368]'
          : 'bg-[#0d1322]/80 border-white/5 text-[#88929b]'
      }`}>
        <p>Ground-truthed with CPCB India &amp; NASA VIIRS Satellite Data</p>
      </div>
    </div>
  );
};
