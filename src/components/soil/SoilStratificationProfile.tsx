import { useState } from 'react'
import {
  CheckCircle2,
  Layers,
  Sparkles,
} from 'lucide-react'
import type { SoilReading } from '../../types'

interface SoilStratificationProfileProps {
  reading: SoilReading
}

interface HorizonLayer {
  id: 'topsoil' | 'subsoil' | 'deep'
  code: string
  name: string
  depthRange: string
  depthCm: string
  vwc: number // Volumetric Water Content %
  temperature: number // °C
  compactionPsi: number // Soil penetration resistance in PSI
  compactionStatus: 'Good' | 'Moderate' | 'Hardpan Risk'
  aeration: string
  microbialActivity: 'Very High' | 'Moderate' | 'Low'
  rootFraction: number // % of active roots residing in this zone
  description: string
  managementAdvice: string
  color: string
  borderColor: string
}

export function SoilStratificationProfile({ reading }: SoilStratificationProfileProps) {
  const [selectedLayerId, setSelectedLayerId] = useState<'topsoil' | 'subsoil' | 'deep'>('topsoil')

  const layers: HorizonLayer[] = [
    {
      id: 'topsoil',
      code: 'Horizon A',
      name: 'Plow Layer / Topsoil (Seedbed)',
      depthRange: '0 – 15 cm',
      depthCm: '0-15',
      vwc: reading.moisture,
      temperature: reading.soilTemp,
      compactionPsi: 140, // < 200 PSI is optimal for root penetration
      compactionStatus: 'Good',
      aeration: 'Aerobic & Well Oxygenated (18-20% O2)',
      microbialActivity: 'Very High',
      rootFraction: 65,
      description: 'The biologically fertile epipedon where 65% of feeder roots and active mycorrhizal fungi thrive.',
      managementAdvice: 'Maintain light mulch to prevent surface crusting and evaporative moisture loss under high ambient heat.',
      color: 'from-amber-900/40 via-amber-800/30 to-amber-900/20',
      borderColor: 'border-amber-700/60',
    },
    {
      id: 'subsoil',
      code: 'Horizon B',
      name: 'Sub-Surface Root Anchorage Zone',
      depthRange: '15 – 30 cm',
      depthCm: '15-30',
      vwc: Math.min(65, Math.round(reading.moisture * 1.15)),
      temperature: Math.max(16, Math.round(reading.soilTemp - 1.8)),
      compactionPsi: 195,
      compactionStatus: 'Good',
      aeration: 'Adequate Gas Exchange (14-16% O2)',
      microbialActivity: 'Moderate',
      rootFraction: 25,
      description: 'Main structural anchorage horizon with clay accumulation (illuvial layer) buffering seasonal droughts.',
      managementAdvice: 'Adequate moisture buffer present. Phosphatic fertilizers placed here resist surface fixation.',
      color: 'from-amber-950/60 via-amber-900/40 to-amber-950/30',
      borderColor: 'border-amber-800/80',
    },
    {
      id: 'deep',
      code: 'Horizon C / Pan',
      name: 'Deep Vadose & Compaction Boundary',
      depthRange: '30 – 60 cm',
      depthCm: '30-60',
      vwc: Math.min(75, Math.round(reading.moisture * 1.25)),
      temperature: Math.max(15, Math.round(reading.soilTemp - 3.2)),
      compactionPsi: 285, // > 250 PSI indicates plow-pan compaction
      compactionStatus: 'Hardpan Risk',
      aeration: 'Hypoxic Transition (< 8% O2)',
      microbialActivity: 'Low',
      rootFraction: 10,
      description: 'Potential plow-pan layer caused by repeated rotary tillage. Deep taproots (cotton/pigeonpea) can penetrate.',
      managementAdvice: 'Plow-pan compaction (285 PSI) restricts downward water drainage. Conduct subsoiling or chisel plowing once every 3 years.',
      color: 'from-stone-900/80 via-stone-800/70 to-stone-900/60',
      borderColor: 'border-stone-700',
    },
  ]

  const activeLayer = layers.find((l) => l.id === selectedLayerId) || layers[0]

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 dark:border-agri-darkBorder">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-400">
              <Layers className="h-4 w-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-orange-800 dark:text-orange-400">
              3D Stratification Profiler
            </span>
          </div>
          <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
            Multi-Horizon Soil Root Profile (0 – 60 cm)
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Depth-stratified moisture gradients, rhizosphere thermal flux, and penetrometer compaction resistance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Multi-Depth Sensor Array
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-12 items-center">
        {/* Left: Interactive Vertical Soil Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-[340px] rounded-3xl overflow-hidden border-2 border-slate-300 bg-slate-900 p-2 shadow-inner dark:border-agri-darkBorder">
            {/* Surface Grass and Crops */}
            <div className="h-6 w-full rounded-t-2xl bg-linear-to-r from-emerald-600 via-green-500 to-emerald-600 flex items-center justify-center text-[10px] font-black text-white uppercase tracking-wider shadow-sm">
              ▲ Crop Canopy & Surface
            </div>

            {/* The 3 Horizons Stacked */}
            <div className="mt-1 flex flex-col gap-1.5">
              {layers.map((layer) => {
                const isSelected = selectedLayerId === layer.id
                return (
                  <div
                    key={layer.id}
                    onClick={() => setSelectedLayerId(layer.id)}
                    className={`relative cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${layer.color} ${
                      isSelected
                        ? 'border-emerald-400 ring-2 ring-emerald-400/50 scale-[1.02] shadow-lg'
                        : `${layer.borderColor} hover:border-slate-400 opacity-80 hover:opacity-100`
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                          {layer.code} • {layer.depthRange}
                        </span>
                        <h4 className="text-xs font-black text-white mt-0.5">
                          {layer.name}
                        </h4>
                      </div>
                      <span className="rounded-full bg-black/40 px-2 py-0.5 text-[9px] font-bold text-slate-300 backdrop-blur-xs">
                        {layer.rootFraction}% Roots
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-200">
                      <span>VWC: {layer.vwc}%</span>
                      <span>{layer.temperature}°C</span>
                      <span className={layer.compactionPsi > 250 ? 'text-amber-400' : 'text-emerald-400'}>
                        {layer.compactionPsi} PSI
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bedrock / Deep Substratum Indicator */}
            <div className="mt-1.5 h-4 w-full rounded-b-2xl bg-stone-900/90 flex items-center justify-center text-[9px] font-bold text-stone-500">
              ▼ Deep Vadose Zone (&gt; 60 cm)
            </div>
          </div>

          <p className="mt-2 text-[11px] text-slate-400 text-center">
            Click any soil depth horizon above to inspect localized agronomic physics.
          </p>
        </div>

        {/* Right: Selected Horizon Inspection Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-agri-darkBorder">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Inspecting {activeLayer.code} ({activeLayer.depthRange})
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                  {activeLayer.name}
                </h3>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-black ${
                  activeLayer.compactionStatus === 'Good'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {activeLayer.compactionStatus}
              </span>
            </div>

            {/* Metrics Ribbon */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-agri-darkBorder dark:bg-agri-darkSurface">
                <span className="text-[10px] font-bold uppercase text-slate-400">Moisture (VWC)</span>
                <p className="mt-1 text-lg font-black text-blue-600 dark:text-blue-400">
                  {activeLayer.vwc}%
                </p>
                <span className="text-[9px] text-slate-500">Volumetric content</span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-agri-darkBorder dark:bg-agri-darkSurface">
                <span className="text-[10px] font-bold uppercase text-slate-400">Soil Temp</span>
                <p className="mt-1 text-lg font-black text-orange-600 dark:text-orange-400">
                  {activeLayer.temperature}°C
                </p>
                <span className="text-[9px] text-slate-500">Root zone flux</span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-agri-darkBorder dark:bg-agri-darkSurface">
                <span className="text-[10px] font-bold uppercase text-slate-400">Compaction</span>
                <p
                  className={`mt-1 text-lg font-black ${
                    activeLayer.compactionPsi > 250
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {activeLayer.compactionPsi} <span className="text-[10px] font-normal">PSI</span>
                </p>
                <span className="text-[9px] text-slate-500">&lt; 200 PSI ideal</span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-agri-darkBorder dark:bg-agri-darkSurface">
                <span className="text-[10px] font-bold uppercase text-slate-400">Root Density</span>
                <p className="mt-1 text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {activeLayer.rootFraction}%
                </p>
                <span className="text-[9px] text-slate-500">Active root mass</span>
              </div>
            </div>

            {/* Agronomic Physiological Breakdown */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-agri-darkBorder/50">
                <span className="font-bold text-slate-500">Pore Aeration State:</span>
                <span className="font-extrabold text-slate-800 dark:text-white">
                  {activeLayer.aeration}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-agri-darkBorder/50">
                <span className="font-bold text-slate-500">Microbial Activity:</span>
                <span className="font-extrabold text-slate-800 dark:text-white">
                  {activeLayer.microbialActivity}
                </span>
              </div>
              <p className="pt-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                {activeLayer.description}
              </p>
            </div>

            {/* Actionable Subsoil Prescription */}
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 dark:border-emerald-900/60 dark:bg-emerald-950/30">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Depth Zone Prescription
              </div>
              <p className="mt-1 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                {activeLayer.managementAdvice}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
