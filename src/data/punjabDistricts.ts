import type { WeatherCondition } from '../types'

export interface PunjabDistrictWeather extends WeatherCondition {
  districtName: string
  punjabiName: string
  subZone: 'Majha' | 'Doaba' | 'Central Malwa' | 'South-Western Malwa' | 'Kandi Foothills'
  majorCrops: string[]
  soilType: string
  latitude?: number
  longitude?: number
  isLive?: boolean
  lastUpdated?: string
}

export const PUNJAB_DISTRICT_COORDINATES: Record<string, { lat: number; lon: number; name: string }> = {
  Amritsar: { lat: 31.6340, lon: 74.8723, name: 'Amritsar' },
  Barnala: { lat: 30.3819, lon: 75.5469, name: 'Barnala' },
  Bathinda: { lat: 30.2110, lon: 74.9455, name: 'Bathinda' },
  Faridkot: { lat: 30.6769, lon: 74.7583, name: 'Faridkot' },
  FatehgarhSahib: { lat: 30.6490, lon: 76.3986, name: 'Fatehgarh Sahib' },
  Fazilka: { lat: 30.4039, lon: 74.0270, name: 'Fazilka' },
  Ferozepur: { lat: 30.9237, lon: 74.6121, name: 'Ferozepur' },
  Gurdaspur: { lat: 32.0419, lon: 75.4053, name: 'Gurdaspur' },
  Hoshiarpur: { lat: 31.5273, lon: 75.9149, name: 'Hoshiarpur' },
  Jalandhar: { lat: 31.3260, lon: 75.5762, name: 'Jalandhar' },
  Kapurthala: { lat: 31.3802, lon: 75.3800, name: 'Kapurthala' },
  Ludhiana: { lat: 30.9010, lon: 75.8573, name: 'Ludhiana' },
  Malerkotla: { lat: 30.5284, lon: 75.8872, name: 'Malerkotla' },
  Mansa: { lat: 29.9880, lon: 75.3890, name: 'Mansa' },
  Moga: { lat: 30.8230, lon: 75.1734, name: 'Moga' },
  Muktsar: { lat: 30.4762, lon: 74.5161, name: 'Sri Muktsar Sahib' },
  Pathankot: { lat: 32.2643, lon: 75.6421, name: 'Pathankot' },
  Patiala: { lat: 30.3398, lon: 76.3869, name: 'Patiala' },
  Rupnagar: { lat: 30.9664, lon: 76.5331, name: 'Rupnagar' },
  SASNagar: { lat: 30.7046, lon: 76.7179, name: 'SAS Nagar (Mohali)' },
  Sangrur: { lat: 30.2458, lon: 75.8421, name: 'Sangrur' },
  SBSNagar: { lat: 31.1256, lon: 76.1187, name: 'SBS Nagar' },
  TarnTaran: { lat: 31.4520, lon: 74.9268, name: 'Tarn Taran' },
}

export const punjabDistrictsData: Record<string, PunjabDistrictWeather> = {
  Amritsar: {
    districtName: 'Amritsar',
    punjabiName: 'ਅੰਮ੍ਰਿਤਸਰ',
    subZone: 'Majha',
    majorCrops: ['Basmati Rice', 'Wheat', 'Vegetables', 'Pear'],
    soilType: 'Alluvial Deep Loam',
    location: 'Amritsar, Punjab',
    region: 'Majha Plain Agro-Zone',
    temp: 23,
    feelsLike: 22,
    humidity: 62,
    windSpeed: 10,
    windDirection: 'NW',
    rainfallProb: 10,
    uvIndex: 5,
    pressure: 1015,
    sunrise: '06:45 AM',
    sunset: '05:39 PM',
    condition: 'Sunny',
    favourableSpraying: true,
    sprayingRecommendation: 'Favourable. Light north-westerly breeze (10 km/h) allows optimal foliar fungicide distribution on vegetable beds.',
    irrigationRecommendation: 'Soil moisture adequate. Delay irrigation for next 48 hours for early wheat seedbed preparation.',
    alerts: [
      {
        type: 'info',
        title: 'Basmati Harvesting Window',
        description: 'Dry afternoon conditions are ideal for manual and mechanical harvesting of late-sown Pusa 1121 Basmati.'
      }
    ],
    hourly: [
      { time: '06:00', temp: 17, humidity: 78, rainfallProb: 5, condition: 'Clear' },
      { time: '09:00', temp: 20, humidity: 68, rainfallProb: 5, condition: 'Sunny' },
      { time: '12:00', temp: 24, humidity: 56, rainfallProb: 10, condition: 'Sunny' },
      { time: '15:00', temp: 25, humidity: 50, rainfallProb: 10, condition: 'Sunny' },
      { time: '18:00', temp: 21, humidity: 66, rainfallProb: 5, condition: 'Clear' },
      { time: '21:00', temp: 18, humidity: 74, rainfallProb: 5, condition: 'Clear' }
    ],
    daily: [
      { day: 'Mon', date: 'Nov 02', tempMax: 25, tempMin: 14, condition: 'Sunny', rainfallProb: 10, humidity: 62, wind: 10 },
      { day: 'Tue', date: 'Nov 03', tempMax: 26, tempMin: 14, condition: 'Sunny', rainfallProb: 10, humidity: 59, wind: 8 },
      { day: 'Wed', date: 'Nov 04', tempMax: 25, tempMin: 13, condition: 'Partly Cloudy', rainfallProb: 15, humidity: 63, wind: 11 },
      { day: 'Thu', date: 'Nov 05', tempMax: 24, tempMin: 13, condition: 'Cloudy', rainfallProb: 30, humidity: 70, wind: 13 },
      { day: 'Fri', date: 'Nov 06', tempMax: 23, tempMin: 12, condition: 'Sunny', rainfallProb: 15, humidity: 64, wind: 11 },
      { day: 'Sat', date: 'Nov 07', tempMax: 24, tempMin: 12, condition: 'Sunny', rainfallProb: 5, humidity: 58, wind: 9 },
      { day: 'Sun', date: 'Nov 08', tempMax: 25, tempMin: 13, condition: 'Sunny', rainfallProb: 5, humidity: 55, wind: 8 }
    ]
  },

  Barnala: {
    districtName: 'Barnala',
    punjabiName: 'ਬਰਨਾਲਾ',
    subZone: 'Central Malwa',
    majorCrops: ['Wheat', 'Paddy', 'Cotton', 'Mustard'],
    soilType: 'Coarse Loamy to Fine Loamy',
    location: 'Barnala, Punjab',
    region: 'Central Malwa Plain',
    temp: 25,
    feelsLike: 24,
    humidity: 54,
    windSpeed: 11,
    windDirection: 'W',
    rainfallProb: 5,
    uvIndex: 6,
    pressure: 1014,
    sunrise: '06:41 AM',
    sunset: '05:37 PM',
    condition: 'Sunny',
    favourableSpraying: true,
    sprayingRecommendation: 'Highly favourable. Low wind (11 km/h) and dry air support preventive weedicide application.',
    irrigationRecommendation: 'Irrigate pre-sowing rauni for wheat sowing if field moisture is below 25%.',
    alerts: [
      {
        type: 'info',
        title: 'Wheat Sowing Advisory',
        description: 'Optimum soil temperature recorded for high-yielding PBW-826 and HD-3086 wheat sowing.'
      }
    ],
    hourly: [
      { time: '06:00', temp: 18, humidity: 70, rainfallProb: 0, condition: 'Clear' },
      { time: '09:00', temp: 22, humidity: 58, rainfallProb: 5, condition: 'Sunny' },
      { time: '12:00', temp: 26, humidity: 48, rainfallProb: 5, condition: 'Sunny' },
      { time: '15:00', temp: 27, humidity: 44, rainfallProb: 5, condition: 'Sunny' },
      { time: '18:00', temp: 23, humidity: 56, rainfallProb: 5, condition: 'Clear' },
      { time: '21:00', temp: 19, humidity: 66, rainfallProb: 0, condition: 'Clear' }
    ],
    daily: [
      { day: 'Mon', date: 'Nov 02', tempMax: 27, tempMin: 15, condition: 'Sunny', rainfallProb: 5, humidity: 54, wind: 11 },
      { day: 'Tue', date: 'Nov 03', tempMax: 27, tempMin: 15, condition: 'Sunny', rainfallProb: 5, humidity: 52, wind: 10 },
      { day: 'Wed', date: 'Nov 04', tempMax: 26, tempMin: 14, condition: 'Sunny', rainfallProb: 10, humidity: 56, wind: 12 },
      { day: 'Thu', date: 'Nov 05', tempMax: 25, tempMin: 14, condition: 'Partly Cloudy', rainfallProb: 20, humidity: 62, wind: 14 },
      { day: 'Fri', date: 'Nov 06', tempMax: 24, tempMin: 13, condition: 'Sunny', rainfallProb: 10, humidity: 58, wind: 10 },
      { day: 'Sat', date: 'Nov 07', tempMax: 25, tempMin: 13, condition: 'Sunny', rainfallProb: 5, humidity: 54, wind: 9 },
      { day: 'Sun', date: 'Nov 08', tempMax: 26, tempMin: 14, condition: 'Sunny', rainfallProb: 5, humidity: 50, wind: 8 }
    ]
  },

  Bathinda: {
    districtName: 'Bathinda',
    punjabiName: 'ਬਠਿੰਡਾ',
    subZone: 'South-Western Malwa',
    majorCrops: ['Bt Cotton', 'Wheat', 'Kinnow', 'Mustard', 'Gram'],
    soilType: 'Arid Sandy Loam (High Potash)',
    location: 'Bathinda, Punjab',
    region: 'South-Western Semi-Arid Zone',
    temp: 27,
    feelsLike: 26,
    humidity: 46,
    windSpeed: 13,
    windDirection: 'SW',
    rainfallProb: 5,
    uvIndex: 6,
    pressure: 1013,
    sunrise: '06:43 AM',
    sunset: '05:39 PM',
    condition: 'Sunny',
    favourableSpraying: true,
    sprayingRecommendation: 'Safe spraying window available between 08:00 AM - 12:00 PM before afternoon breezes pick up.',
    irrigationRecommendation: 'Canal rotational roster active. Apply light irrigation to standing mustard and winter orchards.',
    alerts: [
      {
        type: 'warning',
        title: 'Pink Bollworm Residue Sanitation',
        description: 'Ensure complete destruction of cotton crop stalks and residues to terminate pest carryover before wheat sowing.'
      }
    ],
    hourly: [
      { time: '06:00', temp: 19, humidity: 64, rainfallProb: 0, condition: 'Clear' },
      { time: '09:00', temp: 23, humidity: 50, rainfallProb: 0, condition: 'Sunny' },
      { time: '12:00', temp: 28, humidity: 38, rainfallProb: 5, condition: 'Sunny' },
      { time: '15:00', temp: 29, humidity: 34, rainfallProb: 5, condition: 'Sunny' },
      { time: '18:00', temp: 24, humidity: 48, rainfallProb: 0, condition: 'Clear' },
      { time: '21:00', temp: 21, humidity: 58, rainfallProb: 0, condition: 'Clear' }
    ],
    daily: [
      { day: 'Mon', date: 'Nov 02', tempMax: 29, tempMin: 16, condition: 'Sunny', rainfallProb: 5, humidity: 46, wind: 13 },
      { day: 'Tue', date: 'Nov 03', tempMax: 29, tempMin: 16, condition: 'Sunny', rainfallProb: 5, humidity: 44, wind: 12 },
      { day: 'Wed', date: 'Nov 04', tempMax: 28, tempMin: 15, condition: 'Sunny', rainfallProb: 5, humidity: 48, wind: 14 },
      { day: 'Thu', date: 'Nov 05', tempMax: 27, tempMin: 15, condition: 'Sunny', rainfallProb: 10, humidity: 52, wind: 15 },
      { day: 'Fri', date: 'Nov 06', tempMax: 26, tempMin: 14, condition: 'Sunny', rainfallProb: 5, humidity: 50, wind: 12 },
      { day: 'Sat', date: 'Nov 07', tempMax: 27, tempMin: 14, condition: 'Sunny', rainfallProb: 5, humidity: 46, wind: 10 },
      { day: 'Sun', date: 'Nov 08', tempMax: 28, tempMin: 15, condition: 'Sunny', rainfallProb: 0, humidity: 42, wind: 9 }
    ]
  },

  Faridkot: {
    districtName: 'Faridkot',
    punjabiName: 'ਫ਼ਰੀਦਕੋਟ',
    subZone: 'South-Western Malwa',
    majorCrops: ['Wheat', 'Bt Cotton', 'Paddy', 'Mustard'],
    soilType: 'Light Loam to Sandy Loam',
    location: 'Faridkot, Punjab',
    region: 'South-Western Transitional Zone',
    temp: 26,
    feelsLike: 25,
    humidity: 50,
    windSpeed: 12,
    windDirection: 'NW',
    rainfallProb: 5,
    uvIndex: 6,
    pressure: 1014,
    sunrise: '06:43 AM',
    sunset: '05:39 PM',
    condition: 'Sunny',
    favourableSpraying: true,
    sprayingRecommendation: 'Favourable. Dry conditions ideal for post-emergence weed control in early sown crops.',
    irrigationRecommendation: 'Maintain light irrigation in canal-fed blocks. Moisture depletion rate is low.',
    alerts: [
      {
        type: 'info',
        title: 'Happy Seeder Operation Window',
        description: 'Dry surface mulch makes direct wheat drilling into standing paddy stubbles highly efficient this week.'
      }
    ],
    hourly: [
      { time: '06:00', temp: 18, humidity: 68, rainfallProb: 0, condition: 'Clear' },
      { time: '09:00', temp: 22, humidity: 55, rainfallProb: 0, condition: 'Sunny' },
      { time: '12:00', temp: 27, humidity: 44, rainfallProb: 5, condition: 'Sunny' },
      { time: '15:00', temp: 28, humidity: 40, rainfallProb: 5, condition: 'Sunny' },
      { time: '18:00', temp: 23, humidity: 52, rainfallProb: 0, condition: 'Clear' },
      { time: '21:00', temp: 20, humidity: 62, rainfallProb: 0, condition: 'Clear' }
    ],
    daily: [
      { day: 'Mon', date: 'Nov 02', tempMax: 28, tempMin: 15, condition: 'Sunny', rainfallProb: 5, humidity: 50, wind: 12 },
      { day: 'Tue', date: 'Nov 03', tempMax: 28, tempMin: 15, condition: 'Sunny', rainfallProb: 5, humidity: 48, wind: 11 },
      { day: 'Wed', date: 'Nov 04', tempMax: 27, tempMin: 14, condition: 'Sunny', rainfallProb: 10, humidity: 52, wind: 13 },
      { day: 'Thu', date: 'Nov 05', tempMax: 26, tempMin: 14, condition: 'Partly Cloudy', rainfallProb: 15, humidity: 58, wind: 14 },
      { day: 'Fri', date: 'Nov 06', tempMax: 25, tempMin: 13, condition: 'Sunny', rainfallProb: 5, humidity: 54, wind: 11 },
      { day: 'Sat', date: 'Nov 07', tempMax: 26, tempMin: 13, condition: 'Sunny', rainfallProb: 5, humidity: 50, wind: 10 },
      { day: 'Sun', date: 'Nov 08', tempMax: 27, tempMin: 14, condition: 'Sunny', rainfallProb: 0, humidity: 46, wind: 8 }
    ]
  },

  FatehgarhSahib: {
    districtName: 'Fatehgarh Sahib',
    punjabiName: 'ਫ਼ਤਹਿਗੜ੍ਹ ਸਾਹਿਬ',
    subZone: 'Central Malwa',
    majorCrops: ['Wheat', 'Paddy', 'Potato', 'Sugarcane'],
    soilType: 'Heavy Alluvial Loam',
    location: 'Sirhind, Fatehgarh Sahib',
    region: 'Central High-Fertility Plain',
    temp: 24,
    feelsLike: 23,
    humidity: 59,
    windSpeed: 9,
    windDirection: 'NW',
    rainfallProb: 10,
    uvIndex: 5,
    pressure: 1015,
    sunrise: '06:39 AM',
    sunset: '05:35 PM',
    condition: 'Sunny',
    favourableSpraying: true,
    sprayingRecommendation: 'Highly favourable. Low wind (9 km/h) minimizes drift for potato blight preventive sprays.',
    irrigationRecommendation: 'First irrigation for autumn sugarcane due in 3 days. Soil moisture index is 68%.',
    alerts: [
      {
        type: 'info',
        title: 'Potato Early Emergence Alert',
        description: 'Maintain uniform soil ridge moisture to prevent early tuber greening and collar rot.'
      }
    ],
    hourly: [
      { time: '06:00', temp: 17, humidity: 76, rainfallProb: 5, condition: 'Clear' },
      { time: '09:00', temp: 21, humidity: 64, rainfallProb: 5, condition: 'Sunny' },
      { time: '12:00', temp: 25, humidity: 52, rainfallProb: 10, condition: 'Sunny' },
      { time: '15:00', temp: 26, humidity: 48, rainfallProb: 10, condition: 'Sunny' },
      { time: '18:00', temp: 22, humidity: 62, rainfallProb: 5, condition: 'Clear' },
      { time: '21:00', temp: 19, humidity: 70, rainfallProb: 5, condition: 'Clear' }
    ],
    daily: [
      { day: 'Mon', date: 'Nov 02', tempMax: 26, tempMin: 14, condition: 'Sunny', rainfallProb: 10, humidity: 59, wind: 9 },
      { day: 'Tue', date: 'Nov 03', tempMax: 26, tempMin: 14, condition: 'Sunny', rainfallProb: 5, humidity: 56, wind: 8 },
      { day: 'Wed', date: 'Nov 04', tempMax: 25, tempMin: 13, condition: 'Sunny', rainfallProb: 10, humidity: 60, wind: 10 },
      { day: 'Thu', date: 'Nov 05', tempMax: 24, tempMin: 13, condition: 'Cloudy', rainfallProb: 25, humidity: 68, wind: 12 },
      { day: 'Fri', date: 'Nov 06', tempMax: 23, tempMin: 12, condition: 'Sunny', rainfallProb: 10, humidity: 62, wind: 10 },
      { day: 'Sat', date: 'Nov 07', tempMax: 24, tempMin: 12, condition: 'Sunny', rainfallProb: 5, humidity: 58, wind: 8 },
      { day: 'Sun', date: 'Nov 08', tempMax: 25, tempMin: 13, condition: 'Sunny', rainfallProb: 5, humidity: 55, wind: 7 }
    ]
  },

  Fazilka: {
    districtName: 'Fazilka',
    punjabiName: 'ਫ਼ਾਜ਼ਿਲਕਾ',
    subZone: 'South-Western Malwa',
    majorCrops: ['Kinnow Citrus', 'Bt Cotton', 'Wheat', 'Guar'],
    soilType: 'Arid Sandy Desert Margin',
    location: 'Fazilka, Punjab',
    region: 'South-Western Citrus & Arid Belt',
    temp: 28,
    feelsLike: 27,
    humidity: 42,
    windSpeed: 14,
    windDirection: 'SW',
    rainfallProb: 0,
    uvIndex: 6,
    pressure: 1012,
    sunrise: '06:46 AM',
    sunset: '05:41 PM',
    condition: 'Sunny',
    favourableSpraying: true,
    sprayingRecommendation: 'Favourable. Dry canopy conditions prevent fruit drop. Spray micro-nutrients on Kinnow orchards.',
    irrigationRecommendation: 'Maintain drip irrigation in citrus orchards. Soil evaporation is elevated due to dry winds.',
    alerts: [
      {
        type: 'info',
        title: 'Kinnow Citrus Fruit Development',
        description: 'Mild daytime warmth is enhancing fruit brix (sugar content). Avoid water stress during color break stage.'
      }
    ],
    hourly: [
      { time: '06:00', temp: 20, humidity: 58, rainfallProb: 0, condition: 'Clear' },
      { time: '09:00', temp: 24, humidity: 46, rainfallProb: 0, condition: 'Sunny' },
      { time: '12:00', temp: 29, humidity: 34, rainfallProb: 0, condition: 'Sunny' },
      { time: '15:00', temp: 30, humidity: 30, rainfallProb: 0, condition: 'Sunny' },
      { time: '18:00', temp: 25, humidity: 42, rainfallProb: 0, condition: 'Clear' },
      { time: '21:00', temp: 22, humidity: 52, rainfallProb: 0, condition: 'Clear' }
    ],
    daily: [
      { day: 'Mon', date: 'Nov 02', tempMax: 30, tempMin: 17, condition: 'Sunny', rainfallProb: 0, humidity: 42, wind: 14 },
      { day: 'Tue', date: 'Nov 03', tempMax: 30, tempMin: 17, condition: 'Sunny', rainfallProb: 0, humidity: 40, wind: 13 },
      { day: 'Wed', date: 'Nov 04', tempMax: 29, tempMin: 16, condition: 'Sunny', rainfallProb: 5, humidity: 44, wind: 14 },
      { day: 'Thu', date: 'Nov 05', tempMax: 28, tempMin: 16, condition: 'Sunny', rainfallProb: 5, humidity: 48, wind: 15 },
      { day: 'Fri', date: 'Nov 06', tempMax: 27, tempMin: 15, condition: 'Sunny', rainfallProb: 0, humidity: 45, wind: 12 },
      { day: 'Sat', date: 'Nov 07', tempMax: 28, tempMin: 15, condition: 'Sunny', rainfallProb: 0, humidity: 42, wind: 11 },
      { day: 'Sun', date: 'Nov 08', tempMax: 29, tempMin: 16, condition: 'Sunny', rainfallProb: 0, humidity: 38, wind: 10 }
    ]
  },

  Ferozepur: {
    districtName: 'Ferozepur',
    punjabiName: 'ਫ਼ਿਰੋਜ਼ਪੁਰ',
    subZone: 'South-Western Malwa',
    majorCrops: ['Wheat', 'Paddy', 'Mustard', 'Barley'],
    soilType: 'Satluj River Basin Alluvium',
    location: 'Ferozepur, Punjab',
    region: 'Border River Basin Zone',
    temp: 25,
    feelsLike: 24,
    humidity: 56,
    windSpeed: 11,
    windDirection: 'NW',
    rainfallProb: 5,
    uvIndex: 5,
    pressure: 1014,
    sunrise: '06:45 AM',
    sunset: '05:40 PM',
    condition: 'Sunny',
    favourableSpraying: true,
    sprayingRecommendation: 'Favourable. River mist clears by 08:30 AM. Optimal foliar nutrition spray timing.',
    irrigationRecommendation: 'River bed plots have high moisture retention. Defer irrigation until crown root stage.',
    alerts: [
      {
        type: 'info',
        title: 'Riverine Soil Moisture Retention',
        description: 'Moisture in low-lying Satluj belt is high. Ensure seed treatment with Azotobacter before sowing.'
      }
    ],
    hourly: [
      { time: '06:00', temp: 18, humidity: 74, rainfallProb: 0, condition: 'Clear' },
      { time: '09:00', temp: 21, humidity: 62, rainfallProb: 5, condition: 'Sunny' },
      { time: '12:00', temp: 26, humidity: 50, rainfallProb: 5, condition: 'Sunny' },
      { time: '15:00', temp: 27, humidity: 46, rainfallProb: 5, condition: 'Sunny' },
      { time: '18:00', temp: 23, humidity: 58, rainfallProb: 0, condition: 'Clear' },
      { time: '21:00', temp: 19, humidity: 68, rainfallProb: 0, condition: 'Clear' }
    ],
    daily: [
      { day: 'Mon', date: 'Nov 02', tempMax: 27, tempMin: 15, condition: 'Sunny', rainfallProb: 5, humidity: 56, wind: 11 },
      { day: 'Tue', date: 'Nov 03', tempMax: 27, tempMin: 15, condition: 'Sunny', rainfallProb: 5, humidity: 54, wind: 10 },
      { day: 'Wed', date: 'Nov 04', tempMax: 26, tempMin: 14, condition: 'Sunny', rainfallProb: 10, humidity: 58, wind: 12 },
      { day: 'Thu', date: 'Nov 05', tempMax: 25, tempMin: 14, condition: 'Partly Cloudy', rainfallProb: 15, humidity: 64, wind: 13 },
      { day: 'Fri', date: 'Nov 06', tempMax: 24, tempMin: 13, condition: 'Sunny', rainfallProb: 5, humidity: 60, wind: 10 },
      { day: 'Sat', date: 'Nov 07', tempMax: 25, tempMin: 13, condition: 'Sunny', rainfallProb: 5, humidity: 55, wind: 9 },
      { day: 'Sun', date: 'Nov 08', tempMax: 26, tempMin: 14, condition: 'Sunny', rainfallProb: 0, humidity: 52, wind: 8 }
    ]
  },

  Gurdaspur: {
    districtName: 'Gurdaspur',
    punjabiName: 'ਗੁਰਦਾਸਪੁਰ',
    subZone: 'Majha',
    majorCrops: ['Sugarcane', 'Wheat', 'Paddy', 'Maize', 'Litchi'],
    soilType: 'Heavy Silt Loam (High Organic Matter)',
    location: 'Gurdaspur, Punjab',
    region: 'Sub-Mountainous Undulating Plain',
    temp: 22,
    feelsLike: 21,
    humidity: 68,
    windSpeed: 8,
    windDirection: 'NE',
    rainfallProb: 15,
    uvIndex: 4,
    pressure: 1016,
    sunrise: '06:43 AM',
    sunset: '05:36 PM',
    condition: 'Partly Cloudy',
    favourableSpraying: true,
    sprayingRecommendation: 'Favourable after morning fog dissipates. Ideal for sugarcane borer biological control.',
    irrigationRecommendation: 'Recent sub-surface runoff ensures adequate root moisture. No irrigation required this week.',
    alerts: [
      {
        type: 'warning',
        title: 'Yellow (Stripe) Rust Vigilance',
        description: 'Cool humid micro-climate in sub-mountainous Ravi-Beas belt favors Puccinia striiformis spores. Scout wheat borders.'
      }
    ],
    hourly: [
      { time: '06:00', temp: 15, humidity: 84, rainfallProb: 10, condition: 'Misty' },
      { time: '09:00', temp: 18, humidity: 72, rainfallProb: 10, condition: 'Partly Cloudy' },
      { time: '12:00', temp: 23, humidity: 60, rainfallProb: 15, condition: 'Partly Cloudy' },
      { time: '15:00', temp: 24, humidity: 55, rainfallProb: 15, condition: 'Sunny' },
      { time: '18:00', temp: 20, humidity: 70, rainfallProb: 10, condition: 'Clear' },
      { time: '21:00', temp: 17, humidity: 80, rainfallProb: 5, condition: 'Clear' }
    ],
    daily: [
      { day: 'Mon', date: 'Nov 02', tempMax: 24, tempMin: 12, condition: 'Partly Cloudy', rainfallProb: 15, humidity: 68, wind: 8 },
      { day: 'Tue', date: 'Nov 03', tempMax: 25, tempMin: 13, condition: 'Sunny', rainfallProb: 10, humidity: 65, wind: 7 },
      { day: 'Wed', date: 'Nov 04', tempMax: 24, tempMin: 12, condition: 'Cloudy', rainfallProb: 25, humidity: 72, wind: 10 },
      { day: 'Thu', date: 'Nov 05', tempMax: 22, tempMin: 11, condition: 'Light Rain', rainfallProb: 45, humidity: 80, wind: 12 },
      { day: 'Fri', date: 'Nov 06', tempMax: 21, tempMin: 10, condition: 'Sunny', rainfallProb: 15, humidity: 72, wind: 9 },
      { day: 'Sat', date: 'Nov 07', tempMax: 23, tempMin: 11, condition: 'Sunny', rainfallProb: 10, humidity: 66, wind: 8 },
      { day: 'Sun', date: 'Nov 08', tempMax: 24, tempMin: 12, condition: 'Sunny', rainfallProb: 5, humidity: 62, wind: 7 }
    ]
  },

  Hoshiarpur: {
    districtName: 'Hoshiarpur',
    punjabiName: 'ਹੁਸ਼ਿਆਰਪੁਰ',
    subZone: 'Kandi Foothills',
    majorCrops: ['Kinnow', 'Mango', 'Maize', 'Wheat', 'Turmeric'],
    soilType: 'Coarse Sandy Loam with Gravel (Kandi)',
    location: 'Hoshiarpur, Punjab',
    region: 'Kandi Sub-Himalayan Foothill Zone',
    temp: 23,
    feelsLike: 22,
    humidity: 65,
    windSpeed: 9,
    windDirection: 'NE',
    rainfallProb: 15,
    uvIndex: 5,
    pressure: 1016,
    sunrise: '06:40 AM',
    sunset: '05:35 PM',
    condition: 'Sunny',
    favourableSpraying: true,
    sprayingRecommendation: 'Favourable. Calm winds ideal for citrus canker copper oxychloride sprays in Kandi orchards.',
    irrigationRecommendation: 'Soil has high permeability. Check drip lines in orchard terraces every 48 hours.',
    alerts: [
      {
        type: 'info',
        title: 'Kandi Foothill Citrus Flush',
        description: 'New autumn shoot flush in citrus orchards. Monitor for leaf miner and citrus psylla activity.'
      }
    ],
    hourly: [
      { time: '06:00', temp: 16, humidity: 80, rainfallProb: 5, condition: 'Clear' },
      { time: '09:00', temp: 19, humidity: 70, rainfallProb: 10, condition: 'Sunny' },
      { time: '12:00', temp: 24, humidity: 58, rainfallProb: 15, condition: 'Sunny' },
      { time: '15:00', temp: 25, humidity: 52, rainfallProb: 15, condition: 'Sunny' },
      { time: '18:00', temp: 21, humidity: 66, rainfallProb: 10, condition: 'Clear' },
      { time: '21:00', temp: 18, humidity: 76, rainfallProb: 5, condition: 'Clear' }
    ],
    daily: [
      { day: 'Mon', date: 'Nov 02', tempMax: 25, tempMin: 13, condition: 'Sunny', rainfallProb: 15, humidity: 65, wind: 9 },
      { day: 'Tue', date: 'Nov 03', tempMax: 26, tempMin: 13, condition: 'Sunny', rainfallProb: 10, humidity: 62, wind: 8 },
      { day: 'Wed', date: 'Nov 04', tempMax: 25, tempMin: 12, condition: 'Partly Cloudy', rainfallProb: 20, humidity: 68, wind: 10 },
      { day: 'Thu', date: 'Nov 05', tempMax: 23, tempMin: 12, condition: 'Light Rain', rainfallProb: 40, humidity: 76, wind: 13 },
      { day: 'Fri', date: 'Nov 06', tempMax: 22, tempMin: 11, condition: 'Sunny', rainfallProb: 15, humidity: 68, wind: 9 },
      { day: 'Sat', date: 'Nov 07', tempMax: 24, tempMin: 11, condition: 'Sunny', rainfallProb: 10, humidity: 62, wind: 8 },
      { day: 'Sun', date: 'Nov 08', tempMax: 25, tempMin: 12, condition: 'Sunny', rainfallProb: 5, humidity: 58, wind: 7 }
    ]
  },

  Jalandhar: {
    districtName: 'Jalandhar',
    punjabiName: 'ਜਲੰਧਰ',
    subZone: 'Doaba',
    majorCrops: ['Seed Potato', 'Wheat', 'Paddy', 'Vegetables', 'Maize'],
    soilType: 'Fertile Silt Alluvium',
    location: 'Jalandhar, Punjab',
    region: 'Doaba Heartland Agro-Zone',
    temp: 24,
    feelsLike: 23,
    humidity: 60,
    windSpeed: 10,
    windDirection: 'NW',
    rainfallProb: 10,
    uvIndex: 5,
    pressure: 1015,
    sunrise: '06:41 AM',
    sunset: '05:36 PM',
    condition: 'Sunny',
    favourableSpraying: true,
    sprayingRecommendation: 'Highly favourable. Essential spray window for prophylactic Mancozeb treatment on early potato crops.',
    irrigationRecommendation: 'Apply light sprinkler irrigation in potato furrows. Avoid submerging ridges.',
    alerts: [
      {
        type: 'warning',
        title: 'Potato Late Blight Preventative Window',
        description: 'Morning dew duration of 4+ hours combined with 23°C daytime temp creates early Phytophthora risk. Apply protective contact fungicide.'
      }
    ],
    hourly: [
      { time: '06:00', temp: 17, humidity: 78, rainfallProb: 5, condition: 'Clear' },
      { time: '09:00', temp: 21, humidity: 66, rainfallProb: 5, condition: 'Sunny' },
      { time: '12:00', temp: 25, humidity: 54, rainfallProb: 10, condition: 'Sunny' },
      { time: '15:00', temp: 26, humidity: 50, rainfallProb: 10, condition: 'Sunny' },
      { time: '18:00', temp: 22, humidity: 64, rainfallProb: 5, condition: 'Clear' },
      { time: '21:00', temp: 19, humidity: 72, rainfallProb: 5, condition: 'Clear' }
    ],
    daily: [
      { day: 'Mon', date: 'Nov 02', tempMax: 26, tempMin: 14, condition: 'Sunny', rainfallProb: 10, humidity: 60, wind: 10 },
      { day: 'Tue', date: 'Nov 03', tempMax: 27, tempMin: 14, condition: 'Sunny', rainfallProb: 5, humidity: 57, wind: 9 },
      { day: 'Wed', date: 'Nov 04', tempMax: 26, tempMin: 13, condition: 'Partly Cloudy', rainfallProb: 15, humidity: 62, wind: 11 },
      { day: 'Thu', date: 'Nov 05', tempMax: 24, tempMin: 13, condition: 'Cloudy', rainfallProb: 30, humidity: 72, wind: 13 },
      { day: 'Fri', date: 'Nov 06', tempMax: 23, tempMin: 12, condition: 'Sunny', rainfallProb: 10, humidity: 64, wind: 10 },
      { day: 'Sat', date: 'Nov 07', tempMax: 25, tempMin: 12, condition: 'Sunny', rainfallProb: 5, humidity: 58, wind: 9 },
      { day: 'Sun', date: 'Nov 08', tempMax: 26, tempMin: 13, condition: 'Sunny', rainfallProb: 5, humidity: 54, wind: 8 }
    ]
  },

  Kapurthala: {
    districtName: 'Kapurthala',
    punjabiName: 'ਕਪੂਰਥਲਾ',
    subZone: 'Doaba',
    majorCrops: ['Wheat', 'Paddy', 'Sugarcane', 'Potato'],
    soilType: 'Doab Alluvial Loam (Beas River Basin)',
    location: 'Kapurthala, Punjab',
    region: 'Beas-Satluj Doab Plain',
    temp: 24,
    feelsLike: 23,
    humidity: 62,
    windSpeed: 10,
    windDirection: 'NW',
    rainfallProb: 10,
    uvIndex: 5,
    pressure: 1015,
    sunrise: '06:42 AM',
    sunset: '05:37 PM',
    condition: 'Sunny',
    favourableSpraying: true,
    sprayingRecommendation: 'Favourable. Moderate humidity and steady wind speed are conducive for systemic herbicide treatments.',
    irrigationRecommendation: 'Soil moisture reserves are sound. Plan next irrigation cycle after wheat sowing.',
    alerts: [
      {
        type: 'info',
        title: 'Wetland Vicinity Humidity',
        description: 'Proximity to Harike wetland creates elevated night humidity. Monitor for early mildew in nursery beds.'
      }
    ],
    hourly: [
      { time: '06:00', temp: 17, humidity: 80, rainfallProb: 5, condition: 'Clear' },
      { time: '09:00', temp: 21, humidity: 68, rainfallProb: 5, condition: 'Sunny' },
      { time: '12:00', temp: 25, humidity: 55, rainfallProb: 10, condition: 'Sunny' },
      { time: '15:00', temp: 26, humidity: 52, rainfallProb: 10, condition: 'Sunny' },
      { time: '18:00', temp: 22, humidity: 65, rainfallProb: 5, condition: 'Clear' },
      { time: '21:00', temp: 19, humidity: 74, rainfallProb: 5, condition: 'Clear' }
    ],
    daily: [
      { day: 'Mon', date: 'Nov 02', tempMax: 26, tempMin: 14, condition: 'Sunny', rainfallProb: 10, humidity: 62, wind: 10 },
      { day: 'Tue', date: 'Nov 03', tempMax: 26, tempMin: 14, condition: 'Sunny', rainfallProb: 5, humidity: 59, wind: 9 },
      { day: 'Wed', date: 'Nov 04', tempMax: 25, tempMin: 13, condition: 'Partly Cloudy', rainfallProb: 15, humidity: 64, wind: 11 },
      { day: 'Thu', date: 'Nov 05', tempMax: 24, tempMin: 13, condition: 'Cloudy', rainfallProb: 30, humidity: 72, wind: 13 },
      { day: 'Fri', date: 'Nov 06', tempMax: 23, tempMin: 12, condition: 'Sunny', rainfallProb: 10, humidity: 65, wind: 10 },
      { day: 'Sat', date: 'Nov 07', tempMax: 25, tempMin: 12, condition: 'Sunny', rainfallProb: 5, humidity: 60, wind: 8 },
      { day: 'Sun', date: 'Nov 08', tempMax: 26, tempMin: 13, condition: 'Sunny', rainfallProb: 5, humidity: 56, wind: 8 }
    ]
  },

  Ludhiana: {
    districtName: 'Ludhiana',
    punjabiName: 'ਲੁਧਿਆਣਾ',
    subZone: 'Central Malwa',
    majorCrops: ['Wheat', 'Paddy', 'Mustard', 'Vegetables', 'Maize'],
    soilType: 'Deep Alluvial Loam (PAU Research Baseline)',
    location: 'Ludhiana, Punjab',
    region: 'North-Western Plain Central Agro-Hub',
    temp: 24,
    feelsLike: 23,
    humidity: 58,
    windSpeed: 11,
    windDirection: 'NW',
    rainfallProb: 15,
    uvIndex: 5,
    pressure: 1014,
    sunrise: '06:42 AM',
    sunset: '05:38 PM',
    condition: 'Sunny',
    favourableSpraying: true,
    sprayingRecommendation: 'Highly favourable. Low wind (11 km/h) and moderate humidity ensure minimal spray drift.',
    irrigationRecommendation: 'Irrigation can be deferred by 36-48 hours. Soil moisture levels remain adequate.',
    alerts: [
      {
        type: 'info',
        title: 'Mild Dew Formation Expected',
        description: 'Morning surface moisture may prolong leaf wetness; scout for early stripe rust in wheat.'
      }
    ],
    hourly: [
      { time: '06:00', temp: 18, humidity: 76, rainfallProb: 5, condition: 'Clear' },
      { time: '09:00', temp: 21, humidity: 65, rainfallProb: 10, condition: 'Sunny' },
      { time: '12:00', temp: 25, humidity: 52, rainfallProb: 15, condition: 'Sunny' },
      { time: '15:00', temp: 26, humidity: 48, rainfallProb: 15, condition: 'Partly Cloudy' },
      { time: '18:00', temp: 22, humidity: 62, rainfallProb: 10, condition: 'Clear' },
      { time: '21:00', temp: 19, humidity: 70, rainfallProb: 5, condition: 'Clear' }
    ],
    daily: [
      { day: 'Mon', date: 'Nov 02', tempMax: 26, tempMin: 15, condition: 'Sunny', rainfallProb: 15, humidity: 58, wind: 11 },
      { day: 'Tue', date: 'Nov 03', tempMax: 27, tempMin: 16, condition: 'Sunny', rainfallProb: 10, humidity: 55, wind: 9 },
      { day: 'Wed', date: 'Nov 04', tempMax: 26, tempMin: 14, condition: 'Partly Cloudy', rainfallProb: 20, humidity: 60, wind: 12 },
      { day: 'Thu', date: 'Nov 05', tempMax: 25, tempMin: 14, condition: 'Light Rain', rainfallProb: 65, humidity: 78, wind: 16 },
      { day: 'Fri', date: 'Nov 06', tempMax: 23, tempMin: 13, condition: 'Cloudy', rainfallProb: 40, humidity: 72, wind: 14 },
      { day: 'Sat', date: 'Nov 07', tempMax: 24, tempMin: 13, condition: 'Sunny', rainfallProb: 10, humidity: 60, wind: 10 },
      { day: 'Sun', date: 'Nov 08', tempMax: 25, tempMin: 14, condition: 'Sunny', rainfallProb: 5, humidity: 56, wind: 8 }
    ]
  },

  Malerkotla: {
    districtName: 'Malerkotla',
    punjabiName: 'ਮਾਲੇਰਕੋਟਲਾ',
    subZone: 'Central Malwa',
    majorCrops: ['Vegetables', 'Wheat', 'Paddy', 'Exotic Greens'],
    soilType: 'Rich Loam with High Humus',
    location: 'Malerkotla, Punjab',
    region: 'Intensive Vegetable & Horticulture Belt',
    temp: 25,
    feelsLike: 24,
    humidity: 57,
    windSpeed: 10,
    windDirection: 'NW',
    rainfallProb: 5,
    uvIndex: 6,
    pressure: 1014,
    sunrise: '06:40 AM',
    sunset: '05:36 PM',
    condition: 'Sunny',
    favourableSpraying: true,
    sprayingRecommendation: 'Highly favourable. Excellent conditions for organic bio-pesticides and foliar micronutrients.',
    irrigationRecommendation: 'Maintain regular 3-day light drip cycle on cauliflower, cabbage, and spinach beds.',
    alerts: [
      {
        type: 'info',
        title: 'Horticulture Micro-Nutrient Timing',
        description: 'Optimal vegetative phase in winter cole crops. Spray Boron and Zinc chelates under clear skies.'
      }
    ],
    hourly: [
      { time: '06:00', temp: 17, humidity: 74, rainfallProb: 0, condition: 'Clear' },
      { time: '09:00', temp: 21, humidity: 62, rainfallProb: 5, condition: 'Sunny' },
      { time: '12:00', temp: 26, humidity: 50, rainfallProb: 5, condition: 'Sunny' },
      { time: '15:00', temp: 27, humidity: 46, rainfallProb: 5, condition: 'Sunny' },
      { time: '18:00', temp: 22, humidity: 60, rainfallProb: 5, condition: 'Clear' },
      { time: '21:00', temp: 19, humidity: 68, rainfallProb: 0, condition: 'Clear' }
    ],
    daily: [
      { day: 'Mon', date: 'Nov 02', tempMax: 27, tempMin: 14, condition: 'Sunny', rainfallProb: 5, humidity: 57, wind: 10 },
      { day: 'Tue', date: 'Nov 03', tempMax: 27, tempMin: 14, condition: 'Sunny', rainfallProb: 5, humidity: 55, wind: 9 },
      { day: 'Wed', date: 'Nov 04', tempMax: 26, tempMin: 13, condition: 'Sunny', rainfallProb: 10, humidity: 58, wind: 11 },
      { day: 'Thu', date: 'Nov 05', tempMax: 25, tempMin: 13, condition: 'Partly Cloudy', rainfallProb: 20, humidity: 66, wind: 13 },
      { day: 'Fri', date: 'Nov 06', tempMax: 24, tempMin: 12, condition: 'Sunny', rainfallProb: 10, humidity: 60, wind: 10 },
      { day: 'Sat', date: 'Nov 07', tempMax: 25, tempMin: 12, condition: 'Sunny', rainfallProb: 5, humidity: 56, wind: 9 },
      { day: 'Sun', date: 'Nov 08', tempMax: 26, tempMin: 13, condition: 'Sunny', rainfallProb: 5, humidity: 52, wind: 8 }
    ]
  },

  Mansa: {
    districtName: 'Mansa',
    punjabiName: 'ਮਾਨਸਾ',
    subZone: 'South-Western Malwa',
    majorCrops: ['Bt Cotton', 'Wheat', 'Mustard', 'Barley'],
    soilType: 'Arid Sandy Loam',
    location: 'Mansa, Punjab',
    region: 'White Gold Cotton Belt',
    temp: 27,
    feelsLike: 26,
    humidity: 48,
    windSpeed: 12,
    windDirection: 'W',
    rainfallProb: 5,
    uvIndex: 6,
    pressure: 1013,
    sunrise: '06:42 AM',
    sunset: '05:38 PM',
    condition: 'Sunny',
    favourableSpraying: true,
    sprayingRecommendation: 'Favourable. Dry canopy facilitates pre-emergence herbicide spraying prior to wheat seeding.',
    irrigationRecommendation: 'Canal roster active. Ensure timely pre-sowing rauni for wheat fields.',
    alerts: [
      {
        type: 'info',
        title: 'Mustard Germination Inspection',
        description: 'Sunny conditions with 26°C day temp are ideal for early raya/mustard seedling establishment.'
      }
    ],
    hourly: [
      { time: '06:00', temp: 19, humidity: 66, rainfallProb: 0, condition: 'Clear' },
      { time: '09:00', temp: 23, humidity: 52, rainfallProb: 0, condition: 'Sunny' },
      { time: '12:00', temp: 28, humidity: 40, rainfallProb: 5, condition: 'Sunny' },
      { time: '15:00', temp: 29, humidity: 36, rainfallProb: 5, condition: 'Sunny' },
      { time: '18:00', temp: 24, humidity: 50, rainfallProb: 0, condition: 'Clear' },
      { time: '21:00', temp: 21, humidity: 60, rainfallProb: 0, condition: 'Clear' }
    ],
    daily: [
      { day: 'Mon', date: 'Nov 02', tempMax: 29, tempMin: 16, condition: 'Sunny', rainfallProb: 5, humidity: 48, wind: 12 },
      { day: 'Tue', date: 'Nov 03', tempMax: 29, tempMin: 16, condition: 'Sunny', rainfallProb: 5, humidity: 45, wind: 11 },
      { day: 'Wed', date: 'Nov 04', tempMax: 28, tempMin: 15, condition: 'Sunny', rainfallProb: 5, humidity: 50, wind: 13 },
      { day: 'Thu', date: 'Nov 05', tempMax: 27, tempMin: 15, condition: 'Partly Cloudy', rainfallProb: 15, humidity: 55, wind: 14 },
      { day: 'Fri', date: 'Nov 06', tempMax: 26, tempMin: 14, condition: 'Sunny', rainfallProb: 5, humidity: 52, wind: 11 },
      { day: 'Sat', date: 'Nov 07', tempMax: 27, tempMin: 14, condition: 'Sunny', rainfallProb: 5, humidity: 48, wind: 10 },
      { day: 'Sun', date: 'Nov 08', tempMax: 28, tempMin: 15, condition: 'Sunny', rainfallProb: 0, humidity: 44, wind: 8 }
    ]
  },

  Moga: {
    districtName: 'Moga',
    punjabiName: 'ਮੋਗਾ',
    subZone: 'Central Malwa',
    majorCrops: ['Wheat', 'Paddy', 'Potato', 'Dairy Forage'],
    soilType: 'Deep Productive Alluvial Loam',
    location: 'Moga, Punjab',
    region: 'Central Agrarian Dairy Plain',
    temp: 25,
    feelsLike: 24,
    humidity: 56,
    windSpeed: 11,
    windDirection: 'NW',
    rainfallProb: 10,
    uvIndex: 5,
    pressure: 1014,
    sunrise: '06:42 AM',
    sunset: '05:38 PM',
    condition: 'Sunny',
    favourableSpraying: true,
    sprayingRecommendation: 'Favourable. Dry sunny daytime supports pre-sowing herbicide soil incorporation.',
    irrigationRecommendation: 'Soil moisture levels optimal. Defer irrigation until crown root emergence.',
    alerts: [
      {
        type: 'info',
        title: 'Dairy Green Fodder Sowing',
        description: 'Conditions are optimal for Berseem and Lucerne forage sowing with adequate seed germination.'
      }
    ],
    hourly: [
      { time: '06:00', temp: 18, humidity: 72, rainfallProb: 0, condition: 'Clear' },
      { time: '09:00', temp: 22, humidity: 60, rainfallProb: 5, condition: 'Sunny' },
      { time: '12:00', temp: 26, humidity: 48, rainfallProb: 10, condition: 'Sunny' },
      { time: '15:00', temp: 27, humidity: 45, rainfallProb: 10, condition: 'Sunny' },
      { time: '18:00', temp: 23, humidity: 58, rainfallProb: 5, condition: 'Clear' },
      { time: '21:00', temp: 20, humidity: 66, rainfallProb: 0, condition: 'Clear' }
    ],
    daily: [
      { day: 'Mon', date: 'Nov 02', tempMax: 27, tempMin: 15, condition: 'Sunny', rainfallProb: 10, humidity: 56, wind: 11 },
      { day: 'Tue', date: 'Nov 03', tempMax: 27, tempMin: 15, condition: 'Sunny', rainfallProb: 5, humidity: 54, wind: 10 },
      { day: 'Wed', date: 'Nov 04', tempMax: 26, tempMin: 14, condition: 'Sunny', rainfallProb: 10, humidity: 58, wind: 12 },
      { day: 'Thu', date: 'Nov 05', tempMax: 25, tempMin: 14, condition: 'Partly Cloudy', rainfallProb: 20, humidity: 65, wind: 13 },
      { day: 'Fri', date: 'Nov 06', tempMax: 24, tempMin: 13, condition: 'Sunny', rainfallProb: 10, humidity: 60, wind: 10 },
      { day: 'Sat', date: 'Nov 07', tempMax: 25, tempMin: 13, condition: 'Sunny', rainfallProb: 5, humidity: 55, wind: 9 },
      { day: 'Sun', date: 'Nov 08', tempMax: 26, tempMin: 14, condition: 'Sunny', rainfallProb: 5, humidity: 51, wind: 8 }
    ]
  },

  Muktsar: {
    districtName: 'Sri Muktsar Sahib',
    punjabiName: 'ਸ੍ਰੀ ਮੁਕਤਸਰ ਸਾਹਿਬ',
    subZone: 'South-Western Malwa',
    majorCrops: ['Kinnow', 'Bt Cotton', 'Wheat', 'Mustard'],
    soilType: 'Arid Sandy Loam with Subsoil Gypsum',
    location: 'Sri Muktsar Sahib, Punjab',
    region: 'South-Western Canal Irrigated Zone',
    temp: 27,
    feelsLike: 26,
    humidity: 47,
    windSpeed: 13,
    windDirection: 'SW',
    rainfallProb: 5,
    uvIndex: 6,
    pressure: 1013,
    sunrise: '06:45 AM',
    sunset: '05:40 PM',
    condition: 'Sunny',
    favourableSpraying: true,
    sprayingRecommendation: 'Favourable. Dry sunny climate allows uniform coverage of foliar nutrition on Kinnow trees.',
    irrigationRecommendation: 'Check canal distribution turn. Maintain ridge moisture to combat salinity buildup.',
    alerts: [
      {
        type: 'info',
        title: 'Citrus Orchard Fruit Coloration',
        description: 'Night temperatures dipping to 15°C are stimulating natural carotenoid development in Kinnow fruit.'
      }
    ],
    hourly: [
      { time: '06:00', temp: 19, humidity: 65, rainfallProb: 0, condition: 'Clear' },
      { time: '09:00', temp: 23, humidity: 51, rainfallProb: 0, condition: 'Sunny' },
      { time: '12:00', temp: 28, humidity: 39, rainfallProb: 5, condition: 'Sunny' },
      { time: '15:00', temp: 29, humidity: 35, rainfallProb: 5, condition: 'Sunny' },
      { time: '18:00', temp: 24, humidity: 49, rainfallProb: 0, condition: 'Clear' },
      { time: '21:00', temp: 21, humidity: 59, rainfallProb: 0, condition: 'Clear' }
    ],
    daily: [
      { day: 'Mon', date: 'Nov 02', tempMax: 29, tempMin: 15, condition: 'Sunny', rainfallProb: 5, humidity: 47, wind: 13 },
      { day: 'Tue', date: 'Nov 03', tempMax: 29, tempMin: 15, condition: 'Sunny', rainfallProb: 5, humidity: 45, wind: 12 },
      { day: 'Wed', date: 'Nov 04', tempMax: 28, tempMin: 14, condition: 'Sunny', rainfallProb: 5, humidity: 49, wind: 14 },
      { day: 'Thu', date: 'Nov 05', tempMax: 27, tempMin: 14, condition: 'Sunny', rainfallProb: 10, humidity: 53, wind: 15 },
      { day: 'Fri', date: 'Nov 06', tempMax: 26, tempMin: 13, condition: 'Sunny', rainfallProb: 5, humidity: 51, wind: 12 },
      { day: 'Sat', date: 'Nov 07', tempMax: 27, tempMin: 13, condition: 'Sunny', rainfallProb: 5, humidity: 47, wind: 10 },
      { day: 'Sun', date: 'Nov 08', tempMax: 28, tempMin: 14, condition: 'Sunny', rainfallProb: 0, humidity: 43, wind: 9 }
    ]
  },

  Pathankot: {
    districtName: 'Pathankot',
    punjabiName: 'ਪਠਾਨਕੋਟ',
    subZone: 'Kandi Foothills',
    majorCrops: ['Litchi', 'Mango', 'Wheat', 'Paddy', 'Maize'],
    soilType: 'Shivalik Gravelly Sandy Loam',
    location: 'Pathankot, Punjab',
    region: 'Sub-Himalayan Hill Foothill Zone',
    temp: 21,
    feelsLike: 20,
    humidity: 70,
    windSpeed: 7,
    windDirection: 'NE',
    rainfallProb: 20,
    uvIndex: 4,
    pressure: 1017,
    sunrise: '06:41 AM',
    sunset: '05:34 PM',
    condition: 'Partly Cloudy',
    favourableSpraying: true,
    sprayingRecommendation: 'Favourable during clear afternoon hours. Sub-Himalayan breezes remain gentle (7 km/h).',
    irrigationRecommendation: 'Hill slope runoff provides natural moisture. No supplementary irrigation required.',
    alerts: [
      {
        type: 'info',
        title: 'Cool Night Temperatures (11°C)',
        description: 'Cold night air descending from Dhauladhar range. Protect nursery seedlings from cold shock.'
      }
    ],
    hourly: [
      { time: '06:00', temp: 14, humidity: 86, rainfallProb: 10, condition: 'Misty' },
      { time: '09:00', temp: 17, humidity: 74, rainfallProb: 15, condition: 'Partly Cloudy' },
      { time: '12:00', temp: 22, humidity: 62, rainfallProb: 20, condition: 'Partly Cloudy' },
      { time: '15:00', temp: 23, humidity: 58, rainfallProb: 20, condition: 'Sunny' },
      { time: '18:00', temp: 19, humidity: 72, rainfallProb: 10, condition: 'Clear' },
      { time: '21:00', temp: 16, humidity: 82, rainfallProb: 5, condition: 'Clear' }
    ],
    daily: [
      { day: 'Mon', date: 'Nov 02', tempMax: 23, tempMin: 11, condition: 'Partly Cloudy', rainfallProb: 20, humidity: 70, wind: 7 },
      { day: 'Tue', date: 'Nov 03', tempMax: 24, tempMin: 12, condition: 'Sunny', rainfallProb: 15, humidity: 67, wind: 6 },
      { day: 'Wed', date: 'Nov 04', tempMax: 23, tempMin: 11, condition: 'Cloudy', rainfallProb: 30, humidity: 74, wind: 9 },
      { day: 'Thu', date: 'Nov 05', tempMax: 21, tempMin: 10, condition: 'Light Rain', rainfallProb: 55, humidity: 82, wind: 11 },
      { day: 'Fri', date: 'Nov 06', tempMax: 20, tempMin: 9, condition: 'Sunny', rainfallProb: 20, humidity: 74, wind: 8 },
      { day: 'Sat', date: 'Nov 07', tempMax: 22, tempMin: 10, condition: 'Sunny', rainfallProb: 10, humidity: 68, wind: 7 },
      { day: 'Sun', date: 'Nov 08', tempMax: 23, tempMin: 11, condition: 'Sunny', rainfallProb: 5, humidity: 64, wind: 6 }
    ]
  },

  Patiala: {
    districtName: 'Patiala',
    punjabiName: 'ਪਟਿਆਲਾ',
    subZone: 'Central Malwa',
    majorCrops: ['Wheat', 'Paddy', 'Sugarcane', 'Mustard', 'Sunflower'],
    soilType: 'Heavy Alluvial Clay Loam',
    location: 'Patiala, Punjab',
    region: 'Eastern Malwa Agrarian Plain',
    temp: 24,
    feelsLike: 23,
    humidity: 59,
    windSpeed: 10,
    windDirection: 'NW',
    rainfallProb: 10,
    uvIndex: 5,
    pressure: 1015,
    sunrise: '06:39 AM',
    sunset: '05:35 PM',
    condition: 'Sunny',
    favourableSpraying: true,
    sprayingRecommendation: 'Highly favourable. Optimal weather for pre-sowing weedicide application in wheat fields.',
    irrigationRecommendation: 'Soil has excellent clay moisture-holding capacity. Irrigation can wait 3-4 days.',
    alerts: [
      {
        type: 'info',
        title: 'Sugarcane Ripening Survey',
        description: 'Dry sunny days are accelerating sucrose accumulation in CoJ-85 and CoPb-92 early sugarcane cultivars.'
      }
    ],
    hourly: [
      { time: '06:00', temp: 17, humidity: 76, rainfallProb: 5, condition: 'Clear' },
      { time: '09:00', temp: 21, humidity: 64, rainfallProb: 5, condition: 'Sunny' },
      { time: '12:00', temp: 25, humidity: 52, rainfallProb: 10, condition: 'Sunny' },
      { time: '15:00', temp: 26, humidity: 48, rainfallProb: 10, condition: 'Sunny' },
      { time: '18:00', temp: 22, humidity: 62, rainfallProb: 5, condition: 'Clear' },
      { time: '21:00', temp: 19, humidity: 70, rainfallProb: 5, condition: 'Clear' }
    ],
    daily: [
      { day: 'Mon', date: 'Nov 02', tempMax: 26, tempMin: 14, condition: 'Sunny', rainfallProb: 10, humidity: 59, wind: 10 },
      { day: 'Tue', date: 'Nov 03', tempMax: 27, tempMin: 15, condition: 'Sunny', rainfallProb: 5, humidity: 56, wind: 9 },
      { day: 'Wed', date: 'Nov 04', tempMax: 26, tempMin: 14, condition: 'Sunny', rainfallProb: 10, humidity: 60, wind: 11 },
      { day: 'Thu', date: 'Nov 05', tempMax: 25, tempMin: 13, condition: 'Cloudy', rainfallProb: 25, humidity: 68, wind: 13 },
      { day: 'Fri', date: 'Nov 06', tempMax: 24, tempMin: 12, condition: 'Sunny', rainfallProb: 10, humidity: 62, wind: 10 },
      { day: 'Sat', date: 'Nov 07', tempMax: 25, tempMin: 12, condition: 'Sunny', rainfallProb: 5, humidity: 58, wind: 8 },
      { day: 'Sun', date: 'Nov 08', tempMax: 26, tempMin: 13, condition: 'Sunny', rainfallProb: 5, humidity: 55, wind: 8 }
    ]
  },

  Rupnagar: {
    districtName: 'Rupnagar (Ropar)',
    punjabiName: 'ਰੂਪਨਗਰ',
    subZone: 'Kandi Foothills',
    majorCrops: ['Wheat', 'Maize', 'Paddy', 'Mustard'],
    soilType: 'Undulating Silt Loam with Pebble Beds',
    location: 'Rupnagar, Punjab',
    region: 'Satluj Sub-Mountainous Valley',
    temp: 23,
    feelsLike: 22,
    humidity: 64,
    windSpeed: 9,
    windDirection: 'NE',
    rainfallProb: 10,
    uvIndex: 5,
    pressure: 1016,
    sunrise: '06:39 AM',
    sunset: '05:34 PM',
    condition: 'Sunny',
    favourableSpraying: true,
    sprayingRecommendation: 'Favourable. Low wind velocity protects terraced farms from spray drift.',
    irrigationRecommendation: 'Satluj valley water table is high. Surface moisture remains favorable.',
    alerts: [
      {
        type: 'info',
        title: 'Shivalik Valley Morning Dew',
        description: 'Morning dew is heavy near river banks. Ensure seed treatment with fungicides to prevent damping off.'
      }
    ],
    hourly: [
      { time: '06:00', temp: 16, humidity: 80, rainfallProb: 5, condition: 'Clear' },
      { time: '09:00', temp: 20, humidity: 68, rainfallProb: 5, condition: 'Sunny' },
      { time: '12:00', temp: 24, humidity: 56, rainfallProb: 10, condition: 'Sunny' },
      { time: '15:00', temp: 25, humidity: 52, rainfallProb: 10, condition: 'Sunny' },
      { time: '18:00', temp: 21, humidity: 66, rainfallProb: 5, condition: 'Clear' },
      { time: '21:00', temp: 18, humidity: 76, rainfallProb: 5, condition: 'Clear' }
    ],
    daily: [
      { day: 'Mon', date: 'Nov 02', tempMax: 25, tempMin: 13, condition: 'Sunny', rainfallProb: 10, humidity: 64, wind: 9 },
      { day: 'Tue', date: 'Nov 03', tempMax: 26, tempMin: 13, condition: 'Sunny', rainfallProb: 10, humidity: 61, wind: 8 },
      { day: 'Wed', date: 'Nov 04', tempMax: 25, tempMin: 12, condition: 'Partly Cloudy', rainfallProb: 15, humidity: 66, wind: 10 },
      { day: 'Thu', date: 'Nov 05', tempMax: 23, tempMin: 12, condition: 'Light Rain', rainfallProb: 35, humidity: 75, wind: 12 },
      { day: 'Fri', date: 'Nov 06', tempMax: 22, tempMin: 11, condition: 'Sunny', rainfallProb: 15, humidity: 68, wind: 9 },
      { day: 'Sat', date: 'Nov 07', tempMax: 24, tempMin: 11, condition: 'Sunny', rainfallProb: 5, humidity: 62, wind: 8 },
      { day: 'Sun', date: 'Nov 08', tempMax: 25, tempMin: 12, condition: 'Sunny', rainfallProb: 5, humidity: 58, wind: 7 }
    ]
  },

  SASNagar: {
    districtName: 'SAS Nagar (Mohali)',
    punjabiName: 'ਐਸ.ਏ.ਐਸ. ਨਗਰ',
    subZone: 'Central Malwa',
    majorCrops: ['Wheat', 'Paddy', 'Vegetables', 'Flowers', 'Guava'],
    soilType: 'Medium Alluvium to Sub-Mountainous Loam',
    location: 'Mohali, Punjab',
    region: 'Chandigarh Peri-Urban Agro-Zone',
    temp: 24,
    feelsLike: 23,
    humidity: 61,
    windSpeed: 9,
    windDirection: 'NW',
    rainfallProb: 10,
    uvIndex: 5,
    pressure: 1015,
    sunrise: '06:38 AM',
    sunset: '05:34 PM',
    condition: 'Sunny',
    favourableSpraying: true,
    sprayingRecommendation: 'Favourable. Excellent window for protected vegetable nurseries and polyhouse ventilation.',
    irrigationRecommendation: 'Maintain standard micro-sprinkler cycle in peri-urban vegetable plots.',
    alerts: [
      {
        type: 'info',
        title: 'Floriculture & Exotic Vegetable Season',
        description: 'Ideal nighttime temperature (14°C) for gladiolus and marigold flowering development.'
      }
    ],
    hourly: [
      { time: '06:00', temp: 17, humidity: 78, rainfallProb: 5, condition: 'Clear' },
      { time: '09:00', temp: 21, humidity: 66, rainfallProb: 5, condition: 'Sunny' },
      { time: '12:00', temp: 25, humidity: 54, rainfallProb: 10, condition: 'Sunny' },
      { time: '15:00', temp: 26, humidity: 50, rainfallProb: 10, condition: 'Sunny' },
      { time: '18:00', temp: 22, humidity: 64, rainfallProb: 5, condition: 'Clear' },
      { time: '21:00', temp: 19, humidity: 72, rainfallProb: 5, condition: 'Clear' }
    ],
    daily: [
      { day: 'Mon', date: 'Nov 02', tempMax: 26, tempMin: 14, condition: 'Sunny', rainfallProb: 10, humidity: 61, wind: 9 },
      { day: 'Tue', date: 'Nov 03', tempMax: 26, tempMin: 14, condition: 'Sunny', rainfallProb: 5, humidity: 58, wind: 8 },
      { day: 'Wed', date: 'Nov 04', tempMax: 25, tempMin: 13, condition: 'Partly Cloudy', rainfallProb: 15, humidity: 63, wind: 10 },
      { day: 'Thu', date: 'Nov 05', tempMax: 24, tempMin: 13, condition: 'Cloudy', rainfallProb: 30, humidity: 70, wind: 12 },
      { day: 'Fri', date: 'Nov 06', tempMax: 23, tempMin: 12, condition: 'Sunny', rainfallProb: 10, humidity: 64, wind: 9 },
      { day: 'Sat', date: 'Nov 07', tempMax: 24, tempMin: 12, condition: 'Sunny', rainfallProb: 5, humidity: 59, wind: 8 },
      { day: 'Sun', date: 'Nov 08', tempMax: 25, tempMin: 13, condition: 'Sunny', rainfallProb: 5, humidity: 55, wind: 7 }
    ]
  },

  Sangrur: {
    districtName: 'Sangrur',
    punjabiName: 'ਸੰਗਰੂਰ',
    subZone: 'Central Malwa',
    majorCrops: ['Wheat', 'Paddy', 'Mustard', 'Barley', 'Cotton'],
    soilType: 'Heavy Fertile Clay Alluvium',
    location: 'Sangrur, Punjab',
    region: 'Central Malwa Granary',
    temp: 25,
    feelsLike: 24,
    humidity: 55,
    windSpeed: 11,
    windDirection: 'NW',
    rainfallProb: 5,
    uvIndex: 6,
    pressure: 1014,
    sunrise: '06:40 AM',
    sunset: '05:36 PM',
    condition: 'Sunny',
    favourableSpraying: true,
    sprayingRecommendation: 'Highly favourable. Dry canopy and gentle winds support high-precision chemical distribution.',
    irrigationRecommendation: 'Irrigate fields earmarked for wheat sowing 4-5 days prior to seeding.',
    alerts: [
      {
        type: 'info',
        title: 'Major Wheat Sowing Peak',
        description: 'Favorable soil temperature (23°C) enables rapid coleoptile emergence in HD-2967 and DBW-187 wheat.'
      }
    ],
    hourly: [
      { time: '06:00', temp: 18, humidity: 72, rainfallProb: 0, condition: 'Clear' },
      { time: '09:00', temp: 22, humidity: 60, rainfallProb: 5, condition: 'Sunny' },
      { time: '12:00', temp: 26, humidity: 48, rainfallProb: 5, condition: 'Sunny' },
      { time: '15:00', temp: 27, humidity: 44, rainfallProb: 5, condition: 'Sunny' },
      { time: '18:00', temp: 23, humidity: 56, rainfallProb: 5, condition: 'Clear' },
      { time: '21:00', temp: 19, humidity: 66, rainfallProb: 0, condition: 'Clear' }
    ],
    daily: [
      { day: 'Mon', date: 'Nov 02', tempMax: 27, tempMin: 15, condition: 'Sunny', rainfallProb: 5, humidity: 55, wind: 11 },
      { day: 'Tue', date: 'Nov 03', tempMax: 27, tempMin: 15, condition: 'Sunny', rainfallProb: 5, humidity: 53, wind: 10 },
      { day: 'Wed', date: 'Nov 04', tempMax: 26, tempMin: 14, condition: 'Sunny', rainfallProb: 10, humidity: 57, wind: 12 },
      { day: 'Thu', date: 'Nov 05', tempMax: 25, tempMin: 14, condition: 'Partly Cloudy', rainfallProb: 20, humidity: 64, wind: 13 },
      { day: 'Fri', date: 'Nov 06', tempMax: 24, tempMin: 13, condition: 'Sunny', rainfallProb: 10, humidity: 59, wind: 10 },
      { day: 'Sat', date: 'Nov 07', tempMax: 25, tempMin: 13, condition: 'Sunny', rainfallProb: 5, humidity: 55, wind: 9 },
      { day: 'Sun', date: 'Nov 08', tempMax: 26, tempMin: 14, condition: 'Sunny', rainfallProb: 5, humidity: 51, wind: 8 }
    ]
  },

  SBSNagar: {
    districtName: 'Shahid Bhagat Singh Nagar (Nawanshahr)',
    punjabiName: 'ਸ਼ਹੀਦ ਭਗਤ ਸਿੰਘ ਨਗਰ',
    subZone: 'Doaba',
    majorCrops: ['Sugarcane', 'Wheat', 'Maize', 'Paddy'],
    soilType: 'Deep Alluvial Sandy Clay Loam',
    location: 'Nawanshahr, Punjab',
    region: 'Eastern Doaba Sugarcane Zone',
    temp: 24,
    feelsLike: 23,
    humidity: 63,
    windSpeed: 9,
    windDirection: 'NW',
    rainfallProb: 10,
    uvIndex: 5,
    pressure: 1015,
    sunrise: '06:40 AM',
    sunset: '05:35 PM',
    condition: 'Sunny',
    favourableSpraying: true,
    sprayingRecommendation: 'Favourable. Calm weather allows effective biological trichogramma card installation in sugarcane.',
    irrigationRecommendation: 'Soil moisture adequate. Irrigate young ratoon crops in 5-6 days.',
    alerts: [
      {
        type: 'info',
        title: 'Sugarcane Crushing Season Prep',
        description: 'Sugar mills commencing early crushing. Monitor crop stalk moisture and sugar sucrose percentage.'
      }
    ],
    hourly: [
      { time: '06:00', temp: 17, humidity: 80, rainfallProb: 5, condition: 'Clear' },
      { time: '09:00', temp: 21, humidity: 68, rainfallProb: 5, condition: 'Sunny' },
      { time: '12:00', temp: 25, humidity: 56, rainfallProb: 10, condition: 'Sunny' },
      { time: '15:00', temp: 26, humidity: 52, rainfallProb: 10, condition: 'Sunny' },
      { time: '18:00', temp: 22, humidity: 66, rainfallProb: 5, condition: 'Clear' },
      { time: '21:00', temp: 19, humidity: 74, rainfallProb: 5, condition: 'Clear' }
    ],
    daily: [
      { day: 'Mon', date: 'Nov 02', tempMax: 26, tempMin: 14, condition: 'Sunny', rainfallProb: 10, humidity: 63, wind: 9 },
      { day: 'Tue', date: 'Nov 03', tempMax: 26, tempMin: 14, condition: 'Sunny', rainfallProb: 5, humidity: 60, wind: 8 },
      { day: 'Wed', date: 'Nov 04', tempMax: 25, tempMin: 13, condition: 'Partly Cloudy', rainfallProb: 15, humidity: 65, wind: 10 },
      { day: 'Thu', date: 'Nov 05', tempMax: 24, tempMin: 13, condition: 'Cloudy', rainfallProb: 30, humidity: 72, wind: 12 },
      { day: 'Fri', date: 'Nov 06', tempMax: 23, tempMin: 12, condition: 'Sunny', rainfallProb: 10, humidity: 65, wind: 9 },
      { day: 'Sat', date: 'Nov 07', tempMax: 24, tempMin: 12, condition: 'Sunny', rainfallProb: 5, humidity: 60, wind: 8 },
      { day: 'Sun', date: 'Nov 08', tempMax: 25, tempMin: 13, condition: 'Sunny', rainfallProb: 5, humidity: 56, wind: 7 }
    ]
  },

  TarnTaran: {
    districtName: 'Tarn Taran',
    punjabiName: 'ਤਰਨ ਤਾਰਨ',
    subZone: 'Majha',
    majorCrops: ['Basmati Rice', 'Wheat', 'Vegetables', 'Potato'],
    soilType: 'Heavy Alluvial Loam (Beas-Satluj Confluence)',
    location: 'Tarn Taran, Punjab',
    region: 'Basmati Bowl of Punjab',
    temp: 24,
    feelsLike: 23,
    humidity: 61,
    windSpeed: 10,
    windDirection: 'NW',
    rainfallProb: 10,
    uvIndex: 5,
    pressure: 1015,
    sunrise: '06:44 AM',
    sunset: '05:39 PM',
    condition: 'Sunny',
    favourableSpraying: true,
    sprayingRecommendation: 'Favourable. Dry sunny daytime is optimal for post-harvest stubble management sprays.',
    irrigationRecommendation: 'Soil has ample moisture from recent canal releases. Prepare land for timely wheat sowing.',
    alerts: [
      {
        type: 'info',
        title: 'Export Quality Basmati Grain Drying',
        description: 'Dry sunshine ensures rapid moisture drop to 14% target in harvested Basmati paddy on drying yards.'
      }
    ],
    hourly: [
      { time: '06:00', temp: 17, humidity: 78, rainfallProb: 5, condition: 'Clear' },
      { time: '09:00', temp: 21, humidity: 66, rainfallProb: 5, condition: 'Sunny' },
      { time: '12:00', temp: 25, humidity: 54, rainfallProb: 10, condition: 'Sunny' },
      { time: '15:00', temp: 26, humidity: 50, rainfallProb: 10, condition: 'Sunny' },
      { time: '18:00', temp: 22, humidity: 64, rainfallProb: 5, condition: 'Clear' },
      { time: '21:00', temp: 19, humidity: 72, rainfallProb: 5, condition: 'Clear' }
    ],
    daily: [
      { day: 'Mon', date: 'Nov 02', tempMax: 26, tempMin: 14, condition: 'Sunny', rainfallProb: 10, humidity: 61, wind: 10 },
      { day: 'Tue', date: 'Nov 03', tempMax: 26, tempMin: 14, condition: 'Sunny', rainfallProb: 5, humidity: 58, wind: 9 },
      { day: 'Wed', date: 'Nov 04', tempMax: 25, tempMin: 13, condition: 'Partly Cloudy', rainfallProb: 15, humidity: 63, wind: 11 },
      { day: 'Thu', date: 'Nov 05', tempMax: 24, tempMin: 13, condition: 'Cloudy', rainfallProb: 30, humidity: 71, wind: 13 },
      { day: 'Fri', date: 'Nov 06', tempMax: 23, tempMin: 12, condition: 'Sunny', rainfallProb: 10, humidity: 64, wind: 10 },
      { day: 'Sat', date: 'Nov 07', tempMax: 24, tempMin: 12, condition: 'Sunny', rainfallProb: 5, humidity: 59, wind: 8 },
      { day: 'Sun', date: 'Nov 08', tempMax: 25, tempMin: 13, condition: 'Sunny', rainfallProb: 5, humidity: 55, wind: 8 }
    ]
  }
}

export const punjabDistrictNames = Object.keys(punjabDistrictsData)

// Attach precise meteorological coordinates to every district
Object.entries(punjabDistrictsData).forEach(([key, district]) => {
  const coords = PUNJAB_DISTRICT_COORDINATES[key]
  if (coords) {
    district.latitude = coords.lat
    district.longitude = coords.lon
  }
})


