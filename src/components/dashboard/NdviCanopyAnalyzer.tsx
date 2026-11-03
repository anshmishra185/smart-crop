import { useState } from 'react'
import { Layers } from 'lucide-react'

export function NdviCanopyAnalyzer() {
  const [viewMode, setViewMode] = useState<'ndvi' | 'rgb'>('ndvi')
  const fieldAverageNdvi = 0.78

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-agri-darkBorder">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              <Layers className="h-4 w-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              Multispectral Satellite & Drone Index
            </span>
          </div>
          <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
            Live NDVI Vegetation Health Spectrum Analyzer
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Normalized Difference Vegetation Index (NIR - Red) / (NIR + Red) measuring chlorophyll canopy density.
          </p>
        </div>

        {/* RGB vs NDVI Mode Switcher */}
        <div className="flex items-center rounded-2xl bg-slate-100 p-1 dark:bg-agri-darkCard">
          <button
            type="button"
            onClick={() => setViewMode('rgb')}
            className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition ${viewMode === 'rgb'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-emerald-600 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
          >
            True Color (RGB)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('ndvi')}
            className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition ${viewMode === 'ndvi'
                ? 'bg-forest-800 text-white shadow-xs dark:bg-emerald-600'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
          >
            NDVI False-Color
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-center">
        {/* Left: Interactive Multispectral Canopy Visualization (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full max-w-[500px] aspect-16/10 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md dark:border-agri-darkBorder select-none">
            {/* Visual Canopy Matrix Simulation */}
            <svg viewBox="0 0 500 310" className="w-full h-full">
              <defs>
                <linearGradient id="ndviGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={viewMode === 'ndvi' ? '#047857' : '#15803d'} />
                  <stop offset="35%" stopColor={viewMode === 'ndvi' ? '#10b981' : '#16a34a'} />
                  <stop offset="65%" stopColor={viewMode === 'ndvi' ? '#f59e0b' : '#65a30d'} />
                  <stop offset="100%" stopColor={viewMode === 'ndvi' ? '#ef4444' : '#ca8a04'} />
                </linearGradient>

                <filter id="canopyBlur">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
              </defs>

              {/* Background Base */}
              <rect width="500" height="310" fill={viewMode === 'ndvi' ? '#0f172a' : '#1c1917'} />

              {/* Canopy Contour Heatmaps */}
              <circle cx="160" cy="120" r="110" fill={viewMode === 'ndvi' ? '#10b981' : '#16a34a'} opacity="0.85" filter="url(#canopyBlur)" />
              <circle cx="340" cy="110" r="100" fill={viewMode === 'ndvi' ? '#047857' : '#15803d'} opacity="0.9" filter="url(#canopyBlur)" />
              <circle cx="390" cy="220" r="90" fill={viewMode === 'ndvi' ? '#f59e0b' : '#65a30d'} opacity="0.75" filter="url(#canopyBlur)" />
              <circle cx="140" cy="240" r="80" fill={viewMode === 'ndvi' ? '#ef4444' : '#854d0e'} opacity="0.6" filter="url(#canopyBlur)" />

              {/* Grid Reference Graticules */}
              <line x1="250" y1="0" x2="250" y2="310" stroke="#ffffff" strokeWidth="0.5" opacity="0.2" strokeDasharray="4 4" />
              <line x1="0" y1="155" x2="500" y2="155" stroke="#ffffff" strokeWidth="0.5" opacity="0.2" strokeDasharray="4 4" />

              {/* Telemetry Labels */}
              <text x="350" y="80" fill="#ffffff" fontSize="11" fontWeight="bold" className="drop-shadow-xs">
                Zone B (Dense NDVI: 0.88)
              </text>
              <text x="70" y="260" fill="#ffffff" fontSize="11" fontWeight="bold" className="drop-shadow-xs">
                Zone D (Moisture Stress: 0.32)
              </text>
            </svg>

            {/* View Mode Watermark Tag */}
            <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-0.5 text-[10px] font-mono font-bold text-white backdrop-blur-xs">
              {viewMode === 'ndvi' ? 'Sentinel-2 NIR/Red Composite' : 'RGB High-Res Orthomosaic'}
            </span>
          </div>

          {/* Color-Calibrated Scale Legend */}
          <div className="mt-3 w-full max-w-[500px]">
            <div className="h-3 w-full rounded-full bg-linear-to-r from-red-500 via-amber-400 via-emerald-400 to-emerald-800 shadow-xs" />
            <div className="mt-1 flex justify-between text-[10px] font-mono font-bold text-slate-500">
              <span>0.0 (Water/Bare)</span>
              <span>0.35 (Stressed)</span>
              <span>0.65 (Moderate)</span>
              <span>0.90+ (Dense Vigorous)</span>
            </div>
          </div>
        </div>

        {/* Right: Average Score & Biomass Telemetry (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              Field Average Vegetation Index
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-black text-emerald-950 dark:text-white font-mono">
                {fieldAverageNdvi}
              </span>
              <span className="text-xs font-bold text-emerald-800/80 dark:text-emerald-300">
                NDVI Score (High Vigor)
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
              Over 86% of the 31.2 cultivated acres exhibit dense chlorophyll absorption with minimal water transpiration stress.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-agri-darkBorder dark:bg-agri-darkCard">
              <span className="text-[10px] font-bold uppercase text-slate-400">Photosynthetic Vigor</span>
              <p className="mt-1 text-sm font-black text-emerald-600 dark:text-emerald-400">
                92.4% Optimal
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-agri-darkBorder dark:bg-agri-darkCard">
              <span className="text-[10px] font-bold uppercase text-slate-400">Canopy Cover</span>
              <p className="mt-1 text-sm font-black text-slate-900 dark:text-white">
                88.5% Closed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
