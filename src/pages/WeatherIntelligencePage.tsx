import {
  AlertTriangle,
  Cloud,
  CloudRain,
  CloudSun,
  Compass,
  Droplets,
  Gauge,
  MapPin,
  RefreshCw,
  Search,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { mockWeatherService } from '../services/mockWeatherService'
import { punjabDistrictsData, type PunjabDistrictWeather } from '../data/punjabDistricts'
import { useAppStore } from '../store/useAppStore'
import { PunjabInteractiveMap } from '../components/weather/PunjabInteractiveMap'
import { AudioAdvisoryButton } from '../components/common/AudioAdvisoryButton'
import {
  getSprayingAudioNarrative,
  getIrrigationAudioNarrative,
  getWeatherAlertAudioNarrative,
} from '../lib/advisorySpeech'

type WeatherChartMetric = 'temp' | 'rain' | 'humidity' | 'wind'
type SubZoneFilter = 'All' | 'Majha' | 'Doaba' | 'Central Malwa' | 'South-Western Malwa' | 'Kandi Foothills'

/** Returns appropriate meteorological icon based on condition string */
function getWeatherIcon(condition?: string, className = 'h-6 w-6') {
  const cond = (condition || '').toLowerCase()
  if (cond.includes('rain') || cond.includes('shower') || cond.includes('drizzle')) {
    return <CloudRain className={`${className} text-sky-400`} />
  }
  if (cond.includes('cloud') || cond.includes('overcast') || cond.includes('fog')) {
    return <Cloud className={`${className} text-slate-300`} />
  }
  if (cond.includes('storm') || cond.includes('thunder')) {
    return <AlertTriangle className={`${className} text-amber-400`} />
  }
  if (cond.includes('partly')) {
    return <CloudSun className={`${className} text-amber-300`} />
  }
  return <Sun className={`${className} text-amber-300`} />
}

export function WeatherIntelligencePage() {
  const {
    selectedRegion,
    setSelectedRegion,
    selectedPunjabDistrict,
    setSelectedPunjabDistrict,
    weather,
    isWeatherLive,
    isWeatherLoading,
    weatherLastUpdated,
    fetchLiveDistrictWeather,
    t,
  } = useAppStore()

  const regions = mockWeatherService.getAvailableRegions()
  const [activeChart, setActiveChart] = useState<WeatherChartMetric>('temp')
  const [districtSearch, setDistrictSearch] = useState('')
  const [selectedSubZone, setSelectedSubZone] = useState<SubZoneFilter>('All')
  const [allDistrictsLive, setAllDistrictsLive] = useState<Record<string, PunjabDistrictWeather>>(punjabDistrictsData)
  const [isGridSyncing, setIsGridSyncing] = useState(true)
  const [radarViewMode, setRadarViewMode] = useState<'map' | 'cards' | 'both'>('both')

  // Fetch live meteorological telemetry on mount and when district changes
  useEffect(() => {
    void fetchLiveDistrictWeather(selectedPunjabDistrict)
  }, [selectedPunjabDistrict, fetchLiveDistrictWeather])

  // Sync all 23 Punjab districts in parallel for the radar grid
  useEffect(() => {
    let isMounted = true
    void (async () => {
      try {
        const liveMap = await mockWeatherService.fetchAllPunjabDistricts()
        if (isMounted) {
          setAllDistrictsLive(liveMap)
          setIsGridSyncing(false)
        }
      } catch {
        if (isMounted) {
          setIsGridSyncing(false)
        }
      }
    })()

    return () => {
      isMounted = false
    }
  }, [])

  const handleRefresh = () => {
    void fetchLiveDistrictWeather(selectedPunjabDistrict, true)
    setIsGridSyncing(true)
    mockWeatherService
      .fetchAllPunjabDistricts(true)
      .then((liveMap) => {
        setAllDistrictsLive(liveMap)
        setIsGridSyncing(false)
      })
      .catch(() => setIsGridSyncing(false))
  }

  const punjabDistrictsList: PunjabDistrictWeather[] = useMemo(() => {
    return Object.keys(punjabDistrictsData).map((key) => {
      return allDistrictsLive[key] || punjabDistrictsData[key]
    })
  }, [allDistrictsLive])

  // Filter Punjab districts based on search query and sub-zone pill
  const filteredDistricts = useMemo(() => {
    return punjabDistrictsList.filter((d) => {
      const matchesSearch =
        d.districtName.toLowerCase().includes(districtSearch.toLowerCase()) ||
        d.punjabiName.includes(districtSearch) ||
        d.majorCrops.some((c) => c.toLowerCase().includes(districtSearch.toLowerCase()))
      const matchesZone = selectedSubZone === 'All' || d.subZone === selectedSubZone
      return matchesSearch && matchesZone
    })
  }, [punjabDistrictsList, districtSearch, selectedSubZone])

  // Deterministic hourly chart calculations using useMemo
  const hourlyChartData = useMemo(() => {
    const safeHourly = Array.isArray(weather.hourly) ? weather.hourly : []
    const windSpeed = typeof weather.windSpeed === 'number' ? weather.windSpeed : 10
    const windFactors = [0.85, 0.95, 1.1, 1.15, 0.9, 0.8]
    return safeHourly.map((h, idx) => ({
      time: h.time,
      temp: h.temp,
      humidity: h.humidity,
      rainfallProb: h.rainfallProb,
      wind: Math.round(windSpeed * (windFactors[idx % windFactors.length] || 1.0)),
    }))
  }, [weather.hourly, weather.windSpeed])

  const chartButtons: Array<{ id: WeatherChartMetric; label: string }> = [
    { id: 'temp', label: 'Temperature' },
    { id: 'rain', label: 'Rainfall Prob' },
    { id: 'humidity', label: 'Humidity' },
    { id: 'wind', label: 'Wind Speed' },
  ]

  const subZonePills: SubZoneFilter[] = [
    'All',
    'Majha',
    'Doaba',
    'Central Malwa',
    'South-Western Malwa',
    'Kandi Foothills',
  ]

  const activeLocationTitle = selectedRegion === 'Punjab' ? selectedPunjabDistrict : selectedRegion
  const safeDaily = Array.isArray(weather?.daily) ? weather.daily : []
  const safeAlerts = Array.isArray(weather?.alerts) ? weather.alerts : []

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header with Zone & District Selector */}
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
            {t('weather.title')}
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            {t('weather.subtitle')}
          </p>
        </div>

        {/* Location Selectors Strip */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Live Telemetry Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isWeatherLoading || isGridSyncing}
            className="flex items-center gap-1.5 rounded-2xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-800 shadow-sm transition hover:bg-emerald-100 active:scale-95 disabled:opacity-60 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900"
            title="Sync live temperatures from meteorological stations (Weather.com / Open-Meteo)"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isWeatherLoading || isGridSyncing ? 'animate-spin text-emerald-600' : 'text-emerald-700'}`} />
            <span>{isWeatherLoading || isGridSyncing ? t('weather.syncing') : t('weather.liveSync')}</span>
          </button>

          {/* Region Switcher */}
          <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
            <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400 ml-1.5" />
            <span className="text-[11px] font-bold text-slate-500">Zone:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="cursor-pointer rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm outline-none dark:bg-agri-darkSurface dark:text-slate-200"
              aria-label="Select agro-climatic zone"
            >
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* District Switcher (for Punjab) */}
          {selectedRegion === 'Punjab' && (
            <div className="flex items-center gap-1.5 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-1.5 dark:border-emerald-900/60 dark:bg-emerald-950/40">
              <span className="text-[11px] font-extrabold text-emerald-900 dark:text-emerald-300 ml-1.5">
                District:
              </span>
              <select
                value={selectedPunjabDistrict}
                onChange={(e) => setSelectedPunjabDistrict(e.target.value)}
                className="cursor-pointer rounded-xl bg-white px-3 py-1.5 text-xs font-extrabold text-emerald-900 shadow-sm outline-none dark:bg-agri-darkSurface dark:text-emerald-300"
                aria-label="Select Punjab district"
              >
                {mockWeatherService.getPunjabDistrictNames().map((distKey) => {
                  const liveD = allDistrictsLive[distKey] || punjabDistrictsData[distKey]
                  return (
                    <option key={distKey} value={distKey}>
                      {liveD.districtName} ({liveD.punjabiName}) · {liveD.temp}°C
                    </option>
                  )
                })}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Current Weather Card & Agronomic Advisories Strip */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Main Current Weather Tile (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-emerald-100 bg-gradient-to-br from-forest-800 to-emerald-700 p-6 text-white shadow-xl dark:border-agri-darkBorder flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-200">
                    {t('weather.currentConditions')}
                  </p>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-black uppercase text-white backdrop-blur-sm">
                    {activeLocationTitle}
                  </span>
                  {isWeatherLive ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/25 border border-emerald-300/40 px-2 py-0.5 text-[10px] font-bold text-emerald-100 backdrop-blur-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                      Weather.com Calibrated
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-emerald-200">
                      Standard Baseline
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-black mt-1">{weather.location || activeLocationTitle}</h2>
                <p className="text-xs text-emerald-100/80">{weather.region}</p>
                {weatherLastUpdated && (
                  <p className="text-[10px] text-emerald-200/90 font-medium mt-0.5">
                    Synced: {weatherLastUpdated}
                  </p>
                )}
              </div>
              <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-md">
                {getWeatherIcon(weather.condition, 'h-8 w-8')}
              </div>
            </div>

            <div className="mt-6 flex items-baseline gap-4">
              <span className="text-6xl font-black tracking-tight">{weather.temp}°C</span>
              <div>
                <p className="text-sm font-semibold flex items-center gap-1">
                  <Thermometer className="h-3.5 w-3.5 text-amber-300" /> Feels like {weather.feelsLike}°C
                </p>
                <p className="text-xs text-emerald-200">{weather.condition}</p>
              </div>
            </div>

            {/* Micro metrics grid */}
            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/20 pt-5 sm:grid-cols-4">
              <div>
                <p className="text-[10px] uppercase text-emerald-200 font-bold flex items-center gap-1">
                  <Droplets className="h-3 w-3" /> {t('weather.humidity')}
                </p>
                <p className="text-sm font-black">{weather.humidity}%</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-emerald-200 font-bold flex items-center gap-1">
                  <Wind className="h-3 w-3" /> {t('weather.wind')}
                </p>
                <p className="text-sm font-black">{weather.windSpeed} km/h</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-emerald-200 font-bold flex items-center gap-1">
                  <CloudRain className="h-3 w-3" /> Rain Prob
                </p>
                <p className="text-sm font-black">{weather.rainfallProb}%</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-emerald-200 font-bold flex items-center gap-1">
                  <Sun className="h-3 w-3" /> {t('weather.uvIndex')}
                </p>
                <p className="text-sm font-black">{weather.uvIndex} (Mod)</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-3 text-xs text-emerald-100">
            <span className="flex items-center gap-1.5">
              <Sunrise className="h-4 w-4 text-amber-300" /> {weather.sunrise}
            </span>
            <span className="flex items-center gap-1.5">
              <Sunset className="h-4 w-4 text-amber-300" /> {weather.sunset}
            </span>
            <span className="flex items-center gap-1.5">
              <Gauge className="h-4 w-4 text-emerald-200" /> {weather.pressure} hPa
            </span>
          </div>
        </div>

        {/* Right: Spraying Window & Irrigation Advisory Cards (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4">
          {/* Spraying Advisory Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                    weather.favourableSpraying
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                  }`}
                >
                  <Wind className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {t('weather.sprayingAdvisory')} — {activeLocationTitle}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Fungicide, pesticide &amp; foliar nutrient application window
                  </p>
                </div>
              </div>
              <span
                className={`flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-extrabold ${
                  weather.favourableSpraying
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                }`}
              >
                <Compass className="h-3 w-3" /> {weather.windSpeed} km/h ({weather.windDirection})
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {weather.sprayingRecommendation}
            </p>
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-agri-darkBorder flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Field Voice Guidance:</span>
              <AudioAdvisoryButton
                label="Listen Spray Timing"
                getNarrative={(l) =>
                  getSprayingAudioNarrative(
                    {
                      location: activeLocationTitle,
                      isFavourable: weather.favourableSpraying,
                      windSpeed: weather.windSpeed,
                      windDirection: weather.windDirection,
                      recommendation: weather.sprayingRecommendation,
                    },
                    l
                  )
                }
              />
            </div>
          </div>

          {/* Irrigation Schedule Advisory */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                  <Droplets className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {t('weather.irrigationAdvisory')}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Evapotranspiration &amp; root-zone water balance
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-sky-100 px-3 py-0.5 text-xs font-extrabold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                Rain Prob: {weather.rainfallProb}%
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {weather.irrigationRecommendation}
            </p>
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-agri-darkBorder flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Field Voice Guidance:</span>
              <AudioAdvisoryButton
                label="Listen Irrigation Plan"
                getNarrative={(l) =>
                  getIrrigationAudioNarrative(
                    {
                      location: activeLocationTitle,
                      rainfallProb: weather.rainfallProb,
                      humidity: weather.humidity,
                      recommendation: weather.irrigationRecommendation,
                    },
                    l
                  )
                }
              />
            </div>
          </div>

          {/* Active Weather Hazard Alert Banner */}
          {safeAlerts.map((alert, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200"
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <div>
                  <p className="font-extrabold">{alert.title}</p>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                    {alert.description}
                  </p>
                </div>
              </div>
              <AudioAdvisoryButton
                label="Listen Alert"
                getNarrative={(l) =>
                  getWeatherAlertAudioNarrative(
                    {
                      title: alert.title,
                      description: alert.description,
                      location: activeLocationTitle,
                    },
                    l
                  )
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* 🌾 PUNJAB 23-DISTRICT AGRO-WEATHER RADAR SECTION */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-4 dark:border-agri-darkBorder">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                <MapPin className="h-4 w-4" />
              </span>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Punjab High-Resolution District Weather Radar
              </p>
            </div>
            <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
              {t('weather.punjabRadar')}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {t('weather.punjabRadarSub')}
            </p>
          </div>

          {/* Search box for Punjab districts */}
          <div className="relative w-full md:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={districtSearch}
              onChange={(e) => setDistrictSearch(e.target.value)}
              placeholder={t('weather.searchDistrict')}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs font-bold text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-200"
            />
          </div>
        </div>

        {/* View Switcher: Interactive Map vs Grid */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-2xl dark:bg-agri-darkCard">
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span className="text-slate-400 uppercase text-[10px] tracking-wider mr-1">Display:</span>
            <button
              type="button"
              onClick={() => setRadarViewMode('both')}
              className={`rounded-xl px-3 py-1.5 transition ${
                radarViewMode === 'both'
                  ? 'bg-forest-800 text-white shadow-sm dark:bg-emerald-600'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Both (Map + Cards)
            </button>
            <button
              type="button"
              onClick={() => setRadarViewMode('map')}
              className={`rounded-xl px-3 py-1.5 transition ${
                radarViewMode === 'map'
                  ? 'bg-forest-800 text-white shadow-sm dark:bg-emerald-600'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Interactive Map
            </button>
            <button
              type="button"
              onClick={() => setRadarViewMode('cards')}
              className={`rounded-xl px-3 py-1.5 transition ${
                radarViewMode === 'cards'
                  ? 'bg-forest-800 text-white shadow-sm dark:bg-emerald-600'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              District Cards
            </button>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            Real-time AccuWeather & Open-Meteo Synced
          </span>
        </div>

        {/* Interactive SVG Choropleth Map View */}
        {(radarViewMode === 'map' || radarViewMode === 'both') && (
          <PunjabInteractiveMap
            districtsData={allDistrictsLive}
            selectedDistrict={selectedPunjabDistrict}
            onSelectDistrict={(id) => setSelectedPunjabDistrict(id)}
          />
        )}

        {/* Sub-Zone Filter Pills */}
        {(radarViewMode === 'cards' || radarViewMode === 'both') && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              {t('weather.subZone')}:
            </span>
            {subZonePills.map((zone) => (
              <button
                key={zone}
                type="button"
                onClick={() => setSelectedSubZone(zone)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                  selectedSubZone === zone
                    ? 'bg-forest-800 text-white shadow-sm dark:bg-emerald-600'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-agri-darkCard dark:text-slate-300'
                }`}
              >
                {zone}
              </button>
            ))}
            <span className="ml-auto text-xs text-slate-400 font-semibold">
              Showing {filteredDistricts.length} of 23 districts
            </span>
          </div>
        )}

        {/* 23 Punjab District Cards Grid */}
        {(radarViewMode === 'cards' || radarViewMode === 'both') && (
        <div className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredDistricts.length === 0 ? (
            <div className="col-span-full py-10 text-center text-slate-400">
              <Search className="mx-auto h-8 w-8 text-slate-300 mb-2 dark:text-slate-600" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                No Punjab districts found matching &ldquo;{districtSearch}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => {
                  setDistrictSearch('')
                  setSelectedSubZone('All')
                }}
                className="mt-3 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
              >
                Reset Search
              </button>
            </div>
          ) : (
            filteredDistricts.map((d) => {
              const isCurrent = selectedRegion === 'Punjab' && selectedPunjabDistrict === d.districtName
              return (
                <div
                  key={d.districtName}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedPunjabDistrict(d.districtName)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelectedPunjabDistrict(d.districtName)
                    }
                  }}
                  aria-label={`Select ${d.districtName} weather`}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    isCurrent
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/40'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-agri-darkBorder dark:bg-agri-darkCard'
                  }`}
                >
                  {/* District Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white">
                          {d.districtName}
                        </h3>
                        {isCurrent && (
                          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                        {d.punjabiName}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-black text-slate-900 dark:text-white">
                        {d.temp}°C
                      </span>
                      <span className="block text-[10px] text-slate-400 font-medium">
                        Feels {d.feelsLike}°
                      </span>
                    </div>
                  </div>

                  {/* Sub-zone badge & live status */}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {d.subZone}
                      </span>
                      {d.isLive && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[9px] font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          LIVE
                        </span>
                      )}
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold ${
                        d.favourableSpraying
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      }`}
                    >
                      {d.favourableSpraying ? t('weather.spraySafe') : t('weather.delaySpray')}
                    </span>
                  </div>

                  {/* Micro Telemetry metrics */}
                  <div className="mt-3 grid grid-cols-3 gap-1 border-t border-slate-100 pt-2 text-[10px] dark:border-agri-darkBorder text-slate-500">
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-slate-400">Humidity</span>
                      <span className="font-extrabold text-slate-700 dark:text-slate-200">{d.humidity}%</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-slate-400">Wind</span>
                      <span className="font-extrabold text-slate-700 dark:text-slate-200">{d.windSpeed} km/h</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-slate-400">Rain Prob</span>
                      <span className="font-extrabold text-slate-700 dark:text-slate-200">{d.rainfallProb}%</span>
                    </div>
                  </div>

                  {/* Major crops tag */}
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {d.majorCrops.slice(0, 2).map((crop) => (
                      <span
                        key={crop}
                        className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400"
                      >
                        {crop}
                      </span>
                    ))}
                    {d.majorCrops.length > 2 && (
                      <span className="text-[9px] text-slate-400 font-bold self-center">
                        +{d.majorCrops.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
        )}
      </div>

      {/* 7-Day Forecast Row */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-agri-darkBorder">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              {t('weather.sevenDayForecast')} — {weather.location || activeLocationTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Anticipated precipitation, temperature swings, and pest dispersal triggers.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-agri-darkCard dark:text-slate-300">
            7-Day Outlook
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {safeDaily.map((d) => (
            <div
              key={d.day + d.date}
              className="flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 text-center transition hover:border-emerald-300 hover:bg-emerald-50/40 dark:border-agri-darkBorder dark:bg-agri-darkCard"
            >
              <p className="text-xs font-extrabold text-slate-900 dark:text-white">{d.day}</p>
              <p className="text-[10px] text-slate-400">{d.date}</p>
              <div className="my-2 text-amber-500">
                {getWeatherIcon(d.condition, 'h-6 w-6')}
              </div>
              <p className="text-xs font-black text-slate-800 dark:text-slate-100">
                {d.tempMax}° / <span className="text-slate-400">{d.tempMin}°</span>
              </p>
              <p className="mt-1 text-[10px] font-semibold text-sky-600 dark:text-sky-400">
                {d.rainfallProb}% Rain
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Dynamic Charts Section */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-agri-darkBorder">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              {t('weather.hourlyForecast')} — {weather.location || activeLocationTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive Recharts visualization for diurnal agro-meteorological patterns.
            </p>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-agri-darkBorder dark:bg-agri-darkCard">
            {chartButtons.map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setActiveChart(btn.id)}
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
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="temp" name="Temperature (°C)" stroke="#F97316" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            ) : activeChart === 'rain' ? (
              <BarChart data={hourlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis unit="%" stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="rainfallProb" name="Precipitation Probability (%)" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : activeChart === 'humidity' ? (
              <AreaChart data={hourlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis unit="%" stroke="#94a3b8" fontSize={11} domain={[30, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="humidity" name="Relative Humidity (%)" stroke="#10B981" fill="#10B981" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            ) : (
              <LineChart data={hourlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis unit=" km/h" stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="wind" name="Wind Velocity (km/h)" stroke="#6366F1" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
