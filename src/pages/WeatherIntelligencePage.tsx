import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Cloud,
  CloudRain,
  CloudSun,
  Compass,
  Droplets,
  Eye,
  Gauge,
  MapPin,
  RefreshCw,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
} from 'lucide-react'
import { useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { mockWeatherService } from '../services/mockWeatherService'
import { useAppStore } from '../store/useAppStore'

export function WeatherIntelligencePage() {
  const { selectedRegion, setSelectedRegion, weather } = useAppStore()
  const regions = mockWeatherService.getAvailableRegions()
  const [activeChart, setActiveChart] = useState<'temp' | 'rain' | 'humidity' | 'wind'>('temp')

  const hourlyChartData = weather.hourly.map((h) => ({
    time: h.time,
    temp: h.temp,
    humidity: h.humidity,
    rainfallProb: h.rainfallProb,
    wind: Math.round(weather.windSpeed * (0.8 + Math.random() * 0.4)),
  }))

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header with Location Selector */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-400">
              <CloudSun className="h-4 w-4" />
            </span>
            <p className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
              Micro-Climate Intelligence &amp; Agronomic Forecasting
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            Agricultural Weather Intelligence
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            Foliar spraying windows, precipitation alerts, and evapotranspiration metrics.
          </p>
        </div>

        {/* Region Switcher */}
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400 ml-2" />
          <span className="text-xs font-bold text-slate-500">Agro-Climatic Zone:</span>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="cursor-pointer rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm outline-none dark:bg-agri-darkSurface dark:text-slate-200"
          >
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Current Weather Card & Agronomic Advisories Strip */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Main Current Weather Tile (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-emerald-100 bg-gradient-to-br from-forest-800 to-emerald-700 p-6 text-white shadow-xl dark:border-agri-darkBorder">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-200">
                Current Conditions
              </p>
              <h2 className="text-xl font-black">{weather.location}</h2>
              <p className="text-xs text-emerald-100/80">{weather.region}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-md">
              <Sun className="h-8 w-8 text-amber-300 animate-spin-slow" />
            </div>
          </div>

          <div className="mt-6 flex items-baseline gap-4">
            <span className="text-6xl font-black tracking-tight">{weather.temp}°C</span>
            <div>
              <p className="text-sm font-bold text-emerald-100">Feels like {weather.feelsLike}°C</p>
              <p className="text-xs text-emerald-200">{weather.condition}</p>
            </div>
          </div>

          {/* Micro metrics grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/20 pt-5 sm:grid-cols-4">
            <div>
              <p className="text-[10px] uppercase text-emerald-200 font-bold">Humidity</p>
              <p className="text-sm font-black">{weather.humidity}%</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-emerald-200 font-bold">Wind Speed</p>
              <p className="text-sm font-black">{weather.windSpeed} km/h</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-emerald-200 font-bold">Rainfall Prob</p>
              <p className="text-sm font-black">{weather.rainfallProb}%</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-emerald-200 font-bold">UV Index</p>
              <p className="text-sm font-black">{weather.uvIndex} (Mod)</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3 text-xs text-emerald-100">
            <span className="flex items-center gap-1.5">
              <Sunrise className="h-4 w-4 text-amber-300" /> {weather.sunrise}
            </span>
            <span className="flex items-center gap-1.5">
              <Sunset className="h-4 w-4 text-orange-300" /> {weather.sunset}
            </span>
            <span className="flex items-center gap-1.5">
              <Gauge className="h-4 w-4" /> {weather.pressure} hPa
            </span>
          </div>
        </div>

        {/* Right: Agricultural Weather Intelligence Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Spraying Conditions Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    weather.favourableSpraying
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                  }`}
                >
                  {weather.favourableSpraying ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Foliar Spraying Suitability: {weather.favourableSpraying ? 'FAVOURABLE' : 'UNFAVOURABLE'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Wind &amp; Rain Wash-off Hazard Evaluation
                  </p>
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-extrabold ${
                  weather.favourableSpraying
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                }`}
              >
                Wind: {weather.windSpeed} km/h ({weather.windDirection})
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {weather.sprayingRecommendation}
            </p>
          </div>

          {/* Irrigation & Soil Moisture Advisory */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                <Droplets className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Irrigation Scheduling Advisory
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Calculated from ambient humidity &amp; 48-hr precipitation model
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {weather.irrigationRecommendation}
            </p>
          </div>

          {/* Active Weather Hazard Alert */}
          {weather.alerts.length > 0 && (
            <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-5 dark:border-amber-900/50 dark:bg-amber-950/30">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-extrabold text-xs">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                {weather.alerts[0].title}
              </div>
              <p className="mt-1 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                {weather.alerts[0].description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 7-Day Forecast Row */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
          7-Day Agricultural Outlook
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Temperature extremes, precipitation probability, and canopy wetness risk
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {weather.daily.map((day) => (
            <div
              key={day.day}
              className="flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 text-center transition hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-agri-darkBorder dark:bg-agri-darkCard"
            >
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{day.day}</p>
              <p className="text-[10px] text-slate-400">{day.date}</p>
              <div className="my-2.5">
                {day.rainfallProb > 40 ? (
                  <CloudRain className="h-6 w-6 text-blue-500" />
                ) : day.condition === 'Cloudy' ? (
                  <Cloud className="h-6 w-6 text-slate-400" />
                ) : (
                  <Sun className="h-6 w-6 text-amber-400" />
                )}
              </div>
              <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                {day.tempMax}° / <span className="text-slate-400 font-normal">{day.tempMin}°</span>
              </p>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-sky-600 dark:text-sky-400">
                <Droplets className="h-3 w-3" /> {day.rainfallProb}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Analytics Charts */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Hourly Agricultural Weather Dynamics
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive diurnal monitoring across key spraying and irrigation indicators
            </p>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-agri-darkBorder dark:bg-agri-darkCard">
            {[
              { id: 'temp', label: 'Temperature' },
              { id: 'rain', label: 'Rainfall Prob' },
              { id: 'humidity', label: 'Humidity' },
              { id: 'wind', label: 'Wind Speed' },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setActiveChart(btn.id as any)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  activeChart === btn.id
                    ? 'bg-forest-800 text-white shadow-sm dark:bg-emerald-600'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Chart Container */}
        <div className="mt-6 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeChart === 'temp' ? (
              <LineChart data={hourlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis unit="°C" stroke="#94a3b8" fontSize={11} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip />
                <Line type="monotone" dataKey="temp" name="Temperature (°C)" stroke="#F97316" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            ) : activeChart === 'rain' ? (
              <BarChart data={hourlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis unit="%" stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="rainfallProb" name="Precipitation Probability (%)" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : activeChart === 'humidity' ? (
              <AreaChart data={hourlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis unit="%" stroke="#94a3b8" fontSize={11} domain={[30, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="humidity" name="Relative Humidity (%)" stroke="#10B981" fill="#10B981" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            ) : (
              <LineChart data={hourlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis unit=" km/h" stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="wind" name="Wind Velocity (km/h)" stroke="#6366F1" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
