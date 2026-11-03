import { useState } from 'react'
import {
  Award,
  CheckCircle2,
  Coins,
  Droplets,
  FileText,
  Layers,
  RotateCcw,
  Search,
  Sparkles,
} from 'lucide-react'
import { recommendationService } from '../services/recommendationService'
import { useAppStore } from '../store/useAppStore'
import { AudioAdvisoryButton } from '../components/common/AudioAdvisoryButton'
import { getCropRecommendationAudioNarrative } from '../lib/advisorySpeech'
import { AgroSuitabilityRadar } from '../components/recommendations/AgroSuitabilityRadar'
import { CropGrossMarginCalculator } from '../components/recommendations/CropGrossMarginCalculator'
import { CropRotationPlanner } from '../components/recommendations/CropRotationPlanner'
import { WaterFootprintComparator } from '../components/recommendations/WaterFootprintComparator'
import { CertifiedCultivarMatrix } from '../components/recommendations/CertifiedCultivarMatrix'
import { CropProjectReportModal } from '../components/recommendations/CropProjectReportModal'
import type { CropRecommendationScore, RecommendationFormData } from '../types'

export function RecommendationsPage() {
  const { soilReading, weather, selectedRegion, t } = useAppStore()

  const [form, setForm] = useState<RecommendationFormData>({
    nitrogen: soilReading.nitrogen,
    phosphorus: soilReading.phosphorus,
    potassium: soilReading.potassium,
    temperature: weather.temp,
    humidity: weather.humidity,
    ph: soilReading.ph,
    rainfall: weather.rainfallProb > 40 ? 180 : 85,
    soilMoisture: soilReading.moisture,
    season: 'Rabi (Winter)',
    location: selectedRegion,
  })

  const [recommendations, setRecommendations] = useState<CropRecommendationScore[]>(() =>
    recommendationService.evaluateRecommendations(form)
  )

  const [filterCategory, setFilterCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [activeTabCropId, setActiveTabCropId] = useState<Record<string | number, 'radar' | 'economics' | 'water' | 'cultivars'>>({})
  const [isDprModalOpen, setIsDprModalOpen] = useState<boolean>(false)

  const setCropTab = (cropId: string | number, tab: 'radar' | 'economics' | 'water' | 'cultivars') => {
    setActiveTabCropId((prev) => ({ ...prev, [cropId]: tab }))
  }

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    const results = recommendationService.evaluateRecommendations(form)
    setRecommendations(results)
  }

  const handleReset = () => {
    const defaultForm: RecommendationFormData = {
      nitrogen: 110,
      phosphorus: 45,
      potassium: 160,
      temperature: 24,
      humidity: 60,
      ph: 6.8,
      rainfall: 100,
      soilMoisture: 35,
      season: 'Rabi (Winter)',
      location: 'Punjab',
    }
    setForm(defaultForm)
    setRecommendations(recommendationService.evaluateRecommendations(defaultForm))
  }

  const filteredCrops = recommendations.filter((r) => {
    const matchesCategory = filterCategory === 'All' || r.crop.category === filterCategory
    const matchesSearch =
      r.crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.crop.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const topCrop = recommendations[0]

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              <Sparkles className="h-4 w-4" />
            </span>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {t('recommend.badge')}
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {t('recommend.title')}
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            ICAR & FAO ECOCROP Multi-Dimensional Agro-Ecological Decision Support System
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {topCrop && (
            <AudioAdvisoryButton
              label="Listen Advisory"
              variant="solid"
              getNarrative={(l) =>
                getCropRecommendationAudioNarrative(
                  {
                    location: form.location || selectedRegion,
                    season: form.season || 'Rabi (Winter)',
                    topCropName: topCrop.crop.name,
                    suitabilityScore: topCrop.score,
                    projectedProfitPerAcre: topCrop.economicMetrics?.netProfitPerAcre || 32000,
                    waterFootprint: topCrop.waterMetrics?.consumptionTier || 'Moderate',
                  },
                  l
                )
              }
            />
          )}

          <button
            type="button"
            onClick={() => setIsDprModalOpen(true)}
            className="flex items-center gap-1.5 rounded-2xl bg-forest-800 px-4 py-2.5 text-xs font-black text-white hover:bg-forest-900 dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-sm transition active:scale-95"
          >
            <FileText className="h-4 w-4 text-emerald-300" />
            Export Crop Dossier (DPR)
          </button>
        </div>
      </div>

      {/* Sustainable Crop Rotation Advisory Strip */}
      <CropRotationPlanner />

      {/* Main Grid: Parameters Form (4 cols) & Ranked Crops (8 cols) */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Form Inputs (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <form
            onSubmit={handleCalculate}
            className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-agri-darkBorder">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {t('recommend.parameters')}
              </h2>
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] font-semibold text-slate-400 hover:text-emerald-600 flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" /> {t('common.reset')}
              </button>
            </div>

            {/* Region & Season */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Location:</label>
                <select
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-bold text-slate-800 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-200"
                >
                  <option value="Punjab">Punjab</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="UttarPradesh">Uttar Pradesh</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Gujarat">Gujarat</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Season:</label>
                <select
                  value={form.season}
                  onChange={(e) => setForm({ ...form, season: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-bold text-slate-800 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-200"
                >
                  <option value="Rabi (Winter)">Rabi (Winter)</option>
                  <option value="Kharif (Monsoon)">Kharif (Monsoon)</option>
                  <option value="Zaid (Summer)">Zaid (Summer)</option>
                </select>
              </div>
            </div>

            {/* Soil pH */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Soil pH</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">{form.ph}</span>
              </div>
              <input
                type="range"
                min="4.5"
                max="9.0"
                step="0.1"
                value={form.ph}
                onChange={(e) => setForm({ ...form, ph: parseFloat(e.target.value) })}
                className="w-full accent-emerald-600"
              />
            </div>

            {/* N-P-K */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-500">N (kg/ha)</label>
                <input
                  type="number"
                  value={form.nitrogen}
                  onChange={(e) => setForm({ ...form, nitrogen: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-bold dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-200"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500">P (kg/ha)</label>
                <input
                  type="number"
                  value={form.phosphorus}
                  onChange={(e) => setForm({ ...form, phosphorus: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-bold dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-200"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500">K (kg/ha)</label>
                <input
                  type="number"
                  value={form.potassium}
                  onChange={(e) => setForm({ ...form, potassium: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-bold dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-200"
                />
              </div>
            </div>

            {/* Weather inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500">Temp (°C)</label>
                <input
                  type="number"
                  value={form.temperature}
                  onChange={(e) => setForm({ ...form, temperature: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-bold dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-200"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500">Rainfall (mm)</label>
                <input
                  type="number"
                  value={form.rainfall}
                  onChange={(e) => setForm({ ...form, rainfall: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-bold dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-200"
                />
              </div>
            </div>

            {/* Soil Moisture */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Soil Moisture (VWC)</span>
                <span className="text-blue-600 dark:text-blue-400 font-extrabold">{form.soilMoisture || 35}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="1"
                value={form.soilMoisture || 35}
                onChange={(e) => setForm({ ...form, soilMoisture: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>

            <button
              type="submit"
              className="mt-4 w-full rounded-2xl bg-forest-800 py-3 text-xs font-extrabold text-white shadow-lg shadow-forest-900/20 transition hover:bg-forest-900 active:scale-95 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              Recalculate Agro-Suitability
            </button>
          </form>
        </div>

        {/* Ranked Recommendations List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Filter & Search Bar */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-agri-darkBorder dark:bg-agri-darkSurface sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-xs">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ranked crops..."
                className="w-full rounded-xl bg-slate-50 pl-9 pr-3 py-1.5 text-xs outline-none dark:bg-agri-darkCard dark:text-slate-200"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto">
              {['All', 'Cereal', 'Pulse', 'Vegetable', 'Cash Crop', 'Oilseed'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterCategory(cat)}
                  className={`rounded-xl px-3 py-1 text-xs font-bold transition ${
                    filterCategory === cat
                      ? 'bg-forest-800 text-white dark:bg-emerald-600'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-agri-darkCard dark:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-6">
            {filteredCrops.map((item, rank) => {
              const { crop, score, suitabilityLevel, matchReasons, cautionNotes, radarMetrics, economicMetrics, waterMetrics, certifiedCultivars } = item
              const imageSrc = typeof crop.image === 'string' ? crop.image : (crop.image as any)?.src || ''
              const activeTab = activeTabCropId[crop.id] || 'radar'

              return (
                <div
                  key={crop.id}
                  className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-card transition hover:border-emerald-300 dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-4 p-5 sm:p-6"
                >
                  {/* Top Card Row */}
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* Crop Image */}
                    <div className="relative sm:w-48 h-40 sm:h-auto rounded-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-agri-darkBorder">
                      <img
                        src={imageSrc}
                        alt={crop.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
                        }}
                      />
                      <div className="absolute top-2 left-2 rounded-lg bg-black/60 px-2 py-0.5 text-[10px] font-black text-white backdrop-blur-sm">
                        Rank #{rank + 1}
                      </div>
                    </div>

                    {/* Crop Details */}
                    <div className="flex-1 space-y-2.5">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">
                              {crop.name}
                            </h3>
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-agri-darkCard dark:text-slate-300">
                              {crop.category}
                            </span>
                          </div>
                          {crop.scientificName && (
                            <p className="text-xs italic text-slate-400">{crop.scientificName}</p>
                          )}
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            score >= 85
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : score >= 70
                              ? 'bg-forest-50 text-forest-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {score}% Match · {suitabilityLevel}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        {crop.description}
                      </p>

                      {/* Quick Conditions Badges */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 sm:grid-cols-4">
                        <div className="rounded-xl bg-slate-50 p-2 dark:bg-agri-darkCard">
                          <span className="block font-bold text-slate-400">Duration</span>
                          <span className="font-extrabold text-slate-800 dark:text-slate-200">
                            {crop.durationDays ? `${crop.durationDays} Days` : '110-135 Days'}
                          </span>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-2 dark:bg-agri-darkCard">
                          <span className="block font-bold text-slate-400">Water Demand</span>
                          <span className="font-extrabold text-slate-800 dark:text-slate-200">
                            {waterMetrics?.consumptionTier || 'Moderate'}
                          </span>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-2 dark:bg-agri-darkCard">
                          <span className="block font-bold text-slate-400">Target Season</span>
                          <span className="font-extrabold text-slate-800 dark:text-slate-200">
                            {crop.season || 'Rabi / Kharif'}
                          </span>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-2 dark:bg-agri-darkCard">
                          <span className="block font-bold text-slate-400">Net Profit</span>
                          <span className="font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">
                            ₹{(economicMetrics?.netProfitPerAcre || 32000).toLocaleString('en-IN')}/ac
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deep-Dive Sub-Module Tabs */}
                  <div className="flex border-b border-slate-200 pt-1 dark:border-agri-darkBorder overflow-x-auto text-xs font-bold gap-2">
                    <button
                      type="button"
                      onClick={() => setCropTab(crop.id, 'radar')}
                      className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
                        activeTab === 'radar'
                          ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                          : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <Layers className="h-3.5 w-3.5" /> Agro-Suitability Radar
                    </button>

                    <button
                      type="button"
                      onClick={() => setCropTab(crop.id, 'economics')}
                      className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
                        activeTab === 'economics'
                          ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                          : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <Coins className="h-3.5 w-3.5" /> Economics & Farm ROI
                    </button>

                    <button
                      type="button"
                      onClick={() => setCropTab(crop.id, 'water')}
                      className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
                        activeTab === 'water'
                          ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                          : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <Droplets className="h-3.5 w-3.5" /> Water & Drip Savings
                    </button>

                    <button
                      type="button"
                      onClick={() => setCropTab(crop.id, 'cultivars')}
                      className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
                        activeTab === 'cultivars'
                          ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                          : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <Award className="h-3.5 w-3.5" /> Certified Cultivars
                    </button>
                  </div>

                  {/* Tab Panes */}
                  <div className="pt-2">
                    {activeTab === 'radar' && (
                      <div className="space-y-4">
                        {radarMetrics && (
                          <AgroSuitabilityRadar metrics={radarMetrics} cropName={crop.name} />
                        )}

                        {/* Match Reasons & Caution Notes */}
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard space-y-2">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                            Clinical Agronomic Findings
                          </span>
                          {matchReasons.map((m, idx) => (
                            <p key={idx} className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-400 font-semibold">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> {m}
                            </p>
                          ))}
                          {cautionNotes.map((c, idx) => (
                            <p key={idx} className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400">
                              <span className="text-amber-500">⚠</span> {c}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'economics' && economicMetrics && (
                      <CropGrossMarginCalculator metrics={economicMetrics} cropName={crop.name} />
                    )}

                    {activeTab === 'water' && waterMetrics && (
                      <WaterFootprintComparator metrics={waterMetrics} cropName={crop.name} />
                    )}

                    {activeTab === 'cultivars' && certifiedCultivars && (
                      <CertifiedCultivarMatrix cultivars={certifiedCultivars} cropName={crop.name} />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Official Crop Project Report Dossier Modal */}
      {topCrop && (
        <CropProjectReportModal
          isOpen={isDprModalOpen}
          onClose={() => setIsDprModalOpen(false)}
          topRecommendation={topCrop}
          location={form.location || selectedRegion}
          season={form.season || 'Rabi (Winter)'}
        />
      )}
    </div>
  )
}
