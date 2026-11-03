import {
  CheckCircle2,
  CloudRain,
  Droplets,
  Lock,
  Thermometer,
  Waves,
  Wind,
} from 'lucide-react'

interface WeatherGatedAdvisorProps {
  temperature: number
  humidity: number
  windSpeed: number
  rainfallProb: number
  favourableSpraying: boolean
}

export function WeatherGatedSprayAdvisor({
  temperature,
  humidity,
  windSpeed,
  rainfallProb,
  favourableSpraying,
}: WeatherGatedAdvisorProps) {
  // Delta T = Dry bulb temp minus wet bulb temp (simplified estimation ~ temp * (1 - humidity/100) * 0.75)
  const deltaT = Number((temperature * (1 - humidity / 100) * 0.85).toFixed(1))
  const isDeltaTOptimal = deltaT >= 2 && deltaT <= 8

  // Rain gating: if rain > 35%, defer irrigation
  const deferIrrigation = rainfallProb > 35

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 dark:border-agri-darkBorder">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            <CloudRain className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Weather-Gated Smart Spraying & Irrigation Window Advisor
            </h3>
            <p className="text-[11px] text-slate-500">
              Evaluates real-time micro-climatic parameters (Delta T, wind drift & rain wash-off hazard)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-black ${
              favourableSpraying
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
            }`}
          >
            {favourableSpraying ? 'Optimal Spray Window' : 'Advisory Lock Active'}
          </span>
        </div>
      </div>

      {/* Sensor Conditions Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Delta T Window</span>
            <Thermometer className="h-3.5 w-3.5 text-orange-500" />
          </div>
          <p className="mt-1 text-lg font-black text-slate-900 dark:text-white font-mono">
            {deltaT}°C
          </p>
          <span className={`text-[10px] font-bold ${isDeltaTOptimal ? 'text-emerald-600' : 'text-amber-600'}`}>
            {isDeltaTOptimal ? 'Ideal Droplet Survival (2–8°C)' : 'Droplet Evaporation Risk'}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Wind Speed</span>
            <Wind className="h-3.5 w-3.5 text-teal-600" />
          </div>
          <p className="mt-1 text-lg font-black text-slate-900 dark:text-white font-mono">
            {windSpeed} <span className="text-xs font-normal text-slate-400">km/h</span>
          </p>
          <span className={`text-[10px] font-bold ${windSpeed <= 12 ? 'text-emerald-600' : 'text-red-600'}`}>
            {windSpeed <= 12 ? 'Low Drift Hazard (<12 km/h)' : 'High Drift Risk — Hold Boom'}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Rain Probability</span>
            <Droplets className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <p className="mt-1 text-lg font-black text-slate-900 dark:text-white font-mono">
            {rainfallProb}%
          </p>
          <span className={`text-[10px] font-bold ${rainfallProb <= 20 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {rainfallProb <= 20 ? 'Zero Wash-off Risk' : 'Wash-off Risk in 6 Hours'}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Canopy Moisture</span>
            <Waves className="h-3.5 w-3.5 text-purple-500" />
          </div>
          <p className="mt-1 text-lg font-black text-slate-900 dark:text-white font-mono">
            {humidity}% RH
          </p>
          <span className="text-[10px] text-slate-500">
            Foliar absorption threshold
          </span>
        </div>
      </div>

      {/* Advisory Banner */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl p-4 text-xs border ${
        favourableSpraying
          ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-200'
          : 'bg-red-50/90 border-red-200 text-red-950 dark:bg-red-950/30 dark:border-red-900 dark:text-red-200'
      }`}>
        <div className="flex items-start gap-2.5">
          {favourableSpraying ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
          ) : (
            <Lock className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
          )}
          <div>
            <span className="font-extrabold block">
              {favourableSpraying
                ? 'Spraying Clearance Granted: Calibrated nozzles at 2.2 bar pressure between 07:30 AM – 10:30 AM.'
                : 'Spraying Advisory Lock Active: Hold chemical foliar applications until wind drops below 12 km/h.'}
            </span>
            {deferIrrigation && (
              <p className="mt-1 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                ⚡ <strong>Smart Irrigation Advisory:</strong> Rain probability is {rainfallProb}%. Defer tubewell pumping to prevent waterlogging and conserve ~₹1,400 in diesel/electricity.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
