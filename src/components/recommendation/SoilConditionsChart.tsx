import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface SoilConditionsChartProps {
  values: Record<string, number>
  title: string
}

export function SoilConditionsChart({ values, title }: SoilConditionsChartProps) {
  const chartData = Object.entries(values).map(([name, value]) => ({ name, value }))

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">
        {title}
      </h3>
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) => [
                typeof value === 'number' || typeof value === 'string' ? `${value}` : '0',
                'Value',
              ]}
              labelStyle={{ color: '#0f172a' }}
            />
            <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-xs text-slate-500">Illustrative frontend demo values only.</p>
    </div>
  )
}
