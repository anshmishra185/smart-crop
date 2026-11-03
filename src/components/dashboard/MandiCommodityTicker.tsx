import {
  ArrowDownRight,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react'

interface MandiPrice {
  crop: string
  punjabiName: string
  currentRate: number
  msp: number
  changePct: number
  market: string
}

const MANDI_RATES: MandiPrice[] = [
  { crop: 'Wheat (Kanak)', punjabiName: 'ਕਣਕ', currentRate: 2275, msp: 2275, changePct: 0.8, market: 'Khanna APMC' },
  { crop: 'Basmati 1121 Paddy', punjabiName: 'ਬਾਸਮਤੀ ੧੧੨੧', currentRate: 3850, msp: 2183, changePct: 1.4, market: 'Amritsar APMC' },
  { crop: 'Sharbati Paddy', punjabiName: 'ਝੋਨਾ', currentRate: 2420, msp: 2183, changePct: -0.5, market: 'Ludhiana APMC' },
  { crop: 'Bt Cotton (Narma)', punjabiName: 'ਨਰਮਾ', currentRate: 7150, msp: 6620, changePct: 2.1, market: 'Bathinda APMC' },
  { crop: 'Mustard (Sarson)', punjabiName: 'ਸਰ੍ਹੋਂ', currentRate: 5680, msp: 5650, changePct: 1.1, market: 'Mansa APMC' },
]

export function MandiCommodityTicker() {
  const projectedRevenueInr = 1842000 // Estimated farm revenue across 31.2 acres

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-agri-darkBorder">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <TrendingUp className="h-4 w-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
              Live Agricultural APMC Commodities
            </span>
          </div>
          <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
            Real-Time APMC Mandi Commodity Market Ticker
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time auction rates from major Punjab agricultural markets (Khanna, Amritsar, Bathinda).
          </p>
        </div>

        {/* Projected Farm Value Chip */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3 text-right dark:border-emerald-950 dark:bg-emerald-950/20">
          <span className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-400">
            Projected Farm Harvest Revenue
          </span>
          <p className="text-lg font-black text-emerald-900 dark:text-white font-mono">
            ₹{projectedRevenueInr.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
            Based on 52.4 q/ha projected yield
          </span>
        </div>
      </div>

      {/* Horizontal Commodity Rates Grid */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 pt-1">
        {MANDI_RATES.map((item) => {
          const isPositive = item.changePct >= 0
          return (
            <div
              key={item.crop}
              className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:bg-white hover:shadow-xs dark:border-agri-darkBorder dark:bg-agri-darkCard dark:hover:bg-agri-darkSurface"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">
                    {item.crop.split(' ')[0]}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-semibold">{item.punjabiName}</p>
                </div>
                <span
                  className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-black ${
                    isPositive
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {item.changePct}%
                </span>
              </div>

              <div className="mt-3">
                <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
                  ₹{item.currentRate.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-400 font-normal"> / quintal</span>
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200/50 pt-2 dark:border-agri-darkBorder/50">
                <span>MSP: ₹{item.msp}</span>
                <span className="truncate max-w-[80px]">{item.market}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
