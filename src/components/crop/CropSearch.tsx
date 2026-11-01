import { LayoutGrid, List, Search, SlidersHorizontal, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { cropCatalogue } from '../../data/crops'
import type { CropData } from '../../types/crop'
import { CropCard } from './CropCard'
import { CropDetails } from './CropDetails'

const categories = ['All', ...Array.from(new Set(cropCatalogue.map((c) => c.category)))]

type LayoutMode = 'grid' | 'list'

export function CropSearch() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedCrop, setSelectedCrop] = useState<CropData | null>(null)
  const [layout, setLayout] = useState<LayoutMode>('grid')

  const filteredCrops = useMemo(() => {
    return cropCatalogue.filter((crop) => {
      const q = query.toLowerCase()
      const matchesQuery =
        crop.name.toLowerCase().includes(q) ||
        crop.description.toLowerCase().includes(q) ||
        crop.tags.some((tag) => tag.toLowerCase().includes(q))
      const matchesCategory = activeCategory === 'All' || crop.category === activeCategory
      return matchesQuery && matchesCategory
    })
  }, [activeCategory, query])

  return (
    <div className="space-y-6">
      {/* Search + filters bar */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search input */}
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search crops, tags, or descriptions…"
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-9 text-sm text-slate-900 outline-none transition-all focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              aria-label="Search crops"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 transition-colors hover:text-slate-700"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category pills + layout toggle */}
          <div className="flex items-center gap-3 overflow-x-auto pb-0.5">
            <SlidersHorizontal className="h-4 w-4 flex-shrink-0 text-slate-400" aria-hidden />
            <div className="flex items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    activeCategory === cat
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Layout toggle */}
            <div className="ml-2 flex flex-shrink-0 items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setLayout('grid')}
                aria-label="Grid view"
                className={`rounded-lg p-1.5 transition-all ${layout === 'grid' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-400 hover:text-slate-700'}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setLayout('list')}
                aria-label="List view"
                className={`rounded-lg p-1.5 transition-all ${layout === 'list' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-400 hover:text-slate-700'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Result count */}
        <p className="mt-3 text-xs text-slate-400">
          {filteredCrops.length} crop{filteredCrops.length !== 1 ? 's' : ''} found
          {query && <> for "<strong className="text-slate-600">{query}</strong>"</>}
          {activeCategory !== 'All' && <> in <strong className="text-slate-600">{activeCategory}</strong></>}
        </p>
      </div>

      {/* Crop grid / list */}
      {filteredCrops.length > 0 ? (
        <div
          className={
            layout === 'grid'
              ? 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3'
              : 'flex flex-col gap-4'
          }
        >
          {filteredCrops.map((crop) => (
            <CropCard key={crop.id} crop={crop} onViewDetails={setSelectedCrop} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <Search className="h-6 w-6 text-slate-400" />
          </div>
          <p className="text-base font-semibold text-slate-700">No crops match your search</p>
          <p className="mt-2 max-w-xs text-sm text-slate-500">
            Try a different keyword or select a different category filter.
          </p>
          <button
            type="button"
            onClick={() => { setQuery(''); setActiveCategory('All') }}
            className="mt-5 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
          >
            Clear filters
          </button>
        </div>
      )}

      <CropDetails crop={selectedCrop} onClose={() => setSelectedCrop(null)} />
    </div>
  )
}
