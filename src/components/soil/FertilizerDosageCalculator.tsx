import { useState, useMemo } from 'react'
import {
  Calculator,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react'
import type { SoilReading } from '../../types'

interface FertilizerDosageCalculatorProps {
  reading: SoilReading
}

interface CropFertilizerProfile {
  id: string
  name: string
  scientificName: string
  defaultYield: number // q/ha
  baseN: number
  baseP: number
  baseK: number
  yieldFactorN: number // additional kg N per additional quintal yield
  stages: {
    basal: { name: string; timing: string; nPct: number; pPct: number; kPct: number }
    topDressing1: { name: string; timing: string; nPct: number; pPct: number; kPct: number }
    topDressing2: { name: string; timing: string; nPct: number; pPct: number; kPct: number }
  }
}

const CROP_PROFILES: CropFertilizerProfile[] = [
  {
    id: 'wheat',
    name: 'Wheat (गेहूं / ਕਣਕ)',
    scientificName: 'Triticum aestivum',
    defaultYield: 50,
    baseN: 120,
    baseP: 60,
    baseK: 40,
    yieldFactorN: 1.8,
    stages: {
      basal: { name: 'Basal Dose', timing: 'At Sowing (Drilled with seed)', nPct: 33, pPct: 100, kPct: 100 },
      topDressing1: { name: '1st Top Dressing', timing: 'CRI Stage (20-25 DAS, before 1st irrigation)', nPct: 33, pPct: 0, kPct: 0 },
      topDressing2: { name: '2nd Top Dressing', timing: 'Tillering to Flag Leaf (45-50 DAS)', nPct: 34, pPct: 0, kPct: 0 },
    },
  },
  {
    id: 'paddy',
    name: 'Paddy / Basmati (धान / ਝੋਨਾ)',
    scientificName: 'Oryza sativa',
    defaultYield: 65,
    baseN: 120,
    baseP: 40,
    baseK: 40,
    yieldFactorN: 1.6,
    stages: {
      basal: { name: 'Basal Dose', timing: 'Last Puddling before transplanting', nPct: 33, pPct: 100, kPct: 100 },
      topDressing1: { name: '1st Top Dressing', timing: 'Active Tillering (21 DAS)', nPct: 33, pPct: 0, kPct: 0 },
      topDressing2: { name: '2nd Top Dressing', timing: 'Panicle Initiation (42 DAS)', nPct: 34, pPct: 0, kPct: 0 },
    },
  },
  {
    id: 'cotton',
    name: 'Bt Cotton (कपास / ਨਰਮਾ)',
    scientificName: 'Gossypium hirsutum',
    defaultYield: 28,
    baseN: 150,
    baseP: 60,
    baseK: 60,
    yieldFactorN: 2.2,
    stages: {
      basal: { name: 'Basal Dose', timing: 'At sowing or thinning', nPct: 25, pPct: 100, kPct: 50 },
      topDressing1: { name: 'Square Formation', timing: 'Square formation stage (45 DAS)', nPct: 50, pPct: 0, kPct: 50 },
      topDressing2: { name: 'Flowering & Boll', timing: 'Peak flowering / boll development (70 DAS)', nPct: 25, pPct: 0, kPct: 0 },
    },
  },
  {
    id: 'mustard',
    name: 'Mustard / Raya (सरसों / ਰਾਇਆ)',
    scientificName: 'Brassica juncea',
    defaultYield: 22,
    baseN: 100,
    baseP: 40,
    baseK: 40,
    yieldFactorN: 1.4,
    stages: {
      basal: { name: 'Basal Dose', timing: 'Sowing furrow application', nPct: 50, pPct: 100, kPct: 100 },
      topDressing1: { name: '1st Irrigation', timing: 'At first irrigation (25-30 DAS)', nPct: 50, pPct: 0, kPct: 0 },
      topDressing2: { name: 'Flowering / Pod', timing: 'Foliar Sulfur booster (if required)', nPct: 0, pPct: 0, kPct: 0 },
    },
  },
  {
    id: 'maize',
    name: 'Hybrid Maize (मक्का / ਮੱਕੀ)',
    scientificName: 'Zea mays',
    defaultYield: 60,
    baseN: 120,
    baseP: 60,
    baseK: 50,
    yieldFactorN: 1.7,
    stages: {
      basal: { name: 'Basal Dose', timing: 'Sowing placement below seed', nPct: 33, pPct: 100, kPct: 100 },
      topDressing1: { name: 'Knee-High Stage', timing: 'Knee-high vegetative stage (30 DAS)', nPct: 33, pPct: 0, kPct: 0 },
      topDressing2: { name: 'Tasseling Stage', timing: 'Tasseling and silking emergence (50 DAS)', nPct: 34, pPct: 0, kPct: 0 },
    },
  },
]

export function FertilizerDosageCalculator({ reading }: FertilizerDosageCalculatorProps) {
  const [selectedCropId, setSelectedCropId] = useState<string>('wheat')
  const [targetYield, setTargetYield] = useState<number>(50)
  const [areaHectares, setAreaHectares] = useState<number>(1.0) // 1 ha = 2.47 acres

  const crop = useMemo(() => {
    return CROP_PROFILES.find((c) => c.id === selectedCropId) || CROP_PROFILES[0]
  }, [selectedCropId])

  // Calculation of Target N, P2O5, K2O
  const calculation = useMemo(() => {
    const yieldDelta = Math.max(0, targetYield - crop.defaultYield)
    const requiredN = crop.baseN + yieldDelta * crop.yieldFactorN
    const requiredP = crop.baseP
    const requiredK = crop.baseK

    // Soil test adjusted deficit (Credit 30% of existing soil reserve)
    const soilCreditN = Math.max(0, reading.nitrogen * 0.3)
    const soilCreditP = Math.max(0, reading.phosphorus * 0.4)
    const soilCreditK = Math.max(0, reading.potassium * 0.25)

    const netN = Math.max(20, Math.round(requiredN - soilCreditN))
    const netP = Math.max(10, Math.round(requiredP - soilCreditP))
    const netK = Math.max(10, Math.round(requiredK - soilCreditK))

    // Commercial fertilizer translation:
    // DAP (18% N, 46% P2O5) -> 50kg bag contains 9kg N and 23kg P2O5
    const dapBagsPerHa = Math.ceil(netP / 23)
    const nSuppliedByDap = dapBagsPerHa * 9

    // Urea (46% N) -> 45kg bag contains 20.7kg N
    const remainingN = Math.max(0, netN - nSuppliedByDap)
    const ureaBagsPerHa = Math.ceil(remainingN / 20.7)

    // MOP (60% K2O) -> 50kg bag contains 30kg K2O
    const mopBagsPerHa = Math.ceil(netK / 30)

    // Zinc Sulfate (21% Zn)
    const zincKgPerHa = (reading.zinc ?? 0.85) < 0.8 ? 25 : 10

    // Multiplied by farm size
    const totalDapBags = Math.ceil(dapBagsPerHa * areaHectares)
    const totalUreaBags = Math.ceil(ureaBagsPerHa * areaHectares)
    const totalMopBags = Math.ceil(mopBagsPerHa * areaHectares)
    const totalZincKg = Math.round(zincKgPerHa * areaHectares)

    return {
      netN,
      netP,
      netK,
      dapBagsPerHa,
      ureaBagsPerHa,
      mopBagsPerHa,
      zincKgPerHa,
      totalDapBags,
      totalUreaBags,
      totalMopBags,
      totalZincKg,
    }
  }, [crop, targetYield, areaHectares, reading])

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 dark:border-agri-darkBorder">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-forest-100 text-forest-800 dark:bg-emerald-950 dark:text-emerald-400">
              <Calculator className="h-4 w-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-forest-800 dark:text-emerald-400">
              Precision Agronomy Calculator
            </span>
          </div>
          <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
            Commercial Fertilizer Bag & Split-Dose Schedule
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Computes exact commercial market bags (Urea, DAP, MOP) based on soil test reserves and target yield.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> ICAR Targeted Yield (STCR)
          </span>
        </div>
      </div>

      {/* Control Inputs */}
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {/* Crop Selector */}
        <div>
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
            Target Crop Variety
          </label>
          <select
            value={selectedCropId}
            onChange={(e) => {
              setSelectedCropId(e.target.value)
              const matched = CROP_PROFILES.find((c) => c.id === e.target.value)
              if (matched) setTargetYield(matched.defaultYield)
            }}
            className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-extrabold text-slate-800 focus:border-emerald-500 focus:outline-hidden dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-white"
          >
            {CROP_PROFILES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-slate-400 italic">{crop.scientificName}</span>
        </div>

        {/* Target Yield Slider */}
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>Target Yield</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
              {targetYield} Quintals / Hectare
            </span>
          </div>
          <input
            type="range"
            min={Math.round(crop.defaultYield * 0.6)}
            max={Math.round(crop.defaultYield * 1.6)}
            step={1}
            value={targetYield}
            onChange={(e) => setTargetYield(Number(e.target.value))}
            className="mt-3 w-full accent-emerald-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Baseline: {crop.defaultYield} q/ha</span>
            <span>High Target: {Math.round(crop.defaultYield * 1.5)} q/ha</span>
          </div>
        </div>

        {/* Farm Land Size */}
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>Cultivated Area</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
              {areaHectares} Ha ({(areaHectares * 2.47).toFixed(1)} Acres)
            </span>
          </div>
          <input
            type="range"
            min={0.5}
            max={10.0}
            step={0.5}
            value={areaHectares}
            onChange={(e) => setAreaHectares(Number(e.target.value))}
            className="mt-3 w-full accent-emerald-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0.5 Ha (~1.2 ac)</span>
            <span>10 Ha (~25 ac)</span>
          </div>
        </div>
      </div>

      {/* Commercial Fertilizer Bags Summary */}
      <div className="mt-6">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          Total Commercial Fertilizer Requirement for {areaHectares} Hectares ({(areaHectares * 2.47).toFixed(1)} Acres)
        </h3>

        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Urea Card */}
          <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-linear-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-5 dark:border-emerald-800 dark:bg-emerald-950/20">
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-mono text-sm font-black shadow-xs">
                N
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                46% Nitrogen
              </span>
            </div>
            <div className="mt-3">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Neem-Coated Urea</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {calculation.totalUreaBags}
                </span>
                <span className="text-xs font-bold text-slate-500">Bags (45 kg)</span>
              </div>
              <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                ({calculation.ureaBagsPerHa} bags / hectare)
              </p>
            </div>
          </div>

          {/* DAP Card */}
          <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-linear-to-br from-blue-500/10 via-blue-500/5 to-transparent p-5 dark:border-blue-800 dark:bg-blue-950/20">
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-mono text-sm font-black shadow-xs">
                P
              </span>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-black text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                18:46:0 Grade
              </span>
            </div>
            <div className="mt-3">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">DAP (Di-Ammonium Phosphate)</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {calculation.totalDapBags}
                </span>
                <span className="text-xs font-bold text-slate-500">Bags (50 kg)</span>
              </div>
              <p className="mt-1 text-[11px] text-blue-700 dark:text-blue-400 font-semibold">
                ({calculation.dapBagsPerHa} bags / hectare)
              </p>
            </div>
          </div>

          {/* MOP Card */}
          <div className="relative overflow-hidden rounded-2xl border border-purple-200 bg-linear-to-br from-purple-500/10 via-purple-500/5 to-transparent p-5 dark:border-purple-800 dark:bg-purple-950/20">
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white font-mono text-sm font-black shadow-xs">
                K
              </span>
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-black text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                60% Potash
              </span>
            </div>
            <div className="mt-3">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">MOP (Muriate of Potash)</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {calculation.totalMopBags}
                </span>
                <span className="text-xs font-bold text-slate-500">Bags (50 kg)</span>
              </div>
              <p className="mt-1 text-[11px] text-purple-700 dark:text-purple-400 font-semibold">
                ({calculation.mopBagsPerHa} bags / hectare)
              </p>
            </div>
          </div>

          {/* Zinc Sulfate Card */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-linear-to-br from-amber-500/10 via-amber-500/5 to-transparent p-5 dark:border-amber-800 dark:bg-amber-950/20">
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600 text-white font-mono text-sm font-black shadow-xs">
                Zn
              </span>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                21% Zn + S
              </span>
            </div>
            <div className="mt-3">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Zinc Sulfate Heptahydrate</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {calculation.totalZincKg}
                </span>
                <span className="text-xs font-bold text-slate-500">kg total</span>
              </div>
              <p className="mt-1 text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                ({calculation.zincKgPerHa} kg / hectare)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Split Application Timing Timeline */}
      <div className="mt-7">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-emerald-600" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Agronomic Split Application Timeline (Preventing Nitrate Leaching)
          </h3>
        </div>

        <div className="mt-3 grid gap-4 md:grid-cols-3">
          {/* Stage 1 */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Stage 1 • Basal
              </span>
              <Clock className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <h4 className="mt-2 text-sm font-black text-slate-900 dark:text-white">
              {crop.stages.basal.name}
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
              {crop.stages.basal.timing}
            </p>
            <div className="mt-3 space-y-1.5 border-t border-slate-200/60 pt-2 text-xs font-bold dark:border-agri-darkBorder">
              <p className="text-blue-700 dark:text-blue-400">
                • 100% DAP ({calculation.totalDapBags} Bags)
              </p>
              <p className="text-purple-700 dark:text-purple-400">
                • 100% MOP ({calculation.totalMopBags} Bags)
              </p>
              <p className="text-emerald-700 dark:text-emerald-400">
                • {crop.stages.basal.nPct}% Urea (~{Math.round(calculation.totalUreaBags * (crop.stages.basal.nPct / 100))} Bags)
              </p>
              <p className="text-amber-700 dark:text-amber-400">
                • Zinc Sulfate ({calculation.totalZincKg} kg)
              </p>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Stage 2 • 1st Top Dressing
              </span>
              <Clock className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <h4 className="mt-2 text-sm font-black text-slate-900 dark:text-white">
              {crop.stages.topDressing1.name}
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
              {crop.stages.topDressing1.timing}
            </p>
            <div className="mt-3 space-y-1.5 border-t border-slate-200/60 pt-2 text-xs font-bold dark:border-agri-darkBorder">
              <p className="text-emerald-700 dark:text-emerald-400">
                • {crop.stages.topDressing1.nPct}% Urea (~{Math.round(calculation.totalUreaBags * (crop.stages.topDressing1.nPct / 100))} Bags)
              </p>
              <p className="text-slate-500 text-[11px]">
                Broadcast evenly just before light irrigation; avoid waterlogged surface to eliminate denitrification loss.
              </p>
            </div>
          </div>

          {/* Stage 3 */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Stage 3 • 2nd Top Dressing
              </span>
              <Clock className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <h4 className="mt-2 text-sm font-black text-slate-900 dark:text-white">
              {crop.stages.topDressing2.name}
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
              {crop.stages.topDressing2.timing}
            </p>
            <div className="mt-3 space-y-1.5 border-t border-slate-200/60 pt-2 text-xs font-bold dark:border-agri-darkBorder">
              <p className="text-emerald-700 dark:text-emerald-400">
                • {crop.stages.topDressing2.nPct}% Urea (~{Math.round(calculation.totalUreaBags * (crop.stages.topDressing2.nPct / 100))} Bags)
              </p>
              <p className="text-slate-500 text-[11px]">
                Critical for grain filling and spikelet fertility. Do not apply late past flowering to prevent vegetative rankness.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
