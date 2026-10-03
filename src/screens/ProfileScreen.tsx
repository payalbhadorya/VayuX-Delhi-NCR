import React, { useState, useRef } from 'react';
import { ASSET_IMAGES, DEFAULT_AVATAR, STATIONS } from '../data/stations';
import { ScreenType, UserProfile } from '../types';
import { SupportedLanguage, LANGUAGES, getTranslation } from '../utils/i18n';

interface ProfileScreenProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onNavigate: (screen: ScreenType) => void;
  onAvatarChangedToast?: (msg: string) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onSelectTheme?: (theme: 'dark' | 'light') => void;
  onLogout?: () => void;
  language?: SupportedLanguage;
  onSelectLanguage?: (lang: SupportedLanguage) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onUpdateUser,
  onNavigate,
  onAvatarChangedToast,
  theme = 'dark',
  onToggleTheme,
  onSelectTheme,
  onLogout,
  language = 'en',
  onSelectLanguage
}) => {
  const isLight = theme === 'light';
  const t = getTranslation(language);

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    if (newTheme === theme) return;
    if (onSelectTheme) {
      onSelectTheme(newTheme);
    } else if (onToggleTheme) {
      onToggleTheme();
    }
  };

  const [sensitivity, setSensitivity] = useState(user.sensitivityLevel);
  const standard: 'CPCB India' = 'CPCB India';
  const [notifications, setNotifications] = useState(user.notificationsEnabled);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSave = () => {
    onUpdateUser({
      sensitivityLevel: sensitivity,
      standard,
      notificationsEnabled: notifications
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Please select an image smaller than 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onUpdateUser({ avatarUrl: dataUrl });
        try {
          localStorage.setItem('vayux_custom_avatar', dataUrl);
        } catch {
          // localStorage quota catch
        }
        if (onAvatarChangedToast) {
          onAvatarChangedToast('Profile photo updated from your gallery!');
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleResetToDefault = () => {
    onUpdateUser({ avatarUrl: DEFAULT_AVATAR });
    try {
      localStorage.removeItem('vayux_custom_avatar');
    } catch {
      // ignore
    }
    if (onAvatarChangedToast) {
      onAvatarChangedToast('Reset to default silhouette avatar');
    }
  };

  const isCustomAvatar = user.avatarUrl && user.avatarUrl !== DEFAULT_AVATAR;

  return (
    <div className={`flex flex-col w-full max-w-md mx-auto space-y-4 pb-28 px-4 pt-3 transition-colors duration-300 ${
      isLight ? 'text-[#1f1f1f]' : 'text-[#dde2f8]'
    }`}>
      {/* Hidden Gallery / Camera File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarFileChange}
      />

      {/* Header Profile Card with Interactive Avatar (Google Account Style in Day Mode) */}
      <div className={`relative overflow-hidden rounded-3xl p-5 shadow-xl border text-center transition-all ${
        isLight
          ? 'bg-white border-[#dadce0] shadow-[0_1px_4px_rgba(60,64,67,0.12)] text-[#1f1f1f]'
          : 'bg-[#191f2f] border-white/10 text-white'
      }`}>
        {!isLight && (
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-cyan/15 rounded-full blur-2xl pointer-events-none" />
        )}

        <div className="relative z-10 flex flex-col items-center">
          {/* Avatar with click-to-upload from gallery */}
          <div className="relative group cursor-pointer mb-2.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`relative w-24 h-24 rounded-full overflow-hidden border-2 shadow-xl bg-white block focus:outline-none transition-all group-hover:scale-105 cursor-pointer ${
                isLight ? 'border-[#0b57d0] ring-4 ring-[#e8f0fe]' : 'border-sky-cyan/60 focus:ring-4 focus:ring-sky-cyan/30'
              }`}
              title="Click to choose a photo from your gallery"
            >
              <img
                alt="User Avatar"
                className="w-full h-full object-cover"
                src={user.avatarUrl || DEFAULT_AVATAR}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                <span className="material-symbols-outlined text-2xl">photo_camera</span>
                <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Gallery</span>
              </div>
            </button>

            {/* Quick camera badge button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 active:scale-95 transition-all cursor-pointer ${
                isLight
                  ? 'bg-[#0b57d0] text-white border-white hover:bg-[#1a73e8]'
                  : 'bg-sky-cyan text-[#00344d] border-[#191f2f] hover:bg-[#89ceff]'
              }`}
              title="Choose photo from gallery"
            >
              <span className="material-symbols-outlined text-[17px]">photo_library</span>
            </button>
          </div>

          <h2 className={`font-headline-sm text-lg font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
            {user.name}
          </h2>
          <div className="flex flex-col items-center gap-0.5 mt-0.5">
            <span className={`text-xs ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
              {user.email}
            </span>
            {user.phone && (
              <span className={`text-[11px] flex items-center gap-1 font-mono ${isLight ? 'text-[#0b57d0]' : 'text-sky-cyan'}`}>
                <span className="material-symbols-outlined text-[13px]">smartphone</span>
                {user.phone}
              </span>
            )}
          </div>

          {/* Gallery access action buttons */}
          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer active:scale-95 ${
                isLight
                  ? 'bg-[#e8f0fe] hover:bg-[#d2e3fc] text-[#0b57d0] border-[#c2e7ff]'
                  : 'bg-sky-cyan/20 hover:bg-sky-cyan/30 text-sky-cyan border-sky-cyan/40'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
              <span>Change from Gallery</span>
            </button>

            {isCustomAvatar && (
              <button
                type="button"
                onClick={handleResetToDefault}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer border ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-[#444746] border-slate-200'
                    : 'bg-white/5 hover:bg-white/10 text-[#bec8d2] hover:text-white border-transparent'
                }`}
                title="Reset to default avatar"
              >
                <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                <span>Reset</span>
              </button>
            )}
          </div>

          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mt-3 ${
            isLight ? 'bg-emerald-50 text-[#137333] border border-emerald-200' : 'bg-secondary/15 text-secondary'
          }`}>
            <span className="material-symbols-outlined text-[15px]">verified</span>
            <span>Hyperlocal Citizen Sensor Node #782</span>
          </div>
        </div>
      </div>

      {/* Display Theme (Day & Night Mode) Card */}
      <div className={`rounded-3xl p-4 border space-y-3 shadow-xs transition-all ${
        isLight ? 'bg-white border-[#dadce0] text-[#1f1f1f]' : 'bg-[#191f2f] border-white/10 text-white'
      }`}>
        <div className={`flex items-center justify-between pb-1 border-b ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
          <div className="flex items-center gap-2">
            <span className={`material-symbols-outlined ${isLight ? 'text-[#ea8600]' : 'text-sky-cyan'}`}>
              contrast
            </span>
            <div>
              <h3 className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                {t.themeTitle}
              </h3>
              <p className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                {t.themeSubtitle}
              </p>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
            isLight
              ? 'bg-[#fef7e0] text-[#b06000] border-[#fde293]'
              : 'bg-sky-cyan/15 text-sky-cyan border-sky-cyan/30'
          }`}>
            {isLight ? t.themeDay : t.themeNight}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {/* Day Mode Option */}
          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={`p-3 rounded-2xl text-left transition-all border cursor-pointer relative overflow-hidden ${
              isLight
                ? 'bg-[#e8f0fe] border-[#0b57d0] ring-2 ring-[#0b57d0]/20 shadow-sm'
                : 'bg-[#151b2b] hover:bg-[#242a3a] border-white/5 text-[#bec8d2]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isLight ? 'bg-white text-[#ea8600] shadow-xs' : 'bg-white/5 text-[#ea8600]'
              }`}>
                <span className="material-symbols-outlined text-[19px]">wb_sunny</span>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                isLight ? 'border-[#0b57d0] bg-[#0b57d0]' : 'border-white/30'
              }`}>
                {isLight && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
            <span className={`text-xs font-bold block ${isLight ? 'text-[#001d35]' : 'text-white'}`}>
              {t.themeDay}
            </span>
            <span className={`text-[10px] block mt-0.5 leading-tight ${isLight ? 'text-[#0b57d0]' : 'text-[#88929b]'}`}>
              {t.themeDayDesc}
            </span>
          </button>

          {/* Night Mode Option */}
          <button
            type="button"
            onClick={() => handleThemeChange('dark')}
            className={`p-3 rounded-2xl text-left transition-all border cursor-pointer relative overflow-hidden ${
              !isLight
                ? 'bg-[#242a3a] border-sky-cyan ring-2 ring-sky-cyan/20 shadow-md text-white'
                : 'bg-[#f8fafd] hover:bg-[#f0f4f9] border-[#dadce0] text-[#444746]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                !isLight ? 'bg-sky-cyan/20 text-sky-cyan' : 'bg-white text-slate-700 shadow-xs'
              }`}>
                <span className="material-symbols-outlined text-[19px]">dark_mode</span>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                !isLight ? 'border-sky-cyan bg-sky-cyan' : 'border-slate-300'
              }`}>
                {!isLight && <span className="w-1.5 h-1.5 rounded-full bg-[#00344d]" />}
              </div>
            </div>
            <span className={`text-xs font-bold block ${!isLight ? 'text-white' : 'text-[#1f1f1f]'}`}>
              {t.themeNight}
            </span>
            <span className={`text-[10px] block mt-0.5 leading-tight ${!isLight ? 'text-sky-cyan' : 'text-[#5f6368]'}`}>
              {t.themeNightDesc}
            </span>
          </button>
        </div>
      </div>

      {/* Health & Environmental Profile */}
      <div className={`rounded-3xl p-4 border space-y-3 shadow-xs transition-all ${
        isLight ? 'bg-white border-[#dadce0] text-[#1f1f1f]' : 'bg-[#191f2f] border-white/10 text-white'
      }`}>
        <div className={`flex items-center justify-between pb-1 border-b ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
          <div className="flex items-center gap-2">
            <span className={`material-symbols-outlined ${isLight ? 'text-[#0b57d0]' : 'text-sky-cyan'}`}>
              medical_services
            </span>
            <h3 className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
              Health Sensitivity Level
            </h3>
          </div>
          <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>Personalized Alerts</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(['normal', 'sensitive', 'high'] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setSensitivity(level)}
              className={`py-2 px-2 rounded-2xl text-xs font-semibold capitalize transition-all cursor-pointer border ${
                sensitivity === level
                  ? isLight
                    ? 'bg-[#c2e7ff] text-[#001d35] border-transparent shadow-xs'
                    : 'bg-sky-cyan text-[#00344d] border-sky-cyan shadow-md'
                  : isLight
                  ? 'bg-[#f0f4f9] text-[#444746] hover:bg-[#e2e8f0] border-[#dadce0]'
                  : 'bg-[#151b2b] text-[#bec8d2] hover:text-white border-white/5'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <p className={`text-[11px] leading-snug ${isLight ? 'text-[#444746]' : 'text-[#bec8d2]'}`}>
          {sensitivity === 'high'
            ? 'Strict warnings triggered at AQI > 100 with immediate N95 and HEPA advice.'
            : sensitivity === 'sensitive'
            ? 'Notifies when PM2.5 or O3 reaches levels hazardous to asthma and outdoor sports.'
            : 'Standard EPA guideline thresholds apply.'}
        </p>
      </div>

      {/* Language Preference Card */}
      <div className={`rounded-3xl p-4 border space-y-3 shadow-xs transition-all ${
        isLight ? 'bg-white border-[#dadce0] text-[#1f1f1f]' : 'bg-[#191f2f] border-white/10 text-white'
      }`}>
        <div className={`flex items-center justify-between pb-1 border-b ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
          <div className="flex items-center gap-2">
            <span className={`material-symbols-outlined ${isLight ? 'text-[#0b57d0]' : 'text-primary'}`}>
              translate
            </span>
            <h3 className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
              {t.languageBarTitle}
            </h3>
          </div>
          <span className={`text-[10px] font-bold ${isLight ? 'text-[#0b57d0]' : 'text-sky-cyan'}`}>
            {language === 'en' ? 'English' : language === 'hi' ? 'हिंदी' : 'मराठी'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => onSelectLanguage?.(lang.code)}
              className={`py-2 px-2 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer border ${
                language === lang.code
                  ? isLight
                    ? 'bg-[#c2e7ff] text-[#001d35] border-[#0b57d0] shadow-xs font-bold'
                    : 'bg-sky-cyan text-[#00344d] border-sky-cyan shadow-md font-bold'
                  : isLight
                  ? 'bg-[#f0f4f9] text-[#444746] hover:bg-[#e2e8f0] border-[#dadce0]'
                  : 'bg-[#151b2b] text-[#bec8d2] hover:text-white border-white/5'
              }`}
            >
              <span>{lang.code === 'en' ? '🇬🇧' : '🇮🇳'}</span>
              <span>{lang.nativeName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Official CPCB India Atmospheric Standard Badge */}
      <div className={`rounded-3xl p-4 border space-y-2 shadow-xs transition-all ${
        isLight ? 'bg-white border-[#dadce0] text-[#1f1f1f]' : 'bg-[#191f2f] border-white/10 text-white'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              isLight ? 'bg-emerald-50 text-[#137333]' : 'bg-secondary/15 text-secondary'
            }`}>
              <span className="material-symbols-outlined text-[19px]">verified</span>
            </div>
            <div>
              <h3 className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                National Air Quality Standard
              </h3>
              <p className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                CPCB India • Central Pollution Control Board (National AQI)
              </p>
            </div>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
            isLight
              ? 'bg-emerald-50 text-[#137333] border-emerald-200'
              : 'bg-secondary/15 text-secondary border-secondary/30'
          }`}>
            CPCB India
          </span>
        </div>
      </div>

      {/* Connected IoT Air Purifiers */}
      <div className={`rounded-3xl p-4 border space-y-3 shadow-xs transition-all ${
        isLight ? 'bg-white border-[#dadce0] text-[#1f1f1f]' : 'bg-[#191f2f] border-white/10 text-white'
      }`}>
        <div className={`flex items-center justify-between pb-1 border-b ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
          <div className="flex items-center gap-2">
            <span className={`material-symbols-outlined ${isLight ? 'text-[#137333]' : 'text-secondary'}`}>
              mode_fan
            </span>
            <h3 className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
              Connected Purifier Sync
            </h3>
          </div>
          <span className={`text-[10px] font-bold ${isLight ? 'text-[#137333]' : 'text-secondary'}`}>
            1 Active
          </span>
        </div>

        <div className={`flex items-center justify-between p-3 rounded-2xl border ${
          isLight ? 'bg-[#f8fafd] border-[#dadce0]' : 'bg-[#151b2b] border-white/5'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isLight ? 'bg-emerald-100 text-[#137333]' : 'bg-secondary/15 text-secondary'
            }`}>
              <span className="material-symbols-outlined text-[18px]">air_purifier</span>
            </div>
            <div>
              <span className={`text-xs font-bold block ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                Living Room HEPA #01
              </span>
              <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                Auto Mode • Clean Delivery Rate 380 m³/h
              </span>
            </div>
          </div>
          <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${isLight ? 'bg-[#137333]' : 'bg-secondary'}`} />
        </div>
      </div>

      {/* Saved Favorite Stations */}
      <div className={`rounded-3xl p-4 border space-y-2 shadow-xs transition-all ${
        isLight ? 'bg-white border-[#dadce0] text-[#1f1f1f]' : 'bg-[#191f2f] border-white/10 text-white'
      }`}>
        <div className={`flex items-center justify-between pb-1 border-b ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
          <div className="flex items-center gap-2">
            <span className={`material-symbols-outlined ${isLight ? 'text-[#0b57d0]' : 'text-primary'}`}>
              bookmark
            </span>
            <h3 className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
              Saved Atmospheric Nodes
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('location')}
            className={`text-[11px] font-semibold hover:underline cursor-pointer ${
              isLight ? 'text-[#0b57d0]' : 'text-primary'
            }`}
          >
            Manage →
          </button>
        </div>

        <div className="space-y-1.5 pt-1">
          {STATIONS.slice(0, 3).map((st) => (
            <div
              key={st.id}
              onClick={() => onNavigate('home')}
              className={`flex items-center justify-between p-2.5 rounded-2xl transition-colors cursor-pointer border ${
                isLight
                  ? 'bg-[#f8fafd] hover:bg-[#f0f4f9] border-[#dadce0]'
                  : 'bg-[#151b2b] hover:bg-[#242a3a] border-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-sm ${isLight ? 'text-[#0b57d0]' : 'text-[#bec8d2]'}`}>
                  location_on
                </span>
                <span className={`text-xs font-medium ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                  {st.name}
                </span>
              </div>
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${st.aqiColor}20`, color: st.aqiColor }}
              >
                {st.aqi} AQI
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Account & Appearance Settings Card */}
      <div className={`rounded-3xl p-4 border space-y-3 shadow-xs transition-all ${
        isLight ? 'bg-white border-[#dadce0] text-[#1f1f1f]' : 'bg-[#191f2f] border-white/10 text-white'
      }`}>
        <div className={`flex items-center justify-between pb-1 border-b ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
          <div className="flex items-center gap-2">
            <span className={`material-symbols-outlined ${isLight ? 'text-[#0b57d0]' : 'text-primary'}`}>
              manage_accounts
            </span>
            <h3 className={`text-xs font-bold ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
              Account &amp; Session
            </h3>
          </div>
          <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>User Security</span>
        </div>

        {/* Theme Switch Row */}
        {onToggleTheme && (
          <div className={`flex items-center justify-between p-3 rounded-2xl border transition-colors ${
            isLight ? 'bg-[#f8fafd] border-[#dadce0]' : 'bg-[#151b2b] border-white/5'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isLight ? 'bg-amber-100 text-[#ea8600]' : 'bg-sky-cyan/20 text-sky-cyan'
              }`}>
                <span className="material-symbols-outlined text-[18px]">
                  {isLight ? 'wb_sunny' : 'dark_mode'}
                </span>
              </div>
              <div>
                <span className={`text-xs font-bold block ${isLight ? 'text-[#1f1f1f]' : 'text-white'}`}>
                  Display Mode
                </span>
                <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                  {isLight ? 'Day Mode (Google UI active)' : 'Night Mode (Dark aesthetic active)'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleTheme}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                isLight
                  ? 'bg-white hover:bg-slate-50 text-[#0b57d0] border-[#c2e7ff] shadow-xs'
                  : 'bg-[#191f2f] hover:bg-[#252b3d] text-sky-cyan border-white/10'
              }`}
            >
              {isLight ? 'Switch to Night' : 'Switch to Day'}
            </button>
          </div>
        )}

        {/* Logout Action Button */}
        {onLogout && (
          <div className={`flex items-center justify-between p-3 rounded-2xl border transition-colors ${
            isLight ? 'bg-[#fef7f7] border-[#fad2cf]' : 'bg-[#ef4444]/10 border-[#ef4444]/25'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isLight ? 'bg-[#fce8e6] text-[#d93025]' : 'bg-[#ef4444]/20 text-[#ef4444]'
              }`}>
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </div>
              <div>
                <span className={`text-xs font-bold block ${isLight ? 'text-[#d93025]' : 'text-white'}`}>
                  Sign Out of VayuX
                </span>
                <span className={`text-[10px] ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                  {user.email}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
                isLight
                  ? 'bg-[#d93025] hover:bg-[#b3261e] text-white'
                  : 'bg-[#ef4444] hover:bg-[#dc2626] text-white'
              }`}
            >
              Log Out
            </button>
          </div>
        )}
      </div>

      {/* Save Settings Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleSave}
          className={`w-full py-3.5 px-6 rounded-full font-bold text-xs active:scale-[0.98] transition-all cursor-pointer shadow-md ${
            isLight
              ? 'bg-[#0b57d0] hover:bg-[#1a73e8] text-white shadow-[#0b57d0]/20'
              : 'bg-sky-cyan text-[#00344d] hover:brightness-110 shadow-lg'
          }`}
        >
          {savedSuccess ? 'Preferences Saved ✓' : 'Save Health Profile'}
        </button>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && onLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
          <div className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 border ${
            isLight
              ? 'bg-white border-[#dadce0] text-[#1f1f1f] shadow-[0_8px_30px_rgba(60,64,67,0.2)]'
              : 'bg-[#191f2f] border-white/10 text-white'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                isLight ? 'bg-[#fce8e6] text-[#d93025]' : 'bg-[#ef4444]/20 text-[#ef4444]'
              }`}>
                <span className="material-symbols-outlined text-[22px]">logout</span>
              </div>
              <div>
                <h4 className={`font-bold text-base ${isLight ? 'text-[#202124]' : 'text-white'}`}>
                  Confirm Log Out
                </h4>
                <p className={`text-xs ${isLight ? 'text-[#5f6368]' : 'text-[#bec8d2]'}`}>
                  You will return to the sign-in screen.
                </p>
              </div>
            </div>

            <p className={`text-xs leading-relaxed ${isLight ? 'text-[#3c4043]' : 'text-white/80'}`}>
              Are you sure you want to log out of your VayuX atmospheric telemetry station?
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className={`flex-1 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-colors border ${
                  isLight
                    ? 'bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#3c4043] border-[#dadce0]'
                    : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
                className={`flex-1 py-2.5 rounded-full text-xs font-bold text-white cursor-pointer shadow-md transition-all ${
                  isLight
                    ? 'bg-[#d93025] hover:bg-[#b3261e]'
                    : 'bg-[#ef4444] hover:bg-[#dc2626]'
                }`}
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
