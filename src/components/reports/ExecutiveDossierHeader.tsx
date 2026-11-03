import { useState } from 'react'
import {
  Volume2,
  VolumeX,
  FileCheck,
  Building,
  Calendar,
  CheckCircle2,
  Sparkles,
  MapPin
} from 'lucide-react'
import { getReportsAuditAudio } from '../../lib/advisorySpeech'
import type { LanguageCode } from '../../lib/translations'

interface ExecutiveDossierHeaderProps {
  reportRef: string
  dateRange: string
  selectedRegion: string
  totalAcreageAudited: number
  healthyRatio: number
  soilHealthScore: number
  activeCasesCount: number
  currentLang: LanguageCode
}

export function ExecutiveDossierHeader({
  reportRef,
  dateRange,
  selectedRegion,
  totalAcreageAudited,
  healthyRatio,
  soilHealthScore,
  activeCasesCount,
  currentLang,
}: ExecutiveDossierHeaderProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  const handleToggleVoiceDebrief = () => {
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel()
      setIsPlayingAudio(false)
      return
    }

    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this device.')
      return
    }

    const narrative = getReportsAuditAudio(
      {
        location: selectedRegion,
        totalAcreageAudited,
        healthyRatio,
        mrlStatus: 'Zero Violations Detected (EU Compliant)',
        carbonOffsetTons: 20.5,
      },
      currentLang
    )

    const utterance = new SpeechSynthesisUtterance(narrative)
    utterance.rate = 0.95

    const langCodeMap: Record<LanguageCode, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      pa: 'pa-IN',
      mr: 'mr-IN',
      te: 'te-IN',
    }
    utterance.lang = langCodeMap[currentLang] || 'en-IN'

    utterance.onend = () => setIsPlayingAudio(false)
    utterance.onerror = () => setIsPlayingAudio(false)

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setIsPlayingAudio(true)
  }

  return (
    <div className="space-y-6">
      {/* Printable Watermarked Official Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface print:border-none print:shadow-none print:p-0">
        {/* Subtle Watermark for Official Print Document */}
        <div className="pointer-events-none absolute -right-10 -bottom-10 opacity-[0.03] dark:opacity-[0.05] print:opacity-[0.08]">
          <Building className="h-96 w-96 text-forest-900" />
        </div>

        {/* Top Government Format Agency Bar */}
        <div className="flex flex-col sm:flex-row items-start justify-between border-b border-slate-200 pb-6 dark:border-agri-darkBorder gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-forest-800 text-white font-black text-xl shadow-md dark:bg-emerald-600">
              CD
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-forest-100 px-2 py-0.5 text-[10px] font-black uppercase text-forest-900 dark:bg-emerald-950 dark:text-emerald-300">
                  Government of India · ICAR-ATARI Zone 1
                </span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  ISO 11783 Interoperable Dossier
                </span>
              </div>
              <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                National Precision Agronomy &amp; Phytosanitary Compliance Dossier
              </h1>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-forest-700 dark:text-emerald-400" />
                Estate Cadastre: Ludhiana Central Precision Cluster (31.2 Acres) · Agro-Climatic Zone: {selectedRegion}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end text-xs">
            <span className="rounded-full bg-emerald-100 px-3 py-1 font-mono font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {reportRef}
            </span>
            <p className="mt-1.5 text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
              <Calendar className="h-3.5 w-3.5 text-slate-400" /> Audit Period: {dateRange}
            </p>
            <p className="mt-0.5 text-emerald-700 dark:text-emerald-400 font-bold">
              Certifying Officer: Ansh Mishra (Lead Agronomist)
            </p>
          </div>
        </div>

        {/* Audio Briefing Bar & Print Controls (Hidden on Print) */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3.5 dark:bg-agri-darkCard border border-slate-100 dark:border-agri-darkBorder print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleVoiceDebrief}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition active:scale-95 ${
                isPlayingAudio
                  ? 'bg-red-600 text-white shadow-md animate-pulse'
                  : 'bg-forest-800 text-white hover:bg-forest-900 dark:bg-emerald-600 dark:hover:bg-emerald-500'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="h-4 w-4" /> Stop Executive Audio Briefing
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4" /> Play Agronomic Voice Debrief ({currentLang.toUpperCase()})
                </>
              )}
            </button>
            <span className="text-[11px] text-slate-500 hidden md:inline">
              Spoken agronomic overview synthesized in selected regional language.
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Digital Cryptographic Stamp: Validated</span>
          </div>
        </div>

        {/* Executive Summary Metric Pillars */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              1. Executive Farm Estate Telemetry &amp; Compliance Status
            </h3>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> 100% Real-Time IoT Sensor Verified
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Audited Area</span>
              <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                {totalAcreageAudited.toLocaleString('en-IN')} Ac
              </p>
              <span className="text-[11px] text-emerald-600 font-bold">4 Active Parcels</span>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
              <span className="text-[10px] font-bold uppercase text-slate-400">Canopy Health Ratio</span>
              <p className="mt-1 text-2xl font-black text-emerald-700 dark:text-emerald-400">
                {healthyRatio}%
              </p>
              <span className="text-[11px] text-slate-500">Certified Vigorous Biomass</span>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
              <span className="text-[10px] font-bold uppercase text-slate-400">Soil Fertility Index</span>
              <p className="mt-1 text-2xl font-black text-forest-800 dark:text-emerald-300">
                {soilHealthScore} / 100
              </p>
              <span className="text-[11px] text-slate-500">ICAR Optimal Neutral</span>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
              <span className="text-[10px] font-bold uppercase text-slate-400">Active Pathologies</span>
              <p className="mt-1 text-2xl font-black text-amber-600">
                {activeCasesCount} Incidents
              </p>
              <span className="text-[11px] text-slate-500">Under Active Containment</span>
            </div>
          </div>
        </div>

        {/* Official Sign-off Signature Block (Visible in Print & Screen) */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-agri-darkBorder flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-4">
          <div>
            <p className="font-extrabold text-slate-900 dark:text-white">
              Official Agronomic Sign-Off &amp; Certification
            </p>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Verified compliant with ICAR Package of Practices, CIB&amp;RC Act 1968, and PMFBY Guidelines.
            </p>
          </div>

          <div className="border border-dashed border-slate-300 rounded-xl p-3 bg-slate-50 dark:bg-agri-darkCard dark:border-agri-darkBorder flex items-center gap-3">
            <FileCheck className="h-6 w-6 text-emerald-600" />
            <div>
              <p className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200">
                DIGITAL SIGNATURE: 0x8F9A2B...44D
              </p>
              <p className="text-[10px] text-slate-400">Dr. Ansh Mishra · Chief Agronomist &amp; Soil Scientist</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

