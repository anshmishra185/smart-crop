import { useEffect, useState, type MouseEvent } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { speechService } from '../../lib/speech'
import { useAppStore, type LanguageCode } from '../../store/useAppStore'

interface AudioAdvisoryButtonProps {
  textToSpeak?: string
  getNarrative?: (lang: LanguageCode) => string
  label?: string
  className?: string
  variant?: 'solid' | 'ghost' | 'pill'
}

export function AudioAdvisoryButton({
  textToSpeak = '',
  getNarrative,
  label = 'Listen Advisory',
  className = '',
  variant = 'pill',
}: AudioAdvisoryButtonProps) {
  const { language } = useAppStore()
  const [isSpeaking, setIsSpeaking] = useState(false)

  const activeSpokenText = getNarrative ? getNarrative(language) : textToSpeak

  useEffect(() => {
    return speechService.subscribe((state) => {
      setIsSpeaking(state.isSpeaking)
    })
  }, [])

  const handleTogglePlay = (e: MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (isSpeaking) {
      speechService.stop()
    } else {
      speechService.speak(activeSpokenText, language)
    }
  }

  const langLabels: Record<string, string> = {
    en: 'English',
    hi: 'हिंदी',
    pa: 'ਪੰਜਾਬੀ',
    mr: 'मराठी',
    te: 'తెలుగు',
  }

  if (variant === 'ghost') {
    return (
      <button
        type="button"
        onClick={handleTogglePlay}
        title={`Listen aloud clearly in ${langLabels[language] || 'regional language'}`}
        className={`inline-flex items-center gap-1.5 rounded-lg p-1.5 text-xs font-bold transition ${
          isSpeaking
            ? 'bg-emerald-600 text-white animate-pulse'
            : 'text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40'
        } ${className}`}
      >
        {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        {label && <span>{isSpeaking ? 'Stop Audio' : label}</span>}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleTogglePlay}
      title={`Listen aloud clearly in ${langLabels[language] || 'regional language'}`}
      className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-xs font-bold transition-all active:scale-95 shadow-sm ${
        isSpeaking
          ? 'border-emerald-600 bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-400/50'
          : 'border-emerald-200 bg-emerald-50/90 text-emerald-900 hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60'
      } ${className}`}
    >
      {isSpeaking ? (
        <>
          <span className="flex h-2 w-2 items-center justify-center">
            <span className="h-2 w-2 rounded-full bg-white animate-ping" />
          </span>
          <VolumeX className="h-3.5 w-3.5" />
          <span>Stop Voice</span>
        </>
      ) : (
        <>
          <Volume2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{label}</span>
          <span className="rounded-full bg-emerald-200/60 px-1.5 py-0.2 text-[9px] font-extrabold uppercase tracking-wide text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
            {langLabels[language] || language}
          </span>
        </>
      )}
    </button>
  )
}
