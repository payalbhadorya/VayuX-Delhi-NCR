import React from 'react';
import { ScreenType } from '../types';
import { SupportedLanguage, getTranslation } from '../utils/i18n';

interface BottomNavBarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  theme?: 'dark' | 'light';
  language?: SupportedLanguage;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentScreen,
  onNavigate,
  theme = 'dark',
  language = 'en'
}) => {
  const isLight = theme === 'light';
  const t = getTranslation(language);

  const tabs: { id: ScreenType; label: string; icon: string }[] = [
    { id: 'home', label: t.navHome, icon: 'home' },
    { id: 'aqi', label: t.navAQI, icon: 'air' },
    { id: 'weather', label: t.navWeather, icon: 'cloud' },
    { id: 'prediction', label: t.navMap, icon: 'radar' },
    { id: 'profile', label: t.navProfile, icon: 'manage_accounts' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none pb-safe px-4 mb-2">
      <nav className={`pointer-events-auto max-w-md mx-auto rounded-full backdrop-blur-2xl px-2 py-1.5 flex justify-around items-center transition-all duration-300 border ${
        isLight
          ? 'bg-white/95 border-[#dadce0] text-[#444746] shadow-[0_4px_20px_rgba(60,64,67,0.18)]'
          : 'bg-[#1e293b]/85 border-white/10 text-[#bec8d2] shadow-[0_12px_32px_rgba(0,0,0,0.25)]'
      }`}>
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[54px] min-h-[46px] py-0.5 px-1 rounded-2xl transition-all duration-200 cursor-pointer ${
                isLight
                  ? isActive
                    ? 'text-[#001d35]'
                    : 'text-[#444746] hover:text-[#1f1f1f]'
                  : isActive
                  ? 'text-sky-cyan'
                  : 'text-[#bec8d2] hover:text-white'
              }`}
            >
              {/* Google M3 Pill Icon Container in Day mode */}
              <div
                className={`w-12 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? isLight
                      ? 'bg-[#c2e7ff] text-[#001d35] shadow-xs'
                      : 'bg-sky-cyan/15 text-sky-cyan shadow-inner'
                    : isLight
                    ? 'hover:bg-[#f0f4f9] text-[#444746]'
                    : 'hover:bg-white/5 text-[#bec8d2]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {tab.icon}
                </span>
              </div>
              <span className={`text-[10px] leading-tight tracking-tight transition-colors ${
                isActive
                  ? isLight
                    ? 'font-bold text-[#001d35]'
                    : 'font-semibold text-sky-cyan'
                  : isLight
                  ? 'font-medium text-[#444746]'
                  : 'font-normal text-[#bec8d2]'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

