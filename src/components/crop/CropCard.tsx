import { ArrowRight, Leaf } from 'lucide-react'

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
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
      <figure>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-48 w-full object-cover"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = cropPlaceholderImage
          }}
        />
        {imageData?.sourceUrl && (
          <figcaption className="truncate bg-slate-50 px-4 py-2 text-xs text-slate-500">
            <a href={imageData.sourceUrl} target="_blank" rel="noreferrer" className="hover:text-emerald-700">
              Photo: {imageData.attribution}
            </a>
            {imageData.license && <span> · {imageData.license}</span>}
          </figcaption>
        )}
      </figure>
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{crop.name}</h3>
            <p className="text-sm text-slate-500">{crop.category}</p>
          </div>
          <Badge>{crop.tags[0]}</Badge>
        </div>

        <p className="text-sm leading-6 text-slate-600">{crop.description}</p>

        <div className="flex flex-wrap gap-2">
          {crop.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="inline-flex items-center gap-2 text-sm text-emerald-700">
            <Leaf className="h-4 w-4" />
            {crop.suitability}
          </div>
          <Button variant="outline" size="sm" onClick={() => onViewDetails(crop)}>
            View details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  )
}
