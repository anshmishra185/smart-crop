import {
  Bell,
  Check,
  CheckCircle2,
  Languages,
  Moon,
  Save,
  Settings,
  Sun,
  SunMedium,
  User,
} from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { supportedLanguages } from '../lib/translations'

export function SettingsPage() {
  const {
    theme,
    setTheme,
    toggleTheme,
    outdoorMode,
    toggleOutdoorMode,
    language,
    setLanguage,
    selectedRegion,
    setSelectedRegion,
    t,
  } = useAppStore()

  const [farmName, setFarmName] = useState('Ludhiana Central Agro Estate')
  const [acreage, setAcreage] = useState('120')
  const [primarySoil, setPrimarySoil] = useState('Alluvial Loam')
  const [notifyFungal, setNotifyFungal] = useState(true)
  const [notifyMoisture, setNotifyMoisture] = useState(true)
  const [notifySpraying, setNotifySpraying] = useState(true)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              <Settings className="h-4 w-4" />
            </span>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {t('settings.badge')}
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {t('settings.title')}
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            {t('settings.subtitle')}
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4" /> {t('common.saved')}
          </div>
        )}
      </div>

      {/* 1. Language Preferences Section (All 5 Languages) */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-agri-darkBorder">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Languages className="h-4 w-4 text-emerald-600" />
              {t('settings.languageHeader')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('settings.languageSub')}
            </p>
          </div>
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-extrabold uppercase text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            5 Languages Active
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {supportedLanguages.map((l) => {
            const isSelected = language === l.code
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code)}
                className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/70 shadow-sm dark:border-emerald-500 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:hover:bg-agri-darkBorder/40'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-2xl">{l.flag}</span>
                  {isSelected ? (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-extrabold text-white">
                      <Check className="h-3 w-3" /> Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">Select</span>
                  )}
                </div>
                <div className="mt-2.5">
                  <p className="text-sm font-black text-slate-900 dark:text-white">
                    {l.nativeName}
                  </p>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {l.name}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-400">
                    {l.region}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Interactive Theme Switcher Section (Light / Dark Mode) */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-agri-darkBorder">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sun className="h-4 w-4 text-amber-500" />
              Display &amp; Interface Theme (Light / Dark Mode)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Choose your visual comfort: daytime high-contrast agricultural light or OLED dark mode for night scouting.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-white"
          >
            Quick Toggle
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Light Theme Card */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`group relative flex flex-col rounded-2xl border p-5 text-left transition-all ${
              theme === 'light'
                ? 'border-emerald-600 bg-emerald-50/60 shadow-md ring-2 ring-emerald-600/20 dark:bg-agri-darkCard'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-agri-darkBorder dark:bg-agri-darkCard'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Sun className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Daylight Mode
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    High contrast for outdoor direct sunlight
                  </p>
                </div>
              </div>
              {theme === 'light' && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-700 px-2.5 py-1 text-[10px] font-extrabold text-white">
                  <Check className="h-3 w-3" /> Selected
                </span>
              )}
            </div>
            {/* Visual Preview Swatch */}
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 p-2.5">
              <span className="h-4 w-4 rounded-full bg-[#166534]" title="Forest Green Primary" />
              <span className="h-4 w-4 rounded-full bg-[#10B981]" title="Emerald Secondary" />
              <span className="h-4 w-4 rounded-full bg-[#F8FAF7] border border-slate-300" title="Off-White Background" />
              <span className="text-[10px] font-bold text-slate-600">Forest Green &amp; Off-White</span>
            </div>
          </button>

          {/* Dark Theme Card */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`group relative flex flex-col rounded-2xl border p-5 text-left transition-all ${
              theme === 'dark'
                ? 'border-emerald-500 bg-slate-900 text-white shadow-md ring-2 ring-emerald-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-agri-darkBorder dark:bg-agri-darkCard'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-emerald-400">
                  <Moon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    OLED Dark Mode
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Reduced battery usage &amp; night scouting
                  </p>
                </div>
              </div>
              {theme === 'dark' && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-extrabold text-slate-950">
                  <Check className="h-3 w-3" /> Selected
                </span>
              )}
            </div>
            {/* Visual Preview Swatch */}
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 p-2.5">
              <span className="h-4 w-4 rounded-full bg-[#09130D]" title="OLED Dark Background" />
              <span className="h-4 w-4 rounded-full bg-[#102116]" title="Dark Surface" />
              <span className="h-4 w-4 rounded-full bg-[#10B981]" title="Emerald Accent" />
              <span className="text-[10px] font-bold text-slate-300">OLED Agri-Dark &amp; Emerald</span>
            </div>
          </button>
        </div>

        {/* Outdoor Sun Mode Callout Card */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/60 dark:bg-amber-950/30">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black flex-shrink-0">
              <SunMedium className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  High-Contrast Outdoor Sunlight Mode
                </h3>
                {outdoorMode && (
                  <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-black uppercase text-slate-950">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Specially tuned contrast booster and elevated card borders for direct sunlight field inspections on tablets and phones.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleOutdoorMode}
            className={`flex-shrink-0 rounded-2xl px-4 py-2 text-xs font-bold transition active:scale-95 shadow-sm ${
              outdoorMode
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-white'
            }`}
          >
            {outdoorMode ? 'Disable Outdoor Mode' : 'Enable Outdoor Mode'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Farm Profile Section */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="h-4 w-4 text-emerald-600" />
            Estate &amp; Farm Identity
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Farm / Enterprise Name:
              </label>
              <input
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Operational Acreage:
              </label>
              <input
                type="number"
                value={acreage}
                onChange={(e) => setAcreage(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Primary Agro-Climatic Zone:
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-white"
              >
                <option value="Punjab">Punjab (North-Western Plain Zone)</option>
                <option value="Maharashtra">Maharashtra (Western Plateau &amp; Hill Zone)</option>
                <option value="Uttar Pradesh">Uttar Pradesh (Upper Gangetic Plain Zone)</option>
                <option value="Karnataka">Karnataka (Southern Plateau Zone)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Dominant Soil Classification:
              </label>
              <select
                value={primarySoil}
                onChange={(e) => setPrimarySoil(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-white"
              >
                <option value="Alluvial Loam">Alluvial Loam</option>
                <option value="Black Cotton Soil">Black Cotton Soil (Vertisol)</option>
                <option value="Red Sandy Loam">Red Sandy Loam</option>
                <option value="Clay Loam">Clay Loam</option>
              </select>
            </div>
          </div>
        </div>

        {/* Real-time Alert Subscriptions */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="h-4 w-4 text-forest-700 dark:text-emerald-400" />
            Automated Agronomic Alert Triggers
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Fungal Disease &amp; Spore Dispersion Alerts
                </p>
                <p className="text-[11px] text-slate-400">
                  Notify when canopy relative humidity exceeds 75% for 6 consecutive hours
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifyFungal}
                onChange={(e) => setNotifyFungal(e.target.checked)}
                className="h-4 w-4 rounded accent-emerald-600"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Soil Moisture Depletion Warning
                </p>
                <p className="text-[11px] text-slate-400">
                  Notify when volumetric root zone moisture drops below 22%
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifyMoisture}
                onChange={(e) => setNotifyMoisture(e.target.checked)}
                className="h-4 w-4 rounded accent-emerald-600"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Foliar Spraying Condition Windows
                </p>
                <p className="text-[11px] text-slate-400">
                  Notify when wind velocity drops below 12 km/h and rain probability is &lt; 20%
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifySpraying}
                onChange={(e) => setNotifySpraying(e.target.checked)}
                className="h-4 w-4 rounded accent-emerald-600"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-2xl bg-forest-800 px-6 py-3 text-xs font-extrabold text-white shadow-lg shadow-forest-900/20 transition hover:bg-forest-900 active:scale-95 dark:bg-emerald-600"
          >
            <Save className="h-4 w-4" /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  )
}
