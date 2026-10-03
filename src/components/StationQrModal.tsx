import React from 'react';

interface StationQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  stationName: string;
  stationId: string;
  aqi: number;
  theme?: 'dark' | 'light';
}

export const StationQrModal: React.FC<StationQrModalProps> = ({
  isOpen,
  onClose,
  stationName,
  stationId,
  aqi,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md ${
      isLight ? 'bg-black/40' : 'bg-black/75'
    }`}>
      <div className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200 border ${
        isLight
          ? 'bg-white border-[#dadce0] text-[#1f1f1f] shadow-[0_8px_30px_rgba(60,64,67,0.2)]'
          : 'bg-[#191f2f] border-white/10 text-white'
      }`}>
        <div className={`flex items-center justify-between border-b pb-3 ${
          isLight ? 'border-[#dadce0]' : 'border-white/10'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`material-symbols-outlined ${isLight ? 'text-[#1a73e8]' : 'text-sky-cyan'}`}>
              qr_code_2
            </span>
            <span className={`text-sm font-bold ${isLight ? 'text-[#202124]' : 'text-white'}`}>
              Station Verification QR
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

        <div className="p-4 bg-white rounded-2xl mx-auto w-48 h-48 flex items-center justify-center shadow-md border border-[#dadce0]">
          {/* Simulated QR Code SVG */}
          <svg viewBox="0 0 100 100" className="w-full h-full text-black">
            <path
              fill="currentColor"
              d="M0 0h30v30H0zm5 5v20h20V5zm5 5h10v10H10zm60-10h30v30H70zm5 5v20h20V5zm5 5h10v10H80zM0 70h30v30H0zm5 5v20h20V75zm5 5h10v10H10zm35-70h5v15h-5zm10 0h5v5h-5zm0 10h10v5H50zm-10 15h15v5H40zm20 0h10v10H60zm-20 15h5v5h-5zm15 5h5v15h-5zm-15 10h10v5H40zm25-10h5v5h-5zm10 0h15v5H75zm-10 10h10v10H65zm15 0h10v5H80zm0 10h5v10H80zm-40 5h10v15H40zm15 5h10v5H55zm15 0h5v10H70zm-15 10h15v5H55zm30-5h15v10H85z"
            />
          </svg>
        </div>

        <div>
          <h4 className={`font-bold text-base ${isLight ? 'text-[#202124]' : 'text-white'}`}>
            {stationName}
          </h4>
          <p className={`text-xs ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
            Node {stationId} • Validated CPCB Key
          </p>
          <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${
            isLight
              ? 'bg-[#f1f3f4] text-[#1a73e8]'
              : 'bg-white/5 text-sky-cyan'
          }`}>
            <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
            <span className="font-semibold">Live Calibrated AQI: {aqi}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className={`w-full py-2.5 rounded-full font-bold text-xs transition-colors cursor-pointer shadow-sm ${
            isLight
              ? 'bg-[#1a73e8] text-white hover:bg-[#1557b0]'
              : 'bg-sky-cyan text-[#00344d] hover:bg-[#006591]'
          }`}
        >
          Done
        </button>
      </div>
    </div>
  );
};
