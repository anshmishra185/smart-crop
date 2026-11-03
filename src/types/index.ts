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
  topDifferentialDiagnoses?: Array<{
    diseaseName: string
    confidence: number
    pathogenType: string
  }>
  modelTelemetry?: {
    architecture: string
    inputTensor: string
    latencyMs: number
  }
  lesionAnnotations?: Array<{
    id: string
    label: string
    xPct: number
    yPct: number
    widthPct: number
    heightPct: number
    description: string
  }>
  tankMixRecommendations?: {
    chemical: Array<{
      name: string
      dosePerLiter: number
      unit: string
      activeIngredient: string
      phiDays: number
      reiHours: number
    }>
    organic: Array<{
      name: string
      dosePerLiter: number
      unit: string
      activeIngredient: string
    }>
  }
  spreadForecast?: {
    riskLevel: 'Low' | 'Medium' | 'High' | 'Critical'
    sporeGerminationWindow: string
    humidityThreshold: number
    tempRange: string
    advice: string
  }
  pathologyTaxonomy?: {
    kingdom: string
    phylum: string
    genus: string
    species: string
  }
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
  // ICAR 12-Parameter Extended Metrics
  sulfur?: number // ppm (ideal 10-25)
  calcium?: number // meq/100g (ideal 10-25)
  magnesium?: number // meq/100g (ideal 3-8)
  zinc?: number // ppm (ideal 0.6-2.0)
  iron?: number // ppm (ideal 4.5-10.0)
  copper?: number // ppm (ideal 0.2-1.0)
  manganese?: number // ppm (ideal 2.0-8.0)
  boron?: number // ppm (ideal 0.5-1.5)
  // USDA Soil Texture Proportions (%)
  sand?: number
  silt?: number
  clay?: number
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
  bbchStage?: string
  assignedMachine?: string
  assignedCrew?: string
  reiHours?: number
  phiDays?: number
  dieselLiters?: number
  weatherGatedStatus?: 'optimal' | 'warning' | 'locked'
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

export interface CultivarInfo {
  name: string
  releaseInstitution: string
  durationDays: number
  specialTrait: string
  sowingWindow: string
  seedTreatment: string
}

export interface PrecisionEconomicMetrics {
  targetYieldQuintalsPerAcre: number
  mandiPricePerQuintal: number
  mspPricePerQuintal: number
  costOfCultivationPerAcre: number
  grossRevenuePerAcre: number
  netProfitPerAcre: number
  benefitCostRatio: number
}

export interface PrecisionWaterMetrics {
  consumptionTier: 'Low' | 'Moderate' | 'High'
  waterReqMm: number
  pumpingHoursPerAcre: number
  dripSavingsPct: number
  groundwaterAlert?: string
}

export interface PrecisionRadarMetrics {
  soilFertility: number
  climateFit: number
  waterAvailability: number
  economicMargin: number
  pestResilience: number
}

export interface CropRecommendationScore {
  crop: CropData
  score: number
  matchReasons: string[]
  cautionNotes: string[]
  suitabilityLevel: 'Highly Suitable' | 'Suitable' | 'Marginal' | 'Not Recommended'
  radarMetrics?: PrecisionRadarMetrics
  economicMetrics?: PrecisionEconomicMetrics
  waterMetrics?: PrecisionWaterMetrics
  certifiedCultivars?: CultivarInfo[]
}

