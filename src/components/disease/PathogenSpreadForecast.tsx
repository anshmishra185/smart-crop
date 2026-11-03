import {
  AlertTriangle,
  CloudRain,
  Droplets,
  ShieldAlert,
  Thermometer,
  Wind,
} from 'lucide-react'
import type { DiseaseDetectionResult } from '../../types'

interface PathogenSpreadForecastProps {
  result: DiseaseDetectionResult
  currentHumidity?: number
  currentTemp?: number
}

export function PathogenSpreadForecast({
  result,
  currentHumidity = 78,
  currentTemp = 24,
}: PathogenSpreadForecastProps) {
  const forecast = result.spreadForecast || {
    riskLevel: result.riskLevel || 'High',
    sporeGerminationWindow: 'Critical Alert: Spore germination triggers when surface leaf wetness persists under high ambient humidity (>80%).',
    humidityThreshold: 80,
    tempRange: '22°C – 28°C',
    advice: 'Apply protective foliar fungicide within 24 hours before anticipated drizzle to bar secondary conidial germination.',
  }

  const isCritical = forecast.riskLevel === 'Critical'
  const isHigh = forecast.riskLevel === 'High'

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 dark:border-agri-darkBorder">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              72-Hour Pathogen Inoculation & Micro-Climate Spread Risk
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Correlating current ambient telemetry with pathogen biological sporulation threshold curves.
            </p>
          </div>
        </div>

        {/* Risk Level Badge */}
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${isCritical
              ? 'bg-red-500 text-white shadow-xs'
              : isHigh
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-emerald-500 text-white shadow-xs'
            }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          {forecast.riskLevel} Secondary Spread Risk
        </span>
      </div>

      {/* Meteorological Micro-Climate Indicators */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
            <Droplets className="h-3.5 w-3.5 text-blue-500" /> Ambient Humidity
          </div>
          <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">
            {currentHumidity}%
          </p>
          <span className="text-[9px] text-slate-500">Threshold: &gt;{forecast.humidityThreshold}%</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
            <Thermometer className="h-3.5 w-3.5 text-orange-500" /> Temperature Band
          </div>
          <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">
            {currentTemp}°C
          </p>
          <span className="text-[9px] text-slate-500">Optimum: {forecast.tempRange}</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
            <Wind className="h-3.5 w-3.5 text-emerald-500" /> Wind Inoculum Vector
          </div>
          <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">
            Active Spores
          </p>
          <span className="text-[9px] text-slate-500">Anemophilous dispersal</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
            <CloudRain className="h-3.5 w-3.5 text-sky-500" /> Leaf Wetness
          </div>
          <p className="mt-1 text-xl font-black text-red-600 dark:text-red-400">
            High Risk
          </p>
          <span className="text-[9px] text-slate-500">Foliar wash-off potential</span>
        </div>
      </div>

      {/* Biological Warning Callout */}
      <div className="rounded-2xl border border-red-200 bg-red-50/70 p-4 text-xs dark:border-red-950 dark:bg-red-950/20">
        <p className="font-bold text-red-900 dark:text-red-300">
          {forecast.sporeGerminationWindow}
        </p>
        <p className="mt-1.5 font-semibold text-red-800 dark:text-red-400">
          Actionable Advisory: {forecast.advice}
        </p>
      </div>
    </div>
  )
}
