import { cropCatalogue } from '../data/crops'
import type {
  CropData,
  CropRecommendationScore,
  CultivarInfo,
  PrecisionEconomicMetrics,
  PrecisionRadarMetrics,
  PrecisionWaterMetrics,
  RecommendationFormData,
} from '../types'

// University and ICAR certified cultivars dictionary
const CROP_CULTIVARS: Record<string, CultivarInfo[]> = {
  wheat: [
    {
      name: 'PBW-826',
      releaseInstitution: 'PAU Ludhiana (2022)',
      durationDays: 148,
      specialTrait: 'High grain weight (45.8g/1000 grains) with lodging resistance and yellow rust immunity',
      sowingWindow: 'Nov 01 – Nov 15 (Timely Sown)',
      seedTreatment: 'Carboxin 37.5% + Thiram 37.5% (Vitavax Power @ 2g/kg seed)',
    },
    {
      name: 'HD-3086 (Pusa Gautami)',
      releaseInstitution: 'ICAR-IARI New Delhi',
      durationDays: 142,
      specialTrait: 'Terminal heat tolerance during reproductive grain filling, excellent chapati score',
      sowingWindow: 'Nov 05 – Nov 20',
      seedTreatment: 'Tebuconazole 2% DS @ 1g/kg or Trichoderma viride @ 5g/kg seed',
    },
    {
      name: 'DBW-187 (Karan Vandana)',
      releaseInstitution: 'ICAR-IIWBR Karnal',
      durationDays: 140,
      specialTrait: 'Bio-fortified with high protein (12.2%) and iron (42.8 ppm)',
      sowingWindow: 'Nov 05 – Nov 25',
      seedTreatment: 'Azotobacter + PSB culture @ 200g/acre for base root colonization',
    },
  ],
  rice: [
    {
      name: 'PR-126 (Short-Duration High Yield)',
      releaseInstitution: 'PAU Ludhiana',
      durationDays: 123,
      specialTrait: 'Matures in 93 days after transplanting; saves ~25% irrigation water and diesel pumping',
      sowingWindow: 'Nursery: May 25 – June 10; Transplanting: June 25 – July 10',
      seedTreatment: 'Carbendazim 50% WP @ 2g/kg seed soak for 24 hours against bakanae',
    },
    {
      name: 'Pusa Basmati 1121',
      releaseInstitution: 'ICAR-IARI New Delhi',
      durationDays: 145,
      specialTrait: 'World longest extra-long slender basmati grain (8.4 mm kernel elongation)',
      sowingWindow: 'Transplanting: July 01 – July 15',
      seedTreatment: 'Streptocycline 1g + Copper Oxychloride 25g in 10L water for seedling dip',
    },
    {
      name: 'Pusa Basmati 1847',
      releaseInstitution: 'ICAR-IARI New Delhi',
      durationDays: 135,
      specialTrait: 'Near-isogenic PB-1509 with built-in resistance to bacterial leaf blight and blast',
      sowingWindow: 'Transplanting: June 20 – July 05',
      seedTreatment: 'Pseudomonas fluorescens biological culture @ 10g/L nursery bath',
    },
  ],
  cotton: [
    {
      name: 'RCH-659 BGII',
      releaseInstitution: 'Rasi Seeds / CICR Approved',
      durationDays: 160,
      specialTrait: 'Dual bollworm cry1Ac + cry2Ab tolerance with high boll retention and lint index',
      sowingWindow: 'April 15 – May 15',
      seedTreatment: 'Imidacloprid 70% WS @ 5g/kg seed for early sap-sucking pest defense',
    },
    {
      name: 'PAU 1 Bt',
      releaseInstitution: 'PAU Ludhiana',
      durationDays: 155,
      specialTrait: 'First university-bred public sector Bt cotton variety with low seed cost',
      sowingWindow: 'April 20 – May 10',
      seedTreatment: 'Trichoderma harzianum @ 10g/kg for root rot suppression',
    },
  ],
  mustard: [
    {
      name: 'Giriraj (DRMRIJ-31)',
      releaseInstitution: 'ICAR-DRMR Bharatpur',
      durationDays: 138,
      specialTrait: 'Bold seeds with 40.2% high oil content and white rust field tolerance',
      sowingWindow: 'Oct 05 – Oct 25',
      seedTreatment: 'Apron 35 SD (Metalaxyl) @ 6g/kg seed to prevent downy mildew',
    },
    {
      name: 'RH-725',
      releaseInstitution: 'CCS HAU Hisar',
      durationDays: 142,
      specialTrait: 'Exceptional branching (18-22 siliquae per plant) with high yield potential',
      sowingWindow: 'Oct 10 – Oct 30',
      seedTreatment: 'Carbendazim 12% + Mancozeb 63% WP (Saaf) @ 2.5g/kg seed',
    },
  ],
  maize: [
    {
      name: 'PMH-1 (Punjab Maize Hybrid 1)',
      releaseInstitution: 'PAU Ludhiana',
      durationDays: 110,
      specialTrait: 'High grain yield hybrid with strong lodging resistance and stay-green foliage',
      sowingWindow: 'Kharif: June 15 – July 05; Spring: Jan 20 – Feb 15',
      seedTreatment: 'Thiram 75% WP @ 3g/kg seed to protect against seedling blight',
    },
    {
      name: 'Pusa HM-4 Baby Corn & Grain',
      releaseInstitution: 'ICAR-IARI New Delhi',
      durationDays: 95,
      specialTrait: 'Fast maturity, excellent table quality baby corn and cattle fodder silage',
      sowingWindow: 'Feb 15 – March 10',
      seedTreatment: 'Cyantraniliprole 19.8% + Thiamethoxam 19.8% FS @ 4ml/kg for Fall Armyworm',
    },
  ],
  chickpea: [
    {
      name: 'PBG-8 (Desi Gram)',
      releaseInstitution: 'PAU Ludhiana',
      durationDays: 145,
      specialTrait: 'Ascochyta blight and Fusarium wilt resistant with erect plant canopy',
      sowingWindow: 'Oct 25 – Nov 15',
      seedTreatment: 'Rhizobium + PSB seed inoculant @ 250g per 15kg seed',
    },
  ],
  moong: [
    {
      name: 'SML-1827 (Summer Mungbean)',
      releaseInstitution: 'PAU Ludhiana',
      durationDays: 62,
      specialTrait: 'Ultra-short 60-day catch crop; fixes ~32 kg/ha atmospheric nitrogen for soil enrichment',
      sowingWindow: 'March 20 – April 10 (Post-Wheat/Potato)',
      seedTreatment: 'Rhizobium sp. (Mung) culture packet @ 200g/acre seed priming',
    },
  ],
}

// Economic baseline profiles (Punjab & North India Mandi norms)
const CROP_ECONOMICS: Record<string, {
  yieldPerAcre: number
  mandiRate: number
  mspRate: number
  costA2FL: number
  waterTier: 'Low' | 'Moderate' | 'High'
  waterReqMm: number
  pumpingHours: number
  dripSavingsPct: number
  groundwaterAlert?: string
}> = {
  wheat: {
    yieldPerAcre: 22.5,
    mandiRate: 2275,
    mspRate: 2275,
    costA2FL: 18500,
    waterTier: 'Moderate',
    waterReqMm: 420,
    pumpingHours: 48,
    dripSavingsPct: 35,
  },
  rice: {
    yieldPerAcre: 28.0,
    mandiRate: 3850, // Basmati weighted
    mspRate: 2183,
    costA2FL: 26000,
    waterTier: 'High',
    waterReqMm: 1450,
    pumpingHours: 180,
    dripSavingsPct: 52,
    groundwaterAlert: 'High water intensity! Recommend PR-126 or Direct Seeded Rice (DSR) to prevent aquifer drawdown.',
  },
  cotton: {
    yieldPerAcre: 9.5,
    mandiRate: 7150,
    mspRate: 6620,
    costA2FL: 24500,
    waterTier: 'Moderate',
    waterReqMm: 650,
    pumpingHours: 72,
    dripSavingsPct: 45,
  },
  mustard: {
    yieldPerAcre: 8.5,
    mandiRate: 5680,
    mspRate: 5650,
    costA2FL: 13500,
    waterTier: 'Low',
    waterReqMm: 280,
    pumpingHours: 24,
    dripSavingsPct: 40,
  },
  maize: {
    yieldPerAcre: 24.0,
    mandiRate: 2090,
    mspRate: 2090,
    costA2FL: 16500,
    waterTier: 'Moderate',
    waterReqMm: 500,
    pumpingHours: 55,
    dripSavingsPct: 45,
  },
  chickpea: {
    yieldPerAcre: 7.8,
    mandiRate: 5440,
    mspRate: 5440,
    costA2FL: 12000,
    waterTier: 'Low',
    waterReqMm: 250,
    pumpingHours: 20,
    dripSavingsPct: 30,
  },
  moong: {
    yieldPerAcre: 5.5,
    mandiRate: 8550,
    mspRate: 8558,
    costA2FL: 11000,
    waterTier: 'Low',
    waterReqMm: 220,
    pumpingHours: 18,
    dripSavingsPct: 35,
  },
}

export const recommendationService = {
  evaluateRecommendations(inputs: RecommendationFormData): CropRecommendationScore[] {
    const scores: CropRecommendationScore[] = cropCatalogue.map((crop) => {
      let score = 70
      const matchReasons: string[] = []
      const cautionNotes: string[] = []

      const cropKey = crop.name.toLowerCase()

      // 1. pH Evaluation (ideal range 6.0 - 7.5 for most crops)
      let soilFertilityRadar = 75
      if (inputs.ph >= 6.2 && inputs.ph <= 7.5) {
        score += 8
        soilFertilityRadar += 15
        matchReasons.push(`Soil pH (${inputs.ph}) is in the optimal nutrient assimilation zone (6.2–7.5).`)
      } else if (inputs.ph < 5.8) {
        score -= 10
        soilFertilityRadar -= 20
        cautionNotes.push(`Slightly acidic soil (${inputs.ph}) may limit root development and phosphorus uptake.`)
      } else if (inputs.ph > 8.0) {
        score -= 10
        soilFertilityRadar -= 15
        cautionNotes.push(`Alkaline pH (${inputs.ph}) may cause zinc and iron micronutrient lockup.`)
      }

      // 2. Nitrogen, Phosphorus & Potassium chemometrics
      if (inputs.nitrogen >= 80 && inputs.nitrogen <= 140) {
        score += 5
        soilFertilityRadar += 8
        matchReasons.push(`Available Nitrogen (${inputs.nitrogen} kg/ha) supports vigorous foliar vegetative growth.`)
      } else if (inputs.nitrogen < 50) {
        score -= 6
        soilFertilityRadar -= 12
        cautionNotes.push(`Low available Nitrogen requires base fertilizer top-dressing.`)
      }

      if (inputs.potassium >= 120) {
        score += 4
        soilFertilityRadar += 7
        matchReasons.push(`High Potassium (${inputs.potassium} kg/ha) enhances lodging and drought resistance.`)
      }

      // 3. Temperature & GDD thermal suitability
      let climateFitRadar = 70
      if (cropKey.includes('wheat') || cropKey.includes('mustard') || cropKey.includes('chickpea')) {
        // Rabi (Cool Season)
        if (inputs.temperature <= 26 && inputs.temperature >= 12) {
          score += 12
          climateFitRadar += 20
          matchReasons.push(`Moderate cool temperatures (${inputs.temperature}°C) are ideal for Rabi phenological tillering.`)
        } else if (inputs.temperature > 30) {
          score -= 18
          climateFitRadar -= 30
          cautionNotes.push(`High temperature (${inputs.temperature}°C) poses terminal heat stress and forced maturity risk.`)
        }
      } else if (
        cropKey.includes('rice') ||
        cropKey.includes('cotton') ||
        cropKey.includes('maize') ||
        cropKey.includes('sugarcane')
      ) {
        // Kharif (Warm Season)
        if (inputs.temperature >= 22 && inputs.temperature <= 36) {
          score += 12
          climateFitRadar += 20
          matchReasons.push(`Warm ambient conditions (${inputs.temperature}°C) accelerate photosynthetic vegetative biomass.`)
        } else if (inputs.temperature < 18) {
          score -= 14
          climateFitRadar -= 25
          cautionNotes.push(`Low ambient temperature (${inputs.temperature}°C) delays seed germination.`)
        }
      }

      // 4. Moisture & Water Footprint
      let waterAvailRadar = 72
      if (cropKey.includes('rice')) {
        if (inputs.rainfall >= 140 || (inputs.soilMoisture && inputs.soilMoisture > 40)) {
          score += 10
          waterAvailRadar += 18
          matchReasons.push(`Sufficient rainfall/irrigation (${inputs.rainfall} mm) supports ponding and water depth.`)
        } else {
          score -= 12
          waterAvailRadar -= 25
          cautionNotes.push(`Rice requires high moisture; supplementary tubewell irrigation will be essential.`)
        }
      } else if (cropKey.includes('cotton') || cropKey.includes('mustard') || cropKey.includes('pearl millet')) {
        if (inputs.rainfall < 120) {
          score += 8
          waterAvailRadar += 15
          matchReasons.push(`High drought tolerance: thrives under low-to-moderate moisture conditions.`)
        }
      }

      // 5. Match key for economics and cultivars
      let matchedKey = 'wheat'
      if (cropKey.includes('wheat')) matchedKey = 'wheat'
      else if (cropKey.includes('rice')) matchedKey = 'rice'
      else if (cropKey.includes('cotton')) matchedKey = 'cotton'
      else if (cropKey.includes('mustard')) matchedKey = 'mustard'
      else if (cropKey.includes('maize')) matchedKey = 'maize'
      else if (cropKey.includes('chickpea')) matchedKey = 'chickpea'
      else if (cropKey.includes('moong')) matchedKey = 'moong'

      const econBase = CROP_ECONOMICS[matchedKey] || CROP_ECONOMICS.wheat
      const grossRev = Math.round(econBase.yieldPerAcre * econBase.mandiRate)
      const netProf = grossRev - econBase.costA2FL
      const bcr = Number((grossRev / econBase.costA2FL).toFixed(2))

      const economicMetrics: PrecisionEconomicMetrics = {
        targetYieldQuintalsPerAcre: econBase.yieldPerAcre,
        mandiPricePerQuintal: econBase.mandiRate,
        mspPricePerQuintal: econBase.mspRate,
        costOfCultivationPerAcre: econBase.costA2FL,
        grossRevenuePerAcre: grossRev,
        netProfitPerAcre: netProf,
        benefitCostRatio: bcr,
      }

      const waterMetrics: PrecisionWaterMetrics = {
        consumptionTier: econBase.waterTier,
        waterReqMm: econBase.waterReqMm,
        pumpingHoursPerAcre: econBase.pumpingHours,
        dripSavingsPct: econBase.dripSavingsPct,
        groundwaterAlert: econBase.groundwaterAlert,
      }

      // Radar metrics calculation
      const economicMarginRadar = Math.min(95, Math.max(50, Math.round(bcr * 38)))
      const pestResilienceRadar = Math.min(92, Math.max(55, 65 + (score % 25)))

      const radarMetrics: PrecisionRadarMetrics = {
        soilFertility: Math.min(98, Math.max(45, soilFertilityRadar)),
        climateFit: Math.min(98, Math.max(40, climateFitRadar)),
        waterAvailability: Math.min(95, Math.max(45, waterAvailRadar)),
        economicMargin: economicMarginRadar,
        pestResilience: pestResilienceRadar,
      }

      const certifiedCultivars = CROP_CULTIVARS[matchedKey] || [
        {
          name: `${crop.name} Standard Certified Elite`,
          releaseInstitution: 'State Agricultural University (SAU)',
          durationDays: crop.durationDays || 120,
          specialTrait: 'High agronomic stability and resistance to prevailing rust and wilt pathogens',
          sowingWindow: 'Standard Seasonal Window',
          seedTreatment: 'Carbendazim 50% WP @ 2.5g/kg seed',
        },
      ]

      const finalScore = Math.max(30, Math.min(98, score))
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
        suitabilityLevel,
        radarMetrics,
        economicMetrics,
        waterMetrics,
        certifiedCultivars,
      }
    })

    return scores.sort((a, b) => b.score - a.score)
  },
}
