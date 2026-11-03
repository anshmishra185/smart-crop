import { useState } from 'react'
import {
  AlertTriangle,
  Coins,
} from 'lucide-react'

export function EconomicThresholdDamage() {
  const [currentSeverityPct, setCurrentSeverityPct] = useState<number>(14.8)

  const etlThreshold = 8.0 // Economic Threshold Level (% foliar lesion coverage)
  const eilThreshold = 18.0 // Economic Injury Level

  const isAboveEtl = currentSeverityPct >= etlThreshold
  const isAboveEil = currentSeverityPct >= eilThreshold

  // Estate economic calculations across 2,402 acres (assuming 380 affected acres)
  const affectedAcres = 380
  const baselineYieldQuintals = 22.5
  const yieldLossPct = Number((currentSeverityPct * 0.85).toFixed(1))
  const lostQuintalsPerAcre = Number(((baselineYieldQuintals * yieldLossPct) / 100).toFixed(1))
  const mandiRate = 2275 // Rs per quintal

  const totalPotentialLoss = Math.round(affectedAcres * lostQuintalsPerAcre * mandiRate)
  const sprayCostPerAcre = 850
  const totalSprayCost = affectedAcres * sprayCostPerAcre
  const avoidedLossNet = totalPotentialLoss - totalSprayCost
  const bcr = Number((totalPotentialLoss / totalSprayCost).toFixed(1))

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 dark:border-agri-darkBorder">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            <Coins className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Economic Threshold Level (ETL) & Pre-Harvest Yield Loss Telemetry
            </h3>
            <p className="text-[11px] text-slate-500">
              Evaluates whether pathogen density justifies chemical intervention cost against potential harvest loss
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-black ${
            isAboveEil
              ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
              : isAboveEtl
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
          }`}>
            {isAboveEil ? 'Breached EIL (Severe Loss)' : isAboveEtl ? 'Breached ETL (Spray Warranted)' : 'Below ETL (Safe)'}
          </span>
        </div>
      </div>

      {/* Severity Gauge Slider */}
      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-agri-darkCard border border-slate-200/70 dark:border-agri-darkBorder">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>Canopy Foliar Necrosis Severity</span>
          <span className="text-base font-black text-slate-900 dark:text-white font-mono">
            {currentSeverityPct}% Affected Foliage
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="30"
          step="0.5"
          value={currentSeverityPct}
          onChange={(e) => setCurrentSeverityPct(Number(e.target.value))}
          className="mt-2.5 w-full accent-amber-600"
        />
        <div className="mt-1 flex justify-between text-[10px] text-slate-400 font-mono">
          <span>1% (Clean)</span>
          <span className="text-amber-600 font-bold">8% ETL (Action Threshold)</span>
          <span className="text-red-600 font-bold">18% EIL (Economic Injury)</span>
          <span>30% (Severe Blight)</span>
        </div>
      </div>

      {/* Economic Impact Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Yield Loss If Untreated</span>
          <p className="mt-1 text-lg font-black text-red-600 dark:text-red-400 font-mono">
            -{yieldLossPct}%
          </p>
          <span className="text-[10px] text-slate-400 font-mono">
            -{lostQuintalsPerAcre} q/acre loss
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Potential Damage</span>
          <p className="mt-1 text-lg font-black text-red-600 dark:text-red-400 font-mono">
            ₹{totalPotentialLoss.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-400">
            Across {affectedAcres} affected acres
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Chemical Spray Investment</span>
          <p className="mt-1 text-lg font-black text-slate-900 dark:text-white font-mono">
            ₹{totalSprayCost.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-400">
            ₹{sprayCostPerAcre}/acre material + labor
          </span>
        </div>

        <div className="rounded-2xl border border-emerald-300 bg-emerald-50/70 p-3.5 dark:border-emerald-950 dark:bg-emerald-950/30">
          <span className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-300 block">
            Net Economic Loss Avoided
          </span>
          <p className="mt-1 text-lg font-black text-emerald-800 dark:text-emerald-300 font-mono">
            ₹{avoidedLossNet.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
            Benefit-to-Cost: {bcr}x ROI
          </span>
        </div>
      </div>

      {/* Decision Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-amber-50/80 p-3.5 text-xs text-amber-950 dark:bg-amber-950/30 dark:text-amber-200 border border-amber-200 dark:border-amber-900">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="font-semibold">
            {isAboveEtl
              ? 'Recommendation: Pathogen level has exceeded ETL (8%). Spraying will protect ₹' + avoidedLossNet.toLocaleString('en-IN') + ' in net harvest revenue.'
              : 'Recommendation: Severity is below Economic Threshold (8%). Maintain biological and cultural monitoring; chemical spray is not economically justified.'}
          </span>
        </div>
      </div>
    </div>
  )
}
