import { cropCatalogue } from '../data/crops'
import type { CropData, CropRecommendationScore, RecommendationFormData } from '../types'

export const recommendationService = {
  evaluateRecommendations(inputs: RecommendationFormData): CropRecommendationScore[] {
    const scores: CropRecommendationScore[] = cropCatalogue.map((crop) => {
      let score = 70
      const matchReasons: string[] = []
      const cautionNotes: string[] = []

      // pH Evaluation (ideal range roughly 6.0 - 7.5 for most)
      if (inputs.ph >= 6.0 && inputs.ph <= 7.5) {
        score += 8
        matchReasons.push(`Soil pH (${inputs.ph}) is in the optimal nutrient assimilation zone.`)
      } else if (inputs.ph < 5.8) {
        score -= 10
        cautionNotes.push(`Slightly acidic soil (${inputs.ph}) may limit root development.`)
      } else if (inputs.ph > 8.0) {
        score -= 10
        cautionNotes.push(`Alkaline pH (${inputs.ph}) may cause zinc or iron lockup.`)
      }

      // Temperature suitability
      const cropName = crop.name.toLowerCase()
      if (cropName.includes('wheat') || cropName.includes('mustard') || cropName.includes('chickpea')) {
        // Rabi / cool weather crops
        if (inputs.temperature <= 26 && inputs.temperature >= 12) {
          score += 12
          matchReasons.push(`Moderate cool temperatures (${inputs.temperature}°C) are ideal for Rabi growth.`)
        } else if (inputs.temperature > 30) {
          score -= 18
          cautionNotes.push(`High temperature (${inputs.temperature}°C) causes thermal stress and forced maturity.`)
        }
      } else if (cropName.includes('rice') || cropName.includes('cotton') || cropName.includes('sugarcane') || cropName.includes('maize')) {
        // Kharif / warm crops
        if (inputs.temperature >= 22 && inputs.temperature <= 36) {
          score += 12
          matchReasons.push(`Warm ambient conditions (${inputs.temperature}°C) accelerate photosynthetic tillering.`)
        } else if (inputs.temperature < 18) {
          score -= 14
          cautionNotes.push(`Low temperatures (${inputs.temperature}°C) delay vegetative emergence.`)
        }
      }

      // Rainfall / Moisture
      if (cropName.includes('rice')) {
        if (inputs.rainfall >= 140) {
          score += 10
          matchReasons.push(`Sufficient rainfall/irrigation (${inputs.rainfall} mm) supports ponding needs.`)
        } else {
          score -= 12
          cautionNotes.push(`Rice requires high moisture; supplementary irrigation will be essential.`)
        }
      } else if (cropName.includes('cotton') || cropName.includes('pearl millet') || cropName.includes('sorghum')) {
        if (inputs.rainfall < 100) {
          score += 8
          matchReasons.push(`Tolerates moderate to low moisture conditions efficiently.`)
        }
      }

      // Nitrogen requirement
      if (inputs.nitrogen >= 80 && inputs.nitrogen <= 140) {
        score += 5
        matchReasons.push(`Available Nitrogen (${inputs.nitrogen} kg/ha) supports vigorous foliar canopy.`)
      } else if (inputs.nitrogen < 50) {
        score -= 6
        cautionNotes.push(`Low available Nitrogen requires base fertilizer top-dressing.`)
      }

      // Potassium requirement
      if (inputs.potassium >= 120) {
        score += 4
        matchReasons.push(`High Potassium (${inputs.potassium} kg/ha) boosts disease resistance and grain filling.`)
      }

      const finalScore = Math.max(25, Math.min(98, score))
      let suitabilityLevel: 'Highly Suitable' | 'Suitable' | 'Marginal' | 'Not Recommended' = 'Suitable'

      if (finalScore >= 85) suitabilityLevel = 'Highly Suitable'
      else if (finalScore >= 70) suitabilityLevel = 'Suitable'
      else if (finalScore >= 50) suitabilityLevel = 'Marginal'
      else suitabilityLevel = 'Not Recommended'

      return {
        crop: crop as CropData,
        score: finalScore,
        matchReasons: matchReasons.length > 0 ? matchReasons : ['Matches general agro-ecological parameters.'],
        cautionNotes,
        suitabilityLevel
      }
    })

    return scores.sort((a, b) => b.score - a.score)
  }
}

