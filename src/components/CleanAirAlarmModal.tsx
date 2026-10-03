import React, { useState } from 'react';

interface CleanAirAlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (time: string, repeat: boolean) => void;
  theme?: 'dark' | 'light';
}

export const CleanAirAlarmModal: React.FC<CleanAirAlarmModalProps> = ({
  isOpen,
  onClose,
  onSave,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const [alarmTime, setAlarmTime] = useState('05:00');
  const [repeatDaily, setRepeatDaily] = useState(true);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md ${
      isLight ? 'bg-black/40' : 'bg-black/75'
    }`}>
      <div className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 border ${
        isLight
          ? 'bg-white border-[#dadce0] text-[#1f1f1f] shadow-[0_8px_30px_rgba(60,64,67,0.2)]'
          : 'bg-[#191f2f] border-white/10 text-white'
      }`}>
        <div className={`flex items-center justify-between border-b pb-3 ${
          isLight ? 'border-[#dadce0]' : 'border-white/10'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`material-symbols-outlined ${isLight ? 'text-[#1e8e3e]' : 'text-secondary'}`}>
              alarm_on
            </span>
            <span className={`text-sm font-bold ${isLight ? 'text-[#202124]' : 'text-white'}`}>
              Clean Air Morning Alarm
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
              isLight
                ? 'bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#3c4043]'
                : 'bg-white/5 hover:bg-white/10 text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <div className={`p-3 rounded-2xl border text-xs space-y-1 ${
          isLight
            ? 'bg-[#e6f4ea] border-[#ceead6] text-[#3c4043]'
            : 'bg-[#151b2b] border-white/5 text-[#bec8d2]'
        }`}>
          <div className={`flex items-center gap-1.5 font-semibold ${isLight ? 'text-[#137333]' : 'text-secondary'}`}>
            <span className="material-symbols-outlined text-[15px]">eco</span>
            <span>Optimal Window: 5:00 AM – 6:30 AM</span>
          </div>
          <p>
            Atmospheric inversion layer lifts at dawn, creating a 90-minute clean air corridor before traffic emissions peak.
          </p>
        </div>

        <div className="space-y-2">
          <label className={`text-xs font-semibold block ${isLight ? 'text-[#3c4043]' : 'text-white'}`}>
            Alarm Wakeup Time
          </label>
          <input
            type="time"
            value={alarmTime}
            onChange={(e) => setAlarmTime(e.target.value)}
            className={`w-full text-lg font-bold p-3 rounded-2xl border text-center focus:outline-none transition-colors ${
              isLight
                ? 'bg-[#f8fafd] text-[#1f1f1f] border-[#dadce0] focus:border-[#1a73e8]'
                : 'bg-[#242a3a] text-white border-white/10 focus:border-sky-cyan'
            }`}
          />
        </div>

        <div className={`flex items-center justify-between p-3 rounded-2xl border ${
          isLight ? 'bg-[#f8fafd] border-[#dadce0]' : 'bg-[#151b2b] border-transparent'
        }`}>
          <span className={`text-xs ${isLight ? 'text-[#3c4043]' : 'text-white'}`}>
            Repeat during clean days
          </span>
          <button
            type="button"
            onClick={() => setRepeatDaily(!repeatDaily)}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              repeatDaily
                ? isLight
                  ? 'bg-[#1e8e3e]'
                  : 'bg-secondary'
                : isLight
                ? 'bg-[#dadce0]'
                : 'bg-white/20'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform ${
                repeatDaily ? 'right-0.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onSave(alarmTime, repeatDaily)}
          className={`w-full py-3 rounded-full font-bold text-xs transition-all cursor-pointer shadow-sm ${
            isLight
              ? 'bg-[#1a73e8] text-white hover:bg-[#1557b0]'
              : 'bg-secondary text-[#003824] hover:brightness-110'
          }`}
        >
          Set Alarm ({alarmTime} AM)
        </button>
      </div>
    </div>
  );
};
