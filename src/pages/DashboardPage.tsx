import { useState } from 'react'
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Droplets,
  FileText,
  FlaskConical,
  GraduationCap,
  Leaf,
  ScanEye,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Thermometer,
  TrendingUp,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { useAppStore } from '../store/useAppStore'
import { AudioAdvisoryButton } from '../components/common/AudioAdvisoryButton'
import {
  getMorningOperationsBriefingAudio,
  getWeatherAlertAudioNarrative,
} from '../lib/advisorySpeech'
import { CadastralFarmParcelMap } from '../components/dashboard/CadastralFarmParcelMap'
import { NdviCanopyAnalyzer } from '../components/dashboard/NdviCanopyAnalyzer'
import { OperationsWorkOrderFeed } from '../components/dashboard/OperationsWorkOrderFeed'
import { MandiCommodityTicker } from '../components/dashboard/MandiCommodityTicker'
import { IotSensorMeshStatus } from '../components/dashboard/IotSensorMeshStatus'
import { OperationsBriefingModal } from '../components/dashboard/OperationsBriefingModal'

// Mini sparkline data for KPI cards
const sparklineHealthy = [
  { val: 1200 }, { val: 1350 }, { val: 1500 }, { val: 1680 }, { val: 1780 }, { val: 1840 },
]
const sparklineInfected = [
  { val: 420 }, { val: 390 }, { val: 360 }, { val: 380 }, { val: 350 }, { val: 380 },
]
const sparklineSoil = [
  { val: 78 }, { val: 80 }, { val: 82 }, { val: 79 }, { val: 83 }, { val: 84 },
]
const sparklineTemp = [
  { val: 22 }, { val: 24 }, { val: 27 }, { val: 25 }, { val: 23 }, { val: 24 },
]

export function DashboardPage() {
  const { weather, soilReading, lastDiagnosis, selectedRegion, t } = useAppStore()
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false)

  const kpis = [
    {
      title: t('kpi.totalCrops'),
      value: '2,402',
      unit: 'Acres',
      change: '+8.4%',
      isPositive: true,
      status: t('dashboard.optimalCoverage'),
      icon: Leaf,
      color: 'text-emerald-700 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      data: sparklineHealthy,
      stroke: '#10B981',
    },
    {
      title: t('kpi.healthyRatio'),
      value: '76.6%',
      unit: '1,840 Acres',
      change: '+3.2%',
      isPositive: true,
      status: t('dashboard.healthyBenchmark'),
      icon: ShieldCheck,
      color: 'text-forest-800 dark:text-emerald-300',
      bg: 'bg-forest-50 dark:bg-agri-darkCard',
      data: sparklineHealthy,
      stroke: '#166534',
    },
    {
      title: t('kpi.infectedPlots'),
      value: '15.8%',
      unit: '380 Cases',
      change: '-2.1%',
      isPositive: true, // Lower infection is positive
      status: t('dashboard.containmentActive'),
      icon: ShieldAlert,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      data: sparklineInfected,
      stroke: '#F59E0B',
    },
    {
      title: t('kpi.avgSoilHealth'),
      value: `${soilReading.fertilityScore} / 100`,
      unit: soilReading.qualityStatus,
      change: '+1.5%',
      isPositive: true,
      status: 'Balanced NPK',
      icon: FlaskConical,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      data: sparklineSoil,
      stroke: '#3B82F6',
    },
    {
      title: t('kpi.currentTemp'),
      value: `${weather.temp}°C`,
      unit: `${t('dashboard.feelsLike')} ${weather.feelsLike}°C`,
      change: 'Normal',
      isPositive: true,
      status: weather.condition,
      icon: Thermometer,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-950/40',
      data: sparklineTemp,
      stroke: '#F97316',
    },
    {
      title: t('kpi.rainfallProb'),
      value: `${weather.rainfallProb}%`,
      unit: `${weather.humidity}% ${t('weather.humidity')}`,
      change: weather.rainfallProb > 50 ? t('dashboard.wetWet') : t('dashboard.dryDry'),
      isPositive: weather.rainfallProb <= 50,
      status: weather.favourableSpraying ? t('weather.favourable') : t('weather.unfavourable'),
      icon: Droplets,
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-950/40',
      data: sparklineSoil,
      stroke: '#06B6D4',
    },
  ]

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      {/* Top Banner / Precision Farm Command Center Welcome Row */}
      <div className="flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-900 via-forest-900 to-emerald-950 p-6 text-white shadow-xl dark:border-agri-darkBorder sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-emerald-300">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {t('dashboard.badge')}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
            {t('dashboard.title')} — {selectedRegion}
          </h1>
          <p className="mt-1 text-xs text-emerald-100/80 sm:text-sm">
            {t('dashboard.subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <AudioAdvisoryButton
            label="Morning Briefing"
            variant="ghost"
            getNarrative={(l) =>
              getMorningOperationsBriefingAudio(
                {
                  totalAcres: 2402,
                  healthyRatio: 76.6,
                  activeAlertsCount: 3,
                  weatherTemp: weather.temp,
                  weatherCondition: weather.condition,
                },
                l
              )
            }
          />

          <button
            type="button"
            onClick={() => setIsBriefingModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95 shadow-sm"
          >
            <FileText className="h-4 w-4 text-emerald-300" />
            Export Shift Log
          </button>

          <Link
            to="/disease-detection"
            className="flex items-center gap-2 rounded-2xl bg-lime-400 px-4 py-2.5 text-xs font-extrabold text-slate-900 shadow-lg shadow-lime-400/20 transition hover:bg-lime-300 active:scale-95"
          >
            <ScanEye className="h-4 w-4" /> {t('dashboard.action.scanLeaf')}
          </Link>
          <Link
            to="/recommendations"
            className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
          >
            <Sparkles className="h-4 w-4" /> {t('nav.cropRecommendations')}
          </Link>
        </div>
      </div>

      {/* Advisory Alert Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-xs text-amber-900 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <p className="font-semibold">
            {weather.alerts[0]?.title || 'Agronomic Advisory'}:{' '}
            <span className="font-normal text-amber-800 dark:text-amber-300">
              {weather.alerts[0]?.description || 'Canopy humidity optimal. No immediate fungal outbreak alert.'}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <AudioAdvisoryButton
            label="Listen Advisory"
            variant="ghost"
            getNarrative={(l) =>
              getWeatherAlertAudioNarrative(
                {
                  title: weather.alerts[0]?.title || 'Agronomic Advisory',
                  description: weather.alerts[0]?.description || 'Canopy humidity optimal. No immediate fungal outbreak alert.',
                  location: selectedRegion,
                },
                l
              )
            }
          />
          <Link
            to="/weather"
            className="flex-shrink-0 font-bold text-amber-700 underline dark:text-amber-300"
          >
            View Weather Report →
          </Link>
        </div>
      </div>

      {/* 6 Key Performance Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div
              key={kpi.title}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-card-hover dark:border-agri-darkBorder dark:bg-agri-darkSurface"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {kpi.title}
                  </p>
                  <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                    {kpi.value}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {kpi.unit}
                  </p>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${kpi.bg} ${kpi.color} shadow-sm transition group-hover:scale-110`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>

              {/* Sparkline & Status */}
              <div className="mt-4 flex items-end justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center text-xs font-extrabold ${
                      kpi.isPositive
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {kpi.isPositive ? (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    )}
                    {kpi.change}
                  </span>
                  <span className="text-[10px] text-slate-400">vs last cycle</span>
                </div>

                {/* Mini trend chart */}
                <div className="h-8 w-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={kpi.data}>
                      <Area
                        type="monotone"
                        dataKey="val"
                        stroke={kpi.stroke}
                        strokeWidth={2}
                        fill={kpi.stroke}
                        fillOpacity={0.15}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-2 border-t border-slate-100 pt-2 text-[10px] font-semibold text-slate-400 dark:border-agri-darkBorder dark:text-slate-400">
                Status:{' '}
                <span className="text-slate-700 dark:text-slate-300 font-bold">
                  {kpi.status}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Module 1: Interactive Cadastral Farm Parcel GIS Map & Drone Sentinel */}
      <CadastralFarmParcelMap />

      {/* Module 2: Live NDVI (Normalized Difference Vegetation Index) Spectrum Analyzer */}
      <NdviCanopyAnalyzer />

      {/* Module 3 & 5: AI Operations Work Orders & LoRaWAN Hardware IoT Mesh */}
      <div className="grid gap-6 lg:grid-cols-2">
        <OperationsWorkOrderFeed />
        <IotSensorMeshStatus />
      </div>

      {/* Module 4: Real-Time APMC Mandi Commodity Market Ticker & Harvest Valuation */}
      <MandiCommodityTicker />

      {/* Recent Disease Scanner Diagnostic & Quick Actions Center */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Disease Diagnostic Snapshot */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-agri-darkBorder">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                {t('dashboard.latestDiag')}
              </p>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {lastDiagnosis?.cropName} — {lastDiagnosis?.diseaseName}
              </h2>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                lastDiagnosis?.status === 'healthy'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
              }`}
            >
              {lastDiagnosis?.confidence}% {t('disease.confidence')}
            </span>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-agri-darkBorder">
              <img
                src={lastDiagnosis?.sampleImage}
                alt={lastDiagnosis?.cropName}
                className="h-36 w-full object-cover"
              />
              <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                Sample Foliage
              </div>
            </div>

            <div className="sm:col-span-2 space-y-3">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {t('disease.symptoms')}:
                </p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {lastDiagnosis?.symptoms[0]}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {t('dashboard.recommended')}:
                </p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {lastDiagnosis?.recommendedTreatment[0]}
                </p>
              </div>

              <div className="pt-1 flex items-center gap-3">
                <Link
                  to="/disease-detection"
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-forest-800 hover:underline dark:text-emerald-400"
                >
                  {t('dashboard.viewFull')} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Agronomic Action Center */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            {t('dashboard.quickOps')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fast access to high-impact workflows
          </p>

          <div className="mt-4 space-y-2.5">
            <Link
              to="/disease-detection"
              className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3 text-xs font-bold text-slate-800 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-200 dark:hover:border-emerald-500"
            >
              <div className="flex items-center gap-2.5">
                <ScanEye className="h-4 w-4 text-emerald-600" />
                <span>{t('dashboard.action.scanLeaf')}</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>

            <Link
              to="/soil-health"
              className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3 text-xs font-bold text-slate-800 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-200 dark:hover:border-emerald-500"
            >
              <div className="flex items-center gap-2.5">
                <FlaskConical className="h-4 w-4 text-blue-600" />
                <span>{t('dashboard.action.soilSim')}</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>

            <Link
              to="/calendar"
              className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3 text-xs font-bold text-slate-800 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-200 dark:hover:border-emerald-500"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-forest-700" />
                <span>{t('dashboard.action.calendar')}</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>

            <Link
              to="/reports"
              className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3 text-xs font-bold text-slate-800 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-200 dark:hover:border-emerald-500"
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className="h-4 w-4 text-teal-600" />
                <span>{t('dashboard.action.reports')}</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>

            <Link
              to="/schemes"
              className="flex items-center justify-between rounded-2xl border border-amber-200/60 bg-amber-50/60 p-3 text-xs font-bold text-amber-900 transition hover:border-amber-400 hover:bg-amber-100/70 dark:border-amber-500/20 dark:bg-amber-950/30 dark:text-amber-200 dark:hover:border-amber-500"
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>Punjab Govt Schemes &amp; Masterclasses</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-black uppercase text-amber-700 dark:text-amber-300">
                DBT Portal <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Printable Operations Shift Report Modal */}
      <OperationsBriefingModal
        isOpen={isBriefingModalOpen}
        onClose={() => setIsBriefingModalOpen(false)}
      />
    </div>
  )
}
