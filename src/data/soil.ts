import type { SoilReading } from '../types'

export const defaultSoilReading: SoilReading = {
  ph: 6.8,
  nitrogen: 112, // kg/ha (ideal ~100-140)
  phosphorus: 48, // kg/ha (ideal ~35-60)
  potassium: 165, // kg/ha (ideal ~150-220)
  moisture: 38, // % (ideal ~30-50%)
  soilTemp: 22.4, // °C
  electricalConductivity: 1.15, // dS/m (normal < 2.0)
  organicCarbon: 0.72, // % (ideal > 0.75%)
  salinity: 280, // ppm (safe < 500)
  fertilityScore: 84, // 0-100
  qualityStatus: 'Good',
  alerts: [
    'Organic Carbon (0.72%) is slightly below optimal threshold (>0.75%). Consider incorporating farmyard manure.',
    'Nitrogen and Phosphorus levels are well-balanced for current growth phase.',
    'Available Zinc (0.85 ppm) is within the safe zone, but foliar booster is recommended at tillering.'
  ],
  suggestions: {
    ph: 'Current pH of 6.8 is neutral and ideal for most nutrient absorption. Maintain with compost.',
    npk: 'Balanced NPK ratio. Top-dress with nitrogen in 2 weeks as canopy expands.',
    moisture: '38% moisture supports root respiration. Next light irrigation cycle in 48 hours.',
    organic: 'Apply 2-3 tons/acre well-decomposed FYM or vermicompost before next sowing cycle.'
  },
  // Secondary Nutrients
  sulfur: 16.5, // ppm (threshold: >10 ppm)
  calcium: 14.8, // meq/100g (threshold: 10-25 meq/100g)
  magnesium: 4.6, // meq/100g (threshold: 3-8 meq/100g)
  // Micronutrients
  zinc: 0.85, // ppm (critical: 0.6 ppm)
  iron: 6.8, // ppm (critical: 4.5 ppm)
  copper: 0.42, // ppm (critical: 0.2 ppm)
  manganese: 4.1, // ppm (critical: 2.0 ppm)
  boron: 0.75, // ppm (critical: 0.5 ppm)
  // USDA Soil Texture Proportions (%)
  sand: 45,
  silt: 35,
  clay: 20
}

export function computeSoilHealth(reading: Omit<SoilReading, 'fertilityScore' | 'qualityStatus' | 'alerts' | 'suggestions'>): SoilReading {
  let score = 100
  const alerts: string[] = []

  // pH checks (Ideal 6.0 - 7.5)
  let phSuggestion = 'pH is in the optimal range (6.0 - 7.5) for high nutrient availability.'
  if (reading.ph < 5.8) {
    score -= 15
    alerts.push(`Acidic soil (pH ${reading.ph.toFixed(1)}). Calcium and magnesium uptake may be restricted.`)
    phSuggestion = 'Apply agricultural lime (calcium carbonate) @ 1.5 - 2 tons/acre to elevate pH.'
  } else if (reading.ph > 8.0) {
    score -= 15
    alerts.push(`Alkaline soil (pH ${reading.ph.toFixed(1)}). Zinc, iron, and boron micronutrient lockup likely.`)
    phSuggestion = 'Apply agricultural gypsum (calcium sulfate) and sulfur-enriched organic matter.'
  }

  // NPK checks
  let npkSuggestion = 'NPK balance is favourable for crop growth.'
  if (reading.nitrogen < 70) {
    score -= 12
    alerts.push(`Nitrogen deficiency (${reading.nitrogen} kg/ha). Lower leaf yellowing expected.`)
    npkSuggestion = 'Apply urea @ 45 kg/acre or neem-coated urea split in two doses.'
  } else if (reading.nitrogen > 180) {
    score -= 8
    alerts.push(`Excessive Nitrogen (${reading.nitrogen} kg/ha). Heightens fungal vulnerability and vegetative softness.`)
  }

  if (reading.phosphorus < 25) {
    score -= 10
    alerts.push(`Phosphorus deficiency (${reading.phosphorus} kg/ha). Stunted root architecture.`)
    npkSuggestion += ' Incorporate Single Super Phosphate (SSP) or DAP @ 50 kg/acre.'
  }

  if (reading.potassium < 100) {
    score -= 10
    alerts.push(`Potassium deficiency (${reading.potassium} kg/ha). Poor drought and disease resistance.`)
    npkSuggestion += ' Apply Muriate of Potash (MOP) @ 30 kg/acre.'
  }

  // Moisture checks (Ideal 25% - 50%)
  let moistureSuggestion = 'Soil moisture is optimal for aerobic root activity.'
  if (reading.moisture < 20) {
    score -= 14
    alerts.push(`Low soil moisture (${reading.moisture}%). Permanent wilting point risk approaching.`)
    moistureSuggestion = 'Immediate irrigation recommended. Ensure deep root zone penetration.'
  } else if (reading.moisture > 65) {
    score -= 12
    alerts.push(`Waterlogged soil (${reading.moisture}%). Root hypoxia and pythium root rot risk.`)
    moistureSuggestion = 'Cease watering immediately. Clear field drainage furrows.'
  }

  // Electrical Conductivity (dS/m) (Ideal < 1.5)
  if (reading.electricalConductivity > 2.5) {
    score -= 12
    alerts.push(`Elevated Electrical Conductivity (${reading.electricalConductivity} dS/m). Salt injury potential.`)
  }

  // Organic Carbon (%) (Ideal > 0.75%)
  let organicSuggestion = 'Soil organic carbon supports healthy microbial activity.'
  if (reading.organicCarbon < 0.5) {
    score -= 10
    alerts.push(`Critically low organic carbon (${reading.organicCarbon}%). Poor cation exchange capacity.`)
    organicSuggestion = 'Green manuring with Dhaincha (Sesbania) or Sunnhemp strongly advised.'
  }

  const finalScore = Math.max(10, Math.min(100, Math.round(score)))
  let status: 'Excellent' | 'Good' | 'Moderate' | 'Poor' = 'Good'
  if (finalScore >= 85) status = 'Excellent'
  else if (finalScore >= 70) status = 'Good'
  else if (finalScore >= 50) status = 'Moderate'
  else status = 'Poor'

  return {
    ...reading,
    fertilityScore: finalScore,
    qualityStatus: status,
    alerts: alerts.length > 0 ? alerts : ['All soil parameters fall within normal agronomic thresholds.'],
    suggestions: {
      ph: phSuggestion,
      npk: npkSuggestion,
      moisture: moistureSuggestion,
      organic: organicSuggestion
    }
  }
}

