import { useMemo, useState } from 'react'

import { CropInputForm } from '../components/recommendation/CropInputForm'
import { RecommendationResults } from '../components/recommendation/RecommendationResults'
import { PageContainer } from '../components/layout/PageContainer'
import { demoRecommendation } from '../data/demoResults'
import { emptyRecommendation, validateRecommendation } from '../lib/validation'
import type { RecommendationFormData, RecommendationResult } from '../types/crop'

export function Dashboard() {
  const [formValues, setFormValues] = useState<RecommendationFormData>(emptyRecommendation)
  const [errors, setErrors] = useState<Partial<Record<keyof RecommendationFormData, string>>>({})
  const [result, setResult] = useState<RecommendationResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requestError, setRequestError] = useState<string | undefined>()
  const [statusMessage, setStatusMessage] = useState(
    'Frontend-only workflow: no connected model or backend is in use yet.',
  )

  const statusNote = useMemo(() => {
    if (result) {
      return 'Demo mode is active: sample recommendation output is shown for interface demonstration only.'
    }
    return 'Frontend-only workflow: no connected model or backend is in use yet.'
  }, [result])

  const handleSubmit = () => {
    const validationErrors = validateRecommendation(formValues)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      setRequestError('Please fix the highlighted values before submitting.')
      setStatusMessage('Validation required: please correct the highlighted input values.')
      return
    }

    setRequestError(undefined)
    setIsSubmitting(true)
    setStatusMessage('Generating demo recommendation preview…')

    window.setTimeout(() => {
      const nextResult: RecommendationResult = {
        ...demoRecommendation,
        submitted: formValues,
        score: 86,
        suitabilitySummary:
          'This is a frontend prototype showing how a future crop recommendation interface could present demo scores and conditions before a real model is connected.',
      }

      setResult(nextResult)
      setIsSubmitting(false)
      setStatusMessage('Demo recommendation generated successfully. This is a frontend-only preview.')
    }, 900)
  }

  const handleReset = () => {
    setFormValues(emptyRecommendation)
    setErrors({})
    setRequestError(undefined)
    setResult(null)
    setStatusMessage('Form reset. Ready for a new recommendation scenario.')
  }

  return (
    <PageContainer className="py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Crop recommendation</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Smart crop recommendation dashboard</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          Enter representative soil and climate values to review a front-end demo of how crop suitability outputs could be presented in a future AI-powered system.
        </p>
      </div>

      <div
        className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        role="status"
        aria-live="polite"
      >
        {statusMessage || statusNote}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Soil and climate inputs</h2>
            <p className="mt-2 text-sm text-slate-600">
              All validation settings are centralized and can be adjusted when the backend specification is finalized.
            </p>
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

        <section className="space-y-4">
          <RecommendationResults result={result} isLoading={isSubmitting} error={requestError} />
        </section>
      </div>
    </PageContainer>
  )
}
