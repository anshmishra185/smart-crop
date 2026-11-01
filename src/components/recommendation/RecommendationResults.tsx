import { AlertTriangle, CheckCircle2, Info, Leaf, TrendingUp, Sparkles } from 'lucide-react'

import type { RecommendationResult } from '../../types/crop'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { SoilConditionsChart } from './SoilConditionsChart'

interface RecommendationResultsProps {
  result: RecommendationResult | null
  isLoading: boolean
  error?: string
}

// Circular score ring (SVG)
function ScoreRing({ score }: { score: number }) {
  const r = 38
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ

  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <svg className="-rotate-90" width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-xl font-extrabold text-slate-900">{score}%</p>
        <p className="text-[10px] text-slate-400">match</p>
      </div>
    </div>
  )
}

export function RecommendationResults({ result, isLoading, error }: RecommendationResultsProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden border-emerald-100 bg-white shadow-card" aria-live="polite">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />
            Analysing field conditions…
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-8">
          {[80, 60, 70, 45].map((w, i) => (
            <div
              key={i}
              className="h-3 animate-pulse rounded-full bg-emerald-100"
              style={{ width: `${w}%`, animationDelay: `${i * 120}ms` }}
            />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50/70 shadow-card" aria-live="assertive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            Submission issue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-red-700">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!result) {
    return (
      <Card className="border-dashed border-slate-200 bg-slate-50/80 shadow-sm" aria-live="polite">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-500">
            <Info className="h-5 w-5" />
            Awaiting submission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-slate-500">
            Complete the form on the left and press <strong className="text-slate-700">Get Recommendation</strong> to
            see crop scores and field analysis here.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {['N–P–K analysis', 'Climate scoring', 'pH evaluation', 'Rainfall match'].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                {item}
              </div>
            ))}
          </div>
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
    <Card className="animate-scale-in overflow-hidden border-emerald-100 bg-white shadow-card-hover">
      {/* Hero image */}
      <div className="relative">
        <img src={result.image} alt={result.cropName} className="h-52 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />

        {/* Recommended badge */}
        <div className="absolute left-5 top-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            <Sparkles className="h-3 w-3" />
            Top recommendation
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5 text-white">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
              Recommended crop
            </p>
            <h3 className="mt-1.5 text-3xl font-extrabold tracking-tight">{result.cropName}</h3>
          </div>
          <Badge className="border-emerald-300/50 bg-emerald-500 px-3 py-1.5 text-sm font-bold text-white shadow-sm">
            {result.score}% match
          </Badge>
        </div>
      </div>

      <CardContent className="space-y-6 pt-6">
        {/* Score + status row */}
        <div className="flex items-center gap-5">
          <ScoreRing score={result.score} />
          <div className="flex-1 space-y-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Suitability</p>
              <div className="mt-1 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000"
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
              <Leaf className="h-4 w-4" />
              Demo model output
            </div>
          </div>
        </div>

        {/* Alternative crops */}
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Alternative crops
          </h4>
          <div className="space-y-2.5">
            {result.alternatives.map((alt) => (
              <div key={alt.name} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white shadow-sm">
                  <TrendingUp className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <span className="flex-1 text-sm font-medium text-slate-700">{alt.name}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-1.5 rounded-full bg-slate-400 transition-all duration-700"
                      style={{ width: `${alt.score}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-sm font-semibold text-slate-500">{alt.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <SoilConditionsChart values={chartData} title="Submitted soil & climate conditions" />

        {/* Summary card */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">Suitability summary</p>
              <p className="mt-1 text-sm leading-6 text-emerald-700">{result.suitabilitySummary}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
