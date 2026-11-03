import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import type { PrecisionRadarMetrics } from '../../types'

interface AgroSuitabilityRadarProps {
  metrics: PrecisionRadarMetrics
  cropName: string
}

export function AgroSuitabilityRadar({ metrics, cropName }: AgroSuitabilityRadarProps) {
  const chartData = [
    { subject: 'Soil Fertility', value: metrics.soilFertility, fullMark: 100 },
    { subject: 'Climate & GDD', value: metrics.climateFit, fullMark: 100 },
    { subject: 'Water Match', value: metrics.waterAvailability, fullMark: 100 },
    { subject: 'Gross Margin', value: metrics.economicMargin, fullMark: 100 },
    { subject: 'Pest Resilience', value: metrics.pestResilience, fullMark: 100 },
  ]

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
      <div className="flex items-center justify-between border-b border-slate-200/70 pb-2 dark:border-agri-darkBorder">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Agro-Ecological Suitability Envelope
        </span>
        <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[9px] font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          FAO ECOCROP Matrix
        </span>
      </div>

      <div className="h-44 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="#94a3b8" strokeDasharray="3 3" opacity={0.4} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name={cropName}
              dataKey="value"
              stroke="#059669"
              fill="#10b981"
              fillOpacity={0.35}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-5 gap-1 pt-1 text-center font-mono text-[9px]">
        {chartData.map((d) => (
          <div key={d.subject} className="rounded-md bg-white p-1 dark:bg-agri-darkSurface border border-slate-100 dark:border-agri-darkBorder">
            <span className="block text-[8px] font-bold text-slate-400 truncate">{d.subject}</span>
            <span className="font-black text-emerald-700 dark:text-emerald-400">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

