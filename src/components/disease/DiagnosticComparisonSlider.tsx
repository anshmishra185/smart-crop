import { useRef, useState, useCallback, useEffect, type PointerEvent } from 'react'
import { Flame, Layers, Sliders, Eye, Sparkles } from 'lucide-react'

interface DiagnosticComparisonSliderProps {
  rawImage: string
  cropName: string
  diseaseName: string
  confidence?: number
  affectedAreaPercentage?: number
  className?: string
}

export function DiagnosticComparisonSlider({
  rawImage,
  cropName,
  diseaseName,
  confidence = 98.4,
  affectedAreaPercentage = 24,
  className = '',
}: DiagnosticComparisonSliderProps) {
  const [sliderPos, setSliderPos] = useState(50) // percentage 0 - 100
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.85) // 0 to 1
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPos(percent)
  }, [])

  const handlePointerDown = (e: PointerEvent) => {
    setIsDragging(true)
    handleMove(e.clientX)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: PointerEvent) => {
    if (isDragging) {
      handleMove(e.clientX)
    }
  }

  const handlePointerUp = (e: PointerEvent) => {
    if (isDragging) {
      setIsDragging(false)
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        // Safe ignore
      }
    }
  }

  // Prevent text selection during drag
  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = 'none'
    } else {
      document.body.style.userSelect = ''
    }
    return () => {
      document.body.style.userSelect = ''
    }
  }, [isDragging])

  return (
    <div className={`space-y-4 rounded-3xl border border-slate-200/90 bg-white p-5 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface ${className}`}>
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-agri-darkBorder">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              AI Vision Studio: Split Lesion Inspection
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Drag slider to inspect ResNet-50 Grad-CAM feature activations vs. raw photographic foliage
            </p>
          </div>
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setSliderPos(0)}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
              sliderPos === 0
                ? 'bg-orange-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-agri-darkCard dark:text-slate-300'
            }`}
          >
            Heatmap Only
          </button>
          <button
            type="button"
            onClick={() => setSliderPos(50)}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
              sliderPos === 50
                ? 'bg-forest-800 text-white dark:bg-emerald-600'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-agri-darkCard dark:text-slate-300'
            }`}
          >
            50/50 Split
          </button>
          <button
            type="button"
            onClick={() => setSliderPos(100)}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
              sliderPos === 100
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-agri-darkCard dark:text-slate-300'
            }`}
          >
            Raw Leaf
          </button>
        </div>
      </div>

      {/* Interactive Split Viewport */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative h-64 sm:h-80 w-full cursor-ew-resize select-none overflow-hidden rounded-2xl border border-slate-200/90 shadow-inner dark:border-agri-darkBorder"
      >
        {/* Underlayer (Right side): Grad-CAM Heatmap Layer */}
        <div className="absolute inset-0 h-full w-full">
          <img
            src={rawImage}
            alt={`${cropName} Grad-CAM base`}
            className="h-full w-full object-cover filter contrast-105"
          />
          {/* Simulated Convolutional Attention Heatmap Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-tr from-red-600/80 via-amber-400/60 to-blue-600/30 mix-blend-color-dodge transition-opacity pointer-events-none"
            style={{ opacity: heatmapOpacity }}
          />
          {/* Secondary Saliency Ring Highlights */}
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_45%_50%,rgba(239,68,68,0.95)_0%,rgba(245,158,11,0.7)_35%,rgba(59,130,246,0.3)_60%,transparent_80%)] mix-blend-screen pointer-events-none"
            style={{ opacity: heatmapOpacity * 0.9 }}
          />

          {/* Heatmap Right-Side Badge */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/75 px-3 py-1 text-[11px] font-extrabold text-white backdrop-blur-md shadow-md">
            <Flame className="h-3.5 w-3.5 text-orange-400 animate-pulse" />
            <span>Grad-CAM Attention ({confidence}%)</span>
          </div>
        </div>

        {/* Top Layer (Left side): Raw Foliage with clip-path */}
        <div
          className="absolute inset-0 h-full w-full pointer-events-none overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img
            src={rawImage}
            alt={`${cropName} raw foliage`}
            className="h-full w-full object-cover"
          />
          {/* Raw Leaf Left-Side Badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/75 px-3 py-1 text-[11px] font-extrabold text-white backdrop-blur-md shadow-md">
            <Eye className="h-3.5 w-3.5 text-emerald-400" />
            <span>Raw Foliage Spectrum</span>
          </div>
        </div>

        {/* Vertical Divider Line */}
        <div
          className="absolute top-0 bottom-0 z-20 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Draggable Handle Pill */}
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-forest-800 text-white shadow-xl ring-2 ring-black/20 dark:bg-emerald-600">
            <Sliders className="h-4 w-4 rotate-90" />
          </div>
        </div>

        {/* Visual Inspection Grid lines (Subtle) */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Bottom Controls: Opacity Slider & Saliency Telemetry */}
      <div className="grid gap-3 sm:grid-cols-2 sm:items-center rounded-2xl bg-slate-50 p-3.5 dark:bg-agri-darkCard">
        {/* Heatmap Opacity Slider */}
        <div className="flex items-center gap-3">
          <Layers className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              <span>Heatmap Saliency Layer:</span>
              <span className="text-orange-600 dark:text-orange-400">{Math.round(heatmapOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={heatmapOpacity}
              onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-orange-500 dark:bg-slate-700"
              aria-label="Heatmap opacity"
            />
          </div>
        </div>

        {/* Telemetry info */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Lesion Footprint: <strong className="text-slate-800 dark:text-white">{affectedAreaPercentage}%</strong></span>
          </div>
          <div className="h-3 w-px bg-slate-200 dark:bg-slate-700" />
          <div>
            Target: <strong className="text-emerald-700 dark:text-emerald-400">{diseaseName}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
