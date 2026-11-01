import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface SoilConditionsChartProps {
  values: Record<string, number>
  title: string
}

// Per-parameter bar colours
const barColors: Record<string, string> = {
  Nitrogen: '#10b981',
  Phosphorus: '#3b82f6',
  Potassium: '#8b5cf6',
  Temperature: '#f59e0b',
  Humidity: '#06b6d4',
  pH: '#84cc16',
  Rainfall: '#6366f1',
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-slate-800 mb-1">{label}</p>
      <p className="text-slate-600">
        Value: <span className="font-bold text-slate-900">{payload[0].value}</span>
      </p>
    </div>
  )
}

export function SoilConditionsChart({ values, title }: SoilConditionsChartProps) {
  const chartData = Object.entries(values).map(([name, value]) => ({ name, value }))

  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5 shadow-sm">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {title}
      </h3>
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              width={32}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.08)', radius: 8 }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map(({ name }) => (
                <Cell key={name} fill={barColors[name] ?? '#10b981'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-center text-[11px] text-slate-400">
        Demo values only — connect a live backend for real field data.
      </p>
    </div>
  )
}
