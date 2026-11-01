import { Info, RotateCcw, Send } from 'lucide-react'
import { useState } from 'react'

import { recommendationFieldConfig, validateRecommendation } from '../../lib/validation'
import type { RecommendationFormData } from '../../types/crop'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface CropInputFormProps {
  values: RecommendationFormData
  onChange: (values: RecommendationFormData) => void
  onSubmit: () => void
  onReset: () => void
  isSubmitting: boolean
  errors: Partial<Record<keyof RecommendationFormData, string>>
}

const fieldOrder: Array<keyof RecommendationFormData> = [
  'nitrogen',
  'phosphorus',
  'potassium',
  'temperature',
  'humidity',
  'ph',
  'rainfall',
]

// Field-level accent colours for visual grouping
const fieldAccent: Record<keyof RecommendationFormData, string> = {
  nitrogen: 'from-emerald-400 to-teal-400',
  phosphorus: 'from-sky-400 to-blue-400',
  potassium: 'from-violet-400 to-purple-400',
  temperature: 'from-orange-400 to-amber-400',
  humidity: 'from-blue-400 to-cyan-400',
  ph: 'from-lime-400 to-green-400',
  rainfall: 'from-indigo-400 to-blue-500',
}

// Suggested range for mini progress display
const fieldRangeMax: Record<keyof RecommendationFormData, number> = {
  nitrogen: 140,
  phosphorus: 145,
  potassium: 205,
  temperature: 50,
  humidity: 100,
  ph: 14,
  rainfall: 300,
}

export function CropInputForm({
  values,
  onChange,
  onSubmit,
  onReset,
  isSubmitting,
  errors,
}: CropInputFormProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>(
    Object.fromEntries(fieldOrder.map((field) => [field, true])),
  )

  const updateField = (field: keyof RecommendationFormData, value: string) => {
    const numericValue = value === '' ? 0 : Number(value)
    onChange({ ...values, [field]: numericValue })
  }

  const filledCount = fieldOrder.filter((f) => values[f] !== 0).length

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault()
        const validationErrors = validateRecommendation(values)
        if (Object.keys(validationErrors).length > 0) return
        onSubmit()
      }}
      noValidate
    >
      {/* Progress indicator */}
      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span className="font-medium">Fields completed</span>
          <span className="font-semibold text-emerald-700">{filledCount} / {fieldOrder.length}</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-200">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
            style={{ width: `${(filledCount / fieldOrder.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Input grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {fieldOrder.map((field) => {
          const config = recommendationFieldConfig[field]
          const fieldValue = values[field]
          const hasError = Boolean(errors[field] && touched[field])
          const rangeMax = fieldRangeMax[field]
          const pct = Math.min(100, (fieldValue / rangeMax) * 100)
          const accent = fieldAccent[field]

          return (
            <div key={field} className="group space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor={field} className="text-sm font-semibold text-slate-700">
                  {config.label}
                </label>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                  <Info className="h-3 w-3" />
                  {config.unit || 'value'}
                </span>
              </div>

              <div className="relative">
                <Input
                  id={field}
                  type="number"
                  step={field === 'ph' ? '0.1' : '1'}
                  value={fieldValue === 0 ? '' : fieldValue}
                  placeholder={`Enter ${config.label.toLowerCase()}`}
                  onChange={(event) => {
                    updateField(field, event.target.value)
                    setTouched((current) => ({ ...current, [field]: true }))
                  }}
                  className={`h-11 rounded-xl border bg-white pr-4 text-sm font-medium text-slate-900 shadow-sm transition-all focus:ring-2 ${
                    hasError
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                      : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-100 group-hover:border-slate-300'
                  }`}
                  aria-invalid={hasError}
                  aria-describedby={hasError ? `${field}-error` : `${field}-hint`}
                />
              </div>

              {/* Mini value bar */}
              {!hasError && fieldValue > 0 && (
                <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-1 rounded-full bg-gradient-to-r ${accent} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}

              {/* Range hint */}
              {!hasError && (
                <p id={`${field}-hint`} className="text-[11px] text-slate-400">
                  {config.min !== undefined && config.max !== undefined
                    ? `Typical range: ${config.min} – ${config.max} ${config.unit ?? ''}`
                    : `Enter a valid ${config.label.toLowerCase()} value`}
                </p>
              )}

              {hasError && (
                <p id={`${field}-error`} className="flex items-center gap-1 text-xs font-medium text-red-600" role="alert">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
                  {errors[field]}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          className="flex-1 gap-2 rounded-xl border-slate-200 text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
        <Button
          type="submit"
          className="flex-1 gap-2 rounded-xl shadow-md transition-all hover:shadow-glow-emerald active:scale-95 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Analysing…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Get Recommendation
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
