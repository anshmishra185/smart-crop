import { useState, useMemo } from 'react'
import {
  Leaf,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import type { SoilReading } from '../../types'

interface SoilCarbonBiomassTrackerProps {
  reading: SoilReading
}

export function SoilCarbonBiomassTracker({ reading }: SoilCarbonBiomassTrackerProps) {
  const [farmHectares, setFarmHectares] = useState<number>(2.5)
  const [managementPractice, setManagementPractice] = useState<'conventional' | 'reduced_till' | 'regenerative'>('reduced_till')

  // SOM = OC * 1.724 (Van Bemmelen Factor)
  const som = useMemo(() => {
    return parseFloat((reading.organicCarbon * 1.724).toFixed(2))
  }, [reading.organicCarbon])

  // Sequestration potential (t CO2e / ha / year) based on management
  const sequestrationFactor = useMemo(() => {
    if (managementPractice === 'regenerative') return 2.85 // Cover cropping + Biochar + Zero till
    if (managementPractice === 'reduced_till') return 1.65 // Reduced till + Residue retention
    return 0.45 // Conventional till
  }, [managementPractice])

  // Carbon credits valuation
  const carbonMetrics = useMemo(() => {
    const annualCo2ePerHa = sequestrationFactor
    const totalAnnualCo2e = parseFloat((annualCo2ePerHa * farmHectares).toFixed(2))
    const pricePerTonUsd = 30 // Standard Gold Standard / Verra voluntary carbon market price
    const usdPerInr = 85
    const annualRevenueUsd = Math.round(totalAnnualCo2e * pricePerTonUsd)
    const annualRevenueInr = Math.round(annualRevenueUsd * usdPerInr)

    // Fungi to Bacteria (F:B) Ratio
    // Conventional ~ 0.2, Reduced ~ 0.65, Regenerative ~ 1.05
    let fbRatio = 0.65
    if (managementPractice === 'regenerative') fbRatio = 1.10
    else if (managementPractice === 'conventional') fbRatio = 0.25

    // Respiration rate mg CO2-C / kg / day
    const respiration = Math.round(reading.organicCarbon * 38)

    // Earthworm density (burrows / m2)
    const earthworms = Math.round(reading.organicCarbon * 22)

    return {
      annualCo2ePerHa,
      totalAnnualCo2e,
      annualRevenueUsd,
      annualRevenueInr,
      fbRatio,
      respiration,
      earthworms,
    }
  }, [sequestrationFactor, farmHectares, managementPractice, reading.organicCarbon])

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 dark:border-agri-darkBorder">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              <Leaf className="h-4 w-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              Regenerative Soil Biology & Carbon Offset
            </span>
          </div>
          <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
            Soil Organic Matter & Carbon Credit Engine
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Transforms soil organic carbon into Soil Organic Matter (SOM) and estimates voluntary carbon market returns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Verra VM0042 Protocol
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Left: Biological Vitality & SOM Gauges (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                Soil Organic Matter (SOM)
              </span>
              <span className="rounded-full bg-emerald-200 px-2.5 py-0.5 text-[10px] font-black text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
                Van Bemmelen Standard
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-4xl font-black text-emerald-950 dark:text-white">
                {som}%
              </span>
              <span className="text-xs font-bold text-emerald-800/80 dark:text-emerald-300">
                Total Soil Organic Matter
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
              Computed from measured Organic Carbon ({reading.organicCarbon}%) using the official stoichiometric conversion factor (1.724). Every 1% increase in SOM holds up to 20,000 gallons more water per acre.
            </p>
          </div>

          {/* Biological Vitality Metrics */}
          <div className="grid grid-cols-3 gap-3">
            {/* F:B Ratio */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
              <span className="text-[10px] font-bold uppercase text-slate-400">F:B Ratio</span>
              <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                {carbonMetrics.fbRatio}
              </p>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                Fungi to Bacteria
              </span>
            </div>

            {/* Respiration */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
              <span className="text-[10px] font-bold uppercase text-slate-400">Respiration</span>
              <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                {carbonMetrics.respiration}
              </p>
              <span className="text-[10px] text-slate-500">mg CO2/kg/day</span>
            </div>

            {/* Earthworms */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
              <span className="text-[10px] font-bold uppercase text-slate-400">Earthworms</span>
              <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                ~{carbonMetrics.earthworms}
              </p>
              <span className="text-[10px] text-slate-500">burrows / m²</span>
            </div>
          </div>
        </div>

        {/* Right: Carbon Sequestration & Credit Monetization (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-agri-darkBorder">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
                Carbon Sequestration Scenario
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {carbonMetrics.annualCo2ePerHa} t CO₂e / ha / yr
              </span>
            </div>

            {/* Management Practice Selector */}
            <div className="mt-3">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Regenerative Farm Practice
              </label>
              <div className="mt-1.5 grid grid-cols-3 gap-2">
                {[
                  { id: 'conventional', label: 'Conventional Till' },
                  { id: 'reduced_till', label: 'Zero Till / Residue' },
                  { id: 'regenerative', label: 'Cover Crop + Biochar' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setManagementPractice(p.id as any)}
                    className={`rounded-xl px-2.5 py-2 text-[11px] font-extrabold transition ${
                      managementPractice === p.id
                        ? 'bg-forest-800 text-white dark:bg-emerald-600 shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-agri-darkSurface dark:text-slate-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Farm Area Slider */}
            <div className="mt-4">
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                <span>Enrolled Farmland Size</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  {farmHectares} Hectares ({(farmHectares * 2.47).toFixed(1)} Acres)
                </span>
              </div>
              <input
                type="range"
                min={0.5}
                max={20}
                step={0.5}
                value={farmHectares}
                onChange={(e) => setFarmHectares(Number(e.target.value))}
                className="mt-2 w-full accent-emerald-600"
              />
            </div>

            {/* Monetization Value Card */}
            <div className="mt-5 rounded-2xl bg-linear-to-br from-emerald-600 to-forest-800 p-4 text-white shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200">
                  Annual Carbon Credit Payout
                </span>
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-black">
                    ₹{carbonMetrics.annualRevenueInr.toLocaleString('en-IN')}
                  </span>
                  <span className="ml-1.5 text-xs font-bold text-emerald-200">
                    / year (${carbonMetrics.annualRevenueUsd})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black">
                    {carbonMetrics.totalAnnualCo2e}
                  </span>
                  <span className="ml-1 text-[11px] text-emerald-200 font-semibold">
                    tonnes CO₂e
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
