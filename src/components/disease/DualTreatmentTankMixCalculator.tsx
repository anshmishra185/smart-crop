import { useState, useMemo } from 'react'
import {
  Beaker,
  Clock,
  FlaskConical,
  Leaf,
  Shield,
} from 'lucide-react'
import type { DiseaseDetectionResult } from '../../types'

interface DualTreatmentTankMixCalculatorProps {
  result: DiseaseDetectionResult
}

export function DualTreatmentTankMixCalculator({ result }: DualTreatmentTankMixCalculatorProps) {
  const [treatmentType, setTreatmentType] = useState<'chemical' | 'organic'>('chemical')
  const [tankVolumeLiters, setTankVolumeLiters] = useState<number>(15) // Default 15L backpack sprayer
  const [selectedProductIndex, setSelectedProductIndex] = useState<number>(0)

  // Default fallback catalog if case doesn't specify custom tank mix
  const defaultChemical = [
    { name: 'Mancozeb 75% WP', dosePerLiter: 2.5, unit: 'g/L', activeIngredient: 'Mancozeb 75% w/w Contact Protectant', phiDays: 7, reiHours: 24 },
    { name: 'Chlorothalonil 75% WP', dosePerLiter: 2.0, unit: 'g/L', activeIngredient: 'Broad-Spectrum Multi-Site Chlorothalonil', phiDays: 5, reiHours: 12 },
    { name: 'Azoxystrobin 23% SC', dosePerLiter: 1.0, unit: 'mL/L', activeIngredient: 'Strobilurin Systemic QoI Inhibitor', phiDays: 3, reiHours: 12 },
  ]

  const defaultOrganic = [
    { name: 'Copper Oxychloride 50% WP', dosePerLiter: 3.0, unit: 'g/L', activeIngredient: 'Bordeaux Mixture Alternate (Metallic Cu 50%)' },
    { name: 'Trichoderma viride 1.5% WP', dosePerLiter: 5.0, unit: 'g/L', activeIngredient: 'Trichoderma antagonistic fungus (2x10^6 CFU/g)' },
    { name: 'Cold-Pressed Neem Oil (10,000 ppm)', dosePerLiter: 4.0, unit: 'mL/L', activeIngredient: 'Azadirachtin Botanical Antifeedant' },
  ]

  const activeChemicalList = result.tankMixRecommendations?.chemical || defaultChemical
  const activeOrganicList = result.tankMixRecommendations?.organic || defaultOrganic

  const activeProducts = treatmentType === 'chemical' ? activeChemicalList : activeOrganicList
  const selectedProduct = activeProducts[selectedProductIndex] || activeProducts[0]

  // Total dosage required for the selected tank volume
  const totalDose = useMemo(() => {
    return Math.round(selectedProduct.dosePerLiter * tankVolumeLiters * 10) / 10
  }, [selectedProduct, tankVolumeLiters])

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 dark:border-agri-darkBorder">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <FlaskConical className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Dual Treatment Prescription & Sprayer Tank-Mix Calculator
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Switch between synthetic chemistry and certified organic bio-control with exact backpack dosage calculations.
            </p>
          </div>
        </div>

        {/* Treatment Mode Toggle */}
        <div className="flex items-center rounded-2xl bg-slate-100 p-1 dark:bg-agri-darkCard">
          <button
            type="button"
            onClick={() => {
              setTreatmentType('chemical')
              setSelectedProductIndex(0)
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-extrabold transition ${
              treatmentType === 'chemical'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <FlaskConical className="h-3.5 w-3.5" />
            Conventional Agrochemical
          </button>
          <button
            type="button"
            onClick={() => {
              setTreatmentType('organic')
              setSelectedProductIndex(0)
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-extrabold transition ${
              treatmentType === 'organic'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Leaf className="h-3.5 w-3.5" />
            Certified Organic Bio-Control
          </button>
        </div>
      </div>

      {/* Product Selection Chips */}
      <div className="flex flex-wrap gap-2">
        {activeProducts.map((prod, idx) => (
          <button
            key={prod.name}
            type="button"
            onClick={() => setSelectedProductIndex(idx)}
            className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition ${
              selectedProductIndex === idx
                ? treatmentType === 'chemical'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-agri-darkCard dark:text-slate-300 border border-slate-200 dark:border-agri-darkBorder'
            }`}
          >
            {prod.name}
          </button>
        ))}
      </div>

      {/* Tank Mix Calculator Controls */}
      <div className="grid gap-6 md:grid-cols-12 items-center pt-2">
        {/* Left: Sprayer Tank Volume Slider (6 cols) */}
        <div className="md:col-span-6 space-y-3 rounded-2xl bg-slate-50 p-4 dark:bg-agri-darkCard">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Sprayer Tank Water Volume</span>
            <span className="font-black text-emerald-600 dark:text-emerald-400">
              {tankVolumeLiters} Liters
            </span>
          </div>

          <input
            type="range"
            min="5"
            max="200"
            step="5"
            value={tankVolumeLiters}
            onChange={(e) => setTankVolumeLiters(Number(e.target.value))}
            className="w-full accent-emerald-600"
          />

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              { label: '15L (Knapsack Backpack)', val: 15 },
              { label: '25L (Power Sprayer)', val: 25 },
              { label: '50L (Battery Barrel)', val: 50 },
              { label: '200L (Tractor Tank)', val: 200 },
            ].map((preset) => (
              <button
                key={preset.val}
                type="button"
                onClick={() => setTankVolumeLiters(preset.val)}
                className={`rounded-lg px-2 py-1 text-[10px] font-bold transition ${
                  tankVolumeLiters === preset.val
                    ? 'bg-slate-800 text-white dark:bg-emerald-600'
                    : 'bg-white text-slate-600 hover:bg-slate-200 dark:bg-agri-darkSurface dark:text-slate-300 border border-slate-200 dark:border-agri-darkBorder'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <p className="text-[10px] text-slate-400">
            Active Ingredient: {selectedProduct.activeIngredient}
          </p>
        </div>

        {/* Right: Calculated Dosage Outcome (6 cols) */}
        <div className="md:col-span-6 space-y-3">
          <div
            className={`rounded-2xl p-5 text-white shadow-md ${
              treatmentType === 'chemical'
                ? 'bg-linear-to-br from-blue-600 to-indigo-800'
                : 'bg-linear-to-br from-emerald-600 to-forest-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-200">
                Required Tank Dosage
              </span>
              <Beaker className="h-4 w-4 text-slate-200" />
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-black">{totalDose}</span>
              <span className="text-sm font-bold text-slate-100">
                {selectedProduct.unit.includes('mL') ? 'milliliters (mL)' : 'grams (g)'}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-200 font-semibold">
              Mix with {tankVolumeLiters} Liters clean water (@ {selectedProduct.dosePerLiter} {selectedProduct.unit})
            </p>

            {/* Chemical Spray Safety Thresholds */}
            {'phiDays' in selectedProduct && (
              <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3 text-[11px] font-bold text-slate-100">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> PHI: {(selectedProduct as any).phiDays} Days Withholding
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" /> REI: {(selectedProduct as any).reiHours}h Re-Entry
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
