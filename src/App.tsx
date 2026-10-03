/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { STATIONS, ASSET_IMAGES, DEFAULT_AVATAR } from './data/stations';
import { ScreenType, StationData, UserProfile } from './types';
import { SupportedLanguage } from './utils/i18n';
import { TopHeader } from './components/TopHeader';
import { BottomNavBar } from './components/BottomNavBar';
import { NotificationsModal } from './components/NotificationsModal';
import { SkylineCamModal } from './components/SkylineCamModal';
import { StationQrModal } from './components/StationQrModal';
import { CleanAirAlarmModal } from './components/CleanAirAlarmModal';
import { StubbleFireModal } from './components/StubbleFireModal';
import { MapModal } from './components/MapModal';

import { SplashScreen } from './screens/SplashScreen';
import { LoginScreen } from './screens/LoginScreen';
import { LocationScreen } from './screens/LocationScreen';
import { HomeScreen } from './screens/HomeScreen';
import { AQIScreen } from './screens/AQIScreen';
import { WeatherScreen } from './screens/WeatherScreen';
import { PredictionScreen } from './screens/PredictionScreen';
import { ProfileScreen } from './screens/ProfileScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [selectedStation, setSelectedStation] = useState<StationData>(STATIONS[0]);

  // Day & Night Atmospheric Mode State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('vayux_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return 'dark';
  });

  useEffect(() => {
    try {
      localStorage.setItem('vayux_theme', theme);
    } catch {}
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Multilingual preference (English, Hindi, Marathi)
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('vayux_language');
      if (saved === 'en' || saved === 'hi' || saved === 'mr') return saved;
    } catch {}
    return 'en';
  });

  const handleSetLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang);
    try {
      localStorage.setItem('vayux_language', lang);
    } catch {}
  };

  const [user, setUser] = useState<UserProfile>(() => {
    let savedAvatar = DEFAULT_AVATAR;
    try {
      savedAvatar = localStorage.getItem('vayux_custom_avatar') || DEFAULT_AVATAR;
    } catch {
      // ignore
    }
    return {
      name: 'Payal Bhadoriya',
      email: 'payalbhadoriya009@gmail.com',
      avatarUrl: savedAvatar,
      notificationsEnabled: true,
      sensitivityLevel: 'sensitive',
      standard: 'CPCB India',
      savedStations: ['connaught-place', 'lodhi-road', 'anand-vihar']
    };
  });

  // Modal states
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCamOpen, setIsCamOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);
  const [isFireModalOpen, setIsFireModalOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `VayuX AQI Report - ${selectedStation.name}`,
          text: `Current AQI at ${selectedStation.name} is ${selectedStation.aqi} (${selectedStation.aqiStatus}). PM2.5 is ${selectedStation.pm25} µg/m³. Take precautions.`,
          url: window.location.href
        })
        .catch(() => {});
    } else {
      showToast('Live Air Quality Report copied to clipboard!');
    }
  };

  const handleSaveAlarm = (time: string) => {
    setIsAlarmOpen(false);
    showToast(`Clean Air Alarm set for ${time} AM window!`);
  };

  const toggleTheme = () => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  };

  const handleSelectTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    const label = newTheme === 'light' ? 'Day Mode (Google UI)' : 'Night Mode (Obsidian)';
    showToast(`Switched to ${label}`);
  };

  const handleLogout = () => {
    setUser({
      name: 'Payal Bhadoriya',
      email: 'payalbhadoriya009@gmail.com',
      avatarUrl: DEFAULT_AVATAR,
      notificationsEnabled: true,
      sensitivityLevel: 'sensitive',
      standard: 'CPCB India',
      savedStations: ['connaught-place', 'lodhi-road', 'anand-vihar']
    });
    try {
      localStorage.removeItem('vayux_custom_avatar');
    } catch {
      // ignore
    }
    setCurrentScreen('login');
    showToast('Signed out successfully');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans relative selection:bg-sky-cyan selection:text-[#00344d] transition-colors duration-300 ${
      theme === 'light' ? 'bg-[#f8fafd] text-[#1f1f1f]' : 'bg-[#0d1322] text-[#dde2f8]'
    }`}>
      {/* Screen Container */}
      <div className="flex-1 flex flex-col relative w-full">
        {currentScreen === 'splash' && (
          <SplashScreen onContinue={() => setCurrentScreen('login')} theme={theme} />
        )}

        {currentScreen === 'login' && (
          <LoginScreen
            theme={theme}
            onSuccess={(contact, name) => {
              const isEmail = contact.includes('@');
              setUser((prev) => ({
                ...prev,
                email: isEmail ? contact : prev.email,
                phone: !isEmail ? contact : prev.phone,
                name: name || prev.name
              }));
              showToast(`Logged in successfully as ${name || (isEmail ? contact : contact)}`);
              setCurrentScreen('location');
            }}
          />
        )}

        {currentScreen === 'location' && (
          <LocationScreen
            selectedStation={selectedStation}
            onSelectStation={(st) => setSelectedStation(st)}
            onContinue={() => setCurrentScreen('home')}
            onBack={() => setCurrentScreen('login')}
            onShare={handleShare}
            avatarUrl={user.avatarUrl}
            onOpenMap={() => setIsMapOpen(true)}
            theme={theme}
            onToggleTheme={toggleTheme}
            language={language}
            onSelectLanguage={handleSetLanguage}
          />
        )}

        {currentScreen === 'home' && (
          <>
            <TopHeader
              title="VayuX"
              subtitle="Dashboard"
              avatarUrl={user.avatarUrl}
              theme={theme}
              onToggleTheme={toggleTheme}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onOpenProfile={() => setCurrentScreen('profile')}
              onShare={handleShare}
              language={language}
              onSelectLanguage={handleSetLanguage}
            />

            <HomeScreen
              selectedStation={selectedStation}
              onSelectStation={(st) => setSelectedStation(st)}
              onNavigate={(s) => setCurrentScreen(s)}
              theme={theme}
              onOpenFireDetails={() => setIsFireModalOpen(true)}
              onOpenMap={() => setIsMapOpen(true)}
              language={language}
            />
            <BottomNavBar
              currentScreen={currentScreen}
              onNavigate={(s) => setCurrentScreen(s)}
              theme={theme}
              language={language}
            />
          </>
        )}

        {currentScreen === 'aqi' && (
          <>
            <TopHeader
              title="VayuX"
              subtitle="Aqi Analytics"
              avatarUrl={user.avatarUrl}
              theme={theme}
              onToggleTheme={toggleTheme}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onOpenProfile={() => setCurrentScreen('profile')}
              onShare={handleShare}
              language={language}
              onSelectLanguage={handleSetLanguage}
            />

            <AQIScreen
              selectedStation={selectedStation}
              onNavigate={(s) => setCurrentScreen(s)}
              onOpenCam={() => setIsCamOpen(true)}
              onOpenQr={() => setIsQrOpen(true)}
              onTriggerShare={handleShare}
              theme={theme}
            />
            <BottomNavBar
              currentScreen={currentScreen}
              onNavigate={(s) => setCurrentScreen(s)}
              theme={theme}
              language={language}
            />
          </>
        )}

        {currentScreen === 'weather' && (
          <>
            <TopHeader
              title="VayuX"
              subtitle="Weather Forecast"
              avatarUrl={user.avatarUrl}
              theme={theme}
              onToggleTheme={toggleTheme}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onOpenProfile={() => setCurrentScreen('profile')}
              onShare={handleShare}
              language={language}
              onSelectLanguage={handleSetLanguage}
            />

            <WeatherScreen
              selectedStation={selectedStation}
              onNavigate={(s) => setCurrentScreen(s)}
              onOpenAlarm={() => setIsAlarmOpen(true)}
              onShare={handleShare}
              theme={theme}
            />
            <BottomNavBar
              currentScreen={currentScreen}
              onNavigate={(s) => setCurrentScreen(s)}
              theme={theme}
              language={language}
            />
          </>
        )}

        {currentScreen === 'prediction' && (
          <>
            <TopHeader
              title="Explore Live"
              subtitle="Atmospheric Radar 72h"
              avatarUrl={user.avatarUrl}
              theme={theme}
              onToggleTheme={toggleTheme}
              showBack
              onBack={() => setCurrentScreen('weather')}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onOpenProfile={() => setCurrentScreen('profile')}
              onShare={handleShare}
              language={language}
              onSelectLanguage={handleSetLanguage}
            />
            <PredictionScreen
              selectedStation={selectedStation}
              onNavigate={(s) => setCurrentScreen(s)}
              onSelectStation={(st) => setSelectedStation(st)}
              theme={theme}
            />
            <BottomNavBar
              currentScreen={currentScreen}
              onNavigate={(s) => setCurrentScreen(s)}
              theme={theme}
              language={language}
            />
          </>
        )}

        {currentScreen === 'profile' && (
          <>
            <TopHeader
              title="VayuX"
              subtitle="Profile & Settings"
              avatarUrl={user.avatarUrl}
              theme={theme}
              onToggleTheme={toggleTheme}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onOpenProfile={() => setCurrentScreen('profile')}
              onShare={handleShare}
              language={language}
              onSelectLanguage={handleSetLanguage}
            />
            <ProfileScreen
              user={user}
              onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
              onNavigate={(s) => setCurrentScreen(s)}
              onAvatarChangedToast={showToast}
              theme={theme}
              onToggleTheme={toggleTheme}
              onSelectTheme={handleSelectTheme}
              onLogout={handleLogout}
              language={language}
              onSelectLanguage={handleSetLanguage}
            />
            <BottomNavBar
              currentScreen={currentScreen}
              onNavigate={(s) => setCurrentScreen(s)}
              theme={theme}
              language={language}
            />
          </>
        )}

      </div>

      {/* Floating Interactive Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-sky-cyan text-[#00344d] font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Atmospheric Alert Command Center Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        theme={theme}
        onOpenFireDetails={() => {
          setIsNotificationsOpen(false);
          setIsFireModalOpen(true);
        }}
      />

      {/* Live Optical Webcam Modal */}
      <SkylineCamModal
        isOpen={isCamOpen}
        onClose={() => setIsCamOpen(false)}
        stationName={selectedStation.name}
        theme={theme}
      />

      {/* Hardware Calibration QR Modal */}
      <StationQrModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        stationName={selectedStation.name}
        stationId={selectedStation.id.toUpperCase().slice(0, 5)}
        aqi={selectedStation.aqi}
        theme={theme}
      />

      {/* Clean Air Window Alarm Scheduler */}
      <CleanAirAlarmModal
        isOpen={isAlarmOpen}
        onClose={() => setIsAlarmOpen(false)}
        onSave={handleSaveAlarm}
        theme={theme}
      />

      {/* Satellite Stubble Fire Thermal Anomalies Modal */}
      <StubbleFireModal
        isOpen={isFireModalOpen}
        onClose={() => setIsFireModalOpen(false)}
        onNavigateToRadar={(screen) => setCurrentScreen(screen)}
        theme={theme}
      />

      {/* Basin Map Modal (5 Hotzones & 5 Green Zones) */}
      <MapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        theme={theme}
        onSelectStation={(zoneName) => {
          setIsMapOpen(false);
          showToast(`Monitoring zone set to: ${zoneName}`);
        }}
      />
    </div>
  );
}
