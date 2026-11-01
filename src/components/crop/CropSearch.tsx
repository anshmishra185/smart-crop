import { Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'

import { cropCatalogue } from '../../data/crops'
import type { CropData } from '../../types/crop'
import { CropCard } from './CropCard'
import { CropDetails } from './CropDetails'

const categories = ['All', ...new Set(cropCatalogue.map((crop) => crop.category))]

export function CropSearch() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedCrop, setSelectedCrop] = useState<CropData | null>(null)

  const filteredCrops = useMemo(() => {
    return cropCatalogue.filter((crop) => {
      const matchesQuery =
        crop.name.toLowerCase().includes(query.toLowerCase()) ||
        crop.description.toLowerCase().includes(query.toLowerCase()) ||
        crop.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))

      const matchesCategory = activeCategory === 'All' || crop.category === activeCategory
      return matchesQuery && matchesCategory
    })
  }, [activeCategory, query])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search crops, tags, or descriptions"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            aria-label="Search crops"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                activeCategory === category
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredCrops.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCrops.map((crop) => (
            <CropCard key={crop.id} crop={crop} onViewDetails={setSelectedCrop} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <p className="text-lg font-medium text-slate-700">No crops match your search.</p>
          <p className="mt-2 text-sm text-slate-500">
            Try another keyword or switch to a different crop category.
          </p>
        </div>
      )}

      <CropDetails crop={selectedCrop} onClose={() => setSelectedCrop(null)} />
    </div>
  )
}
