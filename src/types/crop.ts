export type CropCategory = 'Cereal' | 'Pulse' | 'Vegetable' | 'Cash Crop' | 'Millet' | 'Oilseed' | 'Fruit'

export interface CropImageData {
  src: string
  alt: string
  sourceUrl?: string
  attribution?: string
  license?: string
}

export interface CropData {
  id: number | string
  name: string
  scientificName?: string
  category: CropCategory
  description: string
  image: string | CropImageData
  suitability: string
  tags: string[]
  climate?: string
  soil?: string
  water?: string
  season?: string
  growthHabit?: string
  durationDays?: number
  expectedYield?: string
}

export interface RecommendationFormData {
  nitrogen: number
  phosphorus: number
  potassium: number
  temperature: number
  humidity: number
  ph: number
  rainfall: number
}

export interface RecommendationResult {
  cropName: string
  score: number
  image: string
  alternatives: Array<{
    name: string
    score: number
  }>
  submitted: RecommendationFormData
  suitabilitySummary: string
}
