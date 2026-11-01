import { Info, RotateCcw } from 'lucide-react'
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
    const nextValues = { ...values, [field]: numericValue }
    onChange(nextValues)
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault()
        const validationErrors = validateRecommendation(values)
        if (Object.keys(validationErrors).length > 0) {
          return
        }
        onSubmit()
      }}
      noValidate
    >
      <div className="grid gap-4 md:grid-cols-2">
        {fieldOrder.map((field) => {
          const config = recommendationFieldConfig[field]
          const fieldValue = values[field]
          const hasError = Boolean(errors[field] && touched[field])

          return (
            <div key={field} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor={field} className="text-sm font-medium text-slate-700">
                  {config.label}
                </label>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                  <Info className="h-3.5 w-3.5" />
                  {config.unit || 'value'}
                </span>
              </div>

              <Input
                id={field}
                type="number"
                step={field === 'ph' ? '0.1' : '1'}
                value={fieldValue}
                onChange={(event) => {
                  updateField(field, event.target.value)
                  setTouched((current) => ({ ...current, [field]: true }))
                }}
                className={hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : ''}
                aria-invalid={hasError}
                aria-describedby={hasError ? `${field}-error` : undefined}
              />

              {hasError ? (
                <p id={`${field}-error`} className="text-sm text-red-600">
                  {errors[field]}
                </p>
              ) : null}
            </div>
          )
        })}
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <Button type="button" variant="outline" onClick={onReset} className="flex-1">
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? 'Preparing demo...' : 'Submit for demo prediction'}
        </Button>
      </div>
    </form>
  )
}
