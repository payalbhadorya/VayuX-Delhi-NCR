export interface MapZone {
  id: string;
  name: string;
  subTitle: string;
  type: 'hotzone' | 'greenzone';
  aqi: number;
  aqiStatus: 'Pristine' | 'Good' | 'Moderate' | 'Poor' | 'Severe' | 'Hazardous';
  aqiColor: string;
  pm25: number;
  pm10: number;
  primaryFactor: string;
  healthAdvice: string;
  cleanWindow?: string;
  canopyFilterRate?: string;
  activeFiresNearby?: number;
  // Percentage coordinates on map (x: 0-100%, y: 0-100%)
  x: number;
  y: number;
  radius: number; // visual radius in map
}

export const MAP_ZONES: MapZone[] = [
  // --- HOTZONES (Severe / Hazardous / Industrial / Stubble Burning) ---
  {
    id: 'hz-stubble-arc',
    name: 'NW Stubble Burning Entry Arc',
    subTitle: 'Singhu / Tikri Border Corridor (Punjab-Haryana Drift)',
    type: 'hotzone',
    aqi: 365,
    aqiStatus: 'Hazardous',
    aqiColor: '#7f1d1d',
    pm25: 310,
    pm10: 480,
    primaryFactor: '1,428 Satellite Farm Fires & NW Biomass Smoke Funnel',
    healthAdvice: 'Extreme toxic smoke plume. Outdoor activity prohibited. Wear N95 mandatory.',
    activeFiresNearby: 1428,
    x: 18,
    y: 16,
    radius: 36
  },
  {
    id: 'hz-anand-vihar',
    name: 'Anand Vihar & Ghazipur Hotzone',
    subTitle: 'East Delhi Inter-State Terminal & Landfill',
    type: 'hotzone',
    aqi: 285,
    aqiStatus: 'Severe',
    aqiColor: '#ef4444',
    pm25: 238,
    pm10: 395,
    primaryFactor: 'Diesel Bus Stagnation & Low Boundary Layer Thermal Inversion',
    healthAdvice: 'Severe particulate trap. Run HEPA air purifiers at maximum speed.',
    x: 78,
    y: 42,
    radius: 28
  },
  {
    id: 'hz-jahangirpuri',
    name: 'Jahangirpuri & Wazirpur Industrial',
    subTitle: 'North Delhi Heavy Industrial Sector',
    type: 'hotzone',
    aqi: 310,
    aqiStatus: 'Hazardous',
    aqiColor: '#7f1d1d',
    pm25: 265,
    pm10: 420,
    primaryFactor: 'Industrial Smelting, Metal Finishing & Stagnant Air Pool',
    healthAdvice: 'Cease outdoor exposure. High risk of respiratory irritation.',
    x: 36,
    y: 28,
    radius: 26
  },
  {
    id: 'hz-bawana',
    name: 'Bawana & Narela Cluster',
    subTitle: 'North-West Manufacturing & Waste Processing Belt',
    type: 'hotzone',
    aqi: 295,
    aqiStatus: 'Severe',
    aqiColor: '#ef4444',
    pm25: 245,
    pm10: 410,
    primaryFactor: 'Industrial Boilers, Heavy Truck Logistics & Waste Incineration',
    healthAdvice: 'Keep residential vents closed. High VOC and sulfur concentrations.',
    x: 24,
    y: 32,
    radius: 25
  },
  {
    id: 'hz-okhla',
    name: 'Okhla & Badarpur Logistics Basin',
    subTitle: 'South-East Commercial & Transit Hub',
    type: 'hotzone',
    aqi: 240,
    aqiStatus: 'Poor',
    aqiColor: '#ef4444',
    pm25: 195,
    pm10: 320,
    primaryFactor: 'Waste-to-Energy Dispersion & Mathura Road Diesel Freight',
    healthAdvice: 'Sensitive groups, elderly, and children should remain strictly indoors.',
    x: 74,
    y: 72,
    radius: 24
  },

  // --- GREEN ZONES (Clean Air Sanctuaries / Forest Canopy Sinks) ---
  {
    id: 'gz-asola-bhatti',
    name: 'Asola Bhatti Wildlife Sanctuary',
    subTitle: 'Southern Ridge Biodiversity Haven (32.7 km²)',
    type: 'greenzone',
    aqi: 34,
    aqiStatus: 'Pristine',
    aqiColor: '#10b981',
    pm25: 12,
    pm10: 28,
    primaryFactor: 'Dense Native Forest Canopy & Natural Particulate Filter',
    healthAdvice: 'Optimal clean air zone! 84% lower particulate count than urban basin.',
    cleanWindow: 'All Day (Best 5:00 AM – 10:00 AM)',
    canopyFilterRate: '88% PM absorption rate',
    x: 62,
    y: 86,
    radius: 34
  },
  {
    id: 'gz-central-ridge',
    name: 'Delhi Central Ridge & Buddha Jayanti',
    subTitle: 'Central Forest Lungs & Geological Spine',
    type: 'greenzone',
    aqi: 46,
    aqiStatus: 'Good',
    aqiColor: '#10b981',
    pm25: 18,
    pm10: 42,
    primaryFactor: 'Neem & Vilayati Kikar Bio-Shield with Microclimate Cooling',
    healthAdvice: 'Superb zone for morning walks, deep breathing, and outdoor exercises.',
    cleanWindow: '5:30 AM – 8:30 AM & 5:00 PM – 7:00 PM',
    canopyFilterRate: '72% particulate filtration',
    x: 44,
    y: 50,
    radius: 28
  },
  {
    id: 'gz-lodhi-gardens',
    name: 'Lodhi Gardens & Nehru Botanical Sink',
    subTitle: 'Lutyens Heritage Canopy Micro-Sink (90 Acres)',
    type: 'greenzone',
    aqi: 58,
    aqiStatus: 'Good',
    aqiColor: '#10b981',
    pm25: 22,
    pm10: 54,
    primaryFactor: 'Centuries-old Banyan, Peepal & Shaded Canopy Ventilation',
    healthAdvice: 'Natural micro-sink protects pedestrians from surrounding arterial smog.',
    cleanWindow: '5:00 AM – 7:30 AM (AQI drops to 42)',
    canopyFilterRate: '65% dust suppression',
    x: 52,
    y: 58,
    radius: 25
  },
  {
    id: 'gz-sanjay-van',
    name: 'Sanjay Van & Qutub Green Woods',
    subTitle: '783-Acre Protected Deep Woodland',
    type: 'greenzone',
    aqi: 42,
    aqiStatus: 'Pristine',
    aqiColor: '#10b981',
    pm25: 15,
    pm10: 36,
    primaryFactor: 'High Moisture Micro-climate & Dense Avian Wildlife Sanctuary',
    healthAdvice: 'Pristine atmospheric pocket. Temperatures 2.8°C cooler than downtown.',
    cleanWindow: 'Dawn to Dusk',
    canopyFilterRate: '82% aerosol buffering',
    x: 42,
    y: 74,
    radius: 30
  },
  {
    id: 'gz-aravalli-biopark',
    name: 'Aravalli Biodiversity Forest Park',
    subTitle: 'Restored Native Scrub & Ridge Ecosystem',
    type: 'greenzone',
    aqi: 52,
    aqiStatus: 'Good',
    aqiColor: '#10b981',
    pm25: 20,
    pm10: 48,
    primaryFactor: 'Native Dhau, Salai & Khair Foliage Particulate Settling',
    healthAdvice: 'Ideal eco-corridor for cycling, brisk walking, and lung rejuvenation.',
    cleanWindow: '6:00 AM – 9:00 AM',
    canopyFilterRate: '74% dust capture',
    x: 28,
    y: 80,
    radius: 26
  }
];
