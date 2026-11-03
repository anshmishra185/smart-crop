import { useState } from 'react'
import {
  AlertTriangle,
  Droplets,
  Sparkles,
} from 'lucide-react'
import type { PrecisionWaterMetrics } from '../../types'

interface WaterFootprintComparatorProps {
  metrics: PrecisionWaterMetrics
  cropName: string
}

export function WaterFootprintComparator({ metrics, cropName }: WaterFootprintComparatorProps) {
  const [method, setMethod] = useState<'flood' | 'drip'>('drip')

  const isDrip = method === 'drip'
  const effectiveWaterReq = isDrip
    ? Math.round(metrics.waterReqMm * (1 - metrics.dripSavingsPct / 100))
    : metrics.waterReqMm
  const effectivePumpingHours = isDrip
    ? Math.round(metrics.pumpingHoursPerAcre * (1 - metrics.dripSavingsPct / 100))
    : metrics.pumpingHoursPerAcre

  const tierColors = {
    Low: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300',
    Moderate: 'text-amber-700 bg-amber-100 dark:bg-amber-950 dark:text-amber-300',
    High: 'text-red-700 bg-red-100 dark:bg-red-950 dark:text-red-300',
  }

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 dark:border-agri-darkBorder">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <Droplets className="h-4 w-4" />
          </span>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              Water Footprint & Irrigation Efficiency Comparator
            </h4>
            <p className="text-[11px] text-slate-500">
              Crop water demand (mm) and power requirement for {cropName} comparing flooding vs precision micro-drip
            </p>
          </div>
        </div>

        {/* Consumption Tier Badge */}
        <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${tierColors[metrics.consumptionTier]}`}>
          {metrics.consumptionTier} Water Footprint
        </span>
      </div>

      {/* Groundwater Depletion Warning if applicable */}
      {metrics.groundwaterAlert && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-300 bg-amber-50/90 p-3.5 text-xs text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <p className="font-semibold leading-relaxed">
            {metrics.groundwaterAlert}
          </p>
        </div>
      )}

      {/* Flood vs Drip Switcher */}
      <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-2 dark:bg-agri-darkCard border border-slate-200/70 dark:border-agri-darkBorder">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
          Select Delivery Method:
        </span>
        <div className="flex items-center rounded-xl bg-slate-200/70 p-1 dark:bg-agri-darkSurface">
          <button
            type="button"
            onClick={() => setMethod('flood')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              !isDrip
                ? 'bg-white text-slate-900 shadow-xs dark:bg-emerald-600 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            Conventional Flood / Basin
          </button>
          <button
            type="button"
            onClick={() => setMethod('drip')}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              isDrip
                ? 'bg-forest-800 text-white shadow-xs dark:bg-emerald-600'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <Sparkles className="h-3 w-3 text-amber-400" />
            Precision Micro-Drip / Sprinkler
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Crop Water Demand</span>
          <p className="mt-1 text-base font-black text-blue-600 dark:text-blue-400 font-mono">
            {effectiveWaterReq} <span className="text-xs font-normal text-slate-500">mm</span>
          </p>
          <span className="text-[10px] text-slate-400 font-mono">
            {isDrip ? `Saved ${metrics.waterReqMm - effectiveWaterReq} mm` : 'Base Requirement'}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Pumping Duration</span>
          <p className="mt-1 text-base font-black text-amber-600 dark:text-amber-400 font-mono">
            {effectivePumpingHours} <span className="text-xs font-normal text-slate-500">Hrs / Acre</span>
          </p>
          <span className="text-[10px] text-slate-400 font-mono">
            {isDrip ? `-${metrics.pumpingHoursPerAcre - effectivePumpingHours} hrs saved` : 'Submersible pump run'}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Water Conserved</span>
          <p className="mt-1 text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {isDrip ? `${metrics.dripSavingsPct}% Saved` : '0% (Standard Baseline)'}
          </p>
          <span className="text-[10px] text-slate-400 font-mono">
            {isDrip ? 'Low evaporation & seepage' : 'High evaporation losses'}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Fertigation Efficiency</span>
          <p className="mt-1 text-base font-black text-purple-600 dark:text-purple-400 font-mono">
            {isDrip ? '+18% Yield Boost' : 'Standard'}
          </p>
          <span className="text-[10px] text-slate-400 font-mono">
            {isDrip ? 'Direct root zone dosing' : 'Broadcast nutrient runoff'}
          </span>
        </div>
      </div>
    </div>
  )
}
