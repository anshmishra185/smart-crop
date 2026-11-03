import { useState } from 'react'
import {
  FlaskConical,
  RefreshCw,
} from 'lucide-react'

interface FracEntry {
  code: string
  groupName: string
  activeIngredients: string
  modeOfAction: string
  resistanceRisk: 'High' | 'Moderate' | 'Low' | 'Zero (Multi-site)'
  annualSpraysLogged: number
  maxAllowedSprays: number
  advisory: string
}

const FRAC_DATA: FracEntry[] = [
  {
    code: 'FRAC Code 11',
    groupName: 'QoI (Quinone Outside Inhibitors) / Strobilurins',
    activeIngredients: 'Azoxystrobin 23% SC, Pyraclostrobin 20% WG',
    modeOfAction: 'Inhibition of mitochondrial respiration at Complex III cytochrome bc1',
    resistanceRisk: 'Moderate',
    annualSpraysLogged: 2,
    maxAllowedSprays: 2,
    advisory: 'Annual ceiling reached! Do not apply Strobilurins consecutively. Pathogen target-site mutation (G143A) risk.',
  },
  {
    code: 'FRAC Code 3',
    groupName: 'DMI (Demethylation Inhibitors) / Triazoles',
    activeIngredients: 'Tebuconazole 25.9% EC, Propiconazole 25% EC, Difenoconazole',
    modeOfAction: 'Inhibits C14-demethylase enzyme in ergosterol fungal cell membrane synthesis',
    resistanceRisk: 'Low',
    annualSpraysLogged: 1,
    maxAllowedSprays: 3,
    advisory: 'Permissible window available. Rotate with multi-site contact fungicide for curative blast or rust defense.',
  },
  {
    code: 'FRAC Code M03',
    groupName: 'Multi-Site Contact Activity / Dithiocarbamates',
    activeIngredients: 'Mancozeb 75% WP, Propineb 70% WP, Zineb',
    modeOfAction: 'Disrupts multiple biochemical enzymatic pathways in fungal cellular cytoplasm',
    resistanceRisk: 'Zero (Multi-site)',
    annualSpraysLogged: 3,
    maxAllowedSprays: 6,
    advisory: 'Zero known resistance developed after 50 years of global use. Premier partner for anti-resistance tank mixtures.',
  },
  {
    code: 'FRAC Code 4',
    groupName: 'PA (Phenylamides) / Oomycete Specialist',
    activeIngredients: 'Metalaxyl 35% WS, Metalaxyl-M',
    modeOfAction: 'Inhibition of RNA polymerase I in Oomycete nucleic acid synthesis',
    resistanceRisk: 'High',
    annualSpraysLogged: 1,
    maxAllowedSprays: 2,
    advisory: 'High risk of single-step resistance in Phytophthora late blight. Always formulate with Mancozeb (e.g. Ridomil Gold).',
  },
]

export function FracResistanceTracker() {
  const [selectedFracCode, setSelectedFracCode] = useState<string>('FRAC Code 11')

  const activeFrac = FRAC_DATA.find((f) => f.code === selectedFracCode) || FRAC_DATA[0]
  const isCeilingReached = activeFrac.annualSpraysLogged >= activeFrac.maxAllowedSprays

  const riskColors = {
    High: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-900',
    Moderate: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900',
    Low: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900',
    'Zero (Multi-site)': 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900',
  }

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 dark:border-agri-darkBorder">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
            <FlaskConical className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              FRAC Chemical Resistance Tracker & Fungicide Rotation Matrix
            </h3>
            <p className="text-[11px] text-slate-500">
              Fungicide Resistance Action Committee monitoring single-site chemical tolerance and mode-of-action rotation
            </p>
          </div>
        </div>

        <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-black text-purple-700 dark:bg-purple-950 dark:text-purple-300">
          Global FRAC Compliance
        </span>
      </div>

      {/* Tabs */}
      <div className="grid gap-2 sm:grid-cols-4">
        {FRAC_DATA.map((frac) => {
          const isSelected = frac.code === selectedFracCode
          const atMax = frac.annualSpraysLogged >= frac.maxAllowedSprays
          return (
            <button
              key={frac.code}
              type="button"
              onClick={() => setSelectedFracCode(frac.code)}
              className={`rounded-2xl border p-3 text-left transition ${
                isSelected
                  ? 'border-purple-600 bg-purple-50/70 shadow-xs dark:border-purple-500 dark:bg-purple-950/30'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-agri-darkBorder dark:bg-agri-darkCard'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-black text-slate-500 dark:text-slate-400">
                  {frac.code}
                </span>
                <span className={`rounded-md border px-1.5 py-0.5 text-[8px] font-black uppercase ${riskColors[frac.resistanceRisk]}`}>
                  {frac.resistanceRisk}
                </span>
              </div>
              <h5 className="mt-1 text-xs font-black text-slate-900 dark:text-white truncate">
                {frac.groupName.split(' ')[0]}
              </h5>
              <p className="mt-1 text-[10px] text-slate-500 font-mono">
                {frac.annualSpraysLogged} / {frac.maxAllowedSprays} Sprays {atMax ? '• MAX' : ''}
              </p>
            </button>
          )
        })}
      </div>

      {/* Selected FRAC Detail Card */}
      <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-4 dark:border-purple-950 dark:bg-purple-950/20 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-purple-200/60 pb-3 dark:border-purple-900/50">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-black text-purple-950 dark:text-purple-100">
                {activeFrac.code} — {activeFrac.groupName}
              </h4>
              <span className={`rounded-md border px-2 py-0.5 text-[9px] font-black uppercase ${riskColors[activeFrac.resistanceRisk]}`}>
                {activeFrac.resistanceRisk} Risk
              </span>
            </div>
            <p className="text-xs text-purple-900/80 dark:text-purple-200/80 mt-0.5">
              Target Actives: <strong>{activeFrac.activeIngredients}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className={`rounded-full px-3 py-1 text-xs font-black ${
              isCeilingReached
                ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
            }`}>
              {isCeilingReached ? 'Annual Ceiling Reached' : 'Sprays Allowed'}
            </span>
          </div>
        </div>

        {/* Mechanism & Advisory */}
        <div className="grid gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-xl bg-white p-3 dark:bg-agri-darkCard border border-purple-100 dark:border-agri-darkBorder">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">
              Biochemical Mode of Action (MoA)
            </span>
            <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {activeFrac.modeOfAction}
            </p>
          </div>

          <div className="rounded-xl bg-white p-3 dark:bg-agri-darkCard border border-purple-100 dark:border-agri-darkBorder">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">
              Anti-Resistance Spray Rule
            </span>
            <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {activeFrac.advisory}
            </p>
          </div>
        </div>

        {/* Rotation Suggestion Strip */}
        <div className="flex items-center gap-2 rounded-xl bg-purple-100/70 p-2.5 text-xs text-purple-950 dark:bg-purple-950/60 dark:text-purple-200">
          <RefreshCw className="h-4 w-4 text-purple-700 dark:text-purple-400 shrink-0" />
          <span className="font-semibold">
            Recommended Next Rotation: Alternate with <strong>FRAC Code M03 (Mancozeb)</strong> or <strong>FRAC Code 3 (Triazole)</strong> to protect efficacy.
          </span>
        </div>
      </div>
    </div>
  )
}
