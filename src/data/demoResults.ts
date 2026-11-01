import riceImage from '../assets/rice.svg'
import type { RecommendationResult } from '../types/crop'

export const demoRecommendation: RecommendationResult = {
  cropName: 'Rice',
  score: 86,
  image: riceImage,
  alternatives: [
    { name: 'Maize', score: 78 },
    { name: 'Wheat', score: 72 },
    { name: 'Soybean', score: 68 },
  ],
  submitted: {
    nitrogen: 80,
    phosphorus: 52,
    potassium: 66,
    temperature: 28,
    humidity: 72,
    ph: 6.4,
    rainfall: 190,
  },
  suitabilitySummary:
    'Illustrative demo output showing how a future model might rank candidate crops from supplied soil and climate inputs.',
}
