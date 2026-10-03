export type ScreenType =
  | 'splash'
  | 'login'
  | 'location'
  | 'home'
  | 'aqi'
  | 'weather'
  | 'prediction'
  | 'profile';

export interface StationData {
  id: string;
  name: string;
  subName: string;
  distance: string;
  aqi: number;
  aqiStatus: 'Good' | 'Moderate' | 'Sensitive' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  aqiColor: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDir: string;
  uvIndex: number;
  weatherCondition: string;
  weatherDesc: string;
  pm25: number;
  pm10: number;
  co: number;
  co2: number;
  o3: number;
  so2: number;
  no2: number;
  pressure: number;
  visibility: number;
  cloudCover: number;
  dewPoint: number;
  coords: { lat: number; lng: number };
  trend24h: { hour: string; aqi: number }[];
  forecast72h: { day: string; aqi: number; status: string; temp: number }[];
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  avatarUrl: string;
  notificationsEnabled: boolean;
  sensitivityLevel: 'normal' | 'sensitive' | 'high';
  standard: 'CPCB India';
  savedStations: string[];
}
