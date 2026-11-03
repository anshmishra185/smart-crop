import { useRef, useState, type MouseEvent } from 'react'
import {
  Focus,
  ZoomIn,
} from 'lucide-react'
import type { DiseaseDetectionResult } from '../../types'

interface LesionBoundingBoxViewerProps {
  imageSrc: string
  result: DiseaseDetectionResult
}

export function LesionBoundingBoxViewer({ imageSrc, result }: LesionBoundingBoxViewerProps) {
  const [selectedLesionId, setSelectedLesionId] = useState<string | null>(null)
  const [isLoupeActive, setIsLoupeActive] = useState<boolean>(true)
  const [loupePos, setLoupePos] = useState<{ x: number; y: number; width: number; height: number; show: boolean }>({
    x: 0,
    y: 0,
    width: 480,
    height: 360,
    show: false,
  })
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const defaultAnnotations = [
    {
      id: 'lesion-1',
      label: 'Lesion A • Necrotic Target Center',
      xPct: 35,
      yPct: 40,
      widthPct: 25,
      heightPct: 22,
      description: 'Concentric brown target rings indicating advanced foliar necrotic tissue breakdown.',
    },
    {
      id: 'lesion-2',
      label: 'Lesion B • Chlorotic Diffusion Halo',
      xPct: 58,
      yPct: 30,
      widthPct: 20,
      heightPct: 18,
      description: 'Yellow chlorotic margin caused by fungal alternariol toxin diffusing into healthy mesophyll.',
    },
  ]

  const annotations = result.lesionAnnotations && result.lesionAnnotations.length > 0
    ? result.lesionAnnotations
    : defaultAnnotations

  const activeAnnotation = annotations.find((a) => a.id === selectedLesionId) || annotations[0]

  // Track cursor position for the 2.5x Loupe
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isLoupeActive || !imageContainerRef.current) return
    const rect = imageContainerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setLoupePos({ x, y, width: rect.width, height: rect.height, show: true })
  }

  const handleMouseLeave = () => {
    setLoupePos((prev) => ({ ...prev, show: false }))
  }

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 dark:border-agri-darkBorder">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            <Focus className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Interactive Pathology Lesion Annotations & 2.5× Loupe
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Hover over foliage to zoom with the pathology lens or click bounding boxes to inspect necrotic foci.
            </p>
          </div>
        </div>

        {/* Loupe Toggle Button */}
        <button
          type="button"
          onClick={() => setIsLoupeActive((prev) => !prev)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold transition ${isLoupeActive
              ? 'bg-forest-800 text-white dark:bg-emerald-600'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-agri-darkCard dark:text-slate-300'
            }`}
        >
          <ZoomIn className="h-3.5 w-3.5" />
          {isLoupeActive ? '2.5× Loupe Active' : 'Enable 2.5× Loupe'}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-12 items-center">
        {/* Leaf Image Container with Interactive Bounding Boxes (7 cols) */}
        <div className="md:col-span-7 flex flex-col items-center">
          <div
            ref={imageContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative aspect-4/3 w-full max-w-[480px] overflow-hidden rounded-2xl border-2 border-slate-200 bg-black cursor-crosshair select-none dark:border-agri-darkBorder"
          >
            <img
              src={imageSrc}
              alt={result.diseaseName}
              className="h-full w-full object-cover"
            />

            {/* Bounding Box Annotations Overlay */}
            {annotations.map((ann) => {
              const isSelected = selectedLesionId === ann.id
              return (
                <div
                  key={ann.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedLesionId(ann.id)
                  }}
                  className={`absolute cursor-pointer rounded-lg border-2 transition-all ${isSelected
                      ? 'border-red-500 bg-red-500/20 shadow-lg ring-2 ring-red-400'
                      : 'border-amber-400 bg-amber-400/10 hover:border-red-400 hover:bg-red-400/20'
                    }`}
                  style={{
                    left: `${ann.xPct}%`,
                    top: `${ann.yPct}%`,
                    width: `${ann.widthPct}%`,
                    height: `${ann.heightPct}%`,
                  }}
                >
                  <span className="absolute -top-6 left-0 rounded-md bg-black/80 px-2 py-0.5 font-mono text-[9px] font-black text-amber-300 shadow-md backdrop-blur-xs whitespace-nowrap">
                    {ann.label.split('•')[0]}
                  </span>
                </div>
              )
            })}

            {/* 2.5x Loupe Magnifier Circle */}
            {isLoupeActive && loupePos.show && (
              <div
                className="pointer-events-none absolute h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-emerald-400 shadow-2xl overflow-hidden bg-black z-30"
                style={{
                  left: loupePos.x,
                  top: loupePos.y,
                }}
              >
                <div
                  className="absolute h-full w-full"
                  style={{
                    backgroundImage: `url(${imageSrc})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: `${loupePos.width * 2.5}px ${loupePos.height * 2.5}px`,
                    backgroundPosition: `-${loupePos.x * 2.5 - 72}px -${loupePos.y * 2.5 - 72}px`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-red-500/80 shadow-xs" />
                </div>
              </div>
            )}
          </div>

          <p className="mt-2 text-[11px] text-slate-400 text-center">
            Click any highlighted lesion frame above to read its cellular pathology breakdown.
          </p>
        </div>

        {/* Selected Lesion Pathology Callout (5 cols) */}
        <div className="md:col-span-5 space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-agri-darkBorder">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Selected Pathology Focus
              </span>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-black text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                Foliar Lesion
              </span>
            </div>

            <h4 className="mt-2 text-sm font-black text-slate-900 dark:text-white">
              {activeAnnotation.label}
            </h4>

            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
              {activeAnnotation.description}
            </p>

            <div className="mt-4 space-y-2 border-t border-slate-200/60 pt-3 text-xs dark:border-agri-darkBorder">
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Surface Area Affected:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {result.affectedAreaPercentage ?? 28}% of blade
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Pathogen Activity:</span>
                <span className="font-extrabold text-red-600 dark:text-red-400">
                  Active Sporulation
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
