import { X } from 'lucide-react'
import { useEffect } from 'react'

import { cropPlaceholderImage } from '../../data/imageSources'
import type { CropData } from '../../types/crop'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

interface CropDetailsProps {
  crop: CropData | null
  onClose: () => void
}

export function CropDetails({ crop, onClose }: CropDetailsProps) {
  useEffect(() => {
    if (!crop) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [crop, onClose])

  if (!crop) return null

  const imageData = typeof crop.image === 'string' ? null : crop.image
  const imageSrc = typeof crop.image === 'string' ? crop.image : crop.image.src
  const imageAlt = imageData?.alt ?? crop.name

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="crop-details-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-200 p-5">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-700">Crop profile</p>
            <h2 id="crop-details-title" className="mt-2 text-2xl font-semibold text-slate-900">
              {crop.name}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close crop details">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-6 p-5 md:grid-cols-[1.1fr_0.9fr]">
          <figure>
            <img
              src={imageSrc}
              alt={imageAlt}
              className="h-64 w-full rounded-2xl object-cover"
              onError={(event) => {
                event.currentTarget.onerror = null
                event.currentTarget.src = cropPlaceholderImage
              }}
            />
            {imageData?.sourceUrl && (
              <figcaption className="mt-2 text-xs leading-5 text-slate-500">
                Photo by{' '}
                <a
                  href={imageData.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-emerald-700 hover:underline"
                >
                  {imageData.attribution}
                </a>
                {imageData.license && <span> · {imageData.license}</span>}
              </figcaption>
            )}
          </figure>

          <div className="space-y-4">
            <Badge>{crop.category}</Badge>
            {crop.scientificName && <p className="text-sm italic text-slate-500">{crop.scientificName}</p>}
            <p className="text-sm leading-6 text-slate-600">{crop.description}</p>
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">
                Typical suitability
              </h3>
              <p className="text-sm text-slate-700">{crop.suitability}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {crop.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-800">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
