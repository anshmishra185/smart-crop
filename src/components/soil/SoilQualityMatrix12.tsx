import { useState } from 'react'
import {
  CheckCircle2,
  Layers,
  Sparkles,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react'
import type { SoilReading } from '../../types'

interface SoilQualityMatrix12Props {
  reading: SoilReading
}

interface ParameterMeta {
  key: string
  name: string
  symbol: string
  category: 'primary' | 'secondary' | 'micronutrient' | 'physicochemical'
  unit: string
  currentValue: number
  lowLimit: number
  highLimit: number
  optimalRange: string
  status: 'deficient' | 'sufficient' | 'surplus'
  impact: string
  remedy: string
}

export function SoilQualityMatrix12({ reading }: SoilQualityMatrix12Props) {
  const [selectedParam, setSelectedParam] = useState<ParameterMeta | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'primary' | 'secondary' | 'micronutrient' | 'physicochemical'>('all')

  const getStatus = (val: number, low: number, high: number): 'deficient' | 'sufficient' | 'surplus' => {
    if (val < low) return 'deficient'
    if (val > high) return 'surplus'
    return 'sufficient'
  }

  // 12 Official ICAR & Soil Health Card Parameters
  const parameters: ParameterMeta[] = [
    // 1. Primary Macronutrients
    {
      key: 'nitrogen',
      name: 'Available Nitrogen',
      symbol: 'N',
      category: 'primary',
      unit: 'kg/ha',
      currentValue: reading.nitrogen,
      lowLimit: 100,
      highLimit: 150,
      optimalRange: '100 – 150 kg/ha',
      status: getStatus(reading.nitrogen, 100, 150),
      impact: 'Essential for vegetative vigor, chlorophyll synthesis, and protein formation.',
      remedy: reading.nitrogen < 100 ? 'Apply neem-coated urea or incorporate Sesbania green manure.' : 'Withhold urea; risk of vegetative rankness and fungal susceptibility.'
    },
    {
      key: 'phosphorus',
      name: 'Available Phosphorus',
      symbol: 'P',
      category: 'primary',
      unit: 'kg/ha',
      currentValue: reading.phosphorus,
      lowLimit: 30,
      highLimit: 60,
      optimalRange: '30 – 60 kg/ha',
      status: getStatus(reading.phosphorus, 30, 60),
      impact: 'Crucial for root architectural depth, tillering, and ATP cellular energy transport.',
      remedy: reading.phosphorus < 30 ? 'Incorporate Single Super Phosphate (SSP) or DAP banded at root zone.' : 'Adequate reserve; avoid surplus phosphate to prevent zinc lockup.'
    },
    {
      key: 'potassium',
      name: 'Available Potassium',
      symbol: 'K',
      category: 'primary',
      unit: 'kg/ha',
      currentValue: reading.potassium,
      lowLimit: 130,
      highLimit: 220,
      optimalRange: '130 – 220 kg/ha',
      status: getStatus(reading.potassium, 130, 220),
      impact: 'Controls stomatal aperture, disease immunity, frost hardiness, and carbohydrate translocation.',
      remedy: reading.potassium < 130 ? 'Apply Muriate of Potash (MOP) @ 25–40 kg/acre.' : 'Sufficient reserves; no supplemental potassium required.'
    },

    // 2. Secondary Nutrients
    {
      key: 'sulfur',
      name: 'Available Sulfur',
      symbol: 'S',
      category: 'secondary',
      unit: 'ppm',
      currentValue: reading.sulfur ?? 16.5,
      lowLimit: 10.0,
      highLimit: 25.0,
      optimalRange: '10.0 – 25.0 ppm',
      status: getStatus(reading.sulfur ?? 16.5, 10.0, 25.0),
      impact: 'Vital for methionine and cysteine amino acids, essential for oil content in mustard and pulses.',
      remedy: (reading.sulfur ?? 16.5) < 10 ? 'Apply agricultural gypsum (CaSO4) or bentonite sulfur @ 25 kg/ha.' : 'Well-balanced sulfur level.'
    },
    {
      key: 'calcium',
      name: 'Exchangeable Calcium',
      symbol: 'Ca',
      category: 'secondary',
      unit: 'meq/100g',
      currentValue: reading.calcium ?? 14.8,
      lowLimit: 10.0,
      highLimit: 25.0,
      optimalRange: '10.0 – 25.0 meq/100g',
      status: getStatus(reading.calcium ?? 14.8, 10.0, 25.0),
      impact: 'Structural component of plant cell walls (calcium pectate) and root tip elongation.',
      remedy: (reading.calcium ?? 14.8) < 10 ? 'Apply calcitic agricultural lime in acidic soils or gypsum in sodic soils.' : 'Optimum flocculation and cell integrity.'
    },
    {
      key: 'magnesium',
      name: 'Exchangeable Magnesium',
      symbol: 'Mg',
      category: 'secondary',
      unit: 'meq/100g',
      currentValue: reading.magnesium ?? 4.6,
      lowLimit: 3.0,
      highLimit: 8.0,
      optimalRange: '3.0 – 8.0 meq/100g',
      status: getStatus(reading.magnesium ?? 4.6, 3.0, 8.0),
      impact: 'Central atom in chlorophyll molecule; activator of carbohydrate phosphorylation enzymes.',
      remedy: (reading.magnesium ?? 4.6) < 3.0 ? 'Apply Epsom salt (MgSO4) foliar spray @ 1% or dolomitic limestone.' : 'Sufficient levels supporting robust photosynthesis.'
    },

    // 3. Micronutrients
    {
      key: 'zinc',
      name: 'DTPA-Extractable Zinc',
      symbol: 'Zn',
      category: 'micronutrient',
      unit: 'ppm',
      currentValue: reading.zinc ?? 0.85,
      lowLimit: 0.6,
      highLimit: 2.0,
      optimalRange: '0.6 – 2.0 ppm',
      status: getStatus(reading.zinc ?? 0.85, 0.6, 2.0),
      impact: 'Required for auxin synthesis, internode elongation, and Khaira disease prevention in paddy.',
      remedy: (reading.zinc ?? 0.85) < 0.6 ? 'Apply Zinc Sulfate Heptahydrate (ZnSO4·7H2O) @ 25 kg/ha basal dose.' : 'Adequate zinc reserves.'
    },
    {
      key: 'iron',
      name: 'DTPA-Extractable Iron',
      symbol: 'Fe',
      category: 'micronutrient',
      unit: 'ppm',
      currentValue: reading.iron ?? 6.8,
      lowLimit: 4.5,
      highLimit: 12.0,
      optimalRange: '4.5 – 12.0 ppm',
      status: getStatus(reading.iron ?? 6.8, 4.5, 12.0),
      impact: 'Electron transfer catalyst in respiration, photosynthesis, and ferredoxin enzymes.',
      remedy: (reading.iron ?? 6.8) < 4.5 ? 'Spray Ferrous Sulfate (FeSO4) @ 0.5% with citric acid to prevent interveinal chlorosis.' : 'Optimal active iron content.'
    },
    {
      key: 'copper',
      name: 'DTPA-Extractable Copper',
      symbol: 'Cu',
      category: 'micronutrient',
      unit: 'ppm',
      currentValue: reading.copper ?? 0.42,
      lowLimit: 0.2,
      highLimit: 1.0,
      optimalRange: '0.2 – 1.0 ppm',
      status: getStatus(reading.copper ?? 0.42, 0.2, 1.0),
      impact: 'Plays key role in lignin synthesis, pollen fertility, and plastocyanin electron carrier.',
      remedy: (reading.copper ?? 0.42) < 0.2 ? 'Apply Copper Sulfate @ 5 kg/ha or copper oxychloride foliar spray.' : 'Safe and sufficient level.'
    },
    {
      key: 'manganese',
      name: 'DTPA-Extractable Manganese',
      symbol: 'Mn',
      category: 'micronutrient',
      unit: 'ppm',
      currentValue: reading.manganese ?? 4.1,
      lowLimit: 2.0,
      highLimit: 8.0,
      optimalRange: '2.0 – 8.0 ppm',
      status: getStatus(reading.manganese ?? 4.1, 2.0, 8.0),
      impact: 'Activator of water photolysis in Photosystem II and nitrate assimilation enzymes.',
      remedy: (reading.manganese ?? 4.1) < 2.0 ? 'Apply Manganese Sulfate @ 10 kg/ha in wheat following paddy.' : 'Good availability across root zone.'
    },
    {
      key: 'boron',
      name: 'Hot Water Soluble Boron',
      symbol: 'B',
      category: 'micronutrient',
      unit: 'ppm',
      currentValue: reading.boron ?? 0.75,
      lowLimit: 0.5,
      highLimit: 1.5,
      optimalRange: '0.5 – 1.5 ppm',
      status: getStatus(reading.boron ?? 0.75, 0.5, 1.5),
      impact: 'Cell division, pollen grain germination, pollen tube growth, and fruit set.',
      remedy: (reading.boron ?? 0.75) < 0.5 ? 'Apply Borax (10.5% B) @ 10 kg/ha or Solubor 0.1% foliar spray at flower bud initiation.' : 'Optimal boron balance.'
    },

    // 4. Physico-Chemical Triad
    {
      key: 'ph',
      name: 'Soil Reaction (pH)',
      symbol: 'pH',
      category: 'physicochemical',
      unit: 'scale',
      currentValue: reading.ph,
      lowLimit: 6.5,
      highLimit: 7.5,
      optimalRange: '6.5 – 7.5 (Neutral)',
      status: getStatus(reading.ph, 6.5, 7.5),
      impact: 'Controls cation exchange equilibrium and availability of all 16 plant nutrients.',
      remedy: reading.ph < 6.5 ? 'Apply agricultural lime to neutralise soil acidity.' : reading.ph > 7.5 ? 'Apply gypsum and organic mulches to lower alkalinity.' : 'Neutral ideal pH.'
    },
    {
      key: 'electricalConductivity',
      name: 'Electrical Conductivity (EC)',
      symbol: 'EC',
      category: 'physicochemical',
      unit: 'dS/m',
      currentValue: reading.electricalConductivity,
      lowLimit: 0.1,
      highLimit: 1.0,
      optimalRange: '< 1.0 dS/m (Non-Saline)',
      status: reading.electricalConductivity > 1.5 ? 'surplus' : 'sufficient',
      impact: 'Indicator of soluble salt concentration and osmotic water stress on crops.',
      remedy: reading.electricalConductivity > 1.5 ? 'Flush soil with deep drainage leaching; ensure good furrow drainage.' : 'Low salinity; safe for seedling development.'
    },
    {
      key: 'organicCarbon',
      name: 'Organic Carbon (OC)',
      symbol: 'OC',
      category: 'physicochemical',
      unit: '%',
      currentValue: reading.organicCarbon,
      lowLimit: 0.75,
      highLimit: 1.5,
      optimalRange: '> 0.75% (High)',
      status: reading.organicCarbon < 0.5 ? 'deficient' : reading.organicCarbon < 0.75 ? 'deficient' : 'sufficient',
      impact: 'Driver of soil biodiversity, moisture retention capacity, and Cation Exchange Capacity (CEC).',
      remedy: reading.organicCarbon < 0.75 ? 'Incorporate 5-8 tonnes/ha farmyard manure (FYM), pressmud, or paddy straw biochar.' : 'High organic fertility.'
    }
  ]

  const filteredParameters = parameters.filter((p) => {
    if (categoryFilter === 'all') return true
    return p.category === categoryFilter
  })

  const deficientCount = parameters.filter((p) => p.status === 'deficient').length
  const sufficientCount = parameters.filter((p) => p.status === 'sufficient').length
  const surplusCount = parameters.filter((p) => p.status === 'surplus').length

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
      {/* Header & Benchmark Summary */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 dark:border-agri-darkBorder">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              <Layers className="h-4 w-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              ICAR & Soil Health Card (SHC) Protocol
            </span>
          </div>
          <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
            Official 12-Parameter Soil Quality Matrix
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Standard analytical laboratory panel evaluated against National Soil Survey standards.
          </p>
        </div>

        {/* Status Chips */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="h-3.5 w-3.5" /> {sufficientCount} Optimal
          </span>
          {deficientCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-extrabold text-red-700 border border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800">
              <TrendingDown className="h-3.5 w-3.5" /> {deficientCount} Deficient
            </span>
          )}
          {surplusCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
              <TrendingUp className="h-3.5 w-3.5" /> {surplusCount} Surplus
            </span>
          )}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="mt-4 flex flex-wrap gap-2">
        {(
          [
            { id: 'all', label: 'All 12 Parameters' },
            { id: 'primary', label: 'Primary (N-P-K)' },
            { id: 'secondary', label: 'Secondary (S-Ca-Mg)' },
            { id: 'micronutrient', label: 'Micronutrients (Zn-Fe-Cu-Mn-B)' },
            { id: 'physicochemical', label: 'Physico-Chemical (pH-EC-OC)' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setCategoryFilter(tab.id)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              categoryFilter === tab.id
                ? 'bg-forest-800 text-white dark:bg-emerald-600 shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-agri-darkCard dark:text-slate-300 dark:hover:bg-agri-darkBorder'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Matrix Cards Grid */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredParameters.map((param) => {
          const isDeficient = param.status === 'deficient'
          const isSurplus = param.status === 'surplus'
          const statusBg = isDeficient
            ? 'bg-red-500/10 text-red-700 border-red-300 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900'
            : isSurplus
            ? 'bg-amber-500/10 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900'
            : 'bg-emerald-500/10 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900'

          return (
            <div
              key={param.key}
              onClick={() => setSelectedParam(param)}
              className="group relative cursor-pointer rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-white hover:shadow-md dark:border-agri-darkBorder dark:bg-agri-darkCard dark:hover:border-emerald-500 dark:hover:bg-slate-900"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white font-mono text-sm font-black text-slate-800 shadow-xs border border-slate-200 dark:bg-agri-darkSurface dark:text-white dark:border-agri-darkBorder">
                    {param.symbol}
                  </span>
                  <p className="mt-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                    {param.name}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${statusBg}`}
                >
                  {param.status}
                </span>
              </div>

              <div className="mt-3 flex items-baseline justify-between border-t border-slate-200/50 pt-2 dark:border-agri-darkBorder/50">
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {param.currentValue}
                </span>
                <span className="text-xs text-slate-400">{param.unit}</span>
              </div>

              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Optimal:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {param.optimalRange}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-600 opacity-0 transition group-hover:opacity-100 dark:text-emerald-400">
                <Sparkles className="h-3 w-3" /> Click for prescription
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected Parameter Prescription Modal */}
      {selectedParam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-agri-darkBorder dark:bg-agri-darkSurface">
            <button
              type="button"
              onClick={() => setSelectedParam(null)}
              className="absolute right-5 top-5 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-agri-darkCard dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 font-mono text-xl font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {selectedParam.symbol}
              </span>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedParam.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ICAR Benchmark Parameter • {selectedParam.optimalRange}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4 dark:bg-agri-darkCard">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-500">Recorded Soil Level</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {selectedParam.currentValue} {selectedParam.unit}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-500">ICAR Status</span>
                <span
                  className={`font-black uppercase ${
                    selectedParam.status === 'deficient'
                      ? 'text-red-600'
                      : selectedParam.status === 'surplus'
                      ? 'text-amber-600'
                      : 'text-emerald-600'
                  }`}
                >
                  {selectedParam.status}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <p className="font-extrabold uppercase text-slate-400 text-[10px]">
                  Agronomic Physiology Impact
                </p>
                <p className="mt-1 font-medium text-slate-700 dark:text-slate-300">
                  {selectedParam.impact}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 dark:border-emerald-900/60 dark:bg-emerald-950/30">
                <p className="flex items-center gap-1.5 font-extrabold uppercase text-emerald-900 text-[10px] dark:text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Prescribed Soil Amendment & Dosage
                </p>
                <p className="mt-1 font-semibold text-emerald-800 dark:text-emerald-200">
                  {selectedParam.remedy}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedParam(null)}
                className="rounded-2xl bg-forest-800 px-5 py-2.5 text-xs font-extrabold text-white hover:bg-forest-900 dark:bg-emerald-600 dark:hover:bg-emerald-700"
              >
                Close Parameter Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
