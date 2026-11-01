import { Leaf, Tag, X } from 'lucide-react'
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
      if (event.key === 'Escape') onClose()
    }
    // Prevent body scroll
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [crop, onClose])

  if (!crop) return null

  const imageData = typeof crop.image === 'string' ? null : crop.image
  const imageSrc = typeof crop.image === 'string' ? crop.image : crop.image.src
  const imageAlt = imageData?.alt ?? crop.name

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="animate-scale-in w-full max-w-2xl overflow-hidden rounded-4xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="crop-details-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero image with overlay */}
        <div className="relative">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-56 w-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = cropPlaceholderImage
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close crop details"
            className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-sm hover:bg-black/40"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Name on image */}
          <div className="absolute bottom-0 left-0 p-5 text-white">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
              Crop profile
            </p>
            <h2 id="crop-details-title" className="mt-1 text-2xl font-extrabold tracking-tight">
              {crop.name}
            </h2>
            {(crop as any).scientificName && (
              <p className="mt-1 text-sm italic text-white/60">{(crop as any).scientificName}</p>
            )}
          </div>

          {/* Attribution */}
          {imageData?.sourceUrl && (
            <div className="absolute bottom-0 right-0 bg-black/35 px-2 py-1 text-[10px] text-white/70">
              <a href={imageData.sourceUrl} target="_blank" rel="noreferrer" className="hover:text-white">
                © {imageData.attribution}
              </a>
              {imageData.license && <span> · {imageData.license}</span>}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="grid gap-6 overflow-y-auto p-6 md:grid-cols-[1fr_1fr]" style={{ maxHeight: '55vh' }}>
          {/* Left col */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="rounded-full text-xs">{crop.category}</Badge>
            </div>

            <p className="text-sm leading-7 text-slate-600">{crop.description}</p>
          </div>

          {/* Right col */}
          <div className="space-y-4">
            {/* Suitability */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 text-emerald-700 mb-2">
                <Leaf className="h-4 w-4" />
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em]">
                  Typical suitability
                </h3>
              </div>
              <p className="text-sm text-emerald-800">{crop.suitability}</p>
            </div>

            {/* Tags */}
            <div>
              <h3 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                <Tag className="h-3.5 w-3.5" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {crop.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer action */}
        <div className="border-t border-slate-100 px-6 py-4">
          <Button
            onClick={onClose}
            className="w-full rounded-2xl shadow-sm active:scale-95"
            variant="outline"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
