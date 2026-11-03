import { useState } from 'react'
import {
  Volume2,
  VolumeX,
  Sparkles,
  X,
  Send,
  Leaf,
  Bot
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { supportedLanguages } from '../../lib/translations'

interface VoiceCopilotModalProps {
  isOpen: boolean
  onClose: () => void
}

interface QnAPreset {
  query: string
  lang: string
  label: string
  response: string
}

const PRESET_QUERIES: QnAPreset[] = [
  {
    query: 'What is the yellow rust risk in Sector B2 today?',
    lang: 'en',
    label: 'Yellow Rust Risk (B2)',
    response:
      'Airborne spore pressure in Sector B2 is currently elevated at 42 out of 100 with micro-climate relative humidity reaching 84%. An early chlorotic lesion patch has been scouted. Prophylactic foliar application of Mancozeb 75% WP or Tebuconazole is recommended before 11:00 AM while wind speed remains below 12 km/h.',
  },
  {
    query: 'ਕੀ ਅੱਜ ਕਣਕ ਉੱਤੇ ਉੱਲੀਨਾਸ਼ਕ ਸਪਰੇਅ ਕਰਨ ਲਈ ਮੌਸਮ ਅਨੁਕੂਲ ਹੈ?',
    lang: 'pa',
    label: 'ਸਪਰੇਅ ਸਲਾਹ (ਪੰਜਾਬੀ)',
    response:
      'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ। ਲੁਧਿਆਣਾ ਖੇਤਰ ਵਿੱਚ ਇਸ ਸਮੇਂ ਹਵਾ ਦੀ ਗਤੀ 9.4 ਕਿਲੋਮੀਟਰ ਪ੍ਰਤੀ ਘੰਟਾ ਹੈ ਅਤੇ ਡੈਲਟਾ ਟੀ 4.8 ਡਿਗਰੀ ਸੈਲਸੀਅਸ ਹੈ, ਜੋ ਕਿ ਸਪਰੇਅ ਕਰਨ ਲਈ ਬਹੁਤ ਅਨੁਕੂਲ ਹੈ। ਅਗਲੇ 48 ਘੰਟਿਆਂ ਵਿੱਚ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ 15 ਪ੍ਰਤੀਸ਼ਤ ਤੋਂ ਘੱਟ ਹੈ, ਇਸ ਲਈ ਧੁੱਪ ਚੜ੍ਹਨ ਤੋਂ ਪਹਿਲਾਂ ਜਾਂ ਦੁਪਹਿਰ ਤੋਂ ਬਾਅਦ ਸਪਰੇਅ ਪੂਰੀ ਕਰੋ।',
  },
  {
    query: 'यूरिया और डीएपी का शेष स्टॉक एवं अनुशंसित कोटा कितना है?',
    lang: 'hi',
    label: 'उर्वरक स्टॉक (हिंदी)',
    response:
      'नमस्ते। वर्तमान फार्म इन्वेंट्री ऑडिट के अनुसार आपके पास नीम कोटेड यूरिया के 28 बैग और डीएपी के 19 बैग शेष हैं। आईसीएआर पैकेज ऑफ प्रैक्टिसेज के अनुसार सेक्टर ए1 और बी2 के लिए यह कोटा पूर्णतः सुरक्षित है और कोई अतिरिक्त रासायनिक अपव्यय दर्ज नहीं किया गया है।',
  },
  {
    query: 'What is the current APMC Mandi rate for Basmati 1121 and Wheat?',
    lang: 'en',
    label: 'APMC Mandi Rates',
    response:
      'At Khanna Mandi and Ludhiana Central Yard, Basmati 1121 is trading strong at ₹3,850 per quintal, showing a 1.4% gain. HD-3086 Wheat is holding steady at ₹2,275 per quintal, aligning with government Minimum Support Price (MSP) benchmarks.',
  },
]

export function VoiceCopilotModal({ isOpen, onClose }: VoiceCopilotModalProps) {
  const { language, setLanguage } = useAppStore()
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeResponse, setActiveResponse] = useState<string>(PRESET_QUERIES[0].response)
  const [activeQuery, setActiveQuery] = useState<string>(PRESET_QUERIES[0].query)
  const [customInput, setCustomInput] = useState<string>('')

  if (!isOpen) return null

  const handleSpeakText = (text: string) => {
    if (isPlaying) {
      window.speechSynthesis?.cancel()
      setIsPlaying(false)
      return
    }

    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.')
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95

    const langCodeMap: Record<string, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      pa: 'pa-IN',
      mr: 'mr-IN',
      te: 'te-IN',
    }
    utterance.lang = langCodeMap[language] || 'en-IN'

    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setIsPlaying(true)
  }

  const handleSelectPreset = (preset: QnAPreset) => {
    setActiveQuery(preset.query)
    setActiveResponse(preset.response)
    setLanguage(preset.lang as any)
    handleSpeakText(preset.response)
  }

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customInput.trim()) return

    const synthesizedAnswer = `Analyzing crop intelligence database for: "${customInput}". Rootzone moisture is verified at 38% VWC and micro-climate Delta-T is 4.8°C. Field operations are green-lit across all 4 sectors with zero active phytosanitary MRL export violations.`
    setActiveQuery(customInput)
    setActiveResponse(synthesizedAnswer)
    setCustomInput('')
    handleSpeakText(synthesizedAnswer)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xl dark:border-agri-darkBorder dark:bg-agri-darkSurface overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-emerald-500/20 blur-[80px]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-agri-darkBorder">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-forest-800 to-emerald-600 text-white shadow-lg shadow-emerald-600/25">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Krishi Saarthi AI Conversational Copilot
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5" /> Neural Voice v2.4
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Agronomic Voice Assistant
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              window.speechSynthesis?.cancel()
              setIsPlaying(false)
              onClose()
            }}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-agri-darkCard dark:hover:text-slate-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Real-Time Animated Soundwave Visualizer (12 Pulsing Bars) */}
        <div className="my-6 rounded-2xl bg-gradient-to-br from-slate-950 to-forest-950 p-5 text-white shadow-inner flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-1.5 h-14">
            {[45, 75, 95, 60, 30, 85, 100, 70, 50, 90, 65, 40].map((height, i) => (
              <span
                key={i}
                className={`w-1.5 rounded-full bg-emerald-400 transition-all duration-150 ${
                  isPlaying ? 'animate-[pulse_0.6s_ease-in-out_infinite]' : 'opacity-40'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(16, height * 0.45)}px` : '8px',
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>

          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={() => handleSpeakText(activeResponse)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black shadow-md transition active:scale-95 ${
                isPlaying
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
              }`}
            >
              {isPlaying ? (
                <>
                  <VolumeX className="h-4 w-4" /> Stop Voice Playback
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4" /> Listen to Spoken Diagnosis ({language.toUpperCase()})
                </>
              )}
            </button>
          </div>
        </div>

        {/* Current Active Query & Response Card */}
        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
              <span>Audited Field Inquiry:</span>
              <span className="font-mono text-emerald-600 font-bold uppercase">{language} Voice</span>
            </div>
            <p className="text-sm font-black text-slate-900 dark:text-white">
              "{activeQuery}"
            </p>
            <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-agri-darkBorder text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex items-start gap-2">
              <Leaf className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{activeResponse}</span>
            </div>
          </div>

          {/* Quick Suggested Multilingual Prompts */}
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
              Preset In-Field Telemetry Inquiries (English, ਪੰਜਾਬੀ, हिंदी):
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_QUERIES.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(p)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-200 dark:hover:border-emerald-500 transition shadow-sm"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Question Input Form */}
        <form onSubmit={handleCustomSubmit} className="mt-5 pt-4 border-t border-slate-100 dark:border-agri-darkBorder flex items-center gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Ask anything about soil NPK, spore risk, weather, or mandi prices..."
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-emerald-500 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-white"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-2xl bg-forest-800 px-4 py-2.5 text-xs font-black text-white hover:bg-forest-900 transition dark:bg-emerald-600 active:scale-95 shadow-md"
          >
            <span>Ask</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* Language Quick Switcher */}
        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
          <span>Supported regional dialects: 5 languages</span>
          <div className="flex gap-2 font-bold">
            {supportedLanguages.slice(0, 3).map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`transition ${language === l.code ? 'text-emerald-600 underline' : 'hover:text-slate-600'}`}
              >
                {l.nativeName}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

