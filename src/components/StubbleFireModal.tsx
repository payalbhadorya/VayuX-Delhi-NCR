import React from 'react';
import { STUBBLE_FIRE_DATA } from '../data/stubbleFireData';
import { ScreenType } from '../types';

interface StubbleFireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToRadar: (screen: ScreenType) => void;
  theme?: 'dark' | 'light';
}

export const StubbleFireModal: React.FC<StubbleFireModalProps> = ({
  isOpen,
  onClose,
  onNavigateToRadar,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md ${
      isLight ? 'bg-black/40' : 'bg-black/80'
    }`}>
      <div className={`w-full max-w-md rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar animate-in fade-in zoom-in-95 duration-200 border ${
        isLight
          ? 'bg-white text-[#1f1f1f] border-[#dadce0] shadow-[0_8px_30px_rgba(60,64,67,0.2)]'
          : 'bg-[#191f2f] text-white border-white/10'
      }`}>
        {/* Header */}
        <div className={`flex items-start justify-between border-b pb-3 ${
          isLight ? 'border-[#dadce0]' : 'border-white/10'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ea4335] to-[#fbbc04] flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-[22px]">local_fire_department</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold uppercase bg-[#d93025] text-white">
                  SATELLITE FIRMS
                </span>
                <span className={`text-xs font-bold ${isLight ? 'text-[#1a73e8]' : 'text-sky-cyan'}`}>
                  VIIRS 375m &amp; MODIS
                </span>
              </div>
              <h3 className={`font-headline-sm font-bold text-base ${isLight ? 'text-[#202124]' : 'text-white'}`}>
                Stubble Fire Satellite Observation
              </h3>
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

        {/* High-Impact Stat Matrix (2x2) */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className={`p-3 rounded-2xl border flex flex-col justify-between ${
            isLight ? 'bg-[#f8fafd] border-[#dadce0]' : 'bg-[#151b2b] border-white/5'
          }`}>
            <span className={`text-[11px] flex items-center gap-1 ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
              <span className="material-symbols-outlined text-[14px] text-[#d93025]">whatshot</span>
              Active Farm Fires
            </span>
            <div className="my-1">
              <span className={`font-telemetry-num text-2xl font-extrabold ${isLight ? 'text-[#d93025]' : 'text-[#ef4444]'}`}>
                {STUBBLE_FIRE_DATA.totalFires24h.toLocaleString()}
              </span>
              <span className={`text-[10px] block ${isLight ? 'text-[#70757a]' : 'text-[#bec8d2]'}`}>
                +{STUBBLE_FIRE_DATA.totalFires24h - STUBBLE_FIRE_DATA.totalFiresYesterday} vs yesterday
              </span>
            </div>
            <span className={`text-[10px] ${isLight ? 'text-[#3c4043]' : 'text-white/80'}`}>
              North-West Arc (Punjab/HR)
            </span>
          </div>

          <div className={`p-3 rounded-2xl border flex flex-col justify-between ${
            isLight ? 'bg-[#f8fafd] border-[#dadce0]' : 'bg-[#151b2b] border-white/5'
          }`}>
            <span className={`text-[11px] flex items-center gap-1 ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
              <span className="material-symbols-outlined text-[14px] text-[#ea8600]">air</span>
              Smoke Inflow Impact
            </span>
            <div className="my-1">
              <span className={`font-telemetry-num text-2xl font-extrabold ${isLight ? 'text-[#e37400]' : 'text-[#f59e0b]'}`}>
                +{STUBBLE_FIRE_DATA.smokeContributionAqi}{' '}
                <span className={`text-sm font-normal ${isLight ? 'text-[#202124]' : 'text-white'}`}>AQI</span>
              </span>
              <span className={`text-[10px] block ${isLight ? 'text-[#70757a]' : 'text-[#bec8d2]'}`}>
                {STUBBLE_FIRE_DATA.smokeContributionPercentage}% of Delhi pollution
              </span>
            </div>
            <span className={`text-[10px] ${isLight ? 'text-[#3c4043]' : 'text-white/80'}`}>
              Transboundary transport
            </span>
          </div>

          <div className={`p-3 rounded-2xl border flex flex-col justify-between ${
            isLight ? 'bg-[#f8fafd] border-[#dadce0]' : 'bg-[#151b2b] border-white/5'
          }`}>
            <span className={`text-[11px] flex items-center gap-1 ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
              <span className="material-symbols-outlined text-[14px] text-[#1a73e8]">navigation</span>
              Wind Drift Vector
            </span>
            <div className="my-1">
              <span className={`font-telemetry-num text-xl font-bold ${isLight ? 'text-[#202124]' : 'text-white'}`}>
                {STUBBLE_FIRE_DATA.windTransportVector.speedKmh} km/h NW
              </span>
              <span className={`text-[10px] font-semibold block ${isLight ? 'text-[#1a73e8]' : 'text-sky-cyan'}`}>
                ETA: {STUBBLE_FIRE_DATA.windTransportVector.plumeEtaHours} hrs to NCR
              </span>
            </div>
            <span className={`text-[10px] ${isLight ? 'text-[#3c4043]' : 'text-white/80'}`}>
              Boundary layer transport
            </span>
          </div>

          <div className={`p-3 rounded-2xl border flex flex-col justify-between ${
            isLight ? 'bg-[#f8fafd] border-[#dadce0]' : 'bg-[#151b2b] border-white/5'
          }`}>
            <span className={`text-[11px] flex items-center gap-1 ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
              <span className="material-symbols-outlined text-[14px] text-[#1e8e3e]">bolt</span>
              Radiative Energy
            </span>
            <div className="my-1">
              <span className={`font-telemetry-num text-xl font-bold ${isLight ? 'text-[#1e8e3e]' : 'text-secondary'}`}>
                {STUBBLE_FIRE_DATA.totalFrpMw.toLocaleString()} <span className="text-xs">MW</span>
              </span>
              <span className={`text-[10px] block ${isLight ? 'text-[#70757a]' : 'text-[#bec8d2]'}`}>
                Fire Radiative Power
              </span>
            </div>
            <span className={`text-[10px] ${isLight ? 'text-[#3c4043]' : 'text-white/80'}`}>
              Thermal intensity score
            </span>
          </div>
        </div>

        {/* Scientific Context */}
        <div className={`p-3.5 rounded-2xl border space-y-1.5 text-xs ${
          isLight
            ? 'bg-[#f8fafd] border-[#dadce0] text-[#3c4043]'
            : 'bg-[#151b2b] border-white/5 text-[#bec8d2]'
        }`}>
          <div className={`flex items-center gap-1.5 font-semibold ${isLight ? 'text-[#202124]' : 'text-white'}`}>
            <span className={`material-symbols-outlined text-[16px] ${isLight ? 'text-[#1a73e8]' : 'text-sky-cyan'}`}>
              satellite
            </span>
            <span>Satellite Observation Protocol</span>
          </div>
          <p className="leading-relaxed">
            Combined measurements from NASA VIIRS (375m high-resolution infrared band I4) and MODIS Terra/Aqua confirm heavy biomass burning across harvested paddy fields. Fine particulate emissions (PM2.5) are currently advecting downwind into the Indo-Gangetic plain.
          </p>
          <div className={`pt-1 text-[11px] font-mono ${isLight ? 'text-[#5f6368]' : 'text-[#88929b]'}`}>
            {STUBBLE_FIRE_DATA.lastSatellitePass}
          </div>
        </div>

        {/* District Hotspot Breakdown Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className={`text-xs font-bold ${isLight ? 'text-[#202124]' : 'text-white'}`}>
              Top Active Burning Districts
            </span>
            <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
              Fires / FRP
            </span>
          </div>

          <div className="space-y-1.5">
            {STUBBLE_FIRE_DATA.hotspots.map((hotspot) => (
              <div
                key={hotspot.district}
                className={`flex items-center justify-between p-2.5 rounded-2xl border text-xs ${
                  isLight
                    ? 'bg-white border-[#dadce0]'
                    : 'bg-[#151b2b] border-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d93025] animate-pulse" />
                  <div>
                    <span className={`font-semibold ${isLight ? 'text-[#202124]' : 'text-white'}`}>
                      {hotspot.district}
                    </span>
                    <span className={`text-[10px] ml-1.5 ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                      ({hotspot.state})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[11px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                    {hotspot.frp} MW
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isLight
                      ? 'bg-[#fce8e6] text-[#c5221f]'
                      : 'bg-[#ef4444]/20 text-[#ef4444]'
                  }`}>
                    {hotspot.fireCount} fires
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigateToRadar('prediction');
            }}
            className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-[#d93025] via-[#ea8600] to-[#f9ab00] text-white font-bold text-xs shadow-md hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">radar</span>
            <span>View Stubble Smoke Radar on 72h Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};
