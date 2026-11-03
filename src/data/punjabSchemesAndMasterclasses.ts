export interface MasterclassChapter {
  title: string
  titlePa: string
  time: string
  seconds: number
  description: string
  keyTakeaway: string
}

export interface MasterclassVideo {
  id: string
  title: string
  titlePa: string
  instructor: string
  organization: string
  duration: string
  totalSeconds: number
  thumbnailUrl: string
  videoUrl: string
  directVideoSrc: string
  youtubeVideoId: string
  youtubeSearchUrl: string
  category: 'Wheat & Rabi' | 'Paddy & Kharif' | 'Soil & Crop Protection' | 'DSR & Water Conservation' | 'Farm Mechanization'
  crops: string[]
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  description: string
  curriculum: string[]
  chapters: MasterclassChapter[]
  pauTakeaways: string[]
}

export interface PunjabGovtScheme {
  id: string
  name: string
  namePa: string
  nodalMinistry: string
  category: 'Direct Financial DBT' | 'Crop Insurance' | 'Subsidized Machinery & CRM' | 'Direct Seeding (DSR) Incentive' | 'Solar & Micro-Irrigation' | 'Organic & Soil Health'
  applicableCrops: string[]
  financialSubsidy: string
  eligibility: string
  portalUrl: string
  portalName: string
  helpline: string
  applicationWindow: string
  documentsRequired: string[]
  statusBadge: 'Active Application' | 'DBT Direct Credit' | 'Portal Open'
}

export const PUNJAB_MASTERCLASSES: MasterclassVideo[] = [
  {
    id: 'mc-wheat-pop-2026',
    title: 'PAU Ludhiana Masterclass: HD-3086 & PBW-826 High-Yield Wheat Management',
    titlePa: 'ਪੀ.ਏ.ਯੂ. ਲੁਧਿਆਣਾ ਮਾਸਟਰਕਲਾਸ: ਕਣਕ ਦੀ ਵੱਧ ਝਾੜ ਵਾਲੀ ਤਕਨੀਕ',
    instructor: 'Dr. Hari Ram (Senior Agronomist)',
    organization: 'Punjab Agricultural University (PAU) Ludhiana',
    duration: '28:45 mins',
    totalSeconds: 1725,
    thumbnailUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=8ZGRANiGUIw',
    directVideoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    youtubeVideoId: '8ZGRANiGUIw',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=PAU+Ludhiana+wheat+HD-3086+PBW-826',
    category: 'Wheat & Rabi',
    crops: ['Wheat (HD-3086)', 'PBW-826', 'Unnat PBW-343'],
    level: 'Advanced',
    description:
      'Comprehensive scientific masterclass covering Crown Root Initiation (CRI) 21-day first irrigation timing, optimum NPK fertilizer split application, and chemical barricade against Stripe / Yellow Rust (Puccinia striiformis).',
    curriculum: [
      'Seed Treatment with Vitavax / Carboxin (2.5 g/kg seed)',
      'First Irrigation at CRI Stage (21 days post-sowing)',
      'Split Nitrogen Dosing (1/2 at sowing, 1/2 before 1st watering)',
      'Yellow Rust surveillance and Propiconazole 25% EC prophylactic dosing',
    ],
    chapters: [
      {
        title: 'Seed Dressing & Soil Moisture Setup',
        titlePa: 'ਬੀਜ ਸੋਧ ਅਤੇ ਜ਼ਮੀਨ ਦੀ ਤਿਆਰੀ',
        time: '00:00',
        seconds: 0,
        description: 'Pre-sowing seed priming with Vitavax 2.5 g/kg to neutralize loose smut pathogens.',
        keyTakeaway: 'Ensure optimum Rauni pre-sowing irrigation for uniform germination.',
      },
      {
        title: 'Crown Root Initiation (CRI) Irrigation',
        titlePa: 'ਪਹਿਲਾ ਪਾਣੀ (ਕ੍ਰਾਊਨ ਰੂਟ ਸਟੇਜ - 21 ਦਿਨ)',
        time: '06:30',
        seconds: 390,
        description: 'Why the 21st day post-sowing is the absolute deadline for first irrigation to secure root crown anchorage.',
        keyTakeaway: 'Delayed first watering reduces effective tillers by up to 22%.',
      },
      {
        title: 'Balanced Split Nitrogen Application',
        titlePa: 'ਨਾਈਟ੍ਰੋਜਨ (ਯੂਰੀਆ) ਦੀ ਵੰਡਵੀਂ ਵਰਤੋਂ',
        time: '14:15',
        seconds: 855,
        description: 'Splitting Urea into two equal doses: half before first watering and remaining half before boot leaf initiation.',
        keyTakeaway: 'Top-dress urea right before watering to maximize root absorption.',
      },
      {
        title: 'Stripe Rust Triage & Chemical Barrier',
        titlePa: 'ਪੀਲੀ ਕੁੰਗੀ ਦੀ ਰੋਕਥਾਮ ਅਤੇ ਸਪਰੇਅ',
        time: '21:00',
        seconds: 1260,
        description: 'Prophylactic application of Propiconazole 25% EC (Tilt) @ 200 ml in 200L water per acre.',
        keyTakeaway: 'Spray early in morning when Delta-T is within 2°C–8°C.',
      },
    ],
    pauTakeaways: [
      'Apply 50 kg DAP + 110 kg Urea per acre in split doses for PBW-826.',
      'Scout field borders facing foothills of Shivalik for early stripe rust yellow pustules.',
      'Maintain 20-22 cm row-to-row spacing using calibrated seed drill.',
    ],
  },
  {
    id: 'mc-dsr-paddy-2026',
    title: 'Direct Seeded Rice (DSR) & Tar-Wattar Technique for Basmati & PR-126',
    titlePa: 'ਸਿੱਧੀ ਬਿਜਾਈ (ਡੀ.ਐਸ.ਆਰ.) ਅਤੇ ਤਰ-ਵੱਤਰ ਤਕਨੀਕ',
    instructor: 'Dr. Makhan Singh Bhullar (Director of Extension Education)',
    organization: 'Department of Agronomy, PAU Ludhiana',
    duration: '32:10 mins',
    totalSeconds: 1930,
    thumbnailUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=l1vVQ5vUSlo',
    directVideoSrc: 'https://vjs.zencdn.net/v/oceans.mp4',
    youtubeVideoId: 'l1vVQ5vUSlo',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=PAU+Ludhiana+direct+seeded+rice+tar+wattar',
    category: 'DSR & Water Conservation',
    crops: ['Basmati 1121', 'PR-126', 'Pusa-44 alternatives'],
    level: 'Intermediate',
    description:
      'Save 15–20% groundwater and ₹3,500/Acre in diesel pumping costs using the Tar-Wattar DSR drill machine with pre-emergence Stomp (Pendimethalin 30% EC) weed management.',
    curriculum: [
      'Field Laser Levelling and Soil Moisture Calibration',
      'Seed Calibration on Lucky Seed Drill / DSR Machine',
      'Pre-emergence Weed Barrier (Pendimethalin within 24 hours)',
      'Post-emergence Weed Control (Nominee Gold / Bispyribac-sodium)',
    ],
    chapters: [
      {
        title: 'Precision Laser Land Levelling',
        titlePa: 'ਲੇਜ਼ਰ ਕਰਾਹੇ ਨਾਲ ਜ਼ਮੀਨ ਪੱਧਰੀ ਕਰਨਾ',
        time: '00:00',
        seconds: 0,
        description: 'Zero slope laser levelling to guarantee uniform seed depth and avoid water stagnation.',
        keyTakeaway: 'Saves 25% water and prevents localized seed rotting.',
      },
      {
        title: 'Tar-Wattar Soil Condition Preparation',
        titlePa: 'ਤਰ-ਵੱਤਰ ਹਾਲਤ ਵਿੱਚ ਬਿਜਾਈ',
        time: '08:45',
        seconds: 525,
        description: 'Heavy pre-sowing irrigation followed by sowing at optimum soil moisture without immediate post-seeding watering.',
        keyTakeaway: 'Ensures seed germinates before weeds break the surface crust.',
      },
      {
        title: 'Chemical Weed Barrier Setup',
        titlePa: 'ਨਦੀਨਨਾਸ਼ਕ (ਪੈਂਡੀਮੈਥਾਲਿਨ) ਦੀ ਸਪਰੇਅ',
        time: '18:20',
        seconds: 1100,
        description: 'Apply Pendimethalin 30% EC @ 1 litre/acre within 24 hours of sowing using flat fan nozzles.',
        keyTakeaway: 'Forms an unbroken microscopic chemical film over the soil.',
      },
      {
        title: 'First Irrigation Scheduling (21 Days Post-Sowing)',
        titlePa: 'ਪਹਿਲਾ ਪਾਣੀ 21 ਦਿਨਾਂ ਬਾਅਦ ਲਗਾਉਣਾ',
        time: '26:00',
        seconds: 1560,
        description: 'Delaying first watering to force rice roots to penetrate deeper into the moist subsoil.',
        keyTakeaway: 'Eligible for ₹1,500/Acre Punjab Government direct DBT incentive.',
      },
    ],
    pauTakeaways: [
      'Use 8–10 kg seed per acre for Basmati 1121 and 10–12 kg for PR-126.',
      'Sow between June 1 to June 15 for optimal vegetative duration.',
      'Apply 15 kg Zinc Sulphate (21%) per acre at second irrigation.',
    ],
  },
  {
    id: 'mc-cotton-pest-2026',
    title: 'Integrated Pest Management (IPM) for Bt Cotton: Whitefly & Pink Bollworm',
    titlePa: 'ਨਰਮੇ ਦੀ ਫਸਲ ਵਿੱਚ ਚਿੱਟੀ ਮੱਖੀ ਅਤੇ ਗੁਲਾਬੀ ਸੁੰਡੀ ਦੀ ਰੋਕਥਾਮ',
    instructor: 'Dr. Satnam Singh (Entomologist)',
    organization: 'PAU Regional Research Station, Bathinda',
    duration: '24:18 mins',
    totalSeconds: 1458,
    thumbnailUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=HGPWQlpLrD0',
    directVideoSrc: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    youtubeVideoId: 'HGPWQlpLrD0',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=PAU+Ludhiana+cotton+whitefly+pink+bollworm',
    category: 'Soil & Crop Protection',
    crops: ['Bt Cotton', 'Desi Cotton'],
    level: 'Advanced',
    description:
      'Pheromone trap installation guidelines, Economic Threshold Level (ETL) counting protocol, and recommended bio-pesticides including Neem Azadirachtin and Pyriproxyfen.',
    curriculum: [
      'Pheromone Trap Setup (5 traps per acre for Pink Bollworm monitoring)',
      'Economic Threshold Levels (ETL: 6–8 whiteflies per leaf)',
      'Spray Timing Window: Delta-T between 2°C–8°C',
      'FRAC & IRAC insecticide rotation to prevent target resistance',
    ],
    chapters: [
      {
        title: 'Pheromone Trap Sentry Deployment',
        titlePa: 'ਫੇਰੋਮੋਨ ਟਰੈਪ ਲਗਾਉਣ ਦਾ ਤਰੀਕਾ',
        time: '00:00',
        seconds: 0,
        description: 'Deploy 5 yellow sticky traps and 2 Pectino-Lure pheromone traps per acre at 45 days crop age.',
        keyTakeaway: 'Count adult moth catches daily before initiating any chemical spray.',
      },
      {
        title: 'Whitefly Economic Threshold Level (ETL)',
        titlePa: 'ਚਿੱਟੀ ਮੱਖੀ ਦਾ ਆਰਥਿਕ ਨੁਕਸਾਨ ਪੱਧਰ (ਈ.ਟੀ.ਐਲ.)',
        time: '07:15',
        seconds: 435,
        description: 'Count nymphs and adults on 3 leaves per plant (top, middle, bottom) across 20 random plants.',
        keyTakeaway: 'Initiate spray only if whitefly population exceeds 6–8 adults per leaf.',
      },
      {
        title: 'Bio-Pesticide & Neem Oil Barrier',
        titlePa: 'ਨੀਮ ਅਜ਼ਾਡੀਰਾਚਟਿਨ ਅਤੇ ਜੈਵਿਕ ਸਪਰੇਅ',
        time: '13:40',
        seconds: 820,
        description: 'First line of defence: Neem-based formulation (Azadirachtin 1500 ppm @ 1 Litre/acre).',
        keyTakeaway: 'Preserves natural predatory ladybird beetles and chrysoperla.',
      },
      {
        title: 'Insecticide Resistance Management',
        titlePa: 'ਕੀਟਨਾਸ਼ਕਾਂ ਦੀ ਅਦਲ-ਬਦਲ ਕੇ ਵਰਤੋਂ',
        time: '19:10',
        seconds: 1150,
        description: 'Never spray same chemical class twice consecutively. Alternate Pyriproxyfen with Diafenthiuron.',
        keyTakeaway: 'Always verify CIB&RC approval tag on pesticide containers.',
      },
    ],
    pauTakeaways: [
      'Avoid synthetic pyrethroids during early season as they trigger whitefly resurgence.',
      'Maintain clean field borders free of congress grass (Parthenium) and Kanghi buti.',
      'Spray using hollow cone nozzles with minimum 150 litres water per acre.',
    ],
  },
  {
    id: 'mc-crm-super-seeder',
    title: 'Crop Residue Management: Zero Stubble Burning with Super Seeder & Happy Seeder',
    titlePa: 'ਪਰਾਲੀ ਪ੍ਰਬੰਧਨ: ਸੁਪਰ ਸੀਡਰ ਅਤੇ ਹੈਪੀ ਸੀਡਰ ਨਾਲ ਕਣਕ ਦੀ ਬਿਜਾਈ',
    instructor: 'Er. Rajeshwar Singh (Farm Machinery & Power Engineering)',
    organization: 'ICAR-Central Institute of Post-Harvest Engineering (CIPHET) Ludhiana',
    duration: '21:30 mins',
    totalSeconds: 1290,
    thumbnailUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=Tegbion4BzQ',
    directVideoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4',
    youtubeVideoId: 'Tegbion4BzQ',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=Punjab+Super+Seeder+stubble+wheat+sowing',
    category: 'Farm Mechanization',
    crops: ['Paddy Stubble -> Wheat', 'Moong stubble'],
    level: 'Beginner',
    description:
      'Step-by-step tractor PTO calibration, 55+ HP tractor coupling, disc coulter adjustments, and obtaining ₹1,000/Acre ex-situ CRM incentives.',
    curriculum: [
      'Tractor HP and PTO RPM matching for Super Seeder',
      'Depth control and seed-cum-fertilizer metering',
      'Moisture maintenance for uniform wheat germination',
      'Claiming 50% to 80% Govt Machinery Subsidy via CRM Portal',
    ],
    chapters: [
      {
        title: 'Tractor Horsepower & PTO RPM Matching',
        titlePa: 'ਟਰੈਕਟਰ ਐਚ.ਪੀ. ਅਤੇ ਪੀ.ਟੀ.ਓ. ਮੈਚਿੰਗ',
        time: '00:00',
        seconds: 0,
        description: 'Super Seeder demands minimum 55 HP tractor with 540 standard PTO RPM for optimal rotavator pulverization.',
        keyTakeaway: 'Proper RPM prevents clutch slipping and reduces diesel consumption to 6–7 L/acre.',
      },
      {
        title: 'Disc Coulter & Depth Gauge Setup',
        titlePa: 'ਡਿਸਕ ਕਟਰ ਅਤੇ ਬਿਜਾਈ ਦੀ ਡੂੰਘਾਈ ਸੈਟਿੰਗ',
        time: '05:40',
        seconds: 340,
        description: 'Setting seed coulters at 4–5 cm depth into the mulch zone for maximum soil-to-seed contact.',
        keyTakeaway: 'Ensures seed is placed into moist soil while residue stays as protective surface mulch.',
      },
      {
        title: 'Seed & Fertilizer Fluted Roller Calibration',
        titlePa: 'ਬੀਜ ਅਤੇ ਖਾਦ ਦੀ ਮਾਤਰਾ ਤੈਅ ਕਰਨਾ',
        time: '12:15',
        seconds: 735,
        description: 'Calibrate seed rate to 45 kg/acre wheat seed and 50 kg DAP fertilizer.',
        keyTakeaway: 'Check fluted roller rotation by rotating drive wheel 20 times over a tarpaulin.',
      },
      {
        title: 'Government CRM 50%–80% Subsidy Claim',
        titlePa: 'ਪਰਾਲੀ ਮਸ਼ੀਨਰੀ ' + "'ਤੇ 50% ਤੋਂ 80% ਸਬਸਿਡੀ ਦਾ ਦਾਅਵਾ",
        time: '17:30',
        seconds: 1050,
        description: 'Register machine GPS serial number on agrimachinerypb.com portal to receive DBT credit within 30 days.',
        keyTakeaway: 'Individuals receive 50% subsidy; Custom Hiring Centres receive 80%.',
      },
    ],
    pauTakeaways: [
      'Operate tractor in low 1st or 2nd gear depending on residue load.',
      'Surface straw mulch prevents early weed germination and conserves 1-2 irrigations.',
      'Soil organic carbon (SOC) increases by 0.15% after 3 continuous years of CRM.',
    ],
  },
]

export const PUNJAB_GOVT_SCHEMES: PunjabGovtScheme[] = [
  {
    id: 'scheme-dsr-incentive',
    name: 'Punjab Direct Seeded Rice (DSR) Water Conservation Incentive Scheme',
    namePa: 'ਪੰਜਾਬ ਝੋਨੇ ਦੀ ਸਿੱਧੀ ਬਿਜਾਈ (ਡੀ.ਐਸ.ਆਰ.) ₹1,500 ਪ੍ਰਤੀ ਏਕੜ ਪ੍ਰੋਤਸਾਹਨ ਸਕੀਮ',
    nodalMinistry: 'Department of Agriculture & Farmers Welfare, Govt. of Punjab',
    category: 'Direct Seeding (DSR) Incentive',
    applicableCrops: ['Basmati 1121', 'PR-126', 'PR-121', 'Paddy All Varieties'],
    financialSubsidy: '₹1,500 per Acre direct bank transfer (DBT) to farmer bank account',
    eligibility: 'All farmers practicing DSR technique in Punjab verified via Satellite Remote Sensing / Revenue Patwari survey.',
    portalUrl: 'https://agrimachinerypb.com/',
    portalName: 'Punjab Agri Machinery & CRM Portal',
    helpline: '1800-180-1551 (Kisan Call Centre) / 0172-2970605',
    applicationWindow: 'May 15 to June 30 annually (Kharif Season)',
    documentsRequired: ['Aadhaar Card', 'Bank Passbook (IFSC & A/C)', 'Khasra / Khatoni Land Record', 'Self-declaration of DSR acreage'],
    statusBadge: 'DBT Direct Credit',
  },
  {
    id: 'scheme-crm-subsidy',
    name: 'Subsidized Crop Residue Management (CRM) Machinery Scheme (Super Seeder, Smart Seeder, Mulcher)',
    namePa: "ਪਰਾਲੀ ਪ੍ਰਬੰਧਨ ਮਸ਼ੀਨਰੀ 'ਤੇ 50% ਤੋਂ 80% ਸਬਸਿਡੀ ਸਕੀਮ",
    nodalMinistry: 'Ministry of Agriculture & Farmers Welfare, GoI & Punjab State Farmers Commission',
    category: 'Subsidized Machinery & CRM',
    applicableCrops: ['Paddy (Rice)', 'Wheat (Kanak)', 'Maize', 'Sugarcane'],
    financialSubsidy: '50% individual farmer subsidy; 80% for Custom Hiring Centres (CHCs) and Cooperatives',
    eligibility: 'Individual landholding farmers, Registered FPOs, Panchayats, and Primary Agricultural Cooperative Societies (PACS).',
    portalUrl: 'https://agrimachinerypb.com/',
    portalName: 'Punjab CRM Subsidy Registration Portal',
    helpline: '0172-2970607 / kvk-ludhiana@pau.edu',
    applicationWindow: 'July 01 to August 20 annually',
    documentsRequired: ['Farmer Registration ID', 'Land Ownership Records (Fard)', 'Tractor Registration Certificate (RC 50+ HP)', 'Bank Account details'],
    statusBadge: 'Active Application',
  },
  {
    id: 'scheme-pmfby-punjab',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY) Crop Loss Insurance',
    namePa: 'ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਫ਼ਸਲ ਬੀਮਾ ਯੋਜਨਾ (ਕੁਦਰਤੀ ਆਫ਼ਤਾਂ ਤੋਂ ਬਚਾਅ)',
    nodalMinistry: 'Ministry of Agriculture & Farmers Welfare, Government of India',
    category: 'Crop Insurance',
    applicableCrops: ['Wheat (Kanak)', 'Paddy (Dhan)', 'Cotton (Narma)', 'Mustard (Raya)', 'Maize'],
    financialSubsidy: 'Nominal farmer premium (1.5% Rabi, 2.0% Kharif); Remaining premium 100% subsidized by Central & State Govt.',
    eligibility: 'All loanee and non-loanee farmers cultivating notified crops in notified districts of Punjab.',
    portalUrl: 'https://pmfby.gov.in/',
    portalName: 'PMFBY National Insurance Portal',
    helpline: '1800-180-2117 / 14447',
    applicationWindow: 'Rabi: Dec 15 | Kharif: July 31',
    documentsRequired: ['Aadhaar Number', 'Sowing Certificate / Jamabandi', 'Cancelled Cheque', 'Crop Cutting Experiment (CCE) Geotagged Photo'],
    statusBadge: 'Portal Open',
  },
  {
    id: 'scheme-solar-pumps-pmkusum',
    name: 'PM-KUSUM Component-B: Subsidized Solar Agriculture Pumps (3 HP to 10 HP)',
    namePa: 'ਪੀ.ਐੱਮ.-ਕੁਸੁਮ ਸੋਲਰ ਖੇਤੀਬਾੜੀ ਪੰਪ 60% ਸਬਸਿਡੀ ਸਕੀਮ (ਪੇਡਾ)',
    nodalMinistry: 'Punjab Energy Development Agency (PEDA) & MNRE',
    category: 'Solar & Micro-Irrigation',
    applicableCrops: ['All Punjab Field Crops (Paddy, Wheat, Vegetables, Orchards)'],
    financialSubsidy: '60% capital subsidy (30% Central MNRE + 30% Punjab Govt); Farmer contribution only 40%',
    eligibility: 'Farmers without grid tubewell connection or replacing diesel irrigation engines with solar submersible pumps.',
    portalUrl: 'https://peda.gov.in/',
    portalName: 'PEDA Official Solar Portal',
    helpline: '0172-2663328 / 0172-2663382',
    applicationWindow: 'Round-the-year allocation (Batchwise)',
    documentsRequired: ['Aadhaar Card', 'Farad of agricultural land', 'Certificate of no electric tubewell connection', 'Bank Account Details'],
    statusBadge: 'Active Application',
  },
  {
    id: 'scheme-soil-health-card',
    name: 'National Soil Health Card & Micro-Nutrient Subsidy Scheme',
    namePa: 'ਸੋਇਲ ਹੈਲਥ ਕਾਰਡ ਅਤੇ ਸੂਖਮ ਤੱਤ (ਜ਼ਿੰਕ, ਜਿਪਸਮ) ਸਬਸਿਡੀ',
    nodalMinistry: 'Department of Agriculture & Farmers Welfare, Govt. of Punjab',
    category: 'Organic & Soil Health',
    applicableCrops: ['Wheat', 'Basmati Rice', 'Cotton', 'Mustard', 'Gram / Chickpea', 'Moong'],
    financialSubsidy: '100% Free laboratory testing across 12 chemosensory parameters; 50% subsidy on Zinc Sulphate & Gypsum',
    eligibility: 'Every farm holding across all 23 districts of Punjab tested every 2 years.',
    portalUrl: 'https://soilhealth.dac.gov.in/',
    portalName: 'Soil Health Card National Portal',
    helpline: '011-23381012',
    applicationWindow: 'Continuous cycle through District Agriculture Offices & KVKs',
    documentsRequired: ['Khasra Number / GPS Coordinates of sample plot', 'Aadhaar Card', 'Mobile Number'],
    statusBadge: 'DBT Direct Credit',
  },
  {
    id: 'scheme-apeda-basmati-export',
    name: 'APEDA Basmati Export Development Foundation (BEDF) Traceability & Quality Certification',
    namePa: 'ਏਪੀਡਾ ਬਾਸਮਤੀ ਨਿਰਯਾਤ ਗੁਣਵੱਤਾ ਅਤੇ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਪੋਰਟਲ',
    nodalMinistry: 'Agricultural and Processed Food Products Export Development Authority (APEDA)',
    category: 'Direct Financial DBT',
    applicableCrops: ['Basmati 1121', 'Traditional Basmati', 'Pusa Basmati 1509', 'Pusa Basmati 1718'],
    financialSubsidy: 'Subsidized DNA testing, ISO-17025 certified laboratory MRL screening, and free RCMC export certification',
    eligibility: 'All Basmati paddy growers and cooperative export associations in Punjab GI tagged districts.',
    portalUrl: 'https://agriexchange.apeda.gov.in/',
    portalName: 'APEDA Agri-Exchange Portal',
    helpline: '1800-112-256',
    applicationWindow: 'Active during Kharif harvest & procurement season',
    documentsRequired: ['Farmer Registration with APEDA BEDF', 'Seed Purchase Invoice (PAU Certified)', 'Spray record diary for EU-MRL clearance'],
    statusBadge: 'Portal Open',
  },
]
