import type { RecommendationFormData } from '../types/crop'

export const recommendationFieldConfig = {
  nitrogen: { label: 'Nitrogen (N)', min: 0, max: 200, unit: 'kg/ha' },
  phosphorus: { label: 'Phosphorus (P)', min: 0, max: 160, unit: 'kg/ha' },
  potassium: { label: 'Potassium (K)', min: 0, max: 200, unit: 'kg/ha' },
  temperature: { label: 'Temperature', min: -10, max: 50, unit: '°C' },
  humidity: { label: 'Relative humidity', min: 0, max: 100, unit: '%' },
  ph: { label: 'Soil pH', min: 3, max: 10, unit: '' },
  rainfall: { label: 'Rainfall', min: 0, max: 5000, unit: 'mm' },
} as const

export type RecommendationFieldKey = keyof RecommendationFormData

export const emptyRecommendation: RecommendationFormData = {
  nitrogen: 0,
  phosphorus: 0,
  potassium: 0,
  temperature: 25,
  humidity: 60,
  ph: 6.5,
  rainfall: 120,
}

export function validateRecommendation(values: Partial<RecommendationFormData>) {
  const errors: Partial<Record<RecommendationFieldKey, string>> = {}

  for (const [field, config] of Object.entries(recommendationFieldConfig) as Array<[
    RecommendationFieldKey,
    (typeof recommendationFieldConfig)[RecommendationFieldKey],
  ]>) {
    const value = values[field]

    if (value === undefined || Number.isNaN(Number(value))) {
      errors[field] = 'This field is required.'
      continue
    }

    const numericValue = Number(value)

    if (numericValue < config.min || numericValue > config.max) {
      errors[field] = `Enter a value between ${config.min} and ${config.max}${
        config.unit ? ` ${config.unit}` : ''
      }.`
    }
  }

  return errors
}
