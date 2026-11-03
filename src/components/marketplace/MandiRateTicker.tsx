import { TrendingUp, Activity, ShieldCheck } from 'lucide-react'
import { PUNJAB_MANDI_BENCHMARKS, type MandiBenchmarkRate } from '../../data/marketplaceCrops'

interface MandiRateTickerProps {
  onSelectCrop?: (cropName: string) => void
}

export function MandiRateTicker({ onSelectCrop }: MandiRateTickerProps) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-xl transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <Activity className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Official Punjab Mandi Board Live Rates (APMC e-NAM Index)
              </h3>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live e-Auction
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Government Mandi Benchmark floor synchronized with Khanna, Bhagtanwala &amp; Bathinda APMC yards.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>PAU &amp; CACP Minimum Support Price Protected</span>
        </div>
      </div>

      {/* Responsive Benchmark Grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {PUNJAB_MANDI_BENCHMARKS.map((m: MandiBenchmarkRate) => {
          const isPositive = m.dailyTrend.startsWith('+')
          return (
            <div
              key={m.crop}
              onClick={() => onSelectCrop && onSelectCrop(m.crop.split(' ')[0])}
              className="group cursor-pointer rounded-2xl border border-slate-100 bg-slate-50/70 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-50/30 hover:shadow-sm dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-emerald-500/40 dark:hover:bg-emerald-950/20"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-slate-500 dark:text-slate-400 truncate max-w-[120px]" title={m.mandi}>
                  {m.mandi}
                </span>
                <span
                  className={`inline-flex items-center font-black ${
                    isPositive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  <TrendingUp className={`h-3 w-3 mr-0.5 ${!isPositive ? 'rotate-180' : ''}`} />
                  {m.dailyTrend}
                </span>
              </div>

              <h4 className="mt-1 text-xs font-black text-slate-900 line-clamp-1 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                {m.crop}
              </h4>

              <div className="mt-2 flex items-baseline justify-between">
                <div>
                  <span className="font-mono text-base font-black text-slate-900 dark:text-white">
                    ₹{m.modalPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-1">/ Qtl</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  MSP: ₹{m.govtMsp}
                </span>
              </div>

              {/* Min/Max Bar */}
              <div className="mt-2 flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-200/50 pt-1.5 dark:border-slate-800">
                <span>Range: ₹{m.minPrice} - ₹{m.maxPrice}</span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  {m.arrivalQuintals.toLocaleString()} Qtl
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

