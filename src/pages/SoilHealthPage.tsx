import {
  AlertTriangle,
  Award,
  Calculator,
  Compass,
  Edit3,
  FileText,
  FlaskConical,
  Layers,
  Leaf,
  RotateCcw,
  Waves,
} from 'lucide-react'
import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { defaultSoilReading } from '../data/soil'
import { useAppStore } from '../store/useAppStore'
import { AudioAdvisoryButton } from '../components/common/AudioAdvisoryButton'
import { getSoilHealthAudioNarrative } from '../lib/advisorySpeech'
import { SoilQualityMatrix12 } from '../components/soil/SoilQualityMatrix12'
import { FertilizerDosageCalculator } from '../components/soil/FertilizerDosageCalculator'
import { SoilTextureTriangle } from '../components/soil/SoilTextureTriangle'
import { SoilStratificationProfile } from '../components/soil/SoilStratificationProfile'
import { SoilCarbonBiomassTracker } from '../components/soil/SoilCarbonBiomassTracker'
import { SoilHealthCardModal } from '../components/soil/SoilHealthCardModal'

type SoilActiveTab = 'all' | 'matrix' | 'fertilizer' | 'texture' | 'profile' | 'carbon'

export function SoilHealthPage() {
  const { soilReading, updateSoilReading, language, t } = useAppStore()

  // Local state for interactive editing sliders
  const [isEditing, setIsEditing] = useState(false)
  const [isCardModalOpen, setIsCardModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<SoilActiveTab>('all')

  const soilAudioText = getSoilHealthAudioNarrative(
    {
      fertilityScore: soilReading.fertilityScore,
      qualityStatus: soilReading.qualityStatus,
      ph: soilReading.ph,
      nitrogen: soilReading.nitrogen,
      phosphorus: soilReading.phosphorus,
      potassium: soilReading.potassium,
    },
    language
  )

  const [form, setForm] = useState({
    ph: soilReading.ph,
    nitrogen: soilReading.nitrogen,
    phosphorus: soilReading.phosphorus,
    potassium: soilReading.potassium,
    moisture: soilReading.moisture,
    soilTemp: soilReading.soilTemp,
    electricalConductivity: soilReading.electricalConductivity,
    organicCarbon: soilReading.organicCarbon,
    salinity: soilReading.salinity,
    sulfur: soilReading.sulfur ?? 16.5,
    zinc: soilReading.zinc ?? 0.85,
    sand: soilReading.sand ?? 45,
    silt: soilReading.silt ?? 35,
    clay: soilReading.clay ?? 20,
  })

  const handleSliderChange = (field: string, value: number) => {
    const updated = { ...form, [field]: value }
    setForm(updated)
    updateSoilReading(updated)
  }

  const handleResetDefaults = () => {
    setForm({
      ph: defaultSoilReading.ph,
      nitrogen: defaultSoilReading.nitrogen,
      phosphorus: defaultSoilReading.phosphorus,
      potassium: defaultSoilReading.potassium,
      moisture: defaultSoilReading.moisture,
      soilTemp: defaultSoilReading.soilTemp,
      electricalConductivity: defaultSoilReading.electricalConductivity,
      organicCarbon: defaultSoilReading.organicCarbon,
      salinity: defaultSoilReading.salinity,
      sulfur: defaultSoilReading.sulfur ?? 16.5,
      zinc: defaultSoilReading.zinc ?? 0.85,
      sand: defaultSoilReading.sand ?? 45,
      silt: defaultSoilReading.silt ?? 35,
      clay: defaultSoilReading.clay ?? 20,
    })
    updateSoilReading(defaultSoilReading)
  }

  // NPK Bar Chart Data
  const npkChartData = [
    { nutrient: t('soil.nitrogen') || 'Nitrogen (N)', current: soilReading.nitrogen, target: 120, unit: 'kg/ha', fill: '#10B981' },
    { nutrient: t('soil.phosphorus') || 'Phosphorus (P)', current: soilReading.phosphorus, target: 50, unit: 'kg/ha', fill: '#3B82F6' },
    { nutrient: t('soil.potassium') || 'Potassium (K)', current: soilReading.potassium, target: 180, unit: 'kg/ha', fill: '#8B5CF6' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              <FlaskConical className="h-4 w-4" />
            </span>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {t('soil.badge')} • ICAR Precision Agronomy
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {t('soil.title')}
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            {t('soil.subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Audio Advisory Voice Button */}
          <AudioAdvisoryButton
            textToSpeak={soilAudioText}
            label={language === 'pa' ? 'ਸਲਾਹ ਸੁਣੋ' : language === 'hi' ? 'सलाह सुनें' : language === 'mr' ? 'सल्ला ऐका' : language === 'te' ? 'సలహా వినండి' : 'Listen Soil Advisory'}
          />

          {/* Official Soil Health Card Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsCardModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-emerald-700 px-4 py-2.5 text-xs font-black text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-sm transition active:scale-95"
          >
            <FileText className="h-4 w-4" />
            Official Soil Health Card
          </button>

          {/* Interactive Simulation Sliders */}
          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold shadow-sm transition active:scale-95 ${
              isEditing
                ? 'bg-forest-800 text-white dark:bg-emerald-600'
                : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-200'
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            {isEditing ? t('soil.closeSim') : t('soil.simulate')}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-300"
            >
              <RotateCcw className="h-3.5 w-3.5" /> {t('common.reset')}
            </button>
          )}
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-2 dark:border-agri-darkBorder">
        {[
          { id: 'all', label: 'All Agronomy Modules', icon: Layers },
          { id: 'matrix', label: '12-Parameter Matrix', icon: Award },
          { id: 'fertilizer', label: 'Fertilizer Bag Dosage', icon: Calculator },
          { id: 'texture', label: 'USDA Soil Texture', icon: Compass },
          { id: 'profile', label: '0-60 cm Root Horizon', icon: Waves },
          { id: 'carbon', label: 'Carbon & Soil Biomass', icon: Leaf },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as SoilActiveTab)}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-black transition ${
                isActive
                  ? 'bg-forest-800 text-white dark:bg-emerald-600 shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-agri-darkCard dark:text-slate-300 dark:hover:bg-agri-darkSurface border border-slate-200/80 dark:border-agri-darkBorder'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Interactive Simulation Sliders Drawer */}
      {isEditing && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 shadow-md dark:border-emerald-900/60 dark:bg-emerald-950/20 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-emerald-950 dark:text-emerald-300">
                Interactive Soil Simulator Controls
              </h3>
              <p className="text-xs text-emerald-800/80 dark:text-emerald-400">
                Adjust physical, chemical, and biological sliders to simulate real-time soil field conditions.
              </p>
            </div>
            <span className="rounded-full bg-emerald-200 px-3 py-1 text-xs font-extrabold text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
              Live Simulation Active
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* pH */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Soil pH</span>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{form.ph}</span>
              </div>
              <input
                type="range"
                min="4.5"
                max="9.0"
                step="0.1"
                value={form.ph}
                onChange={(e) => handleSliderChange('ph', parseFloat(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <span className="text-[10px] text-slate-400">Acidic (4.5) to Alkaline (9.0)</span>
            </div>

            {/* Nitrogen */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Available Nitrogen (N)</span>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{form.nitrogen} kg/ha</span>
              </div>
              <input
                type="range"
                min="30"
                max="220"
                step="5"
                value={form.nitrogen}
                onChange={(e) => handleSliderChange('nitrogen', parseInt(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <span className="text-[10px] text-slate-400">Deficient (30) to Rich (220)</span>
            </div>

            {/* Phosphorus */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Available Phosphorus (P)</span>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{form.phosphorus} kg/ha</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="2"
                value={form.phosphorus}
                onChange={(e) => handleSliderChange('phosphorus', parseInt(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <span className="text-[10px] text-slate-400">Low (10) to Surplus (90)</span>
            </div>

            {/* Potassium */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Available Potassium (K)</span>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{form.potassium} kg/ha</span>
              </div>
              <input
                type="range"
                min="60"
                max="280"
                step="5"
                value={form.potassium}
                onChange={(e) => handleSliderChange('potassium', parseInt(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <span className="text-[10px] text-slate-400">Low (60) to High (280)</span>
            </div>

            {/* Moisture */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Volumetric Moisture</span>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{form.moisture}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="75"
                step="1"
                value={form.moisture}
                onChange={(e) => handleSliderChange('moisture', parseInt(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <span className="text-[10px] text-slate-400">Wilting (10%) to Saturated (75%)</span>
            </div>

            {/* Organic Carbon */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Organic Carbon (OC)</span>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{form.organicCarbon}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.5"
                step="0.05"
                value={form.organicCarbon}
                onChange={(e) => handleSliderChange('organicCarbon', parseFloat(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <span className="text-[10px] text-slate-400">Critical (&lt;0.5%) to Fertile (&gt;0.75%)</span>
            </div>

            {/* Sulfur */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Available Sulfur (S)</span>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{form.sulfur} ppm</span>
              </div>
              <input
                type="range"
                min="5"
                max="35"
                step="1"
                value={form.sulfur}
                onChange={(e) => handleSliderChange('sulfur', parseFloat(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <span className="text-[10px] text-slate-400">Low (&lt;10 ppm) to High (&gt;25 ppm)</span>
            </div>

            {/* Zinc */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>DTPA Zinc (Zn)</span>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{form.zinc} ppm</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.05"
                value={form.zinc}
                onChange={(e) => handleSliderChange('zinc', parseFloat(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <span className="text-[10px] text-slate-400">Deficient (&lt;0.6) to Optimal (&gt;0.8)</span>
            </div>
          </div>
        </div>
      )}

      {/* TOP OVERVIEW SECTION (Visible on 'all' tab) */}
      {activeTab === 'all' && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Overall Fertility Gauge Card (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Composite Soil Fertility Index
                </span>
                <div className="flex items-center gap-2">
                  <AudioAdvisoryButton textToSpeak={soilAudioText} variant="ghost" label="Listen" />
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-extrabold ${
                      soilReading.qualityStatus === 'Excellent'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : soilReading.qualityStatus === 'Good'
                        ? 'bg-forest-50 text-forest-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : soilReading.qualityStatus === 'Moderate'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                    }`}
                  >
                    {soilReading.qualityStatus.toUpperCase()} CONDITION
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-6">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-8 border-slate-100 dark:border-agri-darkBorder">
                  <div
                    className="absolute inset-0 rounded-full border-8 border-emerald-500 transition-all duration-700"
                    style={{
                      clipPath: `polygon(0 0, 100% 0, 100% ${soilReading.fertilityScore}%, 0 ${soilReading.fertilityScore}%)`,
                    }}
                  />
                  <div className="text-center">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      {soilReading.fertilityScore}
                    </span>
                    <span className="block text-[10px] font-bold text-slate-400">/ 100</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <p className="font-bold text-slate-700 dark:text-slate-200">
                    Standard Quality Index
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    Evaluated across 12 physical, macro, secondary, and micronutrient parameters.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      High microbial responsiveness
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alert Snippets */}
            <div className="mt-6 space-y-2 border-t border-slate-100 pt-4 dark:border-agri-darkBorder">
              {soilReading.alerts.slice(0, 2).map((alert, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 rounded-2xl bg-slate-50 p-3 text-xs text-slate-700 dark:bg-agri-darkCard dark:text-slate-300"
                >
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                  <span>{alert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* NPK Bar Chart (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Primary Macronutrient Balance (N - P - K)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Current soil reserves vs. baseline target thresholds (kg/ha)
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-agri-darkCard dark:text-slate-300">
                Target: 120 - 50 - 180
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={npkChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="nutrient" stroke="#888888" fontSize={12} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#FFF',
                    }}
                  />
                  <Bar dataKey="current" name="Recorded (kg/ha)" fill="#10B981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="target" name="Target (kg/ha)" fill="#94A3B8" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 1: Official 12-Parameter Quality Matrix */}
      {(activeTab === 'all' || activeTab === 'matrix') && (
        <section className="space-y-4">
          <SoilQualityMatrix12 reading={soilReading} />
        </section>
      )}

      {/* MODULE 2: Commercial Fertilizer Bag Calculator */}
      {(activeTab === 'all' || activeTab === 'fertilizer') && (
        <section className="space-y-4">
          <FertilizerDosageCalculator reading={soilReading} />
        </section>
      )}

      {/* MODULE 3: Interactive USDA Soil Texture Triangle & Hydraulics */}
      {(activeTab === 'all' || activeTab === 'texture') && (
        <section className="space-y-4">
          <SoilTextureTriangle
            reading={soilReading}
            onUpdateTexture={(sand, silt, clay) => {
              updateSoilReading({ sand, silt, clay })
            }}
          />
        </section>
      )}

      {/* MODULE 4: Multi-Horizon Root Stratification Profile (0-60 cm) */}
      {(activeTab === 'all' || activeTab === 'profile') && (
        <section className="space-y-4">
          <SoilStratificationProfile reading={soilReading} />
        </section>
      )}

      {/* MODULE 5: Soil Organic Matter & Carbon Credit Monetization Engine */}
      {(activeTab === 'all' || activeTab === 'carbon') && (
        <section className="space-y-4">
          <SoilCarbonBiomassTracker reading={soilReading} />
        </section>
      )}

      {/* MODULE 6: Official Soil Health Card Modal (Printable) */}
      <SoilHealthCardModal
        reading={soilReading}
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
      />
    </div>
  )
}
