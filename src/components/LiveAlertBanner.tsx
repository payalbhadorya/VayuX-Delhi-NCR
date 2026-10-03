import React, { useState } from 'react';

interface LiveAlertBannerProps {
  onOpenNotifications: () => void;
  onOpenFireDetails: () => void;
  theme?: 'dark' | 'light';
}

export const LiveAlertBanner: React.FC<LiveAlertBannerProps> = ({
  onOpenNotifications,
  onOpenFireDetails,
  theme = 'dark'
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const isLight = theme === 'light';

  if (isDismissed) return null;

  return (
    <div className="w-full max-w-md mx-auto px-4 pt-2.5 z-30">
      <div className={`relative overflow-hidden rounded-2xl p-3 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-300 border transition-all ${
        isLight
          ? 'bg-[#fef2f2] border-[#fecaca] shadow-[0_1px_4px_rgba(60,64,67,0.12)] text-[#1f1f1f]'
          : 'bg-gradient-to-r from-[#ef4444]/25 via-[#f97316]/20 to-[#f59e0b]/25 border-[#ef4444]/40 shadow-lg text-white'
      }`}>
        {/* Glow backlight */}
        {!isLight && (
          <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[#ef4444]/20 blur-2xl pointer-events-none" />
        )}

        <div className="relative z-10 flex items-start justify-between gap-2.5">
          <div className="flex items-start gap-2.5 min-w-0">
            {/* Pulsing Alert Icon */}
            <div className="relative flex-shrink-0 mt-0.5">
              <span className={`w-7 h-7 rounded-xl text-white flex items-center justify-center shadow-md ${
                isLight ? 'bg-[#d93025]' : 'bg-[#ef4444]'
              }`}>
                <span className="material-symbols-outlined text-[17px] animate-pulse">local_fire_department</span>
              </span>
              <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ring-2 ring-white animate-ping ${
                isLight ? 'bg-[#d93025]' : 'bg-[#ef4444]'
              }`} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-extrabold uppercase tracking-wider text-white ${
                  isLight ? 'bg-[#d93025]' : 'bg-[#ef4444]'
                }`}>
                  URGENT SATELLITE ALERT
                </span>
                <span className={`text-[11px] font-bold flex items-center gap-1 ${
                  isLight ? 'text-[#991b1b]' : 'text-white'
                }`}>
                  <span>1,428 Active Stubble Fires</span>
                </span>
              </div>

              <p className={`text-xs mt-1 leading-snug font-medium ${
                isLight ? 'text-[#7f1d1d]' : 'text-white/95'
              }`}>
                NASA VIIRS satellite detected intense upwind crop burning in Punjab &amp; Haryana.
                NW winds carrying heavy smoke plume (+68 AQI impact).
              </p>

              <div className="flex items-center gap-2 mt-2 pt-0.5">
                <button
                  type="button"
                  onClick={onOpenFireDetails}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer ${
                    isLight
                      ? 'bg-white text-[#b91c1c] border border-[#fca5a5] hover:bg-[#fff5f5]'
                      : 'bg-white text-[#0f172a] hover:bg-white/90 shadow'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px] text-[#d93025]">satellite_alt</span>
                  <span>View Satellite Fires</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenNotifications}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold active:scale-95 transition-all flex items-center gap-1 cursor-pointer ${
                    isLight
                      ? 'bg-[#fee2e2] text-[#991b1b] hover:bg-[#fecaca] border border-[#fca5a5]'
                      : 'bg-black/40 hover:bg-black/60 text-white border border-white/10'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">notifications</span>
                  <span>All Alerts (3)</span>
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss banner"
            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
              isLight
                ? 'bg-black/5 hover:bg-black/10 text-[#747775] hover:text-[#1f1f1f]'
                : 'bg-black/30 hover:bg-black/50 text-white/80 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
