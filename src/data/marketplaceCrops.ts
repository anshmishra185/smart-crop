export interface CropListing {
  id: string
  cropName: string
  cropNamePa: string
  variety: string
  category: 'Cereals' | 'Pulses' | 'Oilseeds' | 'Commercial & Cash Crops' | 'Vegetables'
  farmerName: string
  farmerPhone: string
  village: string
  district: string
  state: string
  quantityQuintals: number
  minOrderQuintals: number
  pricePerQuintal: number
  mspBenchmark: number
  qualityGrade: 'FAQ Standard' | 'Grade A Premium' | 'Certified Organic' | 'Seed Multiplication Grade'
  moisturePercentage: number
  harvestDate: string
  verifiedAPMC: boolean
  imageUrl: string
  description: string
  descriptionPa: string
  deliveryOptions: ('Farm-Gate Direct Pickup' | 'Mandi Yard Delivery' | 'Interstate Heavy Logistics')[]
  labSpecs?: {
    proteinPercent?: number
    grainLengthMm?: number
    oilContentPercent?: number
    germinationRate?: number
    foreignMatterPercent?: number
  }
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface ConfirmedOrder {
  orderId: string
  razorpayPaymentId?: string
  deliveryOtp: number
  cropName: string
  variety: string
  farmerName: string
  farmerPhone: string
  farmerLocation: string
  buyerName: string
  buyerPhone: string
  buyerAddress: string
  buyerMandiYard: string
  quantityQuintals: number
  pricePerQuintal: number
  subtotal: number
  mandiFee: number
  rdfTax: number
  logisticsFee: number
  grandTotal: number
  paymentMethod: 'razorpay' | 'cod'
  timestamp: string
}

export interface MandiBenchmarkRate {
  crop: string
  mandi: string
  district: string
  modalPrice: number
  minPrice: number
  maxPrice: number
  govtMsp: number
  dailyTrend: '+2.4%' | '+1.1%' | '+0.8%' | '-0.5%' | '-1.2%'
  arrivalQuintals: number
}

export interface OrderCheckoutDetails {
  listingId: string
  cropName: string
  variety: string
  farmerName: string
  farmerDistrict: string
  buyerName: string
  buyerPhone: string
  buyerAddress: string
  buyerPinCode: string
  quantityQuintals: number
  pricePerQuintal: number
  logisticsOption: 'Farm-Gate Pickup' | 'APMC Mandi Weighbridge' | 'Express Ag-Truck (+₹45/qtl)'
  paymentMethod: 'razorpay' | 'cod'
  razorpayDetails?: {
    orderId: string
    paymentId: string
    signature: string
    method: 'upi' | 'netbanking' | 'card'
  }
}

export const PUNJAB_MANDI_BENCHMARKS: MandiBenchmarkRate[] = [
  {
    crop: 'Wheat (HD-3086 / PBW-826)',
    mandi: 'Khanna Grain Market (Asia’s Largest)',
    district: 'Ludhiana',
    modalPrice: 2380,
    minPrice: 2275,
    maxPrice: 2450,
    govtMsp: 2275,
    dailyTrend: '+1.1%',
    arrivalQuintals: 14200,
  },
  {
    crop: 'Basmati 1121 Paddy',
    mandi: 'Bhagtanwala APMC Mandi',
    district: 'Amritsar',
    modalPrice: 3920,
    minPrice: 3750,
    maxPrice: 4150,
    govtMsp: 3200,
    dailyTrend: '+2.4%',
    arrivalQuintals: 9800,
  },
  {
    crop: 'Bt Cotton (Medium Staple)',
    mandi: 'Bathinda Cotton Yard',
    district: 'Bathinda',
    modalPrice: 7120,
    minPrice: 6850,
    maxPrice: 7350,
    govtMsp: 6620,
    dailyTrend: '+0.8%',
    arrivalQuintals: 3400,
  },
  {
    crop: 'Mustard / Raya (PBR-357)',
    mandi: 'Fazilka Grain Exchange',
    district: 'Fazilka',
    modalPrice: 5650,
    minPrice: 5450,
    maxPrice: 5800,
    govtMsp: 5650,
    dailyTrend: '+0.8%',
    arrivalQuintals: 4200,
  },
  {
    crop: 'Summer Moong (SML-668)',
    mandi: 'Moga New Mandi',
    district: 'Moga',
    modalPrice: 8650,
    minPrice: 8300,
    maxPrice: 8900,
    govtMsp: 8558,
    dailyTrend: '+1.1%',
    arrivalQuintals: 1850,
  },
  {
    crop: 'Yellow Maize / Corn (PMH-1)',
    mandi: 'Hoshiarpur Kandi Mandi',
    district: 'Hoshiarpur',
    modalPrice: 2190,
    minPrice: 2050,
    maxPrice: 2260,
    govtMsp: 2090,
    dailyTrend: '-0.5%',
    arrivalQuintals: 5600,
  },
]

export const INITIAL_CROP_LISTINGS: CropListing[] = [
  {
    id: 'crop-wh-01',
    cropName: 'Certified HD-3086 Wheat Grain',
    cropNamePa: 'ਪ੍ਰਮਾਣਿਤ ਐਚ.ਡੀ.-3086 ਕਣਕ',
    variety: 'HD-3086 (Pusa Shreshtha)',
    category: 'Cereals',
    farmerName: 'S. Gurpreet Singh Dhillon',
    farmerPhone: '+91 98765-43210',
    village: 'Chak Kalan',
    district: 'Ludhiana',
    state: 'Punjab',
    quantityQuintals: 120,
    minOrderQuintals: 10,
    pricePerQuintal: 2360,
    mspBenchmark: 2275,
    qualityGrade: 'Grade A Premium',
    moisturePercentage: 11.2,
    harvestDate: 'April 2026',
    verifiedAPMC: true,
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
    description:
      'Lustrous, bold amber grains harvested from laser-levelled CRI managed fields. Zero loose smut, 12.8% protein content ideal for premium flour mills and bakeries.',
    descriptionPa: 'ਚਮਕਦਾਰ ਮੋਟੇ ਦਾਣੇ, ਬਿਨਾਂ ਕਿਸੇ ਬਿਮਾਰੀ ਦੇ, ਉੱਚ ਗੁਣਵੱਤਾ ਵਾਲੀ ਕਣਕ ਸਿੱਧੇ ਖੇਤ ਵਿੱਚੋਂ।',
    deliveryOptions: ['Farm-Gate Direct Pickup', 'Mandi Yard Delivery', 'Interstate Heavy Logistics'],
    labSpecs: {
      proteinPercent: 12.8,
      grainLengthMm: 6.8,
      germinationRate: 97,
      foreignMatterPercent: 0.3,
    },
    coordinates: { lat: 30.7046, lng: 75.8567 },
  },
  {
    id: 'crop-bas-02',
    cropName: 'Aged Basmati 1121 Extra Long Slender',
    cropNamePa: 'ਬਾਸਮਤੀ 1121 ਅਸਲੀ ਸੁਗੰਧਿਤ ਚੌਲ/ਝੋਨਾ',
    variety: 'Basmati 1121 (GI Tagged Punjab)',
    category: 'Cereals',
    farmerName: 'S. Harinder Singh Sandhu',
    farmerPhone: '+91 98140-87654',
    village: 'Rayya',
    district: 'Amritsar',
    state: 'Punjab',
    quantityQuintals: 250,
    minOrderQuintals: 20,
    pricePerQuintal: 3950,
    mspBenchmark: 3200,
    qualityGrade: 'Certified Organic',
    moisturePercentage: 12.5,
    harvestDate: 'November 2025',
    verifiedAPMC: true,
    imageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=800&q=80',
    description:
      'Authentic Majha belt Basmati with 8.4mm average uncooked grain length. Grown with bio-fertilizers and zero pesticide residue for export compliance.',
    descriptionPa: 'ਮਾਝੇ ਦੇ ਇਲਾਕੇ ਦੀ ਵਿਸ਼ਵ ਪ੍ਰਸਿੱਧ ਖੁਸ਼ਬੂਦਾਰ ਬਾਸਮਤੀ 1121, ਬਰਾਮਦ ਗੁਣਵੱਤਾ ਮਾਪਦੰਡ ਅਨੁਸਾਰ।',
    deliveryOptions: ['Farm-Gate Direct Pickup', 'Interstate Heavy Logistics'],
    labSpecs: {
      grainLengthMm: 8.4,
      proteinPercent: 9.1,
      foreignMatterPercent: 0.1,
    },
    coordinates: { lat: 31.634, lng: 74.8723 },
  },
  {
    id: 'crop-cot-03',
    cropName: 'Bt Cotton Long Staple (White Gold)',
    cropNamePa: 'ਨਰਮਾ (ਬੀ.ਟੀ. ਕਾਟਨ) ਲੰਮਾ ਰੇਸ਼ਾ',
    variety: 'RCH-659 BG-II',
    category: 'Commercial & Cash Crops',
    farmerName: 'Baldev Singh Brar',
    farmerPhone: '+91 94172-12345',
    village: 'Maur Mandi',
    district: 'Bathinda',
    state: 'Punjab',
    quantityQuintals: 85,
    minOrderQuintals: 15,
    pricePerQuintal: 7150,
    mspBenchmark: 6620,
    qualityGrade: 'Grade A Premium',
    moisturePercentage: 7.8,
    harvestDate: 'October 2025',
    verifiedAPMC: true,
    imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80',
    description:
      'Superior 29.5 mm staple length cotton lint with 4.2 Micronaire value. Hand-picked twice to eliminate trash and leaf matter.',
    descriptionPa: 'ਮਾਲਵੇ ਦਾ ਚਿੱਟਾ ਸੋਨਾ, ਸਾਫ-ਸੁਥਰੀ ਚੁਗਾਈ ਵਾਲਾ ਵਧੀਆ ਨਰਮਾ, ਜਿੰਨਿੰਗ ਮਿੱਲਾਂ ਲਈ ਢੁਕਵਾਂ।',
    deliveryOptions: ['Farm-Gate Direct Pickup', 'Mandi Yard Delivery'],
    labSpecs: {
      grainLengthMm: 29.5, // staple length in mm
      foreignMatterPercent: 1.2,
    },
    coordinates: { lat: 30.211, lng: 74.9455 },
  },
  {
    id: 'crop-mus-04',
    cropName: 'High Oil Raya Mustard Seeds',
    cropNamePa: 'ਰਾਈਆ / ਸਰ੍ਹੋਂ (ਪੀ.ਬੀ.ਆਰ.-357)',
    variety: 'PBR-357 (PAU Ludhiana)',
    category: 'Oilseeds',
    farmerName: 'Rameshwar Lal Bishnoi',
    farmerPhone: '+91 94631-54321',
    village: 'Khui Khera',
    district: 'Fazilka',
    state: 'Punjab',
    quantityQuintals: 95,
    minOrderQuintals: 10,
    pricePerQuintal: 5680,
    mspBenchmark: 5650,
    qualityGrade: 'Grade A Premium',
    moisturePercentage: 7.2,
    harvestDate: 'March 2026',
    verifiedAPMC: true,
    imageUrl: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80',
    description:
      'Golden-brown bold mustard seeds with lab-tested 40.5% oil content. Ideal for cold-pressed kachi ghani edible mustard oil production.',
    descriptionPa: '40.5% ਤੇਲ ਦੀ ਮਾਤਰਾ ਵਾਲੀ ਪੱਕੀ ਸਰ੍ਹੋਂ, ਕੋਹਲੂ ਅਤੇ ਤੇਲ ਮਿੱਲਾਂ ਲਈ ਉੱਤਮ ਚੋਣ।',
    deliveryOptions: ['Farm-Gate Direct Pickup', 'Mandi Yard Delivery', 'Interstate Heavy Logistics'],
    labSpecs: {
      oilContentPercent: 40.5,
      germinationRate: 94,
      foreignMatterPercent: 0.5,
    },
    coordinates: { lat: 30.4042, lng: 74.0253 },
  },
  {
    id: 'crop-mng-05',
    cropName: 'Summer Catch-Crop Moong Dal Grains',
    cropNamePa: 'ਗਰਮੀਆਂ ਦੀ ਮੂੰਗੀ (ਐਸ.ਐਮ.ਐਲ.-668)',
    variety: 'SML-668 / Star Moong',
    category: 'Pulses',
    farmerName: 'Jagjit Singh Gill',
    farmerPhone: '+91 98888-99887',
    village: 'Dharamkot',
    district: 'Moga',
    state: 'Punjab',
    quantityQuintals: 45,
    minOrderQuintals: 5,
    pricePerQuintal: 8750,
    mspBenchmark: 8558,
    qualityGrade: 'FAQ Standard',
    moisturePercentage: 9.1,
    harvestDate: 'June 2025',
    verifiedAPMC: true,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    description:
      'Grown in 60-day summer window between wheat and paddy. Uniform olive-green kernels packed with natural plant proteins.',
    descriptionPa: 'ਕਣਕ-ਝੋਨੇ ਦੇ ਵਿਚਕਾਰ ਬੀਜੀ ਗਈ ਮੂੰਗੀ, ਉੱਚ ਪ੍ਰੋਟੀਨ ਅਤੇ ਪੋਸ਼ਣ ਨਾਲ ਭਰਪੂਰ।',
    deliveryOptions: ['Farm-Gate Direct Pickup', 'Mandi Yard Delivery'],
    labSpecs: {
      proteinPercent: 24.2,
      germinationRate: 98,
      foreignMatterPercent: 0.2,
    },
    coordinates: { lat: 30.8165, lng: 75.1715 },
  },
  {
    id: 'crop-pot-06',
    cropName: 'Kufri Pukhraj Seed Grade Table Potatoes',
    cropNamePa: 'ਆਲੂ ਕੁਫ਼ਰੀ ਪੁਖਰਾਜ (ਜਲੰਧਰ ਕੋਲਡ ਸਟੋਰ)',
    variety: 'Kufri Pukhraj (Doaba Region)',
    category: 'Vegetables',
    farmerName: 'Kulwinder Singh Johal',
    farmerPhone: '+91 98150-11223',
    village: 'Kartarpur',
    district: 'Jalandhar',
    state: 'Punjab',
    quantityQuintals: 400,
    minOrderQuintals: 50,
    pricePerQuintal: 1450,
    mspBenchmark: 1200,
    qualityGrade: 'Seed Multiplication Grade',
    moisturePercentage: 18.0,
    harvestDate: 'February 2026',
    verifiedAPMC: true,
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    description:
      'Doaba belt golden-skinned uniform tubers stored in climate-monitored cold chain at 3°C. Zero hollow heart, ready for prompt dispatch.',
    descriptionPa: 'ਜਲੰਧਰ ਦੋਆਬੇ ਦੇ ਮਸ਼ਹੂਰ ਕੁਫ਼ਰੀ ਪੁਖਰਾਜ ਆਲੂ, ਕੋਲਡ ਸਟੋਰ ਵਿੱਚੋਂ ਸਿੱਧੇ ਡਿਸਪੈਚ ਲਈ ਤਿਆਰ।',
    deliveryOptions: ['Farm-Gate Direct Pickup', 'Interstate Heavy Logistics'],
    labSpecs: {
      germinationRate: 99,
      foreignMatterPercent: 0.0,
    },
    coordinates: { lat: 31.326, lng: 75.5762 },
  },
]

