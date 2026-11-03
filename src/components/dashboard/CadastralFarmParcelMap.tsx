import { useState } from 'react'
import {
  Compass,
  Plane,
} from 'lucide-react'

export interface FarmSector {
  id: string
  code: string
  crop: string
  variety: string
  acres: number
  moisture: number
  status: 'optimal' | 'warning' | 'monitoring'
  stage: string
  valveStatus: 'Open (Flowing)' | 'Closed' | 'Standby'
  ndvi: number
  pathSvg: string
  centerText: { x: number; y: number }
  colorClass: string
  strokeClass: string
}

const FARM_SECTORS: FarmSector[] = [
  {
    id: 'sector-a1',
    code: 'Sector A1',
    crop: 'Basmati Rice',
    variety: 'Pusa Basmati 1121',
    acres: 8.5,
    moisture: 42,
    status: 'optimal',
    stage: 'Active Panicle Emergence',
    valveStatus: 'Open (Flowing)',
    ndvi: 0.84,
    pathSvg: 'M 40,40 L 260,40 L 250,220 L 40,210 Z',
    centerText: { x: 145, y: 130 },
    colorClass: 'fill-emerald-500/20 hover:fill-emerald-500/30',
    strokeClass: 'stroke-emerald-500',
  },
  {
    id: 'sector-b2',
    code: 'Sector B2',
    crop: 'Wheat',
    variety: 'HD-3086 (Pusa Gautami)',
    acres: 12.0,
    moisture: 34,
    status: 'warning',
    stage: 'Crown Root Tillering',
    valveStatus: 'Standby',
    ndvi: 0.62,
    pathSvg: 'M 270,40 L 520,40 L 510,230 L 260,220 Z',
    centerText: { x: 390, y: 130 },
    colorClass: 'fill-amber-500/20 hover:fill-amber-500/30',
    strokeClass: 'stroke-amber-500',
  },
  {
    id: 'sector-c1',
    code: 'Sector C1',
    crop: 'Bt Cotton',
    variety: 'RCH-659 BGII',
    acres: 6.5,
    moisture: 38,
    status: 'optimal',
    stage: 'Square Formation Stage',
    valveStatus: 'Closed',
    ndvi: 0.79,
    pathSvg: 'M 40,220 L 250,230 L 240,380 L 40,370 Z',
    centerText: { x: 140, y: 300 },
    colorClass: 'fill-emerald-500/20 hover:fill-emerald-500/30',
    strokeClass: 'stroke-emerald-500',
  },
  {
    id: 'sector-d3',
    code: 'Sector D3',
    crop: 'Mustard / Raya',
    variety: 'Pusa Mustard 25',
    acres: 4.2,
    moisture: 30,
    status: 'monitoring',
    stage: 'Siliqua Pod Formation',
    valveStatus: 'Standby',
    ndvi: 0.71,
    pathSvg: 'M 260,230 L 510,240 L 500,380 L 250,380 Z',
    centerText: { x: 380, y: 300 },
    colorClass: 'fill-teal-500/20 hover:fill-teal-500/30',
    strokeClass: 'stroke-teal-500',
  },
]

export function CadastralFarmParcelMap() {
  const [selectedSectorId, setSelectedSectorId] = useState<string>('sector-b2')

  const activeSector = FARM_SECTORS.find((s) => s.id === selectedSectorId) || FARM_SECTORS[0]

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-agri-darkBorder">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-forest-100 text-forest-800 dark:bg-emerald-950 dark:text-emerald-400">
              <Compass className="h-4 w-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-forest-800 dark:text-emerald-400">
              GIS Cadastral Farm Parcel Sentinel
            </span>
          </div>
          <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
            Interactive Farm Plot Grid & Drone Sentinel
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time parcel telemetry across 31.2 cultivated acres with autonomous UAV aerial surveillance.
          </p>
        </div>

        {/* Drone Status Capsule */}
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <Plane className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-extrabold text-slate-900 dark:text-white">
                DJI Agras T40 Sentinel
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              Battery 88% • 5.8 GHz LoRa (-72 dBm)
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-center">
        {/* Left: Vector Cadastral Map (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full max-w-[540px] aspect-4/3 rounded-3xl overflow-hidden border-2 border-slate-200 bg-slate-900 p-2 shadow-inner dark:border-agri-darkBorder select-none">
            <svg viewBox="0 0 560 420" className="w-full h-full drop-shadow-xs">
              <defs>
                {/* Drone Flight Path Pattern */}
                <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" strokeWidth="0.5" opacity="0.4" />
                </pattern>
              </defs>

              <rect width="560" height="420" fill="url(#gridPattern)" />

              {/* Drone Flight Trajectory Dashed Line */}
              <path
                d="M 60,60 Q 200,100 480,80 T 460,340 T 80,320 Z"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                opacity="0.6"
              />

              {/* The 4 Farm Parcel Sectors */}
              {FARM_SECTORS.map((sector) => {
                const isSelected = selectedSectorId === sector.id
                return (
                  <g
                    key={sector.id}
                    onClick={() => setSelectedSectorId(sector.id)}
                    className="cursor-pointer transition-all duration-200 group"
                  >
                    <path
                      d={sector.pathSvg}
                      className={`${sector.colorClass} ${sector.strokeClass} transition-all duration-200 ${
                        isSelected ? 'stroke-[3.5] filter drop-shadow(0 0 8px rgba(16,185,129,0.5))' : 'stroke-[1.8]'
                      }`}
                    />
                    <text
                      x={sector.centerText.x}
                      y={sector.centerText.y}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="12"
                      fontWeight="900"
                      className="drop-shadow-md pointer-events-none"
                    >
                      {sector.code}
                    </text>
                    <text
                      x={sector.centerText.x}
                      y={sector.centerText.y + 16}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="10"
                      fontWeight="700"
                      className="pointer-events-none"
                    >
                      {sector.crop} ({sector.acres} Ac)
                    </text>
                    <text
                      x={sector.centerText.x}
                      y={sector.centerText.y + 32}
                      textAnchor="middle"
                      fill={sector.status === 'warning' ? '#f59e0b' : '#34d399'}
                      fontSize="9"
                      fontWeight="800"
                      className="pointer-events-none font-mono"
                    >
                      NDVI {sector.ndvi} • {sector.moisture}% VWC
                    </text>
                  </g>
                )
              })}

              {/* Active Drone Icon Plotted on Trajectory */}
              <g transform="translate(440, 90)">
                <circle cx="0" cy="0" r="14" fill="#10b981" fillOpacity="0.3" className="animate-ping" />
                <circle cx="0" cy="0" r="8" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                <text x="0" y="-12" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold">
                  UAV-01 (Scanning)
                </text>
              </g>

              {/* Map Scale & North Compass */}
              <g transform="translate(500, 370)">
                <circle cx="15" cy="15" r="14" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
                <path d="M 15,6 L 19,19 L 15,16 L 11,19 Z" fill="#ef4444" />
                <text x="15" y="4" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="bold">
                  N
                </text>
              </g>
            </svg>
          </div>

          <p className="mt-2 text-[11px] text-slate-400 text-center">
            Click any field sector above to inspect real-time parcel telemetry and soil moisture valve states.
          </p>
        </div>

        {/* Right: Selected Sector Inspector Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-agri-darkBorder dark:bg-agri-darkCard space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-agri-darkBorder">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Parcel Telemetry Inspector
                </span>
                <h4 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                  {activeSector.code} • {activeSector.crop}
                </h4>
                <p className="text-xs text-slate-500">{activeSector.variety}</p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                  activeSector.status === 'optimal'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {activeSector.status}
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-agri-darkBorder dark:bg-agri-darkSurface">
                <span className="text-[10px] font-bold uppercase text-slate-400">Field Size</span>
                <p className="mt-1 text-base font-black text-slate-900 dark:text-white">
                  {activeSector.acres} <span className="text-xs font-normal">Acres</span>
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-agri-darkBorder dark:bg-agri-darkSurface">
                <span className="text-[10px] font-bold uppercase text-slate-400">Canopy NDVI</span>
                <p className="mt-1 text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {activeSector.ndvi}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-agri-darkBorder dark:bg-agri-darkSurface">
                <span className="text-[10px] font-bold uppercase text-slate-400">Volumetric Moisture</span>
                <p className="mt-1 text-base font-black text-blue-600 dark:text-blue-400">
                  {activeSector.moisture}% VWC
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-agri-darkBorder dark:bg-agri-darkSurface">
                <span className="text-[10px] font-bold uppercase text-slate-400">Drip Solenoid Valve</span>
                <p className="mt-1 text-xs font-black text-slate-800 dark:text-slate-200 truncate">
                  {activeSector.valveStatus}
                </p>
              </div>
            </div>

            {/* Phenological Stage */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs dark:border-emerald-950 dark:bg-emerald-950/20">
              <span className="text-[10px] font-bold uppercase text-emerald-900 dark:text-emerald-300">
                Active Phenological Stage
              </span>
              <p className="mt-0.5 font-bold text-emerald-950 dark:text-emerald-200">
                {activeSector.stage}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
