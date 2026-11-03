import { useState } from 'react'
import {
  Clock,
  Fuel,
  Tractor,
  Users,
} from 'lucide-react'

interface MachineAsset {
  id: string
  name: string
  type: string
  status: 'Deployed' | 'Available' | 'Maintenance'
  operator: string
  dieselLitersPerHour: number
  activeTask: string
}

const MACHINE_ASSETS: MachineAsset[] = [
  {
    id: 'mach-01',
    name: 'Mahindra 575 DI + 500L Boom Sprayer',
    type: 'Chemical Application Rig',
    status: 'Deployed',
    operator: 'Harpreet Singh (Cert. Operator)',
    dieselLitersPerHour: 4.8,
    activeTask: 'Sector B2 Mancozeb prophylactic foliar pass',
  },
  {
    id: 'mach-02',
    name: 'PAU Super Seeder (No-Till Stubble Sowing)',
    type: 'Zero-Tillage Seed Drill',
    status: 'Available',
    operator: 'Manjit Singh',
    dieselLitersPerHour: 6.2,
    activeTask: 'Standby for Sector D3 Mustard line sowing',
  },
  {
    id: 'mach-03',
    name: 'Precision Laser Land Leveler & Scraper',
    type: 'Grading Rig',
    status: 'Available',
    operator: 'Gurmail Singh',
    dieselLitersPerHour: 5.5,
    activeTask: 'Calibrated for Sector C1 pre-sowing grading',
  },
  {
    id: 'mach-04',
    name: 'Solar Pulse Fertigation Solenoid Valve #3',
    type: 'Automated Drip Manifold',
    status: 'Deployed',
    operator: 'Autonomous Telemetry Controller',
    dieselLitersPerHour: 0.0, // Solar
    activeTask: 'Scheduled 45-min rhizosphere pulse @ 08:30 AM',
  },
]

export function MachineFleetCrewEngine() {
  const [assets] = useState<MachineAsset[]>(MACHINE_ASSETS)

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 dark:border-agri-darkBorder">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-forest-100 text-forest-800 dark:bg-emerald-950 dark:text-emerald-400">
            <Tractor className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Machinery Fleet & Field Crew Dispatch Assignment Engine
            </h3>
            <p className="text-[11px] text-slate-500">
              Allocates tractor implements, autonomous solar drip solenoids, operators, and diesel telemetry
            </p>
          </div>
        </div>

        <span className="rounded-full bg-forest-50 px-3 py-1 text-xs font-black text-forest-800 dark:bg-emerald-950 dark:text-emerald-300">
          Fleet Health: 100% Operational
        </span>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {assets.map((asset) => {
          const isDeployed = asset.status === 'Deployed'
          return (
            <div
              key={asset.id}
              className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] text-slate-400 uppercase">
                    {asset.id} • {asset.type}
                  </span>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                    {asset.name}
                  </h4>
                </div>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                    isDeployed
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {asset.status}
                </span>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-white p-2.5 dark:bg-agri-darkSurface border border-slate-100 dark:border-agri-darkBorder">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Assigned Operator</span>
                  <div className="mt-1 flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                    <Users className="h-3.5 w-3.5 text-blue-500" />
                    <span className="truncate">{asset.operator}</span>
                  </div>
                </div>

                <div className="rounded-xl bg-white p-2.5 dark:bg-agri-darkSurface border border-slate-100 dark:border-agri-darkBorder">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Fuel Consumption</span>
                  <div className="mt-1 flex items-center gap-1 font-mono font-black text-slate-800 dark:text-slate-200">
                    <Fuel className="h-3.5 w-3.5 text-orange-500" />
                    <span>{asset.dieselLitersPerHour > 0 ? `${asset.dieselLitersPerHour} L/hr` : 'Zero (Solar)'}</span>
                  </div>
                </div>
              </div>

              {/* Current Task */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 border-t border-slate-200/60 pt-2 dark:border-agri-darkBorder">
                <Clock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="truncate"><strong>Task:</strong> {asset.activeTask}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
