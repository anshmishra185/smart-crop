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
    ]
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
    ]
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

