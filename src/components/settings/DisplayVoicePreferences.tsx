import { useState } from 'react'
import {
  Sun,
  Moon,
  SunMedium,
  Volume2,
  VolumeX,
  Gauge,
  Sparkles,
  Check
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { supportedLanguages } from '../../lib/translations'

export function DisplayVoicePreferences() {
  const {
    theme,
    setTheme,
    toggleTheme,
    outdoorMode,
    toggleOutdoorMode,
    language,
    setLanguage,
  } = useAppStore()

  const [speechRate, setSpeechRate] = useState<number>(0.95)
  const [autoPlayBriefing, setAutoPlayBriefing] = useState<boolean>(false)
  const [testPlaying, setTestPlaying] = useState<boolean>(false)

  const handleTestSpeech = () => {
    if (testPlaying) {
      window.speechSynthesis?.cancel()
      setTestPlaying(false)
      return
    }

    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser environment.')
      return
    }

    const testPhrases: Record<string, string> = {
      en: 'Testing precision agronomic speech synthesizer engine at calibrated speed.',
      hi: 'कृषि वाक संश्लेषण परीक्षण सफल रहा। सभी क्षेत्रीय भाषाएँ सक्रिय हैं।',
      pa: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ। ਐਗਰੋਨੋਮਿਕ ਵਾਇਸ ਇੰਜਣ ਸਫਲਤਾਪੂਰਵਕ ਚੱਲ ਰਿਹਾ ਹੈ।',
      mr: 'शेती व्हॉइस असिस्टंट चाचणी यशस्वीपणे पूर्ण झाली आहे.',
      te: 'వ్యవసాయ వాయిస్ అసిస్టెంట్ పరీక్ష విజయవంతంగా పూర్తయింది.',
    }

    const text = testPhrases[language] || testPhrases.en
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = speechRate

    const langCodeMap: Record<string, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      pa: 'pa-IN',
      mr: 'mr-IN',
      te: 'te-IN',
    }
    utterance.lang = langCodeMap[language] || 'en-IN'

    utterance.onend = () => setTestPlaying(false)
    utterance.onerror = () => setTestPlaying(false)

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setTestPlaying(true)
  }

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-agri-darkBorder">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
            <SunMedium className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Ergonomics &amp; Multimodal Interface
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                5 Languages Active
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Display Ergonomics, Field Sunlight Booster &amp; Multilingual Voice Synthesis
            </h2>
          </div>
        </div>
      </div>

      {/* Language Selector Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-forest-700 dark:text-emerald-400" />
          1. Select Primary Regional Agronomic Language
        </label>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {supportedLanguages.map((l) => {
            const isSelected = language === l.code
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code)}
                className={`flex flex-col items-start rounded-2xl border p-3.5 text-left transition-all ${
                  isSelected
                    ? 'border-forest-700 bg-forest-50/70 shadow-sm dark:border-emerald-500 dark:bg-emerald-950/40 ring-2 ring-forest-700/20 dark:ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 dark:border-agri-darkBorder dark:bg-agri-darkCard'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-xl">{l.flag}</span>
                  {isSelected && (
                    <span className="flex items-center gap-1 rounded-full bg-forest-800 px-1.5 py-0.5 text-[9px] font-extrabold text-white dark:bg-emerald-600">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-xs font-black text-slate-900 dark:text-white">{l.nativeName}</p>
                  <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">{l.name}</p>
                  <p className="text-[9px] text-slate-400">{l.region}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Visual Comfort: Daylight vs OLED Night Mode */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-agri-darkBorder">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sun className="h-3.5 w-3.5 text-amber-500" />
            2. Interface Display Theme &amp; Field Vision
          </label>
          <button
            type="button"
            onClick={toggleTheme}
            className="text-xs font-bold text-forest-700 hover:text-forest-800 dark:text-emerald-400"
          >
            Quick Toggle Theme
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Light Theme Card */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex flex-col rounded-2xl border p-4 text-left transition-all ${
              theme === 'light'
                ? 'border-forest-700 bg-forest-50/60 shadow-md ring-2 ring-forest-700/20'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-agri-darkBorder dark:bg-agri-darkCard'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Sun className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">Daylight Mode</h3>
                  <p className="text-[10px] text-slate-500">Natural daylight high contrast</p>
                </div>
              </div>
              {theme === 'light' && (
                <span className="rounded-full bg-forest-800 px-2 py-0.5 text-[9px] font-extrabold text-white">
                  Active
                </span>
              )}
            </div>
          </button>

          {/* Dark Theme Card */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`flex flex-col rounded-2xl border p-4 text-left transition-all ${
              theme === 'dark'
                ? 'border-emerald-500 bg-slate-900 text-white shadow-md ring-2 ring-emerald-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-agri-darkBorder dark:bg-agri-darkCard'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-emerald-400">
                  <Moon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">OLED Dark Mode</h3>
                  <p className="text-[10px] text-slate-400">Night scouting &amp; battery saver</p>
                </div>
              </div>
              {theme === 'dark' && (
                <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-extrabold text-slate-950">
                  Active
                </span>
              )}
            </div>
          </button>
        </div>

        {/* High-Contrast Outdoor Sunlight Callout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 dark:border-amber-900/60 dark:bg-amber-950/30">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black shrink-0">
              <SunMedium className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                  High-Contrast Outdoor Sunlight Booster
                </h4>
                {outdoorMode && (
                  <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-black uppercase text-slate-950">
                    Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Elevates card borders and color vibrancy for in-cab field inspections under harsh noon sun.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleOutdoorMode}
            className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-sm ${
              outdoorMode
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-white'
            }`}
          >
            {outdoorMode ? 'Disable Booster' : 'Enable Sunlight Booster'}
          </button>
        </div>
      </div>

      {/* Multilingual Agronomic Voice Engine Settings */}
      <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-agri-darkBorder">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Volume2 className="h-3.5 w-3.5 text-forest-700 dark:text-emerald-400" />
          3. Agronomic Spoken Voice Synthesis Engine
        </label>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Gauge className="h-3.5 w-3.5 text-slate-400" /> Voice Delivery Pacing Rate:
                </span>
                <span className="font-mono font-black text-forest-800 dark:text-emerald-400">
                  {speechRate}x
                </span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.25"
                step="0.05"
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="mt-2 w-full accent-forest-700 dark:accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>0.75x (Deliberate)</span>
                <span>0.95x (Natural Flow)</span>
                <span>1.25x (Field Fast)</span>
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoPlayBriefing}
                  onChange={(e) => setAutoPlayBriefing(e.target.checked)}
                  className="rounded accent-forest-700"
                />
                Auto-play voice debriefing upon opening daily shift sheets
              </label>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleTestSpeech}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition active:scale-95 ${
                    testPlaying
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-forest-800 text-white hover:bg-forest-900 dark:bg-emerald-600'
                  }`}
                >
                  {testPlaying ? (
                    <>
                      <VolumeX className="h-3.5 w-3.5" /> Stop Voice Sample
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-3.5 w-3.5" /> Test Voice Engine ({language.toUpperCase()})
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

