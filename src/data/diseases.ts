import type { DiseaseDetectionResult } from '../types'

export const sampleDiseaseCases: DiseaseDetectionResult[] = [
  {
    id: 'case-tomato-early-blight',
    cropName: 'Tomato',
    diseaseName: 'Early Blight (Alternaria solani)',
    status: 'infected',
    confidence: 94.8,
    severity: 'Moderate',
    riskLevel: 'High',
    pathogenType: 'Fungal',
    stage: 'Intermediate Leaf Lesioning',
    affectedAreaPercentage: 28,
    timestamp: 'Today, 10:24 AM',
    sampleImage: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80',
    heatmapUrl: 'simulated-gradcam-early-blight',
    symptoms: [
      'Concentric dark brown rings resembling a target board on older foliage.',
      'Yellow chlorotic halos surrounding lesions leading to early defoliation.',
      'Collar rot or girdling observed near the lower stem base.'
    ],
    prevention: [
      'Implement a minimum 3-year crop rotation avoiding Solanaceae family plants.',
      'Install drip irrigation to keep leaf canopy dry during humid spells.',
      'Sterilize pruning shears with 10% sodium hypochlorite solution.'
    ],
    recommendedTreatment: [
      'Apply Mancozeb 75% WP @ 2.5 g/L or Chlorothalonil 75% WP @ 2 g/L.',
      'For organic management, spray Copper Oxychloride 50% WP @ 3 g/L or Trichoderma viride @ 5 g/L.',
      'Prune and burn heavily infected lower leaves immediately to contain spore dispersal.'
    ],
    topDifferentialDiagnoses: [
      { diseaseName: 'Early Blight (Alternaria solani)', confidence: 94.8, pathogenType: 'Fungal' },
      { diseaseName: 'Septoria Leaf Spot (Septoria lycopersici)', confidence: 3.4, pathogenType: 'Fungal' },
      { diseaseName: 'Bacterial Spot (Xanthomonas vesicatoria)', confidence: 1.8, pathogenType: 'Bacterial' },
    ],
    modelTelemetry: {
      architecture: 'ResNet-50 v2 + ViT-B/16 Multi-Scale Ensemble',
      inputTensor: '224 × 224 × 3 RGB',
      latencyMs: 38,
    },
    lesionAnnotations: [
      {
        id: 'lesion-1',
        label: 'Primary Necrotic Target Center',
        xPct: 38,
        yPct: 42,
        widthPct: 24,
        heightPct: 22,
        description: 'Concentric brown necrotic rings caused by alternariol mycotoxin breakdown.'
      },
      {
        id: 'lesion-2',
        label: 'Chlorotic Diffusion Halo',
        xPct: 58,
        yPct: 32,
        widthPct: 18,
        heightPct: 18,
        description: 'Yellow chlorotic margin caused by pathogen enzymatic breakdown of leaf chlorophyll.'
      }
    ],
    tankMixRecommendations: {
      chemical: [
        { name: 'Mancozeb 75% WP', dosePerLiter: 2.5, unit: 'g/L', activeIngredient: 'Mancozeb 75% w/w', phiDays: 7, reiHours: 24 },
        { name: 'Chlorothalonil 75% WP', dosePerLiter: 2.0, unit: 'g/L', activeIngredient: 'Chlorothalonil', phiDays: 5, reiHours: 12 },
        { name: 'Azoxystrobin 23% SC', dosePerLiter: 1.0, unit: 'mL/L', activeIngredient: 'Azoxystrobin 23%', phiDays: 3, reiHours: 12 },
      ],
      organic: [
        { name: 'Copper Oxychloride 50% WP', dosePerLiter: 3.0, unit: 'g/L', activeIngredient: 'Copper Oxychloride (Metallic Cu 50%)' },
        { name: 'Trichoderma viride 1.5% WP', dosePerLiter: 5.0, unit: 'g/L', activeIngredient: 'Trichoderma antagonistic fungus (2x10^6 CFU/g)' },
        { name: 'Cold-Pressed Neem Oil (10,000 ppm)', dosePerLiter: 4.0, unit: 'mL/L', activeIngredient: 'Azadirachtin 1%' },
      ]
    },
    spreadForecast: {
      riskLevel: 'High',
      sporeGerminationWindow: 'Critical: Conidial germination accelerates if relative humidity remains >80% for 6 consecutive hours.',
      humidityThreshold: 80,
      tempRange: '24°C – 29°C',
      advice: 'Avoid overhead foliar wetting. Spray early morning before ambient wind exceeds 12 km/h.'
    },
    pathologyTaxonomy: {
      kingdom: 'Fungi',
      phylum: 'Ascomycota',
      genus: 'Alternaria',
      species: 'Alternaria solani',
    }
  },
  {
    id: 'case-tomato-late-blight',
    cropName: 'Tomato',
    diseaseName: 'Late Blight (Phytophthora infestans)',
    status: 'critical',
    confidence: 96.2,
    severity: 'Severe',
    riskLevel: 'Critical',
    pathogenType: 'Fungal',
    stage: 'Rapid Foliar Blight',
    affectedAreaPercentage: 42,
    timestamp: 'Yesterday, 04:15 PM',
    sampleImage: 'https://images.unsplash.com/photo-1589134703779-e5879a7fb3c9?auto=format&fit=crop&w=800&q=80',
    heatmapUrl: 'simulated-gradcam-late-blight',
    symptoms: [
      'Large, irregular water-soaked pale green to dark brown patches on leaf margins.',
      'White cottony fungal down visible on leaf undersides in high humidity (>90%).',
      'Greasy brown necrotic lesions spreading rapidly along leaf petioles and stems.'
    ],
    prevention: [
      'Avoid high-density planting to facilitate adequate air ventilation through rows.',
      'Destroy volunteer tomato and potato plants in adjacent perimeter borders.',
      'Monitor weather advisories for consecutive cool, overcast, damp days.'
    ],
    recommendedTreatment: [
      'Emergency foliar spray with Metalaxyl 8% + Mancozeb 64% WP @ 2.5 g/L.',
      'Apply Cymoxanil 8% + Mancozeb 64% WP @ 2 g/L at early lesion detection.',
      'Cease overhead sprinkler irrigation instantly to prevent zoospore germination.'
    ],
    topDifferentialDiagnoses: [
      { diseaseName: 'Late Blight (Phytophthora infestans)', confidence: 96.2, pathogenType: 'Fungal' },
      { diseaseName: 'Early Blight (Alternaria solani)', confidence: 2.6, pathogenType: 'Fungal' },
      { diseaseName: 'Grey Mould (Botrytis cinerea)', confidence: 1.2, pathogenType: 'Fungal' },
    ],
    modelTelemetry: {
      architecture: 'ResNet-50 v2 + ViT-B/16 Multi-Scale Ensemble',
      inputTensor: '224 × 224 × 3 RGB',
      latencyMs: 41,
    },
    lesionAnnotations: [
      {
        id: 'lesion-1',
        label: 'Water-soaked Necrotic Patch',
        xPct: 45,
        yPct: 35,
        widthPct: 32,
        heightPct: 28,
        description: 'Oomycete sporangial proliferation causing rapid cellular water soaking.'
      }
    ],
    tankMixRecommendations: {
      chemical: [
        { name: 'Metalaxyl 8% + Mancozeb 64% WP', dosePerLiter: 2.5, unit: 'g/L', activeIngredient: 'Metalaxyl-M + Mancozeb', phiDays: 14, reiHours: 24 },
        { name: 'Cymoxanil 8% + Mancozeb 64% WP', dosePerLiter: 2.0, unit: 'g/L', activeIngredient: 'Cymoxanil + Mancozeb', phiDays: 10, reiHours: 24 },
        { name: 'Dimethomorph 50% WP', dosePerLiter: 1.0, unit: 'g/L', activeIngredient: 'Dimethomorph', phiDays: 7, reiHours: 12 },
      ],
      organic: [
        { name: 'Copper Hydroxide 53.8% DF', dosePerLiter: 2.0, unit: 'g/L', activeIngredient: 'Copper Hydroxide' },
        { name: 'Bacillus subtilis (QST 713)', dosePerLiter: 4.0, unit: 'mL/L', activeIngredient: 'B. subtilis biological antagonist' },
      ]
    },
    spreadForecast: {
      riskLevel: 'Critical',
      sporeGerminationWindow: 'Critical Alert: Oomycete zoospores swim in surface water film. Night temp 15-20°C and >90% humidity causes 100% field infection in 48 hours.',
      humidityThreshold: 90,
      tempRange: '15°C – 21°C',
      advice: 'Apply systemic fungicide immediately before morning dew sets in.'
    },
    pathologyTaxonomy: {
      kingdom: 'Chromista (Stramenopila)',
      phylum: 'Oomycota',
      genus: 'Phytophthora',
      species: 'Phytophthora infestans',
    }
  },
  {
    id: 'case-tomato-healthy',
    cropName: 'Tomato',
    diseaseName: 'Healthy Foliage — No Pathogen Detected',
    status: 'healthy',
    confidence: 99.1,
    severity: 'None',
    riskLevel: 'Low',
    pathogenType: undefined,
    stage: 'Vigorous Vegetative',
    affectedAreaPercentage: 0,
    timestamp: '2 hours ago',
    sampleImage: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=800&q=80',
    heatmapUrl: 'simulated-gradcam-healthy',
    symptoms: [
      'Leaves display uniform deep green coloration without necrotic spotting or discoloration.',
      'Petiole structure and stem tissues show robust vascular integrity.',
      'Normal leaf turgidity and no presence of insect vector infestation.'
    ],
    prevention: [
      'Maintain standard balanced N-P-K nutrient application schedule.',
      'Routine scouting every 3 to 4 days during early flowering phase.',
      'Apply prophylactic neem seed kernel extract (NSKE 5%) every 14 days.'
    ],
    recommendedTreatment: [
      'No chemical intervention required.',
      'Continue standard fertigation and soil moisture management.'
    ]
  },
  {
    id: 'case-potato-late-blight',
    cropName: 'Potato',
    diseaseName: 'Potato Late Blight (Phytophthora infestans)',
    status: 'critical',
    confidence: 92.4,
    severity: 'Severe',
    riskLevel: 'Critical',
    pathogenType: 'Fungal',
    stage: 'Stem & Foliar Rot',
    affectedAreaPercentage: 35,
    timestamp: 'Nov 01, 09:30 AM',
    sampleImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    heatmapUrl: 'simulated-gradcam-potato-blight',
    symptoms: [
      'Purplish-brown water-soaked spots developing at leaf tips and margins.',
      'Tuber rot risk elevated if rain washes sporangia into ridges.',
      'Rapid collapse of foliage accompanied by foul decaying odor.'
    ],
    prevention: [
      'Utilize certified disease-free seed tubers treated with Trichoderma harzianum.',
      'Perform thorough hilling-up of soil around tuber bases to bar zoospore contact.'
    ],
    recommendedTreatment: [
      'Foliar spray of Dimethomorph 50% WP @ 1 g/L or Azoxystrobin 23% SC @ 1 mL/L.',
      'De-haulm (cut and remove potato vines) 10 days prior to harvest if outbreak is unchecked.'
    ]
  },
  {
    id: 'case-rice-leaf-blast',
    cropName: 'Rice',
    diseaseName: 'Rice Leaf Blast (Magnaporthe oryzae)',
    status: 'infected',
    confidence: 93.7,
    severity: 'Moderate',
    riskLevel: 'High',
    pathogenType: 'Fungal',
    stage: 'Spindle-shaped Foliar Lesions',
    affectedAreaPercentage: 24,
    timestamp: 'Oct 30, 02:40 PM',
    sampleImage: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=800&q=80',
    heatmapUrl: 'simulated-gradcam-rice-blast',
    symptoms: [
      'Elliptical or diamond-shaped lesions with grayish-white centers and dark brown margins.',
      'Lesions coalesce causing entire leaf blade drying ("blast burn").',
      'Nodes turn blackish and break easily during reproductive growth phase.'
    ],
    prevention: [
      'Avoid excessive top-dressing of nitrogen fertilizers in blast-prone varieties.',
      'Seed treatment with Carbendazim 50% WP @ 2 g/kg seed.'
    ],
    recommendedTreatment: [
      'Spray Tricyclazole 75% WP @ 0.6 g/L or Isoprothiolane 40% EC @ 1.5 mL/L.',
      'Drain standing water and allow soil surface aeration for 3 days before reflooding.'
    ]
  },
  {
    id: 'case-wheat-rust',
    cropName: 'Wheat',
    diseaseName: 'Yellow / Stripe Rust (Puccinia striiformis)',
    status: 'infected',
    confidence: 95.1,
    severity: 'Severe',
    riskLevel: 'High',
    pathogenType: 'Fungal',
    stage: 'Pustular Lineation',
    affectedAreaPercentage: 31,
    timestamp: 'Oct 29, 11:15 AM',
    sampleImage: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    heatmapUrl: 'simulated-gradcam-wheat-rust',
    symptoms: [
      'Bright yellow powdery pustules arranged in narrow linear stripes along leaf veins.',
      'Yellow powder dust rubs off onto fingers upon gentle leaf contact.',
      'Premature leaf senescence leading to shriveled grain development.'
    ],
    prevention: [
      'Plant rust-resistant certified cultivars recommended for the local agro-climatic zone.',
      'Sow early in November to avoid late-season temperature spikes favorable for rust spread.'
    ],
    recommendedTreatment: [
      'Propiconazole 25% EC (Tilt) @ 1 mL/L or Tebuconazole 25.9% EC @ 1 mL/L.',
      'Repeat spray after 15 days if cloudy humid weather persists.'
    ]
  },
  {
    id: 'case-cotton-leaf-curl',
    cropName: 'Cotton',
    diseaseName: 'Cotton Leaf Curl Virus (CLCuV)',
    status: 'infected',
    confidence: 91.8,
    severity: 'Moderate',
    riskLevel: 'High',
    pathogenType: 'Viral',
    stage: 'Vein Thickening & Enations',
    affectedAreaPercentage: 22,
    timestamp: 'Oct 28, 04:50 PM',
    sampleImage: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=800&q=80',
    heatmapUrl: 'simulated-gradcam-cotton-clcuv',
    symptoms: [
      'Upward curling of leaf margins and prominent thickening of secondary veins.',
      'Cup-like leaf enations (growths) developing on the underside of major veins.',
      'Stunted plant growth and significant reduction in boll size and quantity.'
    ],
    prevention: [
      'Manage whitefly vector (Bemisia tabaci) rigorously using yellow sticky traps (15 traps/acre).',
      'Eradicate weed hosts like Abutilon indicum and Xanthium strumarium along farm bounds.'
    ],
    recommendedTreatment: [
      'Spray Diafenthiuron 50% WP @ 1.25 g/L or Spiromesifen 22.9% SC @ 1 mL/L for vector knockdown.',
      'Foliar spray with Potassium Nitrate (13:0:45) @ 10 g/L to boost physiological resistance.'
    ]
  }
]

