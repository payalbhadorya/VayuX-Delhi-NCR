export interface StubbleDistrictHotspot {
  district: string;
  state: 'Punjab' | 'Haryana' | 'Uttar Pradesh';
  fireCount: number;
  frp: number; // Fire Radiative Power in Megawatts
  riskLevel: 'Severe' | 'High' | 'Moderate';
  lat: number;
  lng: number;
}

export interface StubbleSatelliteReport {
  lastSatellitePass: string;
  sourceSatellites: string[];
  totalFires24h: number;
  totalFiresYesterday: number;
  totalFrpMw: number;
  smokeContributionAqi: number; // e.g. +68 AQI
  smokeContributionPercentage: number; // e.g. 38%
  windTransportVector: {
    speedKmh: number;
    direction: string;
    bearingDeg: number;
    plumeEtaHours: number;
  };
  dominantBiomass: string;
  hotspots: StubbleDistrictHotspot[];
}

export const STUBBLE_FIRE_DATA: StubbleSatelliteReport = {
  lastSatellitePass: 'VIIRS Overpass 08:45 AM UTC (14:15 IST)',
  sourceSatellites: ['NASA VIIRS (Suomi-NPP)', 'NOAA-20 VIIRS 375m', 'MODIS Terra/Aqua'],
  totalFires24h: 1428,
  totalFiresYesterday: 1195,
  totalFrpMw: 4820,
  smokeContributionAqi: 68,
  smokeContributionPercentage: 38,
  windTransportVector: {
    speedKmh: 14,
    direction: 'NW (North-West)',
    bearingDeg: 315,
    plumeEtaHours: 5.5
  },
  dominantBiomass: 'Paddy / Rice Crop Residue (Kharif Harvest)',
  hotspots: [
    {
      district: 'Sangrur',
      state: 'Punjab',
      fireCount: 342,
      frp: 1280,
      riskLevel: 'Severe',
      lat: 30.2458,
      lng: 75.8421
    },
    {
      district: 'Firozpur',
      state: 'Punjab',
      fireCount: 284,
      frp: 940,
      riskLevel: 'Severe',
      lat: 30.9237,
      lng: 74.6113
    },
    {
      district: 'Bathinda',
      state: 'Punjab',
      fireCount: 218,
      frp: 780,
      riskLevel: 'High',
      lat: 30.211,
      lng: 74.9455
    },
    {
      district: 'Fatehabad',
      state: 'Haryana',
      fireCount: 165,
      frp: 520,
      riskLevel: 'High',
      lat: 29.5147,
      lng: 75.4526
    },
    {
      district: 'Karnal',
      state: 'Haryana',
      fireCount: 142,
      frp: 410,
      riskLevel: 'Moderate',
      lat: 29.6857,
      lng: 76.9905
    },
    {
      district: 'Kaithal',
      state: 'Haryana',
      fireCount: 118,
      frp: 360,
      riskLevel: 'Moderate',
      lat: 29.8015,
      lng: 76.3996
    }
  ]
};
