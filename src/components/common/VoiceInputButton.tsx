import { useEffect, useState } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { voiceRecognitionService, type VoiceLanguage } from '../../lib/voiceRecognition'
import { useAppStore } from '../../store/useAppStore'

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function VoiceInputButton({
  onTranscript,
  className = '',
  size = 'md',
}: VoiceInputButtonProps) {
  const { language } = useAppStore()
  const [isListening, setIsListening] = useState(false)
  const isSupported = voiceRecognitionService.isSupported()

  // Map app language to speech recognition locale
  const voiceLang: VoiceLanguage =
    language === 'pa' ? 'pa-IN' : language === 'hi' ? 'hi-IN' : 'en-IN'

  useEffect(() => {
    return voiceRecognitionService.subscribe((state) => {
      setIsListening(state.isListening)
      if (state.transcript && !state.isListening) {
        onTranscript(state.transcript)
      }
    })
  }, [onTranscript])

  const toggleListening = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (!isSupported) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.')
      return
    }

    if (isListening) {
      voiceRecognitionService.stopListening()
    } else {
      voiceRecognitionService.startListening(voiceLang, (finalText) => {
        onTranscript(finalText)
      })
    }
  }

  const sizeClasses = {
    sm: 'h-7 w-7 p-1 text-xs',
    md: 'h-9 w-9 p-2 text-sm',
    lg: 'h-11 w-11 p-2.5 text-base',
  }

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <button
      type="button"
      onClick={toggleListening}
      title={
        isListening
          ? 'Listening to speech... Click to stop'
          : `Click to speak in ${language === 'pa' ? 'ਪੰਜਾਬੀ (Punjabi)' : language === 'hi' ? 'हिंदी (Hindi)' : 'English'}`
      }
      className={`relative inline-flex items-center justify-center rounded-xl font-bold transition-all ${sizeClasses[size]} ${
        isListening
          ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 ring-4 ring-red-200 animate-pulse'
          : 'border border-slate-200/90 text-slate-600 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 dark:border-agri-darkBorder dark:text-slate-300 dark:hover:bg-agri-darkCard'
      } ${className}`}
    >
      {isListening ? (
        <>
          <Mic className={`${iconSizes[size]} animate-bounce`} />
          <span className="sr-only">Listening...</span>
        </>
      ) : (
        <Mic className={iconSizes[size]} />
      )}
    </button>
  )
}
