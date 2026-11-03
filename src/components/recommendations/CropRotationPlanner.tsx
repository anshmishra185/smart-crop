import { useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Leaf,
  RefreshCw,
  Sparkles,
  Zap,
} from 'lucide-react'

interface RotationPattern {
  id: string
  label: string
  prevCrop: string
  targetCrop: string
  aquiferImpact: 'Severe Depletion' | 'Moderate / Balanced' | 'Groundwater Recharging'
  nitrogenCreditKg: number
  ureaBagsSaved: number
  soilHealthGain: string
  recommendation: string
}

const ROTATION_PATTERNS: RotationPattern[] = [
  {
    id: 'paddy-wheat',
    label: 'Traditional Puddle Paddy → Wheat Monoculture',
    prevCrop: 'Late-Maturing Puddle Rice (PUSA-44)',
    targetCrop: 'Wheat (HD-3086)',
    aquiferImpact: 'Severe Depletion',
    nitrogenCreditKg: 0,
    ureaBagsSaved: 0,
    soilHealthGain: 'Hardpan compaction at 15-20cm; straw burning residue issue.',
    recommendation: 'Replace PUSA-44 with PR-126 or Direct Seeded Rice (DSR) to conserve 25-30% groundwater and allow timely wheat seeding.',
  },
  {
    id: 'moong-wheat',
    label: 'Summer Moong (Green Gram) → Basmati / Wheat (Recommended)',
    prevCrop: 'Summer Mungbean (SML-1827)',
    targetCrop: 'Wheat / Pusa Basmati',
    aquiferImpact: 'Moderate / Balanced',
    nitrogenCreditKg: 32,
    ureaBagsSaved: 1.5,
    soilHealthGain: 'Rhizobial root nodulation fixes organic nitrogen; boosts subsequent wheat tillering by +12%.',
    recommendation: 'Incorporate mungbean residue 10 days before sowing to enrich soil organic carbon by +0.15%.',
  },
  {
    id: 'maize-wheat',
    label: 'Kharif Maize (Corn) → Wheat / Potato Rotation',
    prevCrop: 'Kharif Hybrid Maize (PMH-1)',
    targetCrop: 'Wheat (PBW-826)',
    aquiferImpact: 'Moderate / Balanced',
    nitrogenCreditKg: 10,
    ureaBagsSaved: 0.5,
    soilHealthGain: 'Deep root penetration breaks plough pan; reduces root-knot nematode load.',
    recommendation: 'Excellent water-saving alternative saving ~70% irrigation hours compared to flood paddy.',
  },
  {
    id: 'cotton-wheat',
    label: 'Bt Cotton → Late-Sown Wheat / Mustard',
    prevCrop: 'Bt Cotton (RCH-659)',
    targetCrop: 'Late Wheat (PBW-771) / Mustard',
    aquiferImpact: 'Moderate / Balanced',
    nitrogenCreditKg: 8,
    ureaBagsSaved: 0.4,
    soilHealthGain: 'Foliar leaf drop provides organic mulch; deep taproot extracts subsoil potassium.',
    recommendation: 'Shred cotton sticks with mulcher to return organic matter instead of burning.',
  },
]

export function CropRotationPlanner() {
  const [selectedPatternId, setSelectedPatternId] = useState<string>('moong-wheat')

  const activePattern = ROTATION_PATTERNS.find((p) => p.id === selectedPatternId) || ROTATION_PATTERNS[0]
  const isSevere = activePattern.aquiferImpact === 'Severe Depletion'

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 dark:border-agri-darkBorder">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
            <RefreshCw className="h-4 w-4" />
          </span>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              Sustainable Crop Rotation & Legume Nitrogen Sequencer
            </h4>
            <p className="text-[11px] text-slate-500">
              Evaluates cropping sequence, breaks pest/weed cycles, and calculates biological nitrogen credits
            </p>
          </div>
        </div>

        <span className="rounded-full bg-forest-50 px-3 py-1 text-xs font-black text-forest-800 dark:bg-emerald-950 dark:text-emerald-300">
          ICAR Diversification Advisory
        </span>
      </div>

      {/* Selector Dropdown */}
      <div>
        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
          Select Crop Rotation Sequence:
        </label>
        <select
          value={selectedPatternId}
          onChange={(e) => setSelectedPatternId(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-200 outline-none focus:border-emerald-500"
        >
          {ROTATION_PATTERNS.map((pattern) => (
            <option key={pattern.id} value={pattern.id}>
              {pattern.label}
            </option>
          ))}
        </select>
      </div>

      {/* Rotation Telemetry Grid */}
      <div className="grid gap-3 sm:grid-cols-3 text-xs">
        {/* Aquifer Impact */}
        <div className={`rounded-2xl border p-3.5 ${
          isSevere
            ? 'border-red-200 bg-red-50/80 dark:border-red-950 dark:bg-red-950/30'
            : 'border-emerald-200 bg-emerald-50/80 dark:border-emerald-950 dark:bg-emerald-950/30'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-500">Groundwater Impact</span>
            {isSevere ? (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            ) : (
              <Droplets className="h-4 w-4 text-emerald-600" />
            )}
          </div>
          <p className={`mt-1 text-sm font-black ${isSevere ? 'text-red-700 dark:text-red-300' : 'text-emerald-800 dark:text-emerald-300'}`}>
            {activePattern.aquiferImpact}
          </p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            {isSevere ? 'Drawdown exceeds annual recharge' : 'Safe hydrological balance'}
          </span>
        </div>

        {/* Biological Nitrogen Credit */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-400">Biological N-Fixation</span>
            <Leaf className="h-4 w-4 text-forest-700 dark:text-emerald-400" />
          </div>
          <p className="mt-1 text-sm font-black text-forest-800 dark:text-emerald-400 font-mono">
            +{activePattern.nitrogenCreditKg} kg N/ha
          </p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            Rhizobial bio-fertilizer credit
          </span>
        </div>

        {/* Commercial Fertilizer Bags Saved */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-400">Urea Bag Savings</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-1 text-sm font-black text-amber-700 dark:text-amber-300 font-mono">
            {activePattern.ureaBagsSaved} Bags / Acre
          </p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            ₹{Math.round(activePattern.ureaBagsSaved * 270)} saved / acre in subsidy
          </span>
        </div>
      </div>

      {/* Agronomic Recommendation Details */}
      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-agri-darkCard border border-slate-200/70 dark:border-agri-darkBorder space-y-2">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            <strong>Soil Health Effect:</strong> {activePattern.soilHealthGain}
          </p>
        </div>
        <div className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            <strong>Agronomist Action:</strong> {activePattern.recommendation}
          </p>
        </div>
      </div>
    </div>
  )
}

