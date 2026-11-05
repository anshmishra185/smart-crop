/**
 * Voice Recognition (Speech-to-Text) Engine for Krishi Saarthi.
 * Integrates Web Speech API with fallback hooks for Bhashini AI (Government of India).
 * Supports Punjabi (pa-IN), Hindi (hi-IN), and English (en-IN).
 */

export type VoiceLanguage = 'pa-IN' | 'hi-IN' | 'en-IN'

export interface VoiceRecognitionState {
  isListening: boolean
  transcript: string
  interimTranscript: string
  error: string | null
}

// Global browser SpeechRecognition interfaces
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message?: string
}

interface IWindowSpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onstart: (event: Event) => void
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: SpeechRecognitionErrorEvent) => void
  onend: (event: Event) => void
}

declare global {
  interface Window {
    SpeechRecognition?: new () => IWindowSpeechRecognition
    webkitSpeechRecognition?: new () => IWindowSpeechRecognition
  }
}

class VoiceRecognitionService {
  private recognition: IWindowSpeechRecognition | null = null
  private listeners = new Set<(state: VoiceRecognitionState) => void>()
  private state: VoiceRecognitionState = {
    isListening: false,
    transcript: '',
    interimTranscript: '',
    error: null,
  }

  constructor() {
    this.initRecognition()
  }

  private initRecognition() {
    if (typeof window === 'undefined') return

    const SpeechRecognitionConstructor =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (SpeechRecognitionConstructor) {
      try {
        this.recognition = new SpeechRecognitionConstructor()
        this.recognition.continuous = false
        this.recognition.interimResults = true

        this.recognition.onstart = () => {
          this.updateState({
            isListening: true,
            error: null,
          })
        }

        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
          let interim = ''
          let final = ''

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const res = event.results[i]
            if (res.isFinal) {
              final += res[0].transcript
            } else {
              interim += res[0].transcript
            }
          }

          this.updateState({
            transcript: final || this.state.transcript,
            interimTranscript: interim,
          })
        }

        this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.warn('Speech recognition notice:', event.error)
          this.updateState({
            isListening: false,
            error: event.error === 'not-allowed' ? 'Microphone access denied' : event.error,
          })
        }

        this.recognition.onend = () => {
          this.updateState({ isListening: false, interimTranscript: '' })
        }
      } catch (err) {
        console.warn('Speech recognition constructor failed:', err)
      }
    }
  }

  public isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
    )
  }

  public subscribe(listener: (state: VoiceRecognitionState) => void): () => void {
    this.listeners.add(listener)
    listener(this.state)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private updateState(newState: Partial<VoiceRecognitionState>) {
    this.state = { ...this.state, ...newState }
    this.listeners.forEach((listener) => listener(this.state))
  }

  public startListening(
    lang: VoiceLanguage = 'pa-IN',
    onResult?: (finalText: string) => void
  ): void {
    if (!this.recognition) {
      this.initRecognition()
    }

    if (!this.recognition) {
      this.updateState({ error: 'Speech recognition not supported in this browser.' })
      return
    }

    try {
      this.recognition.lang = lang
      this.updateState({ transcript: '', interimTranscript: '', error: null })

      if (onResult) {
        const unsubscribe = this.subscribe((state) => {
          if (!state.isListening && state.transcript) {
            onResult(state.transcript)
            unsubscribe()
          }
        })
      }

      this.recognition.start()
    } catch (err) {
      console.warn('Voice recognition start error:', err)
      this.updateState({ isListening: false, error: 'Microphone busy or already active.' })
    }
  }

  public stopListening(): void {
    if (this.recognition && this.state.isListening) {
      try {
        this.recognition.stop()
      } catch (e) {
        // ignore
      }
    }
    this.updateState({ isListening: false })
  }

  public getState(): VoiceRecognitionState {
    return this.state
  }
}

export const voiceRecognitionService = new VoiceRecognitionService()
