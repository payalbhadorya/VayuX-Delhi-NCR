import React, { useState } from 'react';
import { ASSET_IMAGES } from '../data/stations';
import { SupportedLanguage, LANGUAGES, getTranslation } from '../utils/i18n';

interface TopHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
  onShare?: () => void;
  unreadNotifications?: boolean;
  avatarUrl?: string;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  language?: SupportedLanguage;
  onSelectLanguage?: (lang: SupportedLanguage) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  onOpenNotifications,
  onOpenProfile,
  onShare,
  unreadNotifications = true,
  avatarUrl,
  theme = 'dark',
  onToggleTheme,
  language = 'en',
  onSelectLanguage
}) => {
  const isLight = theme === 'light';
  const t = getTranslation(language);
  const [showLangMenu, setShowLangMenu] = useState(false);

  return (
    <header className={`sticky top-0 w-full z-40 backdrop-blur-xl border-b transition-colors duration-300 ${
      isLight
        ? 'bg-white/95 border-[#dadce0] text-[#1f1f1f] shadow-[0_1px_3px_0_rgba(60,64,67,0.12)]'
        : 'bg-[#0d1322]/85 border-white/5 text-[#dde2f8] shadow-[0_1px_12px_rgba(0,0,0,0.15)]'
    }`}>
      {/* Mobile status row */}
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
        <div className="flex items-center gap-2.5 min-w-0">
          {showBack && onBack && (
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

          <img
            alt="VayuX Logo"
            className="h-8 w-8 object-contain rounded-xl shadow-xs shrink-0 border border-black/5 dark:border-white/10"
            src={ASSET_IMAGES.logo}
          />

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className={`font-headline-sm font-bold tracking-tight truncate ${
                isLight ? 'text-[#1f1f1f]' : 'text-white'
              }`}>
                {title}
              </span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-0.5 shrink-0 ${
                isLight ? 'bg-[#e8f0fe] text-[#0b57d0]' : 'bg-[#2f3445] text-sky-cyan'
              }`}>
                <span className="material-symbols-outlined text-[11px]">location_on</span>
                <span>NCR</span>
              </span>
            </div>
            {subtitle && (
              <span className={`text-[11px] truncate ${
                isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'
              }`}>
                {subtitle}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Language Switcher Badge */}
          {onSelectLanguage && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className={`h-8 px-2 rounded-full text-xs font-bold flex items-center gap-1 transition-all cursor-pointer border ${
                  isLight
                    ? 'bg-[#f0f4f9] hover:bg-[#e2e8f0] text-[#0b57d0] border-[#dadce0]'
                    : 'bg-[#191f2f] hover:bg-[#33394a] text-sky-cyan border-white/5'
                }`}
                title="Switch Language"
              >
                <span className="material-symbols-outlined text-[15px]">translate</span>
                <span>{language === 'en' ? 'EN' : language === 'hi' ? 'हिं' : 'मरा'}</span>
              </button>

              {/* Language Dropdown Menu */}
              {showLangMenu && (
                <div className={`absolute right-0 top-10 w-36 py-1.5 rounded-2xl shadow-xl border z-50 animate-in fade-in duration-150 ${
                  isLight ? 'bg-white border-[#dadce0] text-[#1f1f1f]' : 'bg-[#191f2f] border-white/10 text-white'
                }`}>
                  <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    isLight ? 'text-[#5f6368]' : 'text-[#88929b]'
                  }`}>
                    {t.languageBarTitle}
                  </div>
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        onSelectLanguage(l.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        language === l.code
                          ? isLight ? 'bg-[#e8f0fe] text-[#0b57d0]' : 'bg-white/10 text-sky-cyan font-bold'
                          : isLight ? 'hover:bg-[#f0f4f9]' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{l.code === 'en' ? '🇬🇧' : '🇮🇳'}</span>
                        <span>{l.nativeName}</span>
                      </div>
                      {language === l.code && (
                        <span className="material-symbols-outlined text-[15px]">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {onShare && (
            <button
              type="button"
              onClick={onShare}
              className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full transition-colors active:scale-95 cursor-pointer ${
                isLight
                  ? 'bg-[#f0f4f9] hover:bg-[#e2e8f0] text-[#444746]'
                  : 'bg-[#191f2f] hover:bg-[#33394a] text-[#bec8d2] hover:text-white'
              }`}
              title="Share"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
            </button>
          )}

          {/* High-Impact Notification Bell Button */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className={`relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer border ${
              unreadNotifications
                ? isLight
                  ? 'bg-[#fce8e6] text-[#d93025] border-[#f5c2c7] shadow-xs'
                  : 'bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/30 shadow-[0_0_12px_rgba(239,68,68,0.25)]'
                : isLight
                ? 'bg-[#f0f4f9] text-[#444746] border-[#dadce0]'
                : 'bg-[#191f2f] text-[#bec8d2] border-white/5'
            }`}
            title="Atmospheric Alerts & Live Broadcasts"
          >
            <span className="material-symbols-outlined text-[19px] animate-pulse">notifications</span>
            {unreadNotifications && (
              <>
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#d93025] text-white text-[8px] font-bold flex items-center justify-center shadow">
                  3
                </span>
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#d93025] animate-ping opacity-75" />
              </>
            )}
          </button>

          {/* User Profile Avatar */}
          <button
            type="button"
            onClick={onOpenProfile}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border-2 active:scale-95 transition-transform cursor-pointer shadow-sm ${
              isLight ? 'border-[#0b57d0]' : 'border-sky-cyan/40 bg-white'
            }`}
            title="User Profile & Settings"
          >
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src={avatarUrl || ASSET_IMAGES.avatar}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
