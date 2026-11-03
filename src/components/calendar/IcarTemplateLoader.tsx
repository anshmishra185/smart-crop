import { useState } from 'react'
import {
  BookOpen,
  CheckCircle2,
  Plus,
} from 'lucide-react'
import type { CalendarTask } from '../../types'

interface IcarTemplateLoaderProps {
  onLoadTasks: (tasks: Omit<CalendarTask, 'id' | 'completed'>[]) => void
}

const TEMPLATES: Record<string, {
  name: string
  crop: string
  tasks: Omit<CalendarTask, 'id' | 'completed'>[]
}> = {
  wheat: {
    name: 'HD-3086 Wheat Full ICAR Package of Practices',
    crop: 'Wheat',
    tasks: [
      {
        title: 'Line Sowing with Super Seeder + DAP Basal (50 kg/acre)',
        crop: 'Wheat (HD-3086)',
        category: 'sowing',
        date: '2026-11-05',
        time: '07:30 AM',
        priority: 'high',
        bbchStage: 'BBCH 00–09',
        assignedMachine: 'PAU Super Seeder',
        assignedCrew: 'Harpreet Singh',
        dieselLiters: 12,
        notes: 'Sow at 4-5 cm depth with 50 kg/acre DAP and treated seeds.',
      },
      {
        title: '1st Irrigation at Crown Root Initiation (CRI Stage)',
        crop: 'Wheat (HD-3086)',
        category: 'irrigation',
        date: '2026-11-26',
        time: '08:00 AM',
        priority: 'high',
        bbchStage: 'BBCH 10–19',
        assignedMachine: 'Solar Drip Solenoid Valve #3',
        assignedCrew: 'Autonomous Controller',
        dieselLiters: 0,
        notes: '21 days after sowing. Most critical irrigation milestone for root establishment.',
      },
      {
        title: '1st Split Urea Top-Dressing (45 kg/acre)',
        crop: 'Wheat (HD-3086)',
        category: 'fertilizer',
        date: '2026-11-29',
        time: '09:00 AM',
        priority: 'medium',
        bbchStage: 'BBCH 20–29',
        assignedMachine: 'Manual Broadcast Spreader',
        assignedCrew: 'Field Labor Crew (2 Hands)',
        notes: 'Broadcast immediately after CRI irrigation when soil is damp.',
      },
      {
        title: 'Prophylactic Yellow Rust Foliar Spray (Tilt 25% EC)',
        crop: 'Wheat (HD-3086)',
        category: 'inspection',
        date: '2026-12-20',
        time: '08:30 AM',
        priority: 'high',
        bbchStage: 'BBCH 30–39',
        assignedMachine: 'Mahindra 575 DI + 500L Boom Sprayer',
        assignedCrew: 'Harpreet Singh',
        reiHours: 24,
        phiDays: 30,
        dieselLiters: 5,
        notes: 'Apply Propiconazole @ 200 ml in 200 L water per acre at jointing stage.',
      },
      {
        title: 'Terminal Heat Potassium Nitrate Spray (13:0:45 @ 1%)',
        crop: 'Wheat (HD-3086)',
        category: 'fertilizer',
        date: '2027-02-15',
        time: '08:00 AM',
        priority: 'medium',
        bbchStage: 'BBCH 70–89',
        assignedMachine: 'Mahindra 575 DI + 500L Boom Sprayer',
        assignedCrew: 'Harpreet Singh',
        notes: 'Foliar spray at early milk stage to prevent terminal high-temperature grain shriveling.',
      },
    ],
  },
  rice: {
    name: 'Pusa Basmati 1121 Rice Full POP Protocol',
    crop: 'Rice',
    tasks: [
      {
        title: 'Nursery Bed Sowing & Seed Carbendazim Soak',
        crop: 'Basmati Rice',
        category: 'sowing',
        date: '2026-11-10',
        time: '07:00 AM',
        priority: 'high',
        bbchStage: 'BBCH 00–09',
        notes: 'Soak seeds for 24h with Carbendazim 2g/kg against Bakanae foot rot.',
      },
      {
        title: 'Seedling Transplanting with Zinc Sulfate Basal',
        crop: 'Basmati Rice',
        category: 'sowing',
        date: '2026-11-28',
        time: '07:30 AM',
        priority: 'high',
        bbchStage: 'BBCH 10–19',
        notes: 'Maintain 20x15 cm hill spacing with 10 kg/acre Zinc Sulfate (21%).',
      },
    ],
  },
  mustard: {
    name: 'Pusa Mustard Giriraj Precision Protocol',
    crop: 'Mustard',
    tasks: [
      {
        title: 'Mustard Line Sowing with Single Super Phosphate (SSP)',
        crop: 'Mustard (Giriraj)',
        category: 'sowing',
        date: '2026-11-08',
        time: '08:00 AM',
        priority: 'high',
        bbchStage: 'BBCH 00–09',
        notes: 'Apply 150 kg SSP per acre to satisfy essential oil-boosting sulfur needs.',
      },
      {
        title: 'Aphid Scouting & Thiamethoxam 25% WG Spray',
        crop: 'Mustard (Giriraj)',
        category: 'inspection',
        date: '2026-12-15',
        time: '09:00 AM',
        priority: 'medium',
        bbchStage: 'BBCH 50–59',
        notes: 'Inspect terminal branches for aphid colonies. Apply when ETL exceeds 20 aphids/plant.',
      },
    ],
  },
}

export function IcarTemplateLoader({ onLoadTasks }: IcarTemplateLoaderProps) {
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('wheat')
  const [loadedNotice, setLoadedNotice] = useState<string | null>(null)

  const handleApply = () => {
    const template = TEMPLATES[selectedTemplateKey]
    if (!template) return
    onLoadTasks(template.tasks)
    setLoadedNotice(`Successfully injected ${template.tasks.length} ICAR protocol tasks for ${template.crop}!`)
    setTimeout(() => setLoadedNotice(null), 4000)
  }

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 dark:border-agri-darkBorder">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
            <BookOpen className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              ICAR Package of Practices (POP) 1-Click Protocol Template Generator
            </h3>
            <p className="text-[11px] text-slate-500">
              Instantly populates tested agronomic timelines, fertilizer split doses, and chemical intervals
            </p>
          </div>
        </div>

        <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-black text-purple-700 dark:bg-purple-950 dark:text-purple-300">
          State University Validated
        </span>
      </div>

      {/* Select & Apply Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <select
            value={selectedTemplateKey}
            onChange={(e) => setSelectedTemplateKey(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-200 outline-none"
          >
            {Object.entries(TEMPLATES).map(([key, item]) => (
              <option key={key} value={key}>
                {item.name} ({item.tasks.length} Tasks)
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleApply}
          className="flex items-center justify-center gap-2 rounded-2xl bg-purple-700 px-5 py-2.5 text-xs font-extrabold text-white hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-500 transition active:scale-95 shadow-sm"
        >
          <Plus className="h-4 w-4" /> Load Template Tasks
        </button>
      </div>

      {loadedNotice && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-900 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{loadedNotice}</span>
        </div>
      )}
    </div>
  )
}
