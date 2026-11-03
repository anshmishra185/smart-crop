import { useState } from 'react'
import {
  CheckCircle2,
  Clock,
  ListTodo,
  Zap,
} from 'lucide-react'

export interface WorkOrder {
  id: string
  code: string
  title: string
  sector: string
  targetWindow: string
  priority: 'Urgent' | 'High' | 'Routine'
  category: 'Chemical Spray' | 'Irrigation Valve' | 'Pest Scouting' | 'Soil Sampling'
  status: 'Dispatched' | 'In Progress' | 'Completed'
}

const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'wo-104',
    code: 'WO #104',
    title: 'Foliar application of Mancozeb 75% WP on Sector B2 (HD-3086 Wheat)',
    sector: 'Sector B2',
    targetWindow: 'Before 11:00 AM (Wind < 12 km/h)',
    priority: 'Urgent',
    category: 'Chemical Spray',
    status: 'In Progress',
  },
  {
    id: 'wo-105',
    code: 'WO #105',
    title: 'Pulse Drip Solenoid Valve #3 for 45 minutes to restore root zone VWC to 40%',
    sector: 'Sector C1',
    targetWindow: 'Immediate (Morning cycle)',
    priority: 'High',
    category: 'Irrigation Valve',
    status: 'Dispatched',
  },
  {
    id: 'wo-106',
    code: 'WO #106',
    title: 'Visual scouting of lower leaf canopy for whitefly / aphid nymphs',
    sector: 'Sector C1 (Bt Cotton)',
    targetWindow: 'By 03:00 PM',
    priority: 'Routine',
    category: 'Pest Scouting',
    status: 'Dispatched',
  },
  {
    id: 'wo-107',
    code: 'WO #107',
    title: 'Extract 3-core composite soil sample for Electrical Conductivity (EC) audit',
    sector: 'Sector D3 (Mustard)',
    targetWindow: 'Tomorrow Morning',
    priority: 'Routine',
    category: 'Soil Sampling',
    status: 'Completed',
  },
]

export function OperationsWorkOrderFeed() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS)
  const [filter, setFilter] = useState<'All' | 'Dispatched' | 'In Progress' | 'Completed'>('All')

  const toggleStatus = (id: string) => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id !== id) return wo
        const nextStatus =
          wo.status === 'Dispatched'
            ? 'In Progress'
            : wo.status === 'In Progress'
            ? 'Completed'
            : 'Dispatched'
        return { ...wo, status: nextStatus }
      })
    )
  }

  const filteredOrders = workOrders.filter((wo) => {
    if (filter === 'All') return true
    return wo.status === filter
  })

  const completedCount = workOrders.filter((w) => w.status === 'Completed').length
  const pendingCount = workOrders.length - completedCount

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-agri-darkBorder">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <ListTodo className="h-4 w-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-300">
              Autonomous Agronomic Dispatch
            </span>
          </div>
          <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
            AI Operations Work Order & Task Dispatch Feed
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated task dispatch engine converting disease and telemetry anomalies into actionable farm work orders.
          </p>
        </div>

        {/* Status Counter Chips */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900">
            <Clock className="h-3 w-3" /> {pendingCount} Pending
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900">
            <CheckCircle2 className="h-3 w-3" /> {completedCount} Done
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pt-1">
        {(['All', 'Dispatched', 'In Progress', 'Completed'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              filter === tab
                ? 'bg-forest-800 text-white dark:bg-emerald-600 shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-agri-darkCard dark:text-slate-300 border border-slate-200 dark:border-agri-darkBorder'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Work Orders List */}
      <div className="space-y-3 pt-2">
        {filteredOrders.map((wo) => {
          const isUrgent = wo.priority === 'Urgent'
          const isHigh = wo.priority === 'High'
          const isDone = wo.status === 'Completed'

          return (
            <div
              key={wo.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 transition ${
                isDone
                  ? 'border-slate-200 bg-slate-50/50 opacity-60 dark:border-agri-darkBorder dark:bg-agri-darkCard/40'
                  : 'border-slate-200 bg-white hover:border-emerald-400 dark:border-agri-darkBorder dark:bg-agri-darkCard shadow-2xs'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-slate-500">
                    {wo.code}
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[9px] font-black uppercase ${
                      isUrgent
                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                        : isHigh
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {wo.priority}
                  </span>
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {wo.category}
                  </span>
                </div>

                <h4 className={`text-xs font-black ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                  {wo.title}
                </h4>

                <p className="text-[11px] text-slate-500">
                  Target: {wo.targetWindow} • Assigned to: Farm Field Hand
                </p>
              </div>

              {/* Status Action Button */}
              <button
                type="button"
                onClick={() => toggleStatus(wo.id)}
                className={`flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black transition ${
                  wo.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : wo.status === 'In Progress'
                    ? 'bg-amber-500 text-white shadow-xs hover:bg-amber-600'
                    : 'bg-slate-800 text-white shadow-xs hover:bg-slate-900 dark:bg-emerald-600 dark:hover:bg-emerald-700'
                }`}
              >
                {wo.status === 'Completed' ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                  </>
                ) : wo.status === 'In Progress' ? (
                  <>
                    <Clock className="h-3.5 w-3.5" /> In Progress
                  </>
                ) : (
                  <>
                    <Zap className="h-3.5 w-3.5" /> Dispatch
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
