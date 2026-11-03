import type { LanguageCode } from './translations'

export interface SpeechAdvisoryState {
  isSpeaking: boolean
  currentText: string | null
}

const langToLocaleMap: Record<LanguageCode, string[]> = {
  en: ['en-IN', 'en-GB', 'en-US'],
  hi: ['hi-IN', 'hi'],
  pa: ['pa-IN', 'pa', 'hi-IN'], // Punjabi with fallback to fluent Hindi/Indian voice if OS lacks Punjabi voice pack
  mr: ['mr-IN', 'mr', 'hi-IN'],
  te: ['te-IN', 'te', 'hi-IN'],
}

/**
 * Phonetic clean-up to prevent stutter, pauses, or mechanical garbling.
 * Expands technical metrics, symbols, and punctuation into smooth articulate speech.
 */
function sanitizeAcousticText(text: string, lang: LanguageCode): string {
  let cleaned = text
    .replace(/[*_#`[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (lang === 'pa' || lang === 'hi') {
    cleaned = cleaned
      .replace(/°C/g, ' ਡਿਗਰੀ ਸੈਲਸੀਅਸ ')
      .replace(/km\/h/g, ' ਕਿਲੋਮੀਟਰ ਪ੍ਰਤੀ ਘੰਟਾ ')
      .replace(/%/g, ' ਪ੍ਰਤੀਸ਼ਤ ')
      .replace(/pH/g, ' ਪੀ ਐਚ ')
  } else if (lang === 'mr') {
    cleaned = cleaned
      .replace(/°C/g, ' अंश सेल्सिअस ')
      .replace(/km\/h/g, ' किलोमीटर प्रति तास ')
      .replace(/%/g, ' टक्के ')
      .replace(/pH/g, ' पीएच ')
  } else if (lang === 'te') {
    cleaned = cleaned
      .replace(/°C/g, ' డిగ్రీల సెల్సియస్ ')
      .replace(/km\/h/g, ' కిలోమీటర్లు ')
      .replace(/%/g, ' శాతం ')
      .replace(/pH/g, ' పిహెచ్ ')
  } else {
    cleaned = cleaned
      .replace(/°C/g, ' degrees Celsius ')
      .replace(/km\/h/g, ' kilometers per hour ')
      .replace(/%/g, ' percent ')
      .replace(/pH/g, ' P H ')
      .replace(/@/g, ' at ')
  }

  // Ensure natural cadence pauses after sentences and commas
  return cleaned
    .replace(/([.!?।])\s*/g, '$1 ')
    .replace(/,\s*/g, ', ')
    .trim()
}

class SpeechService {
  private activeUtterance: SpeechSynthesisUtterance | null = null
  private listeners = new Set<(state: SpeechAdvisoryState) => void>()
  private state: SpeechAdvisoryState = {
    isSpeaking: false,
    currentText: null,
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
  }

  public subscribe(listener: (state: SpeechAdvisoryState) => void): () => void {
    this.listeners.add(listener)
    listener(this.state)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private updateState(newState: Partial<SpeechAdvisoryState>) {
    this.state = { ...this.state, ...newState }
    this.listeners.forEach((listener) => listener(this.state))
  }

  /**
   * Selects the highest quality articulate natural voice available for the target locale.
   * Gives top preference to Indian regional neural voices (Google, Microsoft, Natural).
   */
  private pickVoice(locales: string[]): SpeechSynthesisVoice | null {
    if (!this.isSupported()) return null
    const voices = window.speechSynthesis.getVoices()
    if (!voices || voices.length === 0) return null

    // Helper to score voice quality
    const scoreVoice = (voice: SpeechSynthesisVoice, targetPrefix: string): number => {
      let score = 0
      const name = voice.name.toLowerCase()
      const lang = voice.lang.toLowerCase()

      if (lang === targetPrefix || lang.startsWith(targetPrefix)) score += 50
      if (name.includes('natural') || name.includes('neural') || name.includes('online')) score += 30
      if (name.includes('google') || name.includes('microsoft') || name.includes('apple')) score += 20
      if (name.includes('india') || lang.includes('-in')) score += 15
      return score
    }

    // Search across requested locale priorities
    for (const locale of locales) {
      const prefix = locale.split('-')[0].toLowerCase()
      const matchingVoices = voices.filter((v) => v.lang.toLowerCase().startsWith(prefix))

      if (matchingVoices.length > 0) {
        // Return the voice with highest quality score
        matchingVoices.sort((a, b) => scoreVoice(b, prefix) - scoreVoice(a, prefix))
        return matchingVoices[0]
      }
    }

    // Fallback: Indian English or top natural voice
    const indianEnglish = voices.find((v) => v.lang.toLowerCase() === 'en-in')
    if (indianEnglish) return indianEnglish

    const topRated = voices.find((v) => v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('google'))
    return topRated || voices[0] || null
  }

  public speak(rawText: string, lang: LanguageCode = 'en', onComplete?: () => void): void {
    if (!this.isSupported()) {
      console.warn('Speech synthesis not supported in this browser.')
      return
    }

    // Cancel any ongoing utterance cleanly
    this.stop()

    const cleanText = sanitizeAcousticText(rawText, lang)
    if (!cleanText) return

    const utterance = new SpeechSynthesisUtterance(cleanText)
    const targetLocales = langToLocaleMap[lang] || ['en-IN', 'en-US']

    const voice = this.pickVoice(targetLocales)
    if (voice) {
      utterance.voice = voice
      utterance.lang = voice.lang
    } else {
      utterance.lang = targetLocales[0]
    }

    // Acoustic Calibration:
    // Rate: 0.88 for a calm, deliberate, easy-to-understand farm broadcast cadence.
    // Pitch: 1.02 for an articulate, crisp, bright vocal timbre without bass muffle or squeakiness.
    // Volume: 1.0 for 100% full outdoor auditory clarity.
    utterance.rate = 0.88
    utterance.pitch = 1.02
    utterance.volume = 1.0

    utterance.onstart = () => {
      this.activeUtterance = utterance
      this.updateState({ isSpeaking: true, currentText: cleanText })
    }

    utterance.onend = () => {
      this.activeUtterance = null
      this.updateState({ isSpeaking: false, currentText: null })
      onComplete?.()
    }

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e)
      this.activeUtterance = null
      this.updateState({ isSpeaking: false, currentText: null })
    }

    // Give browser speech worker a microtick to clear previous queue
    setTimeout(() => {
      window.speechSynthesis.speak(utterance)
    }, 50)
  }

  public stop(): void {
    if (this.isSupported()) {
      window.speechSynthesis.cancel()
    }
    this.activeUtterance = null
    this.updateState({ isSpeaking: false, currentText: null })
  }

  public getState(): SpeechAdvisoryState {
    return this.state
  }

  public getActiveUtterance(): SpeechSynthesisUtterance | null {
    return this.activeUtterance
  }
}

export const speechService = new SpeechService()
