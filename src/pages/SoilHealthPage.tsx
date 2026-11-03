import {
  Edit3,
  FlaskConical,
  RotateCcw,
} from 'lucide-react'
import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { defaultSoilReading } from '../data/soil'
import { useAppStore } from '../store/useAppStore'

export function SoilHealthPage() {
  const { soilReading, updateSoilReading, t } = useAppStore()

  // Local state for interactive editing sliders
  const [isEditing, setIsEditing] = useState(false)
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
              {t('soil.badge')}
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {t('soil.title')}
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            {t('soil.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
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

      {/* Interactive Simulation Sliders Drawer */}
      {isEditing && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 shadow-md dark:border-emerald-900/60 dark:bg-emerald-950/20 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-emerald-950 dark:text-emerald-300">
                Interactive Soil Simulator Controls
              </h3>
              <p className="text-xs text-emerald-800/80 dark:text-emerald-400">
                Adjust sliders to simulate field anomalies. Health index recalculates in real-time.
              </p>
            </div>
            <span className="rounded-full bg-emerald-200 px-3 py-1 text-xs font-extrabold text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
              Live Simulation
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
              <span className="text-[10px] text-slate-400">Low (30) to High (220)</span>
            </div>

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
              <span className="text-[10px] text-slate-400">Low (10) to High (90)</span>
            </div>

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

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Volumetric Soil Moisture</span>
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
          </div>
        </div>
      )}

      {/* Top Banner: Fertility Index Score & Condition Category */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Overall Fertility Gauge Card (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Composite Soil Fertility Index
              </span>
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

            <div className="mt-6 flex items-center gap-6">
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-8 border-slate-100 dark:border-agri-darkBorder">
                <div
                  className="absolute inset-0 rounded-full border-8 border-forest-800 dark:border-emerald-500 transition-all duration-500"
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

              <div className="space-y-1.5 flex-1">
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Multi-Factor Agronomic Rating
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Calculated dynamically from NPK saturation, soil pH balance, salinity, and microbial organic carbon buffer.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4 dark:border-agri-darkBorder text-[11px] text-slate-400">
            Simulated sensor telemetry from Ludhiana North Field A
          </div>
        </div>

        {/* NPK Bar Comparison (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Primary Macronutrients Balance (NPK)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Current concentration vs agronomic target thresholds (kg/ha)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
                <span className="h-3 w-3 rounded-md bg-emerald-600" /> Current
              </span>
              <span className="flex items-center gap-1 font-semibold text-slate-400">
                <span className="h-3 w-3 rounded-md bg-slate-300 dark:bg-slate-600" /> Target
              </span>
            </div>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={npkChartData} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="nutrient" stroke="#94a3b8" fontSize={11} />
                <YAxis unit=" kg/ha" stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="current" name="Current Value" fill="#166534" radius={[6, 6, 0, 0]} />
                <Bar dataKey="target" name="Agronomic Target" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 10 Parameter Detailed Grid */}
      <div>
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          Complete 10-Parameter Soil Health Matrix
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* 1. pH */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-agri-darkBorder dark:bg-agri-darkSurface">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase text-slate-400">1. Soil pH</p>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                {soilReading.ph >= 6.0 && soilReading.ph <= 7.5 ? 'Neutral' : soilReading.ph < 6 ? 'Acidic' : 'Alkaline'}
              </span>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{soilReading.ph}</p>
            <p className="mt-1 text-[11px] text-slate-400">Ideal range: 6.0 - 7.5</p>
          </div>

          {/* 2. Nitrogen */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-agri-darkBorder dark:bg-agri-darkSurface">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase text-slate-400">2. Nitrogen (N)</p>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                {soilReading.nitrogen > 100 ? 'Adequate' : 'Deficient'}
              </span>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{soilReading.nitrogen} <span className="text-xs font-normal">kg/ha</span></p>
            <p className="mt-1 text-[11px] text-slate-400">Target: 100-140 kg/ha</p>
          </div>

          {/* 3. Phosphorus */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-agri-darkBorder dark:bg-agri-darkSurface">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase text-slate-400">3. Phosphorus (P)</p>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                {soilReading.phosphorus > 35 ? 'Optimum' : 'Low'}
              </span>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{soilReading.phosphorus} <span className="text-xs font-normal">kg/ha</span></p>
            <p className="mt-1 text-[11px] text-slate-400">Target: 35-60 kg/ha</p>
          </div>

          {/* 4. Potassium */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-agri-darkBorder dark:bg-agri-darkSurface">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase text-slate-400">4. Potassium (K)</p>
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-800">
                {soilReading.potassium > 140 ? 'High' : 'Low'}
              </span>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{soilReading.potassium} <span className="text-xs font-normal">kg/ha</span></p>
            <p className="mt-1 text-[11px] text-slate-400">Target: 150-220 kg/ha</p>
          </div>

          {/* 5. Moisture */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-agri-darkBorder dark:bg-agri-darkSurface">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase text-slate-400">5. Moisture</p>
              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800">
                {soilReading.moisture >= 25 && soilReading.moisture <= 50 ? 'Optimal' : 'Adjust'}
              </span>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{soilReading.moisture}%</p>
            <p className="mt-1 text-[11px] text-slate-400">Ideal range: 25-50%</p>
          </div>

          {/* 6. Soil Temp */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-agri-darkBorder dark:bg-agri-darkSurface">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase text-slate-400">6. Soil Temp</p>
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-800">
                Normal
              </span>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{soilReading.soilTemp}°C</p>
            <p className="mt-1 text-[11px] text-slate-400">Microbial optimum: 18-28°C</p>
          </div>

          {/* 7. Electrical Conductivity */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-agri-darkBorder dark:bg-agri-darkSurface">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase text-slate-400">7. Conductivity</p>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                {soilReading.electricalConductivity < 2.0 ? 'Non-Saline' : 'Saline'}
              </span>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{soilReading.electricalConductivity} <span className="text-xs font-normal">dS/m</span></p>
            <p className="mt-1 text-[11px] text-slate-400">Safe: &lt; 2.0 dS/m</p>
          </div>

          {/* 8. Organic Carbon */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-agri-darkBorder dark:bg-agri-darkSurface">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase text-slate-400">8. Organic Carbon</p>
              <span className="rounded-full bg-forest-100 px-2 py-0.5 text-[10px] font-bold text-forest-800">
                {soilReading.organicCarbon >= 0.75 ? 'Rich' : 'Medium'}
              </span>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{soilReading.organicCarbon}%</p>
            <p className="mt-1 text-[11px] text-slate-400">Benchmark: &gt; 0.75%</p>
          </div>

          {/* 9. Salinity */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-agri-darkBorder dark:bg-agri-darkSurface">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase text-slate-400">9. Soil Salinity</p>
              <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800">
                Safe
              </span>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{soilReading.salinity} <span className="text-xs font-normal">ppm</span></p>
            <p className="mt-1 text-[11px] text-slate-400">Critical threshold: 500 ppm</p>
          </div>

          {/* 10. Fertility Index */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-agri-darkBorder dark:bg-agri-darkSurface">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase text-slate-400">10. Fertility Score</p>
              <span className="rounded-full bg-forest-800 px-2 py-0.5 text-[10px] font-bold text-white">
                {soilReading.qualityStatus}
              </span>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{soilReading.fertilityScore} / 100</p>
            <p className="mt-1 text-[11px] text-slate-400">Index rank: 84th percentile</p>
          </div>
        </div>
      </div>

      {/* Actionable Nutrient Improvement Guidance */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
          Agronomic Correction &amp; Soil Conditioning Recommendations
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Prescribed chemical and organic interventions tailored to current telemetry
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">pH Balancing Advisory</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {soilReading.suggestions.ph}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">NPK Fertilization Plan</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {soilReading.suggestions.npk}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">Soil Moisture &amp; Drainage</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {soilReading.suggestions.moisture}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">Organic Carbon Enrichment</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {soilReading.suggestions.organic}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

