import { useState } from 'react'
import {
  BarChart3,
  Download,
  FileText,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  cropDistributionPieData,
  cropHealthComparisonData,
  cropHealthDistribution,
  diseaseDistributionData,
  monthlyDiseaseTrends,
  soilNutrientComparisonData,
} from '../data/analytics'
import { useAppStore } from '../store/useAppStore'
import { AudioAdvisoryButton } from '../components/common/AudioAdvisoryButton'
import { getDiseaseAnalyticsAudioNarrative } from '../lib/advisorySpeech'
import { SporePressureEpidemiology } from '../components/analytics/SporePressureEpidemiology'
import { SentinelNdviViewer } from '../components/satellite/SentinelNdviViewer'
import { CadastralDiseaseHeatmap } from '../components/analytics/CadastralDiseaseHeatmap'
import { FracResistanceTracker } from '../components/analytics/FracResistanceTracker'
import { EconomicThresholdDamage } from '../components/analytics/EconomicThresholdDamage'
import { PathogenTaxonomyMatrix } from '../components/analytics/PathogenTaxonomyMatrix'
import { PhytosanitaryAuditModal } from '../components/analytics/PhytosanitaryAuditModal'

export function AnalyticsPage() {
  const { weather, selectedRegion, t } = useAppStore()
  const [dateRange, setDateRange] = useState<'30d' | '90d' | '1yr'>('1yr')
  const [chartViewMode, setChartViewMode] = useState<'bar' | 'line'>('bar')
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false)

  // CSV export handler
  const handleExportCSV = () => {
    const csvRows = [
      ['Month', 'Total Cases', 'Growth Rate (%)', 'Rainfall (mm)', 'Avg Temp (°C)'],
      ...monthlyDiseaseTrends.map((r) => [r.month, r.totalCases, r.growthRate, r.rainfall, r.avgTemp]),
    ]
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'crop_doctor_disease_trends_2026.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              <BarChart3 className="h-4 w-4" />
            </span>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {t('analytics.badge')}
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {t('analytics.title')} — {selectedRegion}
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            Plant Pathology Epidemiological Surveillance, FRAC Resistance & PMFBY Phytosanitary Intelligence
          </p>
        </div>

        {/* Action Controls & Voice Player */}
        <div className="flex flex-wrap items-center gap-2.5">
          <AudioAdvisoryButton
            label="Audio Debrief"
            variant="solid"
            getNarrative={(l) =>
              getDiseaseAnalyticsAudioNarrative(
                {
                  location: selectedRegion,
                  activeCasesCount: 380,
                  sporePressureIndex: 82,
                  primaryThreat: 'Yellow Rust & Late Blight',
                  avoidedLossInr: 428000,
                },
                l
              )
            }
          />

          <button
            type="button"
            onClick={() => setIsAuditModalOpen(true)}
            className="flex items-center gap-1.5 rounded-2xl bg-forest-800 px-4 py-2 text-xs font-black text-white hover:bg-forest-900 dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-sm transition active:scale-95"
          >
            <FileText className="h-4 w-4 text-emerald-300" />
            Export PMFBY Audit
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-extrabold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-slate-200"
          >
            <Download className="h-4 w-4 text-emerald-600" /> {t('analytics.exportCSV')}
          </button>
        </div>
      </div>

      {/* Date Range Selector Pill Strip */}
      <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-2.5 dark:bg-agri-darkCard border border-slate-200/80 dark:border-agri-darkBorder">
        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 ml-2">
          Surveillance Epoch Filter:
        </span>
        <div className="flex rounded-xl bg-slate-200/70 p-1 dark:bg-agri-darkSurface">
          {[
            { id: '30d', label: 'Last 30 Days' },
            { id: '90d', label: 'Quarterly' },
            { id: '1yr', label: 'Full Year 2026' },
          ].map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setDateRange(btn.id as any)}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                dateRange === btn.id
                  ? 'bg-forest-800 text-white shadow-xs dark:bg-emerald-600'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Module 1: Epidemiological Spore Pressure Index & Pathogen Infection Velocity (SEIR Model) */}
      <SporePressureEpidemiology
        temperature={weather.temp}
        humidity={weather.humidity}
        windSpeed={weather.windSpeed}
        windDirection={weather.windDirection}
      />

      {/* Module 2: Space-to-Field Sentinel-2 Multi-Spectral NDVI Health Heatmap */}
      <SentinelNdviViewer />

      {/* Module 3: Cadastral Disease Outbreak Heatmap & Agro-Climatic Vulnerability Clusters */}
      <CadastralDiseaseHeatmap />

      {/* Module 3 & 4: FRAC Chemical Resistance Tracker & Economic Threshold (ETL) Damage */}
      <div className="grid gap-6 lg:grid-cols-2">
        <FracResistanceTracker />
        <EconomicThresholdDamage />
      </div>

      {/* Module 5: Multi-Class Pathogen Taxonomy & Etiological Composition */}
      <PathogenTaxonomyMatrix />

      {/* Historical Longitudinal Trends Section */}
      <div className="space-y-6 pt-2">
        <div className="border-b border-slate-200 pb-2 dark:border-agri-darkBorder">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            Longitudinal Field Analytics & Crop Health Distribution
          </h2>
          <p className="text-xs text-slate-500">
            Multi-year sensor observations, foliar health comparisons, and estate soil nutrient profiles
          </p>
        </div>

        {/* Row: Crop Health Comparison & Crop Health Donut */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Crop Health Multi-Bar Chart (8 cols) */}
          <div className="lg:col-span-8 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  A. Crop Health Comparison Over Time
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Acreage breakdown: Healthy vs. Infected vs. At-Risk
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-agri-darkBorder dark:bg-agri-darkCard text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setChartViewMode('bar')}
                  className={`px-2.5 py-1 rounded-lg ${chartViewMode === 'bar' ? 'bg-white shadow-xs dark:bg-agri-darkSurface text-emerald-700' : 'text-slate-500'}`}
                >
                  Stacked Bar
                </button>
                <button
                  type="button"
                  onClick={() => setChartViewMode('line')}
                  className={`px-2.5 py-1 rounded-lg ${chartViewMode === 'line' ? 'bg-white shadow-xs dark:bg-agri-darkSurface text-emerald-700' : 'text-slate-500'}`}
                >
                  Trend Lines
                </button>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartViewMode === 'bar' ? (
                  <BarChart data={cropHealthComparisonData} barCategoryGap="25%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis unit=" ac" stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="healthy" name="Healthy (Acres)" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="infected" name="Infected (Acres)" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="atRisk" name="At Risk (Acres)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <LineChart data={cropHealthComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis unit=" ac" stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="healthy" name="Healthy" stroke="#10B981" strokeWidth={3} />
                    <Line type="monotone" dataKey="infected" name="Infected" stroke="#EF4444" strokeWidth={3} />
                    <Line type="monotone" dataKey="atRisk" name="At Risk" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Crop Health Distribution Donut (4 cols) */}
          <div className="lg:col-span-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Crop Health Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total Farm Estate: 2,402 Acres
              </p>

              <div className="h-44 w-full mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip />
                    <Pie
                      data={cropHealthDistribution}
                      dataKey="count"
                      nameKey="category"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {cropHealthDistribution.map((entry) => (
                        <Cell key={entry.category} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-3 dark:border-agri-darkBorder text-xs">
              {cropHealthDistribution.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.category}
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {item.count} ac ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row: Disease Distribution Bar & Primary Crop Acreage Pie */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Disease Distribution Bar Chart (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              B. Disease Distribution Incidence (Active Cases)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Early Blight, Late Blight, Leaf Rust, Leaf Blast, Bacterial Spot
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={diseaseDistributionData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                  <YAxis dataKey="disease" type="category" stroke="#94a3b8" fontSize={11} width={90} />
                  <Tooltip />
                  <Bar dataKey="cases" name="Cases Identified" radius={[0, 6, 6, 0]}>
                    {diseaseDistributionData.map((d) => (
                      <Cell key={d.disease} fill={d.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Crop Acreage Distribution Pie (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              D. Primary Crop Cultivation Acreage
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              Wheat, Rice, Cotton, Tomato, Potato
            </p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={cropDistributionPieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={75}
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {cropDistributionPieData.map((c) => (
                      <Cell key={c.name} fill={c.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-2 dark:border-agri-darkBorder">
              {cropDistributionPieData.map((c) => (
                <div key={c.name} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="font-bold text-slate-700 dark:text-slate-300">{c.name}:</span>
                  <span className="text-slate-500">{c.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row: Monthly Disease Trends (Jan-Dec) Area Chart */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                C. Monthly Disease Trends (January — December 2026)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total detected disease cases correlated with monsoon rainfall &amp; canopy humidity surges
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-md bg-forest-800" /> Cases
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-md bg-sky-400" /> Rainfall (mm)
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyDiseaseTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="totalCases" name="Disease Cases" stroke="#166534" fill="#166534" fillOpacity={0.25} strokeWidth={2} />
                <Area type="monotone" dataKey="rainfall" name="Rainfall (mm)" stroke="#38BDF8" fill="#38BDF8" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row: Soil Nutrient Comparison Across Farm Plots */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            E. Soil Nutrient Comparison Across Estate Sectors
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Nitrogen, Phosphorus, Potassium &amp; pH across North Field A, North Field B, South Valley C, East Orchard D, West Canal E
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={soilNutrientComparisonData} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="plot" stroke="#94a3b8" fontSize={11} />
                <YAxis unit=" kg/ha" stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Legend />
                <Bar dataKey="nitrogen" name="Nitrogen (N)" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="phosphorus" name="Phosphorus (P)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="potassium" name="Potassium (K)" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Official PMFBY Crop Insurance & Phytosanitary Audit Modal */}
      <PhytosanitaryAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        location={selectedRegion}
      />
    </div>
  )
}
