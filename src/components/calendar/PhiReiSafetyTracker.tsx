import { useState } from 'react'
import {
  AlertTriangle,
  Clock,
  ShieldAlert,
  UserCheck,
} from 'lucide-react'

interface ChemicalSafetyRecord {
  id: string
  parcel: string
  crop: string
  chemicalName: string
  activeIngredient: string
  appliedTimestamp: string
  reiDurationHours: number
  reiRemainingHours: number
  phiDurationDays: number
  phiRemainingDays: number
  hazardNotice: string
}

const ACTIVE_SAFETY_RECORDS: ChemicalSafetyRecord[] = [
  {
    id: 'sec-b2-mancozeb',
    parcel: 'Sector B2 (North Field)',
    crop: 'HD-3086 Wheat',
    chemicalName: 'Mancozeb 75% WP (Contact Dithiocarbamate)',
    activeIngredient: 'Mancozeb (FRAC M03)',
    appliedTimestamp: 'Yesterday @ 09:00 AM',
    reiDurationHours: 24,
    reiRemainingHours: 6,
    phiDurationDays: 14,
    phiRemainingDays: 13,
    hazardNotice: 'Field Hazard Active: Full chemical PPE (nitrile gloves, respirator, eye goggles) required before entry.',
  },
  {
    id: 'sec-a1-azoxystrobin',
    parcel: 'Sector A1 (Basmati)',
    crop: 'Pusa Basmati 1121',
    chemicalName: 'Azoxystrobin 23% SC (Amistar)',
    activeIngredient: 'Azoxystrobin (FRAC 11)',
    appliedTimestamp: 'Nov 01 @ 08:30 AM',
    reiDurationHours: 48,
    reiRemainingHours: 0, // Cleared
    phiDurationDays: 14,
    phiRemainingDays: 11,
    hazardNotice: 'REI Cleared: Safe for unassisted human entry. Maintain 11-day PHI wait before test harvesting.',
  },
]

export function PhiReiSafetyTracker() {
  const [records] = useState<ChemicalSafetyRecord[]>(ACTIVE_SAFETY_RECORDS)

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 dark:border-agri-darkBorder">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            <ShieldAlert className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Worker Re-Entry (REI) & Pre-Harvest Interval (PHI) Safety Tracker
            </h3>
            <p className="text-[11px] text-slate-500">
              Mandatory field re-entry PPE intervals and pre-harvest withholding periods to safeguard workers and prevent MRL violations
            </p>
          </div>
        </div>

        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          WHO / CIB&RC Agrochemical Safety
        </span>
      </div>

      {/* Safety Cards Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {records.map((rec) => {
          const isReiActive = rec.reiRemainingHours > 0
          return (
            <div
              key={rec.id}
              className={`rounded-2xl border p-4 space-y-3 ${
                isReiActive
                  ? 'border-amber-300 bg-amber-50/50 dark:border-amber-900/60 dark:bg-amber-950/20'
                  : 'border-slate-200 bg-slate-50/50 dark:border-agri-darkBorder dark:bg-agri-darkCard'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {rec.parcel}
                  </span>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                    {rec.crop} • {rec.chemicalName}
                  </h4>
                  <p className="text-[11px] text-slate-500">{rec.activeIngredient}</p>
                </div>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                    isReiActive
                      ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {isReiActive ? 'REI Locked' : 'REI Safe'}
                </span>
              </div>

              {/* Intervals Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-white p-2.5 dark:bg-agri-darkSurface border border-slate-200/70 dark:border-agri-darkBorder">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
                    <span>WORKER RE-ENTRY (REI)</span>
                    <Clock className="h-3 w-3" />
                  </div>
                  <p className={`mt-1 text-sm font-black font-mono ${isReiActive ? 'text-red-600' : 'text-emerald-600'}`}>
                    {isReiActive ? `${rec.reiRemainingHours}h Remaining` : 'Cleared (Safe Entry)'}
                  </p>
                  <span className="text-[9px] text-slate-400 block mt-0.5">
                    Total window: {rec.reiDurationHours} hours
                  </span>
                </div>

                <div className="rounded-xl bg-white p-2.5 dark:bg-agri-darkSurface border border-slate-200/70 dark:border-agri-darkBorder">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
                    <span>PRE-HARVEST (PHI)</span>
                    <UserCheck className="h-3 w-3 text-blue-500" />
                  </div>
                  <p className="mt-1 text-sm font-black text-blue-600 dark:text-blue-400 font-mono">
                    {rec.phiRemainingDays} Days to Harvest
                  </p>
                  <span className="text-[9px] text-slate-400 block mt-0.5">
                    Zero chemical residue MRL compliance
                  </span>
                </div>
              </div>

              {/* Notice */}
              <div className="flex items-start gap-1.5 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                <span>{rec.hazardNotice}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
