import type { WeatherCondition } from '../types'

export const regionalWeatherPresets: Record<string, WeatherCondition> = {
  Punjab: {
    location: 'Ludhiana, Punjab',
    region: 'North-Western Plain Zone',
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
  Maharashtra: {
    location: 'Nashik, Maharashtra',
    region: 'Western Plateau & Hills',
    temp: 29,
    feelsLike: 31,
    humidity: 74,
    windSpeed: 16,
    windDirection: 'SW',
    rainfallProb: 65,
    uvIndex: 7,
    pressure: 1010,
    sunrise: '06:34 AM',
    sunset: '05:58 PM',
    condition: 'Light Rain',
    favourableSpraying: false,
    sprayingRecommendation: 'Unfavourable for pesticide spraying. High humidity (74%) and 65% rain chance can cause rain washoff.',
    irrigationRecommendation: 'Suspend irrigation. Precipitation expected over the next 24 hours.',
    alerts: [
      {
        type: 'warning',
        title: 'High Fungal Disease Risk',
        description: 'Warm damp canopy conditions are highly conducive to powdery mildew and downy mildew in vineyards and vegetable crops.'
      },
      {
        type: 'info',
        title: 'Rain Expected This Afternoon',
        description: 'Provide proper drainage outlets in low-lying tomato and onion plots.'
      }
    ],
    hourly: [
      { time: '06:00', temp: 22, humidity: 88, rainfallProb: 40, condition: 'Cloudy' },
      { time: '09:00', temp: 26, humidity: 78, rainfallProb: 50, condition: 'Overcast' },
      { time: '12:00', temp: 29, humidity: 70, rainfallProb: 65, condition: 'Light Rain' },
      { time: '15:00', temp: 28, humidity: 76, rainfallProb: 75, condition: 'Showers' },
      { time: '18:00', temp: 25, humidity: 82, rainfallProb: 60, condition: 'Light Rain' },
      { time: '21:00', temp: 23, humidity: 86, rainfallProb: 35, condition: 'Cloudy' }
    ],
    daily: [
      { day: 'Mon', date: 'Nov 02', tempMax: 29, tempMin: 21, condition: 'Light Rain', rainfallProb: 65, humidity: 74, wind: 16 },
      { day: 'Tue', date: 'Nov 03', tempMax: 28, tempMin: 20, condition: 'Heavy Rain', rainfallProb: 80, humidity: 82, wind: 22 },
      { day: 'Wed', date: 'Nov 04', tempMax: 27, tempMin: 19, condition: 'Cloudy', rainfallProb: 45, humidity: 75, wind: 14 },
      { day: 'Thu', date: 'Nov 05', tempMax: 29, tempMin: 20, condition: 'Partly Cloudy', rainfallProb: 25, humidity: 68, wind: 12 },
      { day: 'Fri', date: 'Nov 06', tempMax: 30, tempMin: 21, condition: 'Sunny', rainfallProb: 15, humidity: 62, wind: 10 },
      { day: 'Sat', date: 'Nov 07', tempMax: 31, tempMin: 21, condition: 'Sunny', rainfallProb: 10, humidity: 58, wind: 11 },
      { day: 'Sun', date: 'Nov 08', tempMax: 30, tempMin: 20, condition: 'Sunny', rainfallProb: 10, humidity: 60, wind: 9 }
    ]
  },
  UttarPradesh: {
    location: 'Varanasi, Uttar Pradesh',
    region: 'Middle Gangetic Plain',
    temp: 27,
    feelsLike: 28,
    humidity: 62,
    windSpeed: 8,
    windDirection: 'E',
    rainfallProb: 10,
    uvIndex: 6,
    pressure: 1012,
    sunrise: '06:12 AM',
    sunset: '05:18 PM',
    condition: 'Sunny',
    favourableSpraying: true,
    sprayingRecommendation: 'Excellent window for foliar nutrient sprays and biological pest management.',
    irrigationRecommendation: 'Light irrigation recommended for early mustard and potato beds.',
    alerts: [
      {
        type: 'info',
        title: 'Optimal Sowing Window',
        description: 'Soil temperature (24°C) is ideal for Rabi pulses and mustard germination.'
      }
    ],
    hourly: [
      { time: '06:00', temp: 19, humidity: 78, rainfallProb: 5, condition: 'Clear' },
      { time: '09:00', temp: 23, humidity: 68, rainfallProb: 5, condition: 'Sunny' },
      { time: '12:00', temp: 28, humidity: 55, rainfallProb: 10, condition: 'Sunny' },
      { time: '15:00', temp: 28, humidity: 52, rainfallProb: 10, condition: 'Sunny' },
      { time: '18:00', temp: 24, humidity: 65, rainfallProb: 5, condition: 'Clear' },
      { time: '21:00', temp: 21, humidity: 72, rainfallProb: 5, condition: 'Clear' }
    ],
    daily: [
      { day: 'Mon', date: 'Nov 02', tempMax: 28, tempMin: 18, condition: 'Sunny', rainfallProb: 10, humidity: 62, wind: 8 },
      { day: 'Tue', date: 'Nov 03', tempMax: 29, tempMin: 18, condition: 'Sunny', rainfallProb: 10, humidity: 60, wind: 7 },
      { day: 'Wed', date: 'Nov 04', tempMax: 28, tempMin: 17, condition: 'Sunny', rainfallProb: 5, humidity: 58, wind: 9 },
      { day: 'Thu', date: 'Nov 05', tempMax: 27, tempMin: 16, condition: 'Partly Cloudy', rainfallProb: 15, humidity: 64, wind: 10 },
      { day: 'Fri', date: 'Nov 06', tempMax: 27, tempMin: 16, condition: 'Sunny', rainfallProb: 10, humidity: 61, wind: 8 },
      { day: 'Sat', date: 'Nov 07', tempMax: 28, tempMin: 17, condition: 'Sunny', rainfallProb: 5, humidity: 59, wind: 8 },
      { day: 'Sun', date: 'Nov 08', tempMax: 28, tempMin: 17, condition: 'Sunny', rainfallProb: 5, humidity: 57, wind: 7 }
    ]
  },
  Karnataka: {
    location: 'Dharwad, Karnataka',
    region: 'Southern Plateau & Hills',
    temp: 26,
    feelsLike: 27,
    humidity: 68,
    windSpeed: 14,
    windDirection: 'SE',
    rainfallProb: 35,
    uvIndex: 8,
    pressure: 1013,
    sunrise: '06:22 AM',
    sunset: '06:04 PM',
    condition: 'Partly Cloudy',
    favourableSpraying: true,
    sprayingRecommendation: 'Favourable during early morning (07:00 - 10:00 AM) prior to afternoon wind pickup.',
    irrigationRecommendation: 'Maintain normal drip schedule for cotton and maize blocks.',
    alerts: [
      {
        type: 'info',
        title: 'Whitefly Activity Monitored',
        description: 'Moderate ambient temperatures are supporting cotton sucking pest proliferation. Inspect undersides of leaves.'
      }
    ],
    hourly: [
      { time: '06:00', temp: 20, humidity: 82, rainfallProb: 10, condition: 'Clear' },
      { time: '09:00', temp: 24, humidity: 72, rainfallProb: 20, condition: 'Sunny' },
      { time: '12:00', temp: 27, humidity: 60, rainfallProb: 30, condition: 'Partly Cloudy' },
      { time: '15:00', temp: 27, humidity: 58, rainfallProb: 35, condition: 'Partly Cloudy' },
      { time: '18:00', temp: 23, humidity: 70, rainfallProb: 25, condition: 'Cloudy' },
      { time: '21:00', temp: 21, humidity: 78, rainfallProb: 15, condition: 'Partly Cloudy' }
    ],
    daily: [
      { day: 'Mon', date: 'Nov 02', tempMax: 28, tempMin: 19, condition: 'Partly Cloudy', rainfallProb: 35, humidity: 68, wind: 14 },
      { day: 'Tue', date: 'Nov 03', tempMax: 27, tempMin: 19, condition: 'Light Rain', rainfallProb: 55, humidity: 75, wind: 16 },
      { day: 'Wed', date: 'Nov 04', tempMax: 26, tempMin: 18, condition: 'Cloudy', rainfallProb: 40, humidity: 72, wind: 15 },
      { day: 'Thu', date: 'Nov 05', tempMax: 28, tempMin: 18, condition: 'Sunny', rainfallProb: 20, humidity: 65, wind: 12 },
      { day: 'Fri', date: 'Nov 06', tempMax: 29, tempMin: 19, condition: 'Sunny', rainfallProb: 15, humidity: 62, wind: 11 },
      { day: 'Sat', date: 'Nov 07', tempMax: 29, tempMin: 19, condition: 'Sunny', rainfallProb: 10, humidity: 60, wind: 10 },
      { day: 'Sun', date: 'Nov 08', tempMax: 28, tempMin: 18, condition: 'Sunny', rainfallProb: 10, humidity: 61, wind: 11 }
    ]
  }
}

