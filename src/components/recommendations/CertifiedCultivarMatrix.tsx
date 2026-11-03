import { useState } from 'react'
import {
  Award,
  Calendar,
  Clock,
  FlaskConical,
  ShieldCheck,
} from 'lucide-react'
import type { CultivarInfo } from '../../types'

interface CertifiedCultivarMatrixProps {
  cultivars: CultivarInfo[]
  cropName: string
}

export function CertifiedCultivarMatrix({ cultivars, cropName }: CertifiedCultivarMatrixProps) {
  const [selectedIdx, setSelectedIdx] = useState<number>(0)
  const activeCultivar = cultivars[selectedIdx] || cultivars[0]

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 dark:border-agri-darkBorder">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
            <Award className="h-4 w-4" />
          </span>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              High-Yielding Certified Cultivar (Seed Variety) Matrix
            </h4>
            <p className="text-[11px] text-slate-500">
              State Agricultural University (PAU / ICAR) gazetted certified varieties for {cropName}
            </p>
          </div>
        </div>

        <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-black text-purple-700 dark:bg-purple-950 dark:text-purple-300">
          NSC / SAU Certified Stock
        </span>
      </div>

      {/* Cultivar Tabs */}
      <div className="flex flex-wrap gap-2 pt-1">
        {cultivars.map((cultivar, idx) => (
          <button
            key={cultivar.name}
            type="button"
            onClick={() => setSelectedIdx(idx)}
            className={`rounded-2xl px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
              selectedIdx === idx
                ? 'bg-purple-700 text-white shadow-xs dark:bg-purple-600'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-agri-darkCard dark:text-slate-300'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            {cultivar.name}
          </button>
        ))}
      </div>

      {/* Selected Cultivar Detailed Card */}
      <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-950 dark:bg-purple-950/20 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-purple-200/60 pb-3 dark:border-purple-900/50">
          <div>
            <div className="flex items-center gap-2">
              <h5 className="text-base font-black text-purple-950 dark:text-purple-100">
                {activeCultivar.name}
              </h5>
              <span className="rounded-md bg-purple-200/80 px-2 py-0.5 text-[10px] font-bold text-purple-900 dark:bg-purple-900 dark:text-purple-200">
                {activeCultivar.releaseInstitution}
              </span>
            </div>
            <p className="text-xs text-purple-900/80 dark:text-purple-200/80 mt-1">
              {activeCultivar.specialTrait}
            </p>
          </div>

          <div className="flex items-center gap-1 text-xs font-black text-purple-800 dark:text-purple-300 shrink-0">
            <Clock className="h-4 w-4" />
            <span>Maturity: {activeCultivar.durationDays} Days</span>
          </div>
        </div>

        {/* Sowing Timeline Window */}
        <div className="rounded-xl bg-white p-3 dark:bg-agri-darkCard border border-purple-100 dark:border-agri-darkBorder space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
            <span className="flex items-center gap-1 text-slate-500">
              <Calendar className="h-3.5 w-3.5 text-purple-600" /> Optimal Sowing Window:
            </span>
            <span className="font-black text-purple-700 dark:text-purple-300">
              {activeCultivar.sowingWindow}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
            <div className="h-full bg-amber-400 w-1/4" title="Early Window" />
            <div className="h-full bg-emerald-500 w-2/4" title="Optimal Timely Window" />
            <div className="h-full bg-red-400 w-1/4" title="Late Sown Window" />
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 font-bold">
            <span>Early Sowing</span>
            <span className="text-emerald-600 font-extrabold">Optimal Timely Window</span>
            <span>Late Sowing</span>
          </div>
        </div>

        {/* Seed Priming & Treatment Protocol */}
        <div className="rounded-xl bg-white p-3 dark:bg-agri-darkCard border border-purple-100 dark:border-agri-darkBorder flex items-start gap-2 text-xs">
          <FlaskConical className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">
              Certified Seed Priming Protocol:
            </span>
            <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
              {activeCultivar.seedTreatment}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
