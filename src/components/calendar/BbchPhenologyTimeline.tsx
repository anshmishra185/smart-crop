import { useState } from 'react'
import {
  Layers,
  Sprout,
} from 'lucide-react'

export interface BbchStage {
  code: string
  name: string
  cropMilestone: string
  dayRange: string
  color: string
  borderColor: string
  description: string
}

const BBCH_STAGES: BbchStage[] = [
  {
    code: 'BBCH 10–19',
    name: 'Leaf Development & CRI',
    cropMilestone: 'Crown Root Initiation (Wheat)',
    dayRange: 'Day 15–25',
    color: 'bg-emerald-500',
    borderColor: 'border-emerald-500',
    description: 'First nodal roots emerge; critical first irrigation and phosphorus absorption phase.',
  },
  {
    code: 'BBCH 20–29',
    name: 'Active Tillering',
    cropMilestone: 'Canopy Tillering & Secondary Stems',
    dayRange: 'Day 26–45',
    color: 'bg-teal-500',
    borderColor: 'border-teal-500',
    description: 'High vegetative growth rate; timing for 1st split Urea application (45 kg/acre).',
  },
  {
    code: 'BBCH 30–39',
    name: 'Stem Elongation / Jointing',
    cropMilestone: 'Internode Extension',
    dayRange: 'Day 46–65',
    color: 'bg-blue-500',
    borderColor: 'border-blue-500',
    description: 'Rapid upward biomass growth; prophylactic fungicide window for stripe rust / blast.',
  },
  {
    code: 'BBCH 50–59',
    name: 'Inflorescence / Heading',
    cropMilestone: 'Ear Emergence / Panicle Initiation',
    dayRange: 'Day 66–85',
    color: 'bg-indigo-500',
    borderColor: 'border-indigo-500',
    description: 'Pollen shedding; strict drought avoidance needed to prevent spikelet sterility.',
  },
  {
    code: 'BBCH 70–89',
    name: 'Milk & Dough Grain Filling',
    cropMilestone: 'Caryopsis Grain Maturation',
    dayRange: 'Day 86–115',
    color: 'bg-amber-500',
    borderColor: 'border-amber-500',
    description: 'Starch deposition in kernels; foliar potassium nitrate (13:0:45) spray against terminal heat.',
  },
  {
    code: 'BBCH 90–99',
    name: 'Ripening & Senescence',
    cropMilestone: 'Harvest Readiness (Grain Moisture <14%)',
    dayRange: 'Day 116–135',
    color: 'bg-orange-500',
    borderColor: 'border-orange-500',
    description: 'Physiological maturity; book combine harvester and prepare clean storage bags.',
  },
]

interface BbchPhenologyProps {
  selectedBbchCode: string | null
  onSelectBbch: (code: string | null) => void
  taskCountByDate: Record<string, number>
  selectedDate: string
  onSelectDate: (date: string) => void
}

export function BbchPhenologyTimeline({
  selectedBbchCode,
  onSelectBbch,
  taskCountByDate,
  selectedDate,
  onSelectDate,
}: BbchPhenologyProps) {
  const [currentMonth] = useState('November 2026')

  // Generate 30 days for November 2026 (Nov 1 is Sunday)
  const daysInMonth = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1
    const dayStr = dayNum < 10 ? `0${dayNum}` : `${dayNum}`
    const dateKey = `2026-11-${dayStr}`
    return {
      day: dayNum,
      dateKey,
      taskCount: taskCountByDate[dateKey] || 0,
    }
  })

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 dark:border-agri-darkBorder">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
            <Sprout className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              30-Day Grid & BBCH Phenological Growth Stage Timeline
            </h3>
            <p className="text-[11px] text-slate-500">
              International BBCH physiological milestones aligned with Punjab wheat & rabi cropping calendar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedBbchCode && (
            <button
              type="button"
              onClick={() => onSelectBbch(null)}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200 dark:bg-agri-darkCard dark:text-slate-300"
            >
              Clear BBCH Filter ({selectedBbchCode})
            </button>
          )}
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            BBCH Standard
          </span>
        </div>
      </div>

      {/* BBCH Phenological Stage Gantt Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <span className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-emerald-600" />
            Active Phenological Milestones (Click to Filter Tasks)
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Current Season: Rabi 2026–27</span>
        </div>

        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {BBCH_STAGES.map((stage) => {
            const isSelected = selectedBbchCode === stage.code
            return (
              <button
                key={stage.code}
                type="button"
                onClick={() => onSelectBbch(isSelected ? null : stage.code)}
                className={`rounded-2xl border p-3 text-left transition ${
                  isSelected
                    ? `${stage.borderColor} bg-slate-50 shadow-xs dark:bg-agri-darkCard`
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 dark:border-agri-darkBorder dark:bg-agri-darkCard/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-black text-slate-500">
                    {stage.code}
                  </span>
                  <span className={`h-2 w-2 rounded-full ${stage.color}`} />
                </div>
                <h5 className="mt-1 text-xs font-black text-slate-900 dark:text-white truncate">
                  {stage.name}
                </h5>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{stage.dayRange}</p>
                <p className="mt-1.5 text-[9px] text-slate-500 line-clamp-2 leading-snug">
                  {stage.cropMilestone}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* 30-Day Monthly Calendar Grid */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-900 dark:text-white">
            {currentMonth} — Operational Schedule
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            Selected: <strong>{selectedDate}</strong>
          </span>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] font-black uppercase text-slate-400">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Cells */}
        <div className="grid grid-cols-7 gap-1.5">
          {daysInMonth.map((d) => {
            const isSelected = selectedDate === d.dateKey
            const hasTasks = d.taskCount > 0
            return (
              <button
                key={d.dateKey}
                type="button"
                onClick={() => onSelectDate(d.dateKey)}
                className={`relative flex flex-col items-center justify-center rounded-xl p-2 text-xs font-bold transition aspect-square ${
                  isSelected
                    ? 'bg-forest-800 text-white shadow-xs dark:bg-emerald-600'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80 dark:bg-agri-darkSurface dark:border-agri-darkBorder dark:text-slate-300'
                }`}
              >
                <span>{d.day}</span>
                {hasTasks && (
                  <span
                    className={`mt-1 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-black ${
                      isSelected
                        ? 'bg-white text-slate-900'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {d.taskCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
