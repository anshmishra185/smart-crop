import { ArrowRight, Leaf, Tag } from 'lucide-react'

import type { CropData } from '../../types/crop'
import { cropPlaceholderImage } from '../../data/imageSources'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

interface CropCardProps {
  crop: CropData
  onViewDetails: (crop: CropData) => void
}

export function CropCard({ crop, onViewDetails }: CropCardProps) {
  const imageData = typeof crop.image === 'string' ? null : crop.image
  const imageSrc = typeof crop.image === 'string' ? crop.image : crop.image.src
  const imageAlt = imageData?.alt ?? crop.name

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-200/60 hover:shadow-card-hover">
      {/* Image */}
      <figure className="relative overflow-hidden">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = cropPlaceholderImage
          }}
        />
        {/* Category overlay badge */}
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-black/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
            {crop.category}
          </span>
        </div>
        {/* Image attribution */}
        {imageData?.sourceUrl && (
          <figcaption className="absolute bottom-0 right-0 bg-black/40 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur-sm">
            <a href={imageData.sourceUrl} target="_blank" rel="noreferrer" className="hover:text-white">
              © {imageData.attribution}
            </a>
          </figcaption>
        )}
      </figure>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold text-slate-900 leading-tight">{crop.name}</h3>
            <Badge className="flex-shrink-0 rounded-full text-[11px]">{crop.tags[0]}</Badge>
          </div>
          {(crop as any).scientificName && (
            <p className="mt-0.5 text-xs italic text-slate-400">{(crop as any).scientificName}</p>
          )}
        </div>

        <p className="text-sm leading-6 text-slate-600 line-clamp-3">{crop.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {crop.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
            >
              <Tag className="h-2.5 w-2.5" />
              {tag}
            </span>
          ))}
          {crop.tags.length > 4 && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-400">
              +{crop.tags.length - 4}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-1.5 text-sm text-emerald-700">
            <Leaf className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1 text-xs font-medium">{crop.suitability}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(crop)}
            className="group/btn flex-shrink-0 gap-1.5 rounded-full border-slate-200 px-4 text-xs transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 active:scale-95"
          >
            Details
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </article>
  )
}
