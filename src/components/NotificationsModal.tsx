import React, { useState } from 'react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFireDetails?: () => void;
  theme?: 'dark' | 'light';
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onOpenFireDetails,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const [filter, setFilter] = useState<'all' | 'urgent'>('all');

  if (!isOpen) return null;

  const alerts = [
    {
      id: 1,
      severity: 'CRITICAL EMERGENCY',
      title: 'Transboundary Stubble Smoke Plume',
      station: 'NASA VIIRS Satellite Overpass · Punjab / Haryana Corridor',
      message:
        '1,428 active agricultural stubble fires detected upwind. 14 km/h NW wind stream is funneling severe black carbon and particulate aerosol straight into Delhi NCR basin (+68 AQI spike).',
      time: 'Just now',
      action: 'MANDATORY N95 MASK OUTDOORS',
      icon: 'local_fire_department',
      color: isLight ? 'text-[#d93025]' : 'text-[#ef4444]',
      bg: isLight ? 'bg-[#fce8e6]' : 'bg-[#ef4444]/15',
      badgeBg: isLight ? 'bg-[#d93025] text-white' : 'bg-[#ef4444] text-white',
      border: isLight ? 'border-[#fad2cf]' : 'border-[#ef4444]/40',
      isFire: true
    },
    {
      id: 2,
      severity: 'HIGH HEALTH ADVISORY',
      title: 'Severe PM2.5 Inversion Spike',
      station: 'Anand Vihar Station #04 · East Delhi',
      message:
        'Particulate matter PM2.5 surged to 245 µg/m³ under low atmospheric boundary layer. Asthma patients and cardio runners must cease outdoor workouts.',
      time: '12m ago',
      action: 'SEAL WINDOWS & RUN HEPA PURIFIER',
      icon: 'warning',
      color: isLight ? 'text-[#e37400]' : 'text-[#f59e0b]',
      bg: isLight ? 'bg-[#fef7e0]' : 'bg-[#f59e0b]/15',
      badgeBg: isLight ? 'bg-[#ea8600] text-white' : 'bg-[#f59e0b] text-[#00344d]',
      border: isLight ? 'border-[#feefc3]' : 'border-[#f59e0b]/40',
      isFire: false
    },
    {
      id: 3,
      severity: 'ATMOSPHERIC OPPORTUNITY',
      title: 'Clean Air Window Detected',
      station: 'Lodhi Pocket Sink · South Central Delhi',
      message:
        'Tree-canopy particulate filtration and dawn thermal ventilation will create a 90-minute clean air window (AQI 88) between 5:00 AM – 6:30 AM tomorrow.',
      time: '1h ago',
      action: 'SET MORNING EXERCISE ALARM',
      icon: 'air',
      color: isLight ? 'text-[#188038]' : 'text-secondary',
      bg: isLight ? 'bg-[#e6f4ea]' : 'bg-secondary/15',
      badgeBg: isLight ? 'bg-[#1e8e3e] text-white' : 'bg-secondary text-[#003824]',
      border: isLight ? 'border-[#ceead6]' : 'border-secondary/40',
      isFire: false
    }
  ];

  const displayedAlerts = filter === 'urgent' ? alerts.filter((a) => a.isFire || a.id === 2) : alerts;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md ${
      isLight ? 'bg-black/40' : 'bg-black/85'
    }`}>
      <div className={`w-full max-w-md rounded-3xl p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto no-scrollbar animate-in fade-in zoom-in-95 duration-200 border ${
        isLight
          ? 'bg-white border-[#dadce0] text-[#1f1f1f] shadow-[0_8px_30px_rgba(60,64,67,0.2)]'
          : 'bg-[#191f2f] border-white/15 text-white'
      }`}>
        {/* Top Header */}
        <div className={`flex items-center justify-between border-b pb-3 ${
          isLight ? 'border-[#dadce0]' : 'border-white/10'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`relative w-10 h-10 rounded-2xl flex items-center justify-center border ${
              isLight
                ? 'bg-[#fce8e6] border-[#fad2cf] text-[#d93025]'
                : 'bg-[#ef4444]/20 border-[#ef4444]/40 text-[#ef4444]'
            }`}>
              <span className="material-symbols-outlined text-[22px] animate-pulse">
                notifications_active
              </span>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#ef4444] ring-2 ring-white animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`font-headline-sm font-bold text-base ${isLight ? 'text-[#202124]' : 'text-white'}`}>
                  Atmospheric Command Center
                </h3>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isLight ? 'bg-[#d93025] text-white' : 'bg-[#ef4444] text-white'
                }`}>
                  3 LIVE
                </span>
              </div>
              <p className={`text-xs ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                CPCB &amp; NASA VIIRS Hyperlocal Broadcasts
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

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'all'
                ? isLight
                  ? 'bg-[#1a73e8] text-white shadow-sm'
                  : 'bg-sky-cyan text-[#00344d]'
                : isLight
                ? 'bg-[#f1f3f4] text-[#3c4043] hover:bg-[#e8eaed]'
                : 'bg-white/5 text-[#bec8d2] hover:text-white'
            }`}
          >
            All Broadcasts (3)
          </button>
          <button
            type="button"
            onClick={() => setFilter('urgent')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'urgent'
                ? isLight
                  ? 'bg-[#d93025] text-white shadow-sm'
                  : 'bg-[#ef4444] text-white'
                : isLight
                ? 'bg-[#fce8e6] text-[#c5221f] hover:bg-[#fad2cf]'
                : 'bg-[#ef4444]/15 text-[#ef4444] hover:bg-[#ef4444]/25'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">warning</span>
            <span>Emergency Only (2)</span>
          </button>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {displayedAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border transition-all ${alert.bg} ${alert.border}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${alert.badgeBg}`}>
                    {alert.severity}
                  </span>
                  <span className={`text-[11px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                    {alert.time}
                  </span>
                </div>
                <span className={`material-symbols-outlined text-[20px] ${alert.color}`}>
                  {alert.icon}
                </span>
              </div>

              <h4 className={`font-bold text-sm mt-2 ${isLight ? 'text-[#202124]' : 'text-white'}`}>
                {alert.title}
              </h4>
              <p className={`text-[11px] mt-0.5 ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                {alert.station}
              </p>
              <p className={`text-xs mt-2 leading-relaxed ${isLight ? 'text-[#3c4043]' : 'text-white/90'}`}>
                {alert.message}
              </p>

              {/* Action Banner inside alert */}
              <div className={`mt-3 p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                isLight ? 'bg-white border-[#dadce0]' : 'bg-black/20 border-white/5'
              }`}>
                <div className="flex items-center gap-1.5 text-[11px] font-bold">
                  <span className={`material-symbols-outlined text-[16px] ${alert.color}`}>
                    shield
                  </span>
                  <span className={isLight ? 'text-[#202124]' : 'text-white'}>{alert.action}</span>
                </div>

                {alert.isFire && onOpenFireDetails && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenFireDetails();
                    }}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      isLight
                        ? 'bg-[#d93025] text-white hover:bg-[#b3261e]'
                        : 'bg-[#ef4444] text-white hover:bg-[#dc2626]'
                    }`}
                  >
                    View Radar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
