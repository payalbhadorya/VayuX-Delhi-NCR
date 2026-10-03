export type SupportedLanguage = 'en' | 'hi' | 'mr';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  shortLabel: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', shortLabel: 'EN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', shortLabel: 'हिं' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', shortLabel: 'मरा' }
];

export const translations = {
  en: {
    // Navigation
    navHome: 'Home',
    navAQI: 'AQI',
    navWeather: 'Weather',
    navMap: 'Map',
    navProfile: 'Profile',

    // Header
    searchPlaceholder: 'Search station or sector...',
    logOut: 'Log Out',
    logOutConfirmTitle: 'Sign out of VayuX?',
    logOutConfirmDesc: 'You will need to sign in again to access your live atmospheric alerts.',
    cancel: 'Cancel',
    confirmLogOut: 'Log Out',
    themeDay: 'Day Mode',
    themeNight: 'Night Mode',
    themeTitle: 'Display Theme & Appearance',
    themeSubtitle: 'Choose Day (Light) or Night (Dark) mode',
    themeDayDesc: 'Crisp Google UI day mode with high contrast',
    themeNightDesc: 'Obsidian dark atmospheric mode for low glare',

    // Language Bar
    languageBarTitle: 'Choose Language Preference',
    languageSub: 'Change the language of the entire app',

    // Location Screen
    locationTitle: 'Set Your Location',
    locationSubtitle: 'Get precise air quality and weather alerts right where you breathe.',
    hyperlocalRadar: 'Hyperlocal Radar',
    useCurrentLocation: 'Use Current Location',
    detectingGps: 'Detecting GPS...',
    gpsLocked: 'Precision GPS • Locked onto live coordinates',
    tapToLocate: 'Tap to locate nearest monitoring station automatically',
    searchStationPlaceholder: 'Search Delhi-NCR or landmark...',
    nearbyStations: 'Nearby & Popular Stations',
    stationSelectedDirect: 'Location selected! Navigating to Home...',
    interactiveMap: 'Interactive Station Map',
    tapPinHint: 'Tap any pin or hotzone to set as active station',
    cleanAirSink: 'Clean Air Sink',
    criticalHotspot: 'Critical Hotzone',
    viewFullMap: 'Open Fullscreen Map',
    stationDetail: 'Station Detail',
    shareLocation: 'Share Station',

    // Statuses
    statusGood: 'Good',
    statusModerate: 'Moderate',
    statusUnhealthy: 'Unhealthy',
    statusVeryUnhealthy: 'Very Unhealthy',
    statusSevere: 'Severe',
    statusHazardous: 'Hazardous',

    // Home Screen
    liveTelemetry: 'Live Telemetry',
    stationActive: 'Station Active',
    airQualityIndex: 'Air Quality Index',
    primaryPollutant: 'Primary Pollutant',
    healthRisk: 'Health Advisory',
    keyPollutants: 'Key Pollutants Breakdown',
    hourlyTrend: '24-Hour Air Quality Trend',
    threeDayOutlook: '3-Day Atmospheric Outlook',
    hyperlocalAdvisory: 'Hyperlocal Health Guidance',
    maskRecommended: 'N95 Respirator Advised',
    maskDesc: 'High particulate matter detected outdoors. Wear protective mask.',
    purifierRecommended: 'Run Air Purifier Indoors',
    purifierDesc: 'Keep windows sealed and run HEPA filters on medium/high.',
    exerciseCaution: 'Limit Heavy Outdoor Cardio',
    exerciseDesc: 'Postpone intense outdoor runs and cycling until AQI improves.',
    vulnerableAlert: 'Protect Seniors & Children',
    vulnerableDesc: 'Asthma and respiratory patients should remain indoors.',

    // Satellite Card
    satelliteFirms: 'NASA Satellite FIRMS',
    thermalAnomalies: 'Thermal Anomalies & Stubble Fires',
    activeHotspots: 'Active Hotspots',
    aqiImpact: 'AQI Impact',
    plumeDrift: 'Plume Drift',
    satelliteDesc: 'NASA polar-orbiting satellites track active crop residue burn signatures across northern agricultural belts. Stagnant nocturnal boundary layers carry smoke southeasterly toward the Delhi airshed.',
    viewThermalData: 'View Thermal Data',
    mapHotzones: 'Map Hotzones',
    exploreDetailedAQI: 'Explore Detailed AQI Analysis',
    checkWeatherAlerts: 'Check Microclimate & Weather',

    // Weather Screen
    weatherTitle: 'Microclimate & Weather',
    weatherDesc: 'Atmospheric boundary layer and wind dispersion dynamics',
    tempFeelsLike: 'Feels Like',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    uvIndex: 'UV Index',
    pressure: 'Pressure',
    visibility: 'Visibility',
    cloudCover: 'Cloud Cover',
    dewPoint: 'Dew Point',
    hourlyWeather: 'Hourly Meteorological Trend',

    // AQI Screen
    aqiBreakdown: 'Pollutant Concentrations',
    healthPrecautions: 'Health Precautions & Guidance',
    standardsToggle: 'Standard: ',

    // Profile Screen
    profileTitle: 'Profile & Settings',
    accountInfo: 'Account & Identity',
    sensitivityTitle: 'Health Sensitivity Level',
    normalSensitivity: 'Standard',
    sensitiveGroup: 'Sensitive',
    highSensitivity: 'High Risk',
    aqiStandard: 'AQI Calculation Standard',
    usAqi: 'US EPA Standard',
    cpcbAqi: 'CPCB India Standard',
    notifications: 'Real-time Pollution Alerts',
    savePreferences: 'Save Preferences',
    savedNotification: 'Preferences saved successfully!'
  },

  hi: {
    // Navigation
    navHome: 'होम',
    navAQI: 'एक्यूआई',
    navWeather: 'मौसम',
    navMap: 'नक्शा',
    navProfile: 'प्रोफ़ाइल',

    // Header
    searchPlaceholder: 'स्टेशन या क्षेत्र खोजें...',
    logOut: 'लॉग आउट',
    logOutConfirmTitle: 'वायुएक्स से लॉग आउट करें?',
    logOutConfirmDesc: 'लाइव वायु अलर्ट देखने के लिए आपको फिर से साइन इन करना होगा।',
    cancel: 'रद्द करें',
    confirmLogOut: 'लॉग आउट करें',
    themeDay: 'दिन मोड',
    themeNight: 'रात मोड',
    themeTitle: 'थीम और दिखावट',
    themeSubtitle: 'VayuX के लिए दिन (लाइट) या रात (डार्क) मोड चुनें',
    themeDayDesc: 'दिन के लिए गूगल यूआई लाइट मोड',
    themeNightDesc: 'रात के लिए गहरा ऑब्सिडियन मोड',

    // Language Bar
    languageBarTitle: 'अपनी भाषा का चयन करें',
    languageSub: 'पूरी ऐप को अपनी पसंदीदा भाषा में बदलें',

    // Location Screen
    locationTitle: 'अपना स्थान चुनें',
    locationSubtitle: 'जहाँ आप सांस लेते हैं, वहां का सटीक वायु गुणवत्ता और मौसम अलर्ट प्राप्त करें।',
    hyperlocalRadar: 'हाइपरलोकल रडार',
    useCurrentLocation: 'वर्तमान स्थान का उपयोग करें',
    detectingGps: 'जीपीएस खोज रहे हैं...',
    gpsLocked: 'सटीक जीपीएस • लाइव निर्देशांक से जुड़ा',
    tapToLocate: 'निकटतम निगरानी केंद्र का स्वचालित पता लगाने के लिए टैप करें',
    searchStationPlaceholder: 'दिल्ली-एनसीआर या स्थल खोजें...',
    nearbyStations: 'निकटवर्ती और लोकप्रिय स्टेशन',
    stationSelectedDirect: 'स्थान चुना गया! होम स्क्रीन पर जा रहे हैं...',
    interactiveMap: 'इंटरैक्टिव स्टेशन नक्शा',
    tapPinHint: 'सक्रिय स्टेशन चुनने के लिए किसी भी पिन या हॉटज़ोन पर टैप करें',
    cleanAirSink: 'स्वच्छ वायु क्षेत्र',
    criticalHotspot: 'गंभीर हॉटस्पॉट',
    viewFullMap: 'पूरा नक्शा खोलें',
    stationDetail: 'स्टेशन विवरण',
    shareLocation: 'स्टेशन साझा करें',

    // Statuses
    statusGood: 'अच्छा',
    statusModerate: 'मध्यम',
    statusUnhealthy: 'अस्वस्थ',
    statusVeryUnhealthy: 'बहुत अस्वस्थ',
    statusSevere: 'गंभीर',
    statusHazardous: 'घातक',

    // Home Screen
    liveTelemetry: 'लाइव डेटा',
    stationActive: 'स्टेशन सक्रिय',
    airQualityIndex: 'वायु गुणवत्ता सूचकांक',
    primaryPollutant: 'मुख्य प्रदूषक',
    healthRisk: 'स्वास्थ्य परामर्श',
    keyPollutants: 'प्रमुख प्रदूषकों का विवरण',
    hourlyTrend: '24 घंटे का वायु गुणवत्ता रुझान',
    threeDayOutlook: '3-दिवसीय वायु पूर्वानुमान',
    hyperlocalAdvisory: 'हाइपरलोकल स्वास्थ्य सलाह',
    maskRecommended: 'N95 मास्क की सलाह',
    maskDesc: 'बाहर भारी धूल और धुंध है। बाहर जाते समय मास्क अवश्य पहनें।',
    purifierRecommended: 'कमरे में एयर प्यूरीफायर चलाएं',
    purifierDesc: 'खिड़कियां बंद रखें और हेपा फिल्टर को मध्यम/तेज गति पर रखें।',
    exerciseCaution: 'बाहर कसरत करने से बचें',
    exerciseDesc: 'एक्यूआई सुधरने तक बाहरी दौड़ और साइकिलिंग सीमित करें।',
    vulnerableAlert: 'बुजुर्गों और बच्चों की रक्षा करें',
    vulnerableDesc: 'अस्थमा और सांस के रोगियों को घर के अंदर रहना चाहिए।',

    // Satellite Card
    satelliteFirms: 'नासा उपग्रह फ़र्म्स',
    thermalAnomalies: 'पराली की आग और थर्मल विसंगतियाँ',
    activeHotspots: 'सक्रिय हॉटस्पॉट',
    aqiImpact: 'एक्यूआई प्रभाव',
    plumeDrift: 'धुएँ का बहाव',
    satelliteDesc: 'नासा के उपग्रह उत्तरी कृषि क्षेत्रों में पराली जलाने की गतिविधियों पर नज़र रख रहे हैं। रात की ठंडी हवा धुआं दिल्ली की ओर ला रही है।',
    viewThermalData: 'थर्मल डेटा देखें',
    mapHotzones: 'नक्शे पर हॉटज़ोन',
    exploreDetailedAQI: 'विस्तृत एक्यूआई विश्लेषण देखें',
    checkWeatherAlerts: 'मौसम और हवा का रुख देखें',

    // Weather Screen
    weatherTitle: 'मौसम और जलवायु',
    weatherDesc: 'वातावरण की परत और हवा का फैलाव',
    tempFeelsLike: 'महसूस',
    humidity: 'नमी',
    windSpeed: 'हवा की गति',
    uvIndex: 'यूवी इंडेक्स',
    pressure: 'वायुदाब',
    visibility: 'दृश्यता',
    cloudCover: 'बादल',
    dewPoint: 'ओसांक',
    hourlyWeather: 'प्रति घंटे का मौसम रुझान',

    // AQI Screen
    aqiBreakdown: 'प्रदूषक सांद्रता',
    healthPrecautions: 'स्वास्थ्य सावधानियां और सुझाव',
    standardsToggle: 'मानक: ',

    // Profile Screen
    profileTitle: 'प्रोफ़ाइल और सेटिंग्स',
    accountInfo: 'खाता और पहचान',
    sensitivityTitle: 'स्वास्थ्य संवेदनशीलता',
    normalSensitivity: 'सामान्य',
    sensitiveGroup: 'संवेदनशील',
    highSensitivity: 'उच्च जोखिम',
    aqiStandard: 'एक्यूआई गणना मानक',
    usAqi: 'अमेरिकी ईपीए मानक',
    cpcbAqi: 'सीपीसीबी भारत मानक',
    notifications: 'प्रदूषण चेतावनी अलर्ट',
    savePreferences: 'सेटिंग्स सहेजें',
    savedNotification: 'प्राथमिकताएं सफलतापूर्वक सहेजी गईं!'
  },

  mr: {
    // Navigation
    navHome: 'मुख्यपृष्ठ',
    navAQI: 'AQI',
    navWeather: 'हवामान',
    navMap: 'नकाशा',
    navProfile: 'प्रोफाइल',

    // Header
    searchPlaceholder: 'स्थानक किंवा परिसर शोधा...',
    logOut: 'लॉग आउट',
    logOutConfirmTitle: 'VayuX मधून बाहेर पडायचे?',
    logOutConfirmDesc: 'थेट हवा गुणवत्ता सूचना मिळवण्यासाठी तुम्हाला पुन्हा साइन इन करावे लागेल.',
    cancel: 'रद्द करा',
    confirmLogOut: 'लॉग आउट करा',
    themeDay: 'दिवस मोड',
    themeNight: 'रात्र मोड',
    themeTitle: 'थीम आणि स्वरूप',
    themeSubtitle: 'VayuX साठी दिवस (लाइट) किंवा रात्र (डार्क) मोड निवडा',
    themeDayDesc: 'दिवसासाठी स्वच्छ गुगल लाइट मोड',
    themeNightDesc: 'रात्रीसाठी गडद ऑब्सिडियन मोड',

    // Language Bar
    languageBarTitle: 'भाषा प्राधान्य निवडा',
    languageSub: 'संपूर्ण ॲपची भाषा तुमच्या आवडीनुसार बदला',

    // Location Screen
    locationTitle: 'तुमचे स्थान निवडा',
    locationSubtitle: 'तुम्ही जिथे राहता आणि श्वास घेता तिथली अचूक हवा गुणवत्ता आणि हवामान सूचना मिळवा.',
    hyperlocalRadar: 'हायपरलोकल रडार',
    useCurrentLocation: 'सध्याचे स्थान वापरा',
    detectingGps: 'जीपीएस शोधत आहे...',
    gpsLocked: 'अचूक जीपीएस • थेट निर्देशांकांशी जोडले',
    tapToLocate: 'जवळचे निरीक्षण केंद्र आपोआप निवडण्यासाठी टॅप करा',
    searchStationPlaceholder: 'दिल्ली-एनसीआर किंवा ठिकाण शोधा...',
    nearbyStations: 'जवळची आणि लोकप्रिय स्थानके',
    stationSelectedDirect: 'स्थान निवडले! मुख्यपृष्ठावर जात आहोत...',
    interactiveMap: 'संवादी स्थानक नकाशा',
    tapPinHint: 'सक्रिय स्थानक निवडण्यासाठी कोणत्याही पिन किंवा हॉटझोनवर टॅप करा',
    cleanAirSink: 'स्वच्छ हवा क्षेत्र',
    criticalHotspot: 'गंभीर हॉटस्पॉट',
    viewFullMap: 'पूर्ण नकाशा उघडा',
    stationDetail: 'स्थानकाचा तपशील',
    shareLocation: 'स्थानक शेअर करा',

    // Statuses
    statusGood: 'उत्तम',
    statusModerate: 'मध्यम',
    statusUnhealthy: 'अस्वास्थ्यकर',
    statusVeryUnhealthy: 'खूप अस्वास्थ्यकर',
    statusSevere: 'गंभीर',
    statusHazardous: 'धोकादायक',

    // Home Screen
    liveTelemetry: 'थेट माहिती',
    stationActive: 'स्थानक सक्रिय',
    airQualityIndex: 'हवा गुणवत्ता निर्देशांक',
    primaryPollutant: 'प्रमुख प्रदूषक',
    healthRisk: 'आरोग्य सल्ला',
    keyPollutants: 'प्रमुख प्रदूषकांचे प्रमाण',
    hourlyTrend: '24 तासांचा हवा गुणवत्ता कल',
    threeDayOutlook: '3-दिवसीय वातावरणाचा अंदाज',
    hyperlocalAdvisory: 'हायपरलोकल आरोग्य मार्गदर्शन',
    maskRecommended: 'N95 मास्क वापरण्याचा सल्ला',
    maskDesc: 'बाहेर हवेत घातक सूक्ष्मकण आहेत. बाहेर जाताना मास्क नक्की वापरा.',
    purifierRecommended: 'घरात एअर प्युरिफायर सुरू ठेवा',
    purifierDesc: 'खिडक्या बंद ठेवा आणि हेपा फिल्टर मध्यम/उच्च गतीने चालवा.',
    exerciseCaution: 'बाहेर जास्त व्यायाम करणे टाळा',
    exerciseDesc: 'हवेची गुणवत्ता सुधारेपर्यंत बाहेर धावणे आणि सायकलिंग टाळा.',
    vulnerableAlert: 'वृद्ध व लहान मुलांची काळजी घ्या',
    vulnerableDesc: 'दमा आणि श्वसनाचा त्रास असणाऱ्यांनी घरातच राहावे.',

    // Satellite Card
    satelliteFirms: 'नासा उपग्रह फर्म्स',
    thermalAnomalies: 'पेंढा जाळणे आणि उष्णता विसंगती',
    activeHotspots: 'सक्रिय हॉटस्पॉट्स',
    aqiImpact: 'AQI वरील परिणाम',
    plumeDrift: 'धुराची दिशा',
    satelliteDesc: 'नासाचे उपग्रह उत्तरेकडील शेतांमध्ये पेंढा जाळण्याच्या घटनांवर लक्ष ठेवून आहेत. रात्रीच्या संथ वाऱ्यामुळे धूर दिल्लीकडे वाहत आहे.',
    viewThermalData: 'थर्मल माहिती पहा',
    mapHotzones: 'नकाशावर हॉटझोन पहा',
    exploreDetailedAQI: 'तपशीलवार AQI विश्लेषण पहा',
    checkWeatherAlerts: 'हवामान आणि वाऱ्याची स्थिती तपासा',

    // Weather Screen
    weatherTitle: 'हवामान आणि वातावरण',
    weatherDesc: 'वातावरणाचा स्तर आणि वाऱ्याची दिशा',
    tempFeelsLike: 'जाणवणारे तापमान',
    humidity: 'आर्द्रता',
    windSpeed: 'वाऱ्याचा वेग',
    uvIndex: 'यूव्ही निर्देशांक',
    pressure: 'हवेचा दाब',
    visibility: 'दृश्यमानता',
    cloudCover: 'ढगाळ वातावरण',
    dewPoint: 'दवबिंदू',
    hourlyWeather: 'तासनिहाय हवामानाचा कल',

    // AQI Screen
    aqiBreakdown: 'प्रदूषकांचे प्रमाण',
    healthPrecautions: 'आरोग्यविषयक काळजी आणि सूचना',
    standardsToggle: 'मानक: ',

    // Profile Screen
    profileTitle: 'प्रोफाइल आणि सेटिंग्ज',
    accountInfo: 'खाते आणि ओळख',
    sensitivityTitle: 'आरोग्य संवेदनशीलता',
    normalSensitivity: 'सामान्य',
    sensitiveGroup: 'संवेदनशील',
    highSensitivity: 'उच्च जोखीम',
    aqiStandard: 'AQI मोजणीचे मानक',
    usAqi: 'अमेरिकन EPA मानक',
    cpcbAqi: 'CPCB भारत मानक',
    notifications: 'प्रदूषण चेतावणी सूचना',
    savePreferences: 'प्राधान्ये जतन करा',
    savedNotification: 'सेटिंग्ज यशस्वीरित्या जतन केल्या!'
  }
};

export const getTranslation = (lang: SupportedLanguage) => {
  return translations[lang] || translations.en;
};
