export type CropCategory = 'Cereal' | 'Pulse' | 'Vegetable' | 'Cash Crop' | 'Millet' | 'Oilseed' | 'Fruit'

export interface CropData {
  id: number | string
  name: string
  scientificName?: string
  category: CropCategory
  description: string
  image: string
  suitability: string
  tags: string[]
  climate?: string
  soil?: string
  water?: string
  season?: string
  growthHabit?: string
  expectedYield?: string
  durationDays?: number
  phMin?: number
  phMax?: number
  tempMin?: number
  tempMax?: number
  rainfallMin?: number
  rainfallMax?: number
  fertilizerGuide?: string
}

export interface DiseaseDetectionResult {
  id: string
  cropName: string
  diseaseName: string
  status: 'healthy' | 'infected' | 'critical'
  confidence: number
  severity: 'None' | 'Mild' | 'Moderate' | 'Severe'
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical'
  symptoms: string[]
  prevention: string[]
  recommendedTreatment: string[]
  timestamp: string
  sampleImage: string
  heatmapUrl?: string
  stage?: string
  pathogenType?: 'Fungal' | 'Bacterial' | 'Viral' | 'Pest' | 'Physiological'
  affectedAreaPercentage?: number
}

export interface WeatherCondition {
  location: string
  region: string
  temp: number
  feelsLike: number
  humidity: number
  windSpeed: number
  windDirection: string
  rainfallProb: number
  uvIndex: number
  pressure: number
  sunrise: string
  sunset: string
  condition: 'Sunny' | 'Partly Cloudy' | 'Cloudy' | 'Light Rain' | 'Heavy Rain' | 'Thunderstorm'
  favourableSpraying: boolean
  sprayingRecommendation: string
  irrigationRecommendation: string
  alerts: Array<{
    type: 'warning' | 'info' | 'danger'
    title: string
    description: string
  }>
  hourly: Array<{
    time: string
    temp: number
    humidity: number
    rainfallProb: number
    condition: string
  }>
  daily: Array<{
    day: string
    date: string
    tempMax: number
    tempMin: number
    condition: string
    rainfallProb: number
    humidity: number
    wind: number
  }>
}

export interface SoilReading {
  ph: number
  nitrogen: number // kg/ha
  phosphorus: number // kg/ha
  potassium: number // kg/ha
  moisture: number // %
  soilTemp: number // °C
  electricalConductivity: number // dS/m
  organicCarbon: number // %
  salinity: number // ppm
  fertilityScore: number // 0-100
  qualityStatus: 'Excellent' | 'Good' | 'Moderate' | 'Poor'
  alerts: string[]
  suggestions: {
    ph: string
    npk: string
    moisture: string
    organic: string
  }
}

export interface CalendarTask {
  id: string
  title: string
  crop: string
  category: 'sowing' | 'irrigation' | 'fertilizer' | 'inspection' | 'harvest' | 'weather'
  date: string
  time?: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  notes?: string
}

export interface AgriNotification {
  id: string
  title: string
  message: string
  severity: 'critical' | 'warning' | 'info' | 'success'
  timestamp: string
  read: boolean
  category: 'disease' | 'weather' | 'soil' | 'irrigation' | 'system'
  actionUrl?: string
}

export interface RecommendationFormData {
  nitrogen: number
  phosphorus: number
  potassium: number
  temperature: number
  humidity: number
  ph: number
  rainfall: number
  soilMoisture?: number
  season?: string
  location?: string
}

export interface CropRecommendationScore {
  crop: CropData
  score: number
  matchReasons: string[]
  cautionNotes: string[]
  suitabilityLevel: 'Highly Suitable' | 'Suitable' | 'Marginal' | 'Not Recommended'
}

