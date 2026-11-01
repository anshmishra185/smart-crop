import { Activity, FlaskConical, Info, RotateCcw, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'

import { CropInputForm } from '../components/recommendation/CropInputForm'
import { RecommendationResults } from '../components/recommendation/RecommendationResults'
import { PageContainer } from '../components/layout/PageContainer'
import { demoRecommendation } from '../data/demoResults'
import { emptyRecommendation, validateRecommendation } from '../lib/validation'
import type { RecommendationFormData, RecommendationResult } from '../types/crop'

type StatusType = 'idle' | 'loading' | 'success' | 'error'

const statusConfig: Record<StatusType, { bg: string; text: string; icon: React.ElementType; dot: string }> = {
  idle: {
    bg: 'bg-slate-50 border-slate-200',
    text: 'text-slate-600',
    icon: Info,
    dot: 'bg-slate-400',
  },
  loading: {
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-700',
    icon: Activity,
    dot: 'bg-blue-500 animate-pulse',
  },
  success: {
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-800',
    icon: Sparkles,
    dot: 'bg-emerald-500',
  },
  error: {
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-700',
    icon: Info,
    dot: 'bg-red-500',
  },
}

export function Dashboard() {
  const [formValues, setFormValues] = useState<RecommendationFormData>(emptyRecommendation)
  const [errors, setErrors] = useState<Partial<Record<keyof RecommendationFormData, string>>>({})
  const [result, setResult] = useState<RecommendationResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requestError, setRequestError] = useState<string | undefined>()
  const [statusType, setStatusType] = useState<StatusType>('idle')
  const [statusMessage, setStatusMessage] = useState(
    'Enter your soil and climate values below, then submit for a demo crop recommendation.',
  )

  const statusNote = useMemo(() => {
    if (result) return 'Demo recommendation generated. Values shown are for interface illustration only.'
    return 'Enter your soil and climate values below, then submit for a demo crop recommendation.'
  }, [result])

  const handleSubmit = () => {
    const validationErrors = validateRecommendation(formValues)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      setRequestError('Please fix the highlighted fields before submitting.')
      setStatusType('error')
      setStatusMessage('Validation required — correct the highlighted fields to continue.')
      return
    }

    setRequestError(undefined)
    setIsSubmitting(true)
    setStatusType('loading')
    setStatusMessage('Analysing soil conditions and scoring crop candidates…')

    window.setTimeout(() => {
      const nextResult: RecommendationResult = {
        ...demoRecommendation,
        submitted: formValues,
        score: 86,
        suitabilitySummary:
          'Based on the submitted N–P–K ratios, pH, and climate values, Rice scores highest for field suitability in this demo model. Connect a real ML backend to generate live predictions.',
      }
      setResult(nextResult)
      setIsSubmitting(false)
      setStatusType('success')
      setStatusMessage('Recommendation ready — review your results in the panel on the right.')
    }, 1100)
  }

  const handleReset = () => {
    setFormValues(emptyRecommendation)
    setErrors({})
    setRequestError(undefined)
    setResult(null)
    setStatusType('idle')
    setStatusMessage('Form reset. Enter new values for a fresh recommendation scenario.')
  }

  const cfg = statusConfig[statusType]
  const StatusIcon = cfg.icon

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
      <PageContainer className="pt-10">
        {/* Page header */}
        <div className="mb-8 animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white shadow-md">
              <FlaskConical className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-600">
                Crop recommendation
              </p>
              <h1 className="text-xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-2xl">
                Smart Crop Dashboard
              </h1>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            Enter representative soil and climate values to explore how a future AI system could
            score and rank crop candidates for your field conditions.
          </p>
        </div>

        {/* Status banner */}
        <div
          className={`mb-8 flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm transition-all duration-300 ${cfg.bg} ${cfg.text}`}
          role="status"
          aria-live="polite"
        >
          <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${cfg.dot}`} />
          <StatusIcon className="mt-0.5 h-4 w-4 flex-shrink-0 opacity-70" />
          <p className="leading-6">{statusMessage || statusNote}</p>
        </div>

        {/* Main grid */}
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          {/* Input panel */}
          <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Soil &amp; climate inputs</h2>
                <p className="mt-1 text-sm text-slate-500">
                  All 7 parameters are required. Ranges are validated automatically.
                </p>
              </div>
              {result && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:bg-slate-50 active:scale-95"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              )}
            </div>

            <CropInputForm
              values={formValues}
              errors={errors}
              onChange={setFormValues}
              onSubmit={handleSubmit}
              onReset={handleReset}
              isSubmitting={isSubmitting}
            />
          </section>

          {/* Results panel */}
          <section className="space-y-4">
            <RecommendationResults result={result} isLoading={isSubmitting} error={requestError} />
          </section>
        </div>
      </PageContainer>
    </div>
  )
}
