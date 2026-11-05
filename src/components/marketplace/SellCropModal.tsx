import { useState } from 'react'
import {
  X,
  Scale,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Coins,
} from 'lucide-react'
import type { CropListing } from '../../data/marketplaceCrops'
import { useAuth } from '../../auth/useAuth'

interface SellCropModalProps {
  onClose: () => void
  onPublish: (listing: CropListing) => void
}

const COMMODITY_PRESETS = [
  { name: 'HD-3086 Wheat (Kanak)', namePa: 'ਐਚ.ਡੀ.-3086 ਕਣਕ', variety: 'HD-3086 Shreshtha', category: 'Cereals', msp: 2275, defaultPrice: 2360 },
  { name: 'PBW-826 High-Yield Wheat', namePa: 'ਪੀ.ਬੀ.ਡਬਲਯੂ.-826 ਕਣਕ', variety: 'PBW-826 PAU', category: 'Cereals', msp: 2275, defaultPrice: 2380 },
  { name: 'Basmati 1121 Extra Long', namePa: 'ਬਾਸਮਤੀ 1121 ਸੁਗੰਧਿਤ', variety: 'Basmati 1121 (Majha)', category: 'Cereals', msp: 3200, defaultPrice: 3950 },
  { name: 'PR-126 DSR Paddy', namePa: 'ਪੀ.ਆਰ.-126 ਸਿੱਧੀ ਬਿਜਾਈ ਝੋਨਾ', variety: 'PR-126 Tar-Wattar', category: 'Cereals', msp: 2320, defaultPrice: 2420 },
  { name: 'Bt Cotton Long Staple', namePa: 'ਬੀ.ਟੀ. ਕਾਟਨ (ਨਰਮਾ)', variety: 'RCH-659 BG-II', category: 'Commercial & Cash Crops', msp: 6620, defaultPrice: 7150 },
  { name: 'PBR-357 Raya Mustard', namePa: 'ਰਾਈਆ / ਸਰ੍ਹੋਂ', variety: 'PBR-357 High Oil', category: 'Oilseeds', msp: 5650, defaultPrice: 5680 },
  { name: 'Summer Moong Dal', namePa: 'ਗਰਮੀਆਂ ਦੀ ਮੂੰਗੀ', variety: 'SML-668 Catch Crop', category: 'Pulses', msp: 8558, defaultPrice: 8750 },
  { name: 'Kufri Pukhraj Potatoes', namePa: 'ਆਲੂ ਕੁਫ਼ਰੀ ਪੁਖਰਾਜ', variety: 'Kufri Pukhraj (Doaba)', category: 'Vegetables', msp: 1200, defaultPrice: 1450 },
] as const

const DISTRICTS = [
  'Ludhiana',
  'Amritsar',
  'Bathinda',
  'Fazilka',
  'Moga',
  'Jalandhar',
  'Hoshiarpur',
  'Patiala',
  'Sangrur',
  'Firozpur',
]

export function SellCropModal({ onClose, onPublish }: SellCropModalProps) {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)

  // Form State
  const [selectedCommodityIndex, setSelectedCommodityIndex] = useState(0)
  const [variety, setVariety] = useState<string>(COMMODITY_PRESETS[0].variety)
  const [qualityGrade, setQualityGrade] = useState<'Grade A Premium' | 'Certified Organic' | 'Seed Multiplication Grade' | 'FAQ Standard'>('Grade A Premium')
  const [moisturePercentage, setMoisturePercentage] = useState(11.5)
  const [quantityQuintals, setQuantityQuintals] = useState(50)
  const [pricePerQuintal, setPricePerQuintal] = useState<number>(COMMODITY_PRESETS[0].defaultPrice)
  const [farmerName, setFarmerName] = useState(user?.name || '')
  const [farmerPhone, setFarmerPhone] = useState(user?.phone || '')
  const [village, setVillage] = useState('')
  const [district, setDistrict] = useState(user?.district || 'Ludhiana')
  const [deliveryOption, setDeliveryOption] = useState<'Farm-Gate Direct Pickup' | 'Mandi Yard Delivery' | 'Interstate Heavy Logistics'>('Farm-Gate Direct Pickup')
  const [description, setDescription] = useState('')

  const activePreset = COMMODITY_PRESETS[selectedCommodityIndex]
  const grossRevenue = quantityQuintals * pricePerQuintal
  const isBelowMsp = pricePerQuintal < activePreset.msp

  const handleCommodityChange = (index: number) => {
    setSelectedCommodityIndex(index)
    const p = COMMODITY_PRESETS[index]
    setVariety(p.variety)
    setPricePerQuintal(p.defaultPrice)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newListing: CropListing = {
      id: `crop-${Date.now()}`,
      cropName: activePreset.name,
      cropNamePa: activePreset.namePa,
      variety,
      category: activePreset.category as any,
      farmerName: farmerName.trim() || 'S. Harpreet Singh',
      farmerPhone: farmerPhone.trim() || '+91 98765-43210',
      village: village.trim() || 'Raikot',
      district,
      state: 'Punjab',
      quantityQuintals,
      minOrderQuintals: Math.min(10, quantityQuintals),
      pricePerQuintal,
      mspBenchmark: activePreset.msp,
      qualityGrade,
      moisturePercentage,
      harvestDate: 'Current Season 2026',
      verifiedAPMC: true,
      imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
      description: description.trim() || 'Harvested under optimal soil moisture conditions. Fully certified by field agronomist.',
      descriptionPa: 'ਖੇਤ ਵਿੱਚੋਂ ਸਿੱਧੀ ਕਟਾਈ ਕੀਤੀ ਗਈ ਉੱਚ ਮਿਆਰੀ ਫਸਲ।',
      deliveryOptions: [deliveryOption],
      labSpecs: {
        proteinPercent: 12.5,
        germinationRate: 96,
        foreignMatterPercent: 0.4,
      },
      coordinates: { lat: 30.7046, lng: 75.8567 },
    }

    onPublish(newListing)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative flex flex-col max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-amber-500/30 bg-slate-950 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                  Step {currentStep} of 3
                </span>
                <span className="text-xs text-emerald-400 font-semibold">Direct Mandi e-Auction</span>
              </div>
              <h3 className="text-lg font-black text-white mt-0.5">Sell Harvested Crop (ਫਸਲ ਵੇਚੋ)</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-3 border-b border-white/10 bg-slate-900/60 px-6 py-2.5 text-xs font-bold text-center">
          <span className={currentStep === 1 ? 'text-amber-400 font-black' : 'text-slate-400'}>
            1. Crop Specs
          </span>
          <span className={currentStep === 2 ? 'text-amber-400 font-black' : 'text-slate-400'}>
            2. Price &amp; MSP
          </span>
          <span className={currentStep === 3 ? 'text-amber-400 font-black' : 'text-slate-400'}>
            3. Contact &amp; Dispatch
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
          {/* STEP 1: CROP & QUALITY SPECIFICATIONS */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="text-xs font-bold text-slate-300">Select Crop Commodity</label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {COMMODITY_PRESETS.map((preset, idx) => (
                    <div
                      key={preset.name}
                      onClick={() => handleCommodityChange(idx)}
                      className={`cursor-pointer rounded-xl border p-2.5 transition text-left ${
                        selectedCommodityIndex === idx
                          ? 'border-amber-400 bg-amber-500/20 text-white'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <p className="text-xs font-bold truncate">{preset.name}</p>
                      <p className="text-[10px] text-emerald-400">{preset.namePa}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Variety Tag</label>
                  <input
                    type="text"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                    placeholder="e.g. HD-3086 Pusa Shreshtha"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Quality Classification</label>
                  <select
                    value={qualityGrade}
                    onChange={(e) => setQualityGrade(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="Grade A Premium">Grade A Premium (Clean &amp; Bold)</option>
                    <option value="Certified Organic">Certified Organic (APEDA Compliant)</option>
                    <option value="Seed Multiplication Grade">Seed Multiplication Grade (Certified)</option>
                    <option value="FAQ Standard">FAQ Standard (Fair Average Quality)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">Moisture Content Level</span>
                  <span className="font-mono text-amber-300 font-bold">{moisturePercentage}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={20}
                  step={0.1}
                  value={moisturePercentage}
                  onChange={(e) => setMoisturePercentage(Number(e.target.value))}
                  className="mt-2 w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Dry &lt;10%</span>
                  <span>Mandi Optimum (11% - 13%)</span>
                  <span>High Moisture &gt;14%</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PRICING & MSP GUARD */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300">Total Lot Volume (Quintals)</label>
                  <input
                    type="number"
                    min={1}
                    value={quantityQuintals}
                    onChange={(e) => setQuantityQuintals(Math.max(1, Number(e.target.value)))}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm font-bold text-white outline-none focus:border-amber-400 font-mono"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    1 Quintal = 100 kg (~2.5 Bags)
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Asking Price (₹ / Quintal)</label>
                  <input
                    type="number"
                    min={500}
                    value={pricePerQuintal}
                    onChange={(e) => setPricePerQuintal(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm font-bold text-white outline-none focus:border-amber-400 font-mono"
                    required
                  />
                  <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 block">
                    Official Govt MSP Floor: ₹{activePreset.msp} / Qtl
                  </span>
                </div>
              </div>

              {/* Dynamic Revenue Projection Card */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-amber-400" />
                    <span className="text-xs font-bold text-emerald-300">Total Projected Revenue:</span>
                  </div>
                  <span className="font-mono text-xl font-black text-white">
                    ₹{grossRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-slate-300">
                  {quantityQuintals} Quintals @ ₹{pricePerQuintal.toLocaleString()}/Qtl with 100% Escrow Guarantee.
                </div>
              </div>

              {/* MSP Warning Banner */}
              {isBelowMsp && (
                <div className="flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3.5 text-xs text-amber-200">
                  <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-amber-300">Asking Price Below MSP Notice</h5>
                    <p className="mt-0.5 text-[11px] leading-relaxed">
                      Your asking rate (₹{pricePerQuintal}) is ₹{activePreset.msp - pricePerQuintal} below the official MSP floor (₹{activePreset.msp}). We recommend adjusting your rate to maximize farm gross margin.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: CONTACT & DISPATCH */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Farmer Legal Full Name</label>
                  <input
                    type="text"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder="S. Gurpreet Singh Dhillon"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Mobile Phone (WhatsApp Enabled)</label>
                  <input
                    type="tel"
                    value={farmerPhone}
                    onChange={(e) => setFarmerPhone(e.target.value)}
                    placeholder="+91 98765-43210"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Village / Tehsil Address</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="Village Chak Kalan, Tehsil Jagraon"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">District (Punjab APMC Jurisdiction)</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-amber-400 cursor-pointer"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d} District
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Preferred Delivery Mode</label>
                <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    'Farm-Gate Direct Pickup',
                    'Mandi Yard Delivery',
                    'Interstate Heavy Logistics',
                  ].map((opt) => (
                    <div
                      key={opt}
                      onClick={() => setDeliveryOption(opt as any)}
                      className={`cursor-pointer rounded-xl border p-2.5 transition text-center ${
                        deliveryOption === opt
                          ? 'border-emerald-400 bg-emerald-500/20 text-white font-bold'
                          : 'border-white/10 bg-white/5 text-slate-400'
                      }`}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Additional Lot Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Machine threshed, stored in ventilated clean silos. Moisture tested at 11.2%."
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 p-2.5 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((currentStep - 1) as any)}
                className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-slate-400 hover:bg-white/10 hover:text-white transition"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((currentStep + 1) as any)}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2 text-xs font-black text-slate-950 hover:bg-amber-400 transition"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-emerald-500 transition cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Publish Crop Listing</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
