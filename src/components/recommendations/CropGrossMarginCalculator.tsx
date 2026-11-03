import { useState } from 'react'
import {
  CircleDollarSign,
  Coins,
  Layers,
  TrendingUp,
} from 'lucide-react'
import type { PrecisionEconomicMetrics } from '../../types'

interface CropGrossMarginCalculatorProps {
  metrics: PrecisionEconomicMetrics
  cropName: string
}

export function CropGrossMarginCalculator({ metrics, cropName }: CropGrossMarginCalculatorProps) {
  const [acres, setAcres] = useState<number>(5)

  const totalYieldQuintals = Number((metrics.targetYieldQuintalsPerAcre * acres).toFixed(1))
  const totalGrossRevenue = metrics.grossRevenuePerAcre * acres
  const totalCostOfCultivation = metrics.costOfCultivationPerAcre * acres
  const totalNetProfit = metrics.netProfitPerAcre * acres

  const isAboveMsp = metrics.mandiPricePerQuintal >= metrics.mspPricePerQuintal
  const priceDeltaPct = Number(
    (((metrics.mandiPricePerQuintal - metrics.mspPricePerQuintal) / metrics.mspPricePerQuintal) * 100).toFixed(1)
  )

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 dark:border-agri-darkBorder">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            <Coins className="h-4 w-4" />
          </span>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              Economic Gross Margin & Farm ROI Calculator
            </h4>
            <p className="text-[11px] text-slate-500">
              Estimated financial returns for {cropName} based on Punjab APMC Mandi rates & CACP A2+FL cost norms
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-black ${
              isAboveMsp
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}
          >
            <TrendingUp className="h-3 w-3" />
            {isAboveMsp ? `+${priceDeltaPct}% over MSP` : `${priceDeltaPct}% below MSP`}
          </span>
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-black text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            BCR: {metrics.benefitCostRatio}x
          </span>
        </div>
      </div>

      {/* Acreage Slider */}
      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-agri-darkCard border border-slate-200/70 dark:border-agri-darkBorder">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
          <span className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-emerald-600" /> Planned Farm Acreage
          </span>
          <span className="font-black text-base text-emerald-700 dark:text-emerald-400 font-mono">
            {acres} {acres === 1 ? 'Acre' : 'Acres'}
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="50"
          step="1"
          value={acres}
          onChange={(e) => setAcres(Number(e.target.value))}
          className="mt-2.5 w-full accent-emerald-600"
        />
        <div className="mt-1 flex justify-between text-[10px] text-slate-400 font-mono">
          <span>1 Acre (Smallholder)</span>
          <span>10 Acres</span>
          <span>25 Acres</span>
          <span>50 Acres (Commercial)</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Target Yield</span>
          <p className="mt-1 text-base font-black text-slate-900 dark:text-white">
            {totalYieldQuintals}{' '}
            <span className="text-xs font-normal text-slate-500">Quintals</span>
          </p>
          <span className="text-[10px] text-slate-400 font-mono">
            {metrics.targetYieldQuintalsPerAcre} q/acre average
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Realization Rate</span>
          <p className="mt-1 text-base font-black text-amber-700 dark:text-amber-300 font-mono">
            ₹{metrics.mandiPricePerQuintal.toLocaleString('en-IN')}{' '}
            <span className="text-[10px] font-normal text-slate-500">/q</span>
          </p>
          <span className="text-[10px] text-slate-400 font-mono">
            Govt MSP: ₹{metrics.mspPricePerQuintal.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Cultivation Cost (A2+FL)</span>
          <p className="mt-1 text-base font-black text-red-600 dark:text-red-400 font-mono">
            ₹{totalCostOfCultivation.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-400 font-mono">
            ₹{metrics.costOfCultivationPerAcre.toLocaleString('en-IN')} / acre
          </span>
        </div>

        <div className="rounded-2xl border border-emerald-300 bg-emerald-50/70 p-3.5 dark:border-emerald-900 dark:bg-emerald-950/40">
          <span className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-300 block">
            Net Farm Profit
          </span>
          <p className="mt-1 text-lg font-black text-emerald-800 dark:text-emerald-300 font-mono">
            ₹{totalNetProfit.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
            ₹{metrics.netProfitPerAcre.toLocaleString('en-IN')} / acre margin
          </span>
        </div>
      </div>

      {/* Revenue Breakdown Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-agri-darkCard dark:text-slate-300 border border-slate-200/60 dark:border-agri-darkBorder">
        <div className="flex items-center gap-2">
          <CircleDollarSign className="h-4 w-4 text-emerald-600" />
          <span>
            Total Gross Harvest Turnover: <strong className="text-slate-900 dark:text-white font-mono">₹{totalGrossRevenue.toLocaleString('en-IN')}</strong>
          </span>
        </div>
        <span className="text-[11px] text-slate-400 mt-1 sm:mt-0 font-medium">
          Cost covers seed priming, DAP/Urea, diesel irrigation, spray applications & combine harvesting
        </span>
      </div>
    </div>
  )
}
