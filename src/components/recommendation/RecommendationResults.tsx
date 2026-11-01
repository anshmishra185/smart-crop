import { AlertTriangle, Info, Leaf, TrendingUp } from 'lucide-react'

import type { RecommendationResult } from '../../types/crop'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { SoilConditionsChart } from './SoilConditionsChart'

interface RecommendationResultsProps {
  result: RecommendationResult | null
  isLoading: boolean
  error?: string
}

export function RecommendationResults({ result, isLoading, error }: RecommendationResultsProps) {
  if (isLoading) {
    return (
      <Card className="border-dashed border-emerald-200 bg-emerald-50/60" aria-live="polite">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <TrendingUp className="h-5 w-5" />
            Preparing demo recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-3 w-3/4 animate-pulse rounded-full bg-emerald-200" />
            <div className="h-3 w-1/2 animate-pulse rounded-full bg-emerald-200" />
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-emerald-200" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50/70" aria-live="assertive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            Demo request unavailable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-700">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!result) {
    return (
      <Card className="border-dashed border-slate-300 bg-slate-50/80" aria-live="polite">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-700">
            <Info className="h-5 w-5" />
            No recommendation yet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Fill in the command inputs and submit to preview a demo recommendation state.
          </p>
        </CardContent>
      </Card>
    )
  }

  const chartData = {
    Nitrogen: result.submitted.nitrogen,
    Phosphorus: result.submitted.phosphorus,
    Potassium: result.submitted.potassium,
    Temperature: result.submitted.temperature,
    Humidity: result.submitted.humidity,
    pH: result.submitted.ph,
    Rainfall: result.submitted.rainfall,
  }

  return (
    <Card className="overflow-hidden border-emerald-200 bg-white shadow-sm">
      <div className="relative">
        <img src={result.image} alt={result.cropName} className="h-52 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/65 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5 text-white">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Recommended crop</p>
            <h3 className="mt-2 text-3xl font-semibold">{result.cropName}</h3>
          </div>
          <Badge className="border-emerald-300 bg-emerald-100 text-emerald-900">
            Confidence {result.score}%
          </Badge>
        </div>
      </div>

      <CardContent className="space-y-6 pt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Model score</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{result.score}%</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Demo status</p>
            <p className="mt-2 flex items-center gap-2 text-base font-medium text-emerald-700">
              <Leaf className="h-4 w-4" />
              Frontend demo output only
            </p>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">
            Top alternatives
          </h4>
          <div className="space-y-2">
            {result.alternatives.map((alternative) => (
              <div key={alternative.name} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <span className="text-sm font-medium text-slate-700">{alternative.name}</span>
                <span className="text-sm text-slate-500">{alternative.score}%</span>
              </div>
            ))}
          </div>
        </div>

        <SoilConditionsChart values={chartData} title="Submitted soil and climate conditions" />

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Educational note</p>
          <p className="mt-1 leading-6">
            {result.suitabilitySummary}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
