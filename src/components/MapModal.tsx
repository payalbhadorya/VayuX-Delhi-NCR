import React from 'react';
import { MapViewer } from './MapViewer';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
  onSelectStation?: (zoneName: string) => void;
}

export const MapModal: React.FC<MapModalProps> = ({
  isOpen,
  onClose,
  theme = 'dark',
  onSelectStation
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl h-[92vh] max-h-[850px] flex flex-col rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <MapViewer
          isModal
          onClose={onClose}
          theme={theme}
          onSelectStation={onSelectStation}
        />
      </div>
    </div>
  );
};
