import React, { useState } from 'react';
import { ASSET_IMAGES } from '../data/stations';

interface SkylineCamModalProps {
  isOpen: boolean;
  onClose: () => void;
  stationName: string;
  theme?: 'dark' | 'light';
}

export const SkylineCamModal: React.FC<SkylineCamModalProps> = ({
  isOpen,
  onClose,
  stationName,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const [filterMode, setFilterMode] = useState<'standard' | 'haze_filter' | 'thermal'>('standard');

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md ${
      isLight ? 'bg-black/40' : 'bg-black/80'
    }`}>
      <div className={`w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl space-y-3 p-4 animate-in fade-in zoom-in-95 duration-200 border ${
        isLight
          ? 'bg-white border-[#dadce0] text-[#1f1f1f] shadow-[0_8px_30px_rgba(60,64,67,0.2)]'
          : 'bg-[#191f2f] border-white/10 text-white'
      }`}>
        <div className={`flex items-center justify-between pb-2 border-b ${
          isLight ? 'border-[#dadce0]' : 'border-white/10'
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d93025] animate-ping" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs uppercase font-bold tracking-wider ${
                  isLight ? 'text-[#d93025]' : 'text-sky-cyan'
                }`}>
                  LIVE FEED
                </span>
                <span className={`text-xs font-semibold ${isLight ? 'text-[#202124]' : 'text-white'}`}>
                  Skyline Cam DL-04
                </span>
              </div>
              <p className={`text-[11px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                {stationName} · Delhi Gate North Axis
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
              isLight
                ? 'bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#3c4043]'
                : 'bg-white/5 hover:bg-white/10 text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Video simulation viewfinder */}
        <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-black border border-white/10">
          <img
            src={ASSET_IMAGES.skylineCam}
            alt="Skyline Cam Live"
            className={`w-full h-full object-cover transition-all duration-300 ${
              filterMode === 'haze_filter'
                ? 'contrast-125 saturate-150 brightness-95'
                : filterMode === 'thermal'
                ? 'hue-rotate-180 invert brightness-90 contrast-150'
                : ''
            }`}
          />

          {/* Optical HUD overlay */}
          <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between bg-gradient-to-t from-black/70 via-transparent to-black/50">
            <div className="flex items-center justify-between text-[10px] text-white/90 font-mono">
              <span className="bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">CAM #DL-04 • 60 FPS</span>
              <span className="bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm text-sky-400">VISIBILITY: 4.2 KM</span>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-16 h-16 border border-white/30 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-sky-400/80" />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/90">
              <span className="bg-black/60 px-2 py-1 rounded backdrop-blur-sm">Haze Inversion: 350m Altitude</span>
              <span className="bg-black/60 px-2 py-1 rounded backdrop-blur-sm text-[#f59e0b] font-semibold">
                Aerosol Index: Moderate
              </span>
            </div>
          </div>
        </div>

        {/* Camera filter controls */}
        <div className="flex items-center justify-between gap-2 pt-1 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1.5 text-xs">
            <span className={`text-[11px] ${isLight ? 'text-[#5f6368]' : 'text-[#88929b]'}`}>
              Optical Lens:
            </span>
            <button
              type="button"
              onClick={() => setFilterMode('standard')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                filterMode === 'standard'
                  ? isLight
                    ? 'bg-[#1a73e8] text-white font-bold shadow-xs'
                    : 'bg-sky-cyan text-[#00344d] font-bold'
                  : isLight
                  ? 'bg-[#f1f3f4] text-[#3c4043] hover:bg-[#e8eaed]'
                  : 'bg-white/5 text-[#bec8d2]'
              }`}
            >
              Standard
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('haze_filter')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                filterMode === 'haze_filter'
                  ? isLight
                    ? 'bg-[#1a73e8] text-white font-bold shadow-xs'
                    : 'bg-sky-cyan text-[#00344d] font-bold'
                  : isLight
                  ? 'bg-[#f1f3f4] text-[#3c4043] hover:bg-[#e8eaed]'
                  : 'bg-white/5 text-[#bec8d2]'
              }`}
            >
              De-Haze
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('thermal')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                filterMode === 'thermal'
                  ? isLight
                    ? 'bg-[#1a73e8] text-white font-bold shadow-xs'
                    : 'bg-sky-cyan text-[#00344d] font-bold'
                  : isLight
                  ? 'bg-[#f1f3f4] text-[#3c4043] hover:bg-[#e8eaed]'
                  : 'bg-white/5 text-[#bec8d2]'
              }`}
            >
              Aerosol Spectrum
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer ${
              isLight
                ? 'bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#3c4043] border border-[#dadce0]'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
};
