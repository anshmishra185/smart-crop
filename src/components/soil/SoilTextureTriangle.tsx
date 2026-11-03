import { useState, useMemo } from 'react'
import {
  Compass,
  Sparkles,
} from 'lucide-react'
import type { SoilReading } from '../../types'

interface SoilTextureTriangleProps {
  reading: SoilReading
  onUpdateTexture?: (sand: number, silt: number, clay: number) => void
}

interface SoilTextureClass {
  name: string
  punjabiName: string
  hindiName: string
  description: string
  infiltrationRate: number // mm/hr
  fieldCapacity: number // %
  wiltingPoint: number // %
  bulkDensity: number // g/cm³
  aerationRating: 'High' | 'Good' | 'Moderate' | 'Poor'
  compactionRisk: 'Low' | 'Medium' | 'High'
}

function determineSoilTexture(sand: number, silt: number, clay: number): SoilTextureClass {
  // USDA Classification logic
  if (clay >= 40) {
    if (silt >= 40) {
      return {
        name: 'Silty Clay',
        punjabiName: 'ਸਿਲਟੀ ਚੀਕਣੀ ਮਿੱਟੀ',
        hindiName: 'सिल्टी चिकनी मिट्टी',
        description: 'Heavy, slow-draining soil with immense cation exchange but prone to waterlogging.',
        infiltrationRate: 3.5,
        fieldCapacity: 38,
        wiltingPoint: 22,
        bulkDensity: 1.25,
        aerationRating: 'Poor',
        compactionRisk: 'High',
      }
    }
    if (sand >= 45) {
      return {
        name: 'Sandy Clay',
        punjabiName: 'ਰੇਤਲੀ ਚੀਕਣੀ ਮਿੱਟੀ',
        hindiName: 'रेतीली चिकनी मिट्टी',
        description: 'Hard when dry, sticky when wet; requires organic mulches to improve structure.',
        infiltrationRate: 4.5,
        fieldCapacity: 34,
        wiltingPoint: 19,
        bulkDensity: 1.35,
        aerationRating: 'Poor',
        compactionRisk: 'High',
      }
    }
    return {
      name: 'Clay (Heavy Soil)',
      punjabiName: 'ਚੀਕਣੀ ਮਿੱਟੀ',
      hindiName: 'चिकनी मिट्टी',
      description: 'Extremely high nutrient holding capacity, low percolation, sensitive to compaction.',
      infiltrationRate: 2.5,
      fieldCapacity: 40,
      wiltingPoint: 24,
      bulkDensity: 1.22,
      aerationRating: 'Poor',
      compactionRisk: 'High',
    }
  }

  if (clay >= 27 && clay < 40) {
    if (sand >= 20 && sand <= 45) {
      return {
        name: 'Clay Loam',
        punjabiName: 'ਚੀਕਣੀ ਦੋਮਟ ਮਿੱਟੀ',
        hindiName: 'चिकनी दोमट मिट्टी',
        description: 'Highly fertile agricultural soil; balanced between moisture retention and nutrient supply.',
        infiltrationRate: 8.0,
        fieldCapacity: 32,
        wiltingPoint: 17,
        bulkDensity: 1.30,
        aerationRating: 'Moderate',
        compactionRisk: 'Medium',
      }
    }
    if (sand > 45) {
      return {
        name: 'Sandy Clay Loam',
        punjabiName: 'ਰੇਤਲੀ ਚੀਕਣੀ ਦੋਮਟ',
        hindiName: 'बलुई चिकनी दोमट',
        description: 'Good internal drainage, favorable for cotton, maize, and pulse crops.',
        infiltrationRate: 14.0,
        fieldCapacity: 28,
        wiltingPoint: 15,
        bulkDensity: 1.36,
        aerationRating: 'Good',
        compactionRisk: 'Medium',
      }
    }
    return {
      name: 'Silty Clay Loam',
      punjabiName: 'ਸਿਲਟੀ ਚੀਕਣੀ ਦੋਮਟ',
      hindiName: 'सिल्टी चिकनी दोमट',
      description: 'Fine-textured, highly retentive soil common in alluvial river basins.',
      infiltrationRate: 6.5,
      fieldCapacity: 35,
      wiltingPoint: 18,
      bulkDensity: 1.28,
      aerationRating: 'Moderate',
      compactionRisk: 'Medium',
    }
  }

  if (silt >= 50) {
    if (silt >= 80 && clay < 12) {
      return {
        name: 'Silt',
        punjabiName: 'ਸਿਲਟ / ਗਾਰ ਮਿੱਟੀ',
        hindiName: 'सिल्ट मिट्टी',
        description: 'Silky smooth feel when moist, crusts easily under heavy rainfall.',
        infiltrationRate: 11.0,
        fieldCapacity: 31,
        wiltingPoint: 11,
        bulkDensity: 1.32,
        aerationRating: 'Good',
        compactionRisk: 'Medium',
      }
    }
    return {
      name: 'Silt Loam',
      punjabiName: 'ਸਿਲਟ ਦੋਮਟ ਮਿੱਟੀ',
      hindiName: 'सिल्ट दोमट मिट्टी',
      description: 'Superb soil for wheat, potato, and vegetables; moderate drainage and deep rooting.',
      infiltrationRate: 15.0,
      fieldCapacity: 30,
      wiltingPoint: 12,
      bulkDensity: 1.33,
      aerationRating: 'Good',
      compactionRisk: 'Low',
    }
  }

  if (sand >= 52) {
    if (sand >= 85 && (silt + 1.5 * clay) < 15) {
      return {
        name: 'Sand',
        punjabiName: 'ਰੇਤਲੀ ਮਿੱਟੀ',
        hindiName: 'बलुई / रेतीली मिट्टी',
        description: 'Excessively drained, poor nutrient and water holding capacity; prone to leaching.',
        infiltrationRate: 45.0,
        fieldCapacity: 12,
        wiltingPoint: 4,
        bulkDensity: 1.55,
        aerationRating: 'High',
        compactionRisk: 'Low',
      }
    }
    if (sand >= 70) {
      return {
        name: 'Loamy Sand',
        punjabiName: 'ਦੋਮਟ ਰੇਤਲੀ ਮਿੱਟੀ',
        hindiName: 'दोमट रेतीली मिट्टी',
        description: 'Rapid water permeability, requires frequent light irrigation and split fertilization.',
        infiltrationRate: 32.0,
        fieldCapacity: 16,
        wiltingPoint: 6,
        bulkDensity: 1.48,
        aerationRating: 'High',
        compactionRisk: 'Low',
      }
    }
    return {
      name: 'Sandy Loam',
      punjabiName: 'ਰੇਤਲੀ ਦੋਮਟ (ਮੈਰਾ)',
      hindiName: 'बलुई दोमट (मैरा)',
      description: 'Ideal agricultural medium (Maira). Warms up rapidly in spring, easy tillage.',
      infiltrationRate: 22.0,
      fieldCapacity: 22,
      wiltingPoint: 9,
      bulkDensity: 1.40,
      aerationRating: 'Good',
      compactionRisk: 'Low',
    }
  }

  // Default: Loam
  return {
    name: 'Loam (Balanced Alluvial)',
    punjabiName: 'ਦੋਮਟ ਮਿੱਟੀ',
    hindiName: 'दोमट मिट्टी',
    description: 'Gold standard agricultural soil. Optimal balance of sand, silt, and clay.',
    infiltrationRate: 18.0,
    fieldCapacity: 28,
    wiltingPoint: 13,
    bulkDensity: 1.32,
    aerationRating: 'Good',
    compactionRisk: 'Low',
  }
}

export function SoilTextureTriangle({ reading, onUpdateTexture }: SoilTextureTriangleProps) {
  const [sand, setSand] = useState<number>(reading.sand ?? 45)
  const [silt, setSilt] = useState<number>(reading.silt ?? 35)
  const [clay, setClay] = useState<number>(reading.clay ?? 20)

  // Handle auto-normalization so Sand + Silt + Clay always sums to 100%
  const handleSandChange = (val: number) => {
    const s = Math.max(0, Math.min(100, val))
    const remainder = 100 - s
    const ratio = (silt + clay) > 0 ? silt / (silt + clay) : 0.5
    const newSilt = Math.round(remainder * ratio)
    const newClay = 100 - s - newSilt
    setSand(s)
    setSilt(newSilt)
    setClay(newClay)
    if (onUpdateTexture) onUpdateTexture(s, newSilt, newClay)
  }

  const handleClayChange = (val: number) => {
    const c = Math.max(0, Math.min(100, val))
    const remainder = 100 - c
    const ratio = (sand + silt) > 0 ? sand / (sand + silt) : 0.5
    const newSand = Math.round(remainder * ratio)
    const newSilt = 100 - c - newSand
    setClay(c)
    setSand(newSand)
    setSilt(newSilt)
    if (onUpdateTexture) onUpdateTexture(newSand, newSilt, c)
  }

  const texture = useMemo(() => {
    return determineSoilTexture(sand, silt, clay)
  }, [sand, silt, clay])

  // Available Water Capacity = Field Capacity - Permanent Wilting Point
  const awc = Math.max(2, texture.fieldCapacity - texture.wiltingPoint)

  // Compute ternary coordinates inside equilateral triangle:
  // Top vertex (Clay 100%): (200, 40)
  // Bottom-Left vertex (Sand 100%): (40, 320)
  // Bottom-Right vertex (Silt 100%): (360, 320)
  const ternaryX = useMemo(() => {
    // x = 40 + (silt / 100) * 320 + (clay / 100) * 160
    return 40 + (silt / 100) * 320 + (clay / 100) * 160
  }, [silt, clay])

  const ternaryY = useMemo(() => {
    // y goes from 320 (bottom, 0% clay) to 40 (top, 100% clay)
    return 320 - (clay / 100) * 280
  }, [clay])

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 dark:border-agri-darkBorder">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400">
              <Compass className="h-4 w-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-400">
              USDA Soil Classification & Hydrology
            </span>
          </div>
          <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
            Interactive USDA Soil Texture Triangle
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Plots textural particle distribution and models hydrological infiltration, field capacity, and compaction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1 text-xs font-black text-forest-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> USDA Ternary Engine
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-12 items-center">
        {/* Left: Interactive SVG Triangle Visualization (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-full max-w-[400px] overflow-hidden rounded-2xl bg-linear-to-b from-slate-50 to-slate-100/50 p-2 dark:from-slate-900/60 dark:to-slate-900 border border-slate-200/80 dark:border-agri-darkBorder">
            <svg
              viewBox="0 0 400 360"
              className="w-full h-auto drop-shadow-xs select-none"
            >
              {/* Triangle Base Polygons */}
              <defs>
                <linearGradient id="triangleGrad" x1="0%" y1="100%" x2="50%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="#10b981" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* Equilateral Outline */}
              <polygon
                points="200,40 360,320 40,320"
                fill="url(#triangleGrad)"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Internal Guidance Grid Lines */}
              {/* 20%, 40%, 60%, 80% Horizontal Clay Lines */}
              {[20, 40, 60, 80].map((c) => {
                const y = 320 - (c / 100) * 280
                const x1 = 40 + (c / 100) * 160
                const x2 = 360 - (c / 100) * 160
                return (
                  <line
                    key={`clay-line-${c}`}
                    x1={x1}
                    y1={y}
                    x2={x2}
                    y2={y}
                    stroke="#94a3b8"
                    strokeWidth="0.8"
                    strokeDasharray="3 3"
                  />
                )
              })}

              {/* Texture Zone Demarcations */}
              {/* Clay polygon (Top) */}
              <polygon
                points="200,40 264,152 136,152"
                fill="#3b82f6"
                fillOpacity="0.15"
                stroke="#3b82f6"
                strokeWidth="1"
              />
              <text x="200" y="115" textAnchor="middle" fill="#2563eb" fontSize="11" fontWeight="bold">
                CLAY (40-100%)
              </text>

              {/* Loam polygon (Center) */}
              <polygon
                points="160,230 240,230 220,270 140,270"
                fill="#10b981"
                fillOpacity="0.25"
                stroke="#10b981"
                strokeWidth="1"
              />
              <text x="190" y="252" textAnchor="middle" fill="#047857" fontSize="10" fontWeight="bold">
                LOAM (Maira)
              </text>

              {/* Sand area (Bottom Left) */}
              <text x="90" y="305" textAnchor="middle" fill="#d97706" fontSize="10" fontWeight="bold">
                SAND
              </text>

              {/* Silt area (Bottom Right) */}
              <text x="310" y="305" textAnchor="middle" fill="#0284c7" fontSize="10" fontWeight="bold">
                SILT
              </text>

              {/* Corner Labels */}
              <text x="200" y="25" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="900" className="dark:fill-white">
                ▲ 100% CLAY (&lt;0.002mm)
              </text>
              <text x="30" y="348" textAnchor="start" fill="#1e293b" fontSize="11" fontWeight="900" className="dark:fill-white">
                100% SAND (0.05-2mm)
              </text>
              <text x="370" y="348" textAnchor="end" fill="#1e293b" fontSize="11" fontWeight="900" className="dark:fill-white">
                100% SILT (0.002-0.05mm)
              </text>

              {/* Active Plotted Coordinate Target */}
              <circle
                cx={ternaryX}
                cy={ternaryY}
                r="16"
                fill="#10b981"
                fillOpacity="0.25"
                className="animate-ping"
              />
              <circle
                cx={ternaryX}
                cy={ternaryY}
                r="7"
                fill="#047857"
                stroke="#ffffff"
                strokeWidth="2.5"
              />
              <text
                x={ternaryX}
                y={ternaryY - 12}
                textAnchor="middle"
                fill="#0f172a"
                fontSize="9"
                fontWeight="900"
                className="dark:fill-white drop-shadow-xs"
              >
                {texture.name.split(' ')[0]}
              </text>
            </svg>
          </div>

          <p className="mt-2 text-[11px] text-slate-400 text-center">
            Normalized Plot: {sand}% Sand • {silt}% Silt • {clay}% Clay (Total: {sand + silt + clay}%)
          </p>
        </div>

        {/* Right: Sliders & Hydraulic Parameters (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Active Classification Banner */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                USDA Textural Designation
              </span>
              <span className="rounded-full bg-emerald-200 px-2.5 py-0.5 text-[10px] font-black text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
                {texture.aerationRating} Aeration
              </span>
            </div>
            <h3 className="mt-1 text-lg font-black text-emerald-950 dark:text-white">
              {texture.name}
            </h3>
            <p className="text-xs font-bold text-emerald-800/80 dark:text-emerald-300">
              {texture.punjabiName} • {texture.hindiName}
            </p>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
              {texture.description}
            </p>
          </div>

          {/* Interactive Sliders */}
          <div className="space-y-3 rounded-2xl bg-slate-50 p-4 dark:bg-agri-darkCard">
            {/* Sand Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Sand Content (0.05 – 2.0 mm)</span>
                <span className="font-extrabold text-amber-600 dark:text-amber-400">{sand}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sand}
                onChange={(e) => handleSandChange(Number(e.target.value))}
                className="mt-1 w-full accent-amber-600"
              />
            </div>

            {/* Clay Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Clay Content (&lt; 0.002 mm)</span>
                <span className="font-extrabold text-blue-600 dark:text-blue-400">{clay}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={clay}
                onChange={(e) => handleClayChange(Number(e.target.value))}
                className="mt-1 w-full accent-blue-600"
              />
            </div>

            {/* Silt Display */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 pt-1">
              <span>Computed Silt Content (0.002 – 0.05 mm):</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400">{silt}%</span>
            </div>
          </div>

          {/* Derived Soil Hydraulics Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {/* Infiltration Rate */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs dark:border-agri-darkBorder dark:bg-agri-darkSurface">
              <span className="text-[10px] font-bold uppercase text-slate-400">Infiltration</span>
              <p className="mt-1 text-base font-black text-slate-900 dark:text-white">
                {texture.infiltrationRate} <span className="text-[10px] font-normal">mm/hr</span>
              </p>
              <span className="text-[9px] text-slate-500">Percolation speed</span>
            </div>

            {/* Field Capacity */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs dark:border-agri-darkBorder dark:bg-agri-darkSurface">
              <span className="text-[10px] font-bold uppercase text-slate-400">Field Capacity</span>
              <p className="mt-1 text-base font-black text-slate-900 dark:text-white">
                {texture.fieldCapacity}%
              </p>
              <span className="text-[9px] text-slate-500">Max held water</span>
            </div>

            {/* Available Water Capacity (AWC) */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs dark:border-agri-darkBorder dark:bg-agri-darkSurface">
              <span className="text-[10px] font-bold uppercase text-slate-400">Plant AWC</span>
              <p className="mt-1 text-base font-black text-emerald-600 dark:text-emerald-400">
                {awc}%
              </p>
              <span className="text-[9px] text-slate-500">Usable by crop</span>
            </div>

            {/* Bulk Density */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs dark:border-agri-darkBorder dark:bg-agri-darkSurface">
              <span className="text-[10px] font-bold uppercase text-slate-400">Bulk Density</span>
              <p className="mt-1 text-base font-black text-slate-900 dark:text-white">
                {texture.bulkDensity} <span className="text-[10px] font-normal">g/cm³</span>
              </p>
              <span className="text-[9px] text-slate-500">Compaction index</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
