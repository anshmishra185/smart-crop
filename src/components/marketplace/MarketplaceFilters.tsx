import { Search, X, SlidersHorizontal, Check } from 'lucide-react'

interface MarketplaceFiltersProps {
  searchQuery: string
  setSearchQuery: (q: string) => void
  selectedCategory: string
  setSelectedCategory: (cat: string) => void
  selectedDistrict: string
  setSelectedDistrict: (dist: string) => void
  selectedGrade: string
  setSelectedGrade: (grade: string) => void
  aboveMspOnly: boolean
  setAboveMspOnly: (val: boolean) => void
  totalCount: number
}

const CATEGORIES = [
  'All',
  'Cereals',
  'Pulses',
  'Oilseeds',
  'Commercial & Cash Crops',
  'Vegetables',
]

const DISTRICTS = [
  'All',
  'Ludhiana',
  'Amritsar',
  'Bathinda',
  'Fazilka',
  'Moga',
  'Jalandhar',
  'Hoshiarpur',
  'Patiala',
]

const QUALITY_GRADES = [
  'All',
  'Grade A Premium',
  'Certified Organic',
  'Seed Multiplication Grade',
  'FAQ Standard',
]

export function MarketplaceFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedDistrict,
  setSelectedDistrict,
  selectedGrade,
  setSelectedGrade,
  aboveMspOnly,
  setAboveMspOnly,
  totalCount,
}: MarketplaceFiltersProps) {
  return (
    <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
      {/* Top Search & Primary District Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input with Clear Button */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search crop, variety (HD-3086, Basmati 1121), farmer, or village..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-9 py-2.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* District & Grade Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none transition hover:border-amber-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 cursor-pointer"
          >
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Districts (ਸਾਰੇ ਜ਼ਿਲ੍ਹੇ)' : `${d} District`}
              </option>
            ))}
          </select>

          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none transition hover:border-amber-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 cursor-pointer"
          >
            {QUALITY_GRADES.map((g) => (
              <option key={g} value={g}>
                {g === 'All' ? 'All Quality Grades' : g}
              </option>
            ))}
          </select>

          {/* Above MSP Only Toggle */}
          <button
            onClick={() => setAboveMspOnly(!aboveMspOnly)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition cursor-pointer ${
              aboveMspOnly
                ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400'
            }`}
          >
            <div
              className={`flex h-4 w-4 items-center justify-center rounded border transition ${
                aboveMspOnly
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            >
              {aboveMspOnly && <Check className="h-3 w-3 stroke-[3]" />}
            </div>
            <span>Above Govt MSP Only</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Results Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 mr-1">
            <SlidersHorizontal className="h-3 w-3" /> Categories:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-slate-950 shadow-sm ring-1 ring-amber-400 font-black'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
          Showing <span className="font-black text-amber-500">{totalCount}</span> verified crop lots
        </div>
      </div>
    </div>
  )
}

