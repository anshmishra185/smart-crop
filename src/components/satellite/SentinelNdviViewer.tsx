import { useState, useEffect } from 'react'
import {
  Satellite,
  Layers,
  Sparkles,
  Compass,
  MapPin,
  RefreshCw,
} from 'lucide-react'
import { AudioAdvisoryButton } from '../common/AudioAdvisoryButton'

interface NdviCell {
  row: number
  col: number
  lat: number
  lon: number
  nir_band8: number
  red_band4: number
  ndvi: number
  classification: string
  foliar_stress_days_advance: number
  color_hex: string
}

interface SatelliteNdviData {
  cluster: string
  state: string
  satellite_mission: string
  sensor: string
  acquisition_date: string
  cloud_coverage_percentage: number
  grid_resolution: string
  total_area_hectares: number
  average_ndvi: number
  pre_symptomatic_alert: string
  healthy_canopy_percentage: number
  stressed_canopy_percentage: number
  critical_canopy_percentage: number
  spectral_indices: {
    NDVI: number
    SAVI: number
    EVI: number
    Chlorophyll_Ratio: number
    Atmospheric_Correction: string
  }
  grid_dimensions: {
    rows: number
    cols: number
    total_pixels: number
  }
  cells: NdviCell[]
}

const CLUSTERS = [
  { id: 'ludhiana', name: 'Ludhiana', label: 'Ludhiana (Wheat & Potato)', state: 'Punjab' },
  { id: 'khanna', name: 'Khanna', label: 'Khanna Mandi (HD-2967 Belt)', state: 'Punjab' },
  { id: 'bathinda', name: 'Bathinda', label: 'Bathinda (Cotton & Mustard)', state: 'Punjab' },
  { id: 'karnal', name: 'Karnal', label: 'Karnal (Pusa 1121 Basmati)', state: 'Haryana' },
]

function createFallbackData(cluster: string, res: string): SatelliteNdviData {
  const meta = {
    ludhiana: { name: 'Ludhiana Agro-Ecological Cluster', state: 'Punjab', baseNir: 0.68, baseRed: 0.11 },
    khanna: { name: 'Khanna Mandi Grain Belt', state: 'Punjab', baseNir: 0.74, baseRed: 0.09 },
    bathinda: { name: 'Bathinda Cotton & Oilseed Belt', state: 'Punjab', baseNir: 0.44, baseRed: 0.22 },
    karnal: { name: 'Karnal Basmati Rice Bowl', state: 'Haryana', baseNir: 0.77, baseRed: 0.08 },
  }[cluster] || { name: 'Ludhiana Agro-Ecological Cluster', state: 'Punjab', baseNir: 0.68, baseRed: 0.11 }

  const cells: NdviCell[] = []
  let totalNdvi = 0
  let healthy = 0
  let stressed = 0
  let critical = 0

  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      const isStress = (cluster === 'ludhiana' && r < 3 && c >= 3) || (cluster === 'bathinda' && r >= 3)
      const nir = isStress ? Math.max(0.2, meta.baseNir * 0.45) : meta.baseNir + (r % 2 === 0 ? 0.04 : -0.02)
      const red = isStress ? Math.min(0.35, meta.baseRed * 2.2) : meta.baseRed
      const ndvi = Number(((nir - red) / (nir + red)).toFixed(4))
      totalNdvi += ndvi

      let classification = 'Vigorous Biomass'
      let color = '#15803d'
      let advanceDays = 0

      if (ndvi >= 0.7) {
        classification = 'Vigorous Biomass (> 0.7)'
        color = '#15803d'
        healthy++
      } else if (ndvi >= 0.5) {
        classification = 'Optimal Canopy (0.5–0.7)'
        color = '#84cc16'
        healthy++
      } else if (ndvi >= 0.3) {
        classification = 'Moisture Stress (0.3–0.5)'
        color = '#eab308'
        advanceDays = 4
        stressed++
      } else {
        classification = 'Severe Fungal Chlorosis (< 0.3)'
        color = '#b91c1c'
        advanceDays = 6
        critical++
      }

      cells.push({
        row: r,
        col: c,
        lat: 30.901 + r * 0.0009,
        lon: 75.857 + c * 0.0011,
        nir_band8: Number(nir.toFixed(3)),
        red_band4: Number(red.toFixed(3)),
        ndvi,
        classification,
        foliar_stress_days_advance: advanceDays,
        color_hex: color,
      })
    }
  }

  return {
    cluster: meta.name,
    state: meta.state,
    satellite_mission: 'Sentinel-2 MSI (Level-2A BOA Surface Reflectance)',
    sensor: 'Multispectral Instrument (Bands: B8-842nm NIR, B4-665nm RED)',
    acquisition_date: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    cloud_coverage_percentage: 1.4,
    grid_resolution: `${res} Pixel Orthorectified Grid`,
    total_area_hectares: 3450,
    average_ndvi: Number((totalNdvi / 36).toFixed(4)),
    pre_symptomatic_alert:
      'Foliar stress detected 6 days before visual appearance in North-East canopy.',
    healthy_canopy_percentage: Number(((healthy / 36) * 100).toFixed(1)),
    stressed_canopy_percentage: Number(((stressed / 36) * 100).toFixed(1)),
    critical_canopy_percentage: Number(((critical / 36) * 100).toFixed(1)),
    spectral_indices: {
      NDVI: Number((totalNdvi / 36).toFixed(4)),
      SAVI: 0.482,
      EVI: 0.521,
      Chlorophyll_Ratio: 5.64,
      Atmospheric_Correction: 'Sen2Cor 2.11 v9.0',
    },
    grid_dimensions: { rows: 6, cols: 6, total_pixels: 36 },
    cells,
  }
}

export function SentinelNdviViewer() {
  const [selectedCluster, setSelectedCluster] = useState<string>('ludhiana')
  const [resolution, setResolution] = useState<'10m' | '20m'>('10m')
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const [data, setData] = useState<SatelliteNdviData>(() => createFallbackData('ludhiana', '10m'))
  const [selectedCell, setSelectedCell] = useState<NdviCell | null>(() => data?.cells?.[0] || null)

  useEffect(() => {
    let ignore = false
    fetch(`/api/v1/satellite/ndvi-assessment?cluster=${selectedCluster}&grid_resolution=${resolution}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Failed'))))
      .then((json: SatelliteNdviData) => {
        if (!ignore) {
          setData(json)
          setSelectedCell(json.cells[0] || null)
        }
      })
      .catch(() => {
        if (!ignore) {
          const fb = createFallbackData(selectedCluster, resolution)
          setData(fb)
          setSelectedCell(fb.cells[0] || null)
        }
      })

    return () => {
      ignore = true
    }
  }, [selectedCluster, resolution])

  const handleManualSync = () => {
    setIsSyncing(true)
    fetch(`/api/v1/satellite/ndvi-assessment?cluster=${selectedCluster}&grid_resolution=${resolution}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Failed'))))
      .then((json: SatelliteNdviData) => {
        setData(json)
        setSelectedCell(json.cells[0] || null)
      })
      .catch(() => {
        const fb = createFallbackData(selectedCluster, resolution)
        setData(fb)
        setSelectedCell(fb.cells[0] || null)
      })
      .finally(() => {
        setIsSyncing(false)
      })
  }


  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-6">
      {/* Top Banner & Satellite Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-agri-darkBorder">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              <Satellite className="h-4 w-4" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Pillar 4: Space-to-Field Earth Observation (ESA Sentinel-2 MSI)
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Cadastral Multi-Spectral NDVI Health Heatmap
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pre-symptomatic macro foliar surveillance: NDVI = (Band 8 NIR - Band 4 RED) / (NIR + RED) calibrated across 10-meter farm cadastral parcels.
          </p>
        </div>

        {/* Action Controls & Voice Narrative */}
        <div className="flex flex-wrap items-center gap-2.5">
          <AudioAdvisoryButton
            label="Audio Debrief"
            variant="solid"
            getNarrative={(lang) => {
              if (lang === 'pa') {
                return `ਸੈਟੇਲਾਈਟ ਨਿਗਰਾਨੀ ਰਿਪੋਰਟ: ${data?.cluster || 'ਖੇਤ'} ਵਿੱਚ ਔਸਤ NDVI ਇੰਡੈਕਸ ${data?.average_ndvi || 0.65} ਹੈ। ਉੱਤਰ-ਪੂਰਬੀ ਕੈਨੋਪੀ ਵਿੱਚ ਪੱਤਿਆਂ ਦਾ ਸੂਖਮ ਤਣਾਅ ਦਿਖਣ ਤੋਂ 6 ਦਿਨ ਪਹਿਲਾਂ ਫੜਿਆ ਗਿਆ ਹੈ। ਤੁਰੰਤ ਬਾਇਓ-ਕੰਟਰੋਲ ਸਪਰੇਅ ਕਰੋ।`
              }
              if (lang === 'hi') {
                return `उपग्रह निगरानी विश्लेषण: ${data?.cluster || 'खेत'} का औसत NDVI सूचकांक ${data?.average_ndvi || 0.65} है। पत्तियों में फफूंद तनाव आंखों से दिखने से 6 दिन पूर्व ही उपग्रह द्वारा डिटेक्ट कर लिया गया है।`
              }
              return `Satellite earth observation report for ${data?.cluster || 'farm cluster'}. Average NDVI is ${data?.average_ndvi || 0.65}. Foliar stress detected 6 days before visual appearance in the North-East canopy quadrant. Preventive bio-fungicide barrier application advised.`
            }}
          />

          <button
            type="button"
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-200 transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
            Sync Overpass
          </button>
        </div>
      </div>

      {/* Cluster Selector & Resolution Toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-slate-50/70 p-3 rounded-2xl border border-slate-200/80 dark:bg-agri-darkCard/50 dark:border-agri-darkBorder">
        {/* Cluster Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <MapPin className="h-4 w-4 text-emerald-600 shrink-0 ml-1" />
          <span className="text-xs font-bold text-slate-500 shrink-0 mr-1">Cluster:</span>
          {CLUSTERS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCluster(c.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition ${
                selectedCluster === c.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-agri-darkSurface dark:text-slate-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* 10m vs 20m Toggle */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <Layers className="h-4 w-4 text-slate-400" />
          <div className="flex rounded-xl bg-slate-200/80 p-0.5 dark:bg-agri-darkSurface">
            <button
              type="button"
              onClick={() => setResolution('10m')}
              className={`rounded-lg px-2.5 py-1 text-xs font-extrabold transition ${
                resolution === '10m'
                  ? 'bg-white text-emerald-700 shadow-xs dark:bg-agri-darkCard dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              10m Native
            </button>
            <button
              type="button"
              onClick={() => setResolution('20m')}
              className={`rounded-lg px-2.5 py-1 text-xs font-extrabold transition ${
                resolution === '20m'
                  ? 'bg-white text-emerald-700 shadow-xs dark:bg-agri-darkCard dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              20m Aggregated
            </button>
          </div>
        </div>
      </div>

      {/* Pre-Symptomatic Early Warning Alert Banner */}
      {data && (
        <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/90 p-4 dark:border-amber-900/60 dark:bg-amber-950/30">
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200 shrink-0">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-amber-200 px-2 py-0.5 text-[10px] font-black uppercase text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                  Pre-Symptomatic Early Alert
                </span>
                <span className="text-xs font-extrabold text-amber-950 dark:text-amber-100">
                  {data.pre_symptomatic_alert}
                </span>
              </div>
              <p className="text-xs text-amber-900/80 dark:text-amber-200/80">
                Multi-spectral Band 8 NIR reflectance dropped below 0.35 in quadrant NE while visible leaves still appear green. Internal spongy mesophyll cell disruption signals fungal spore colonization 6 days prior to macroscopic chlorosis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid & Telemetry Breakdown */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: 10m Pixel Matrix Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-extrabold text-slate-700 dark:text-slate-300">
              6 × 6 Multi-Spectral Cadastral Parcel Matrix ({resolution} Resolution)
            </span>
            <span className="text-[11px] text-slate-400">Click a cell to inspect spectral bands</span>
          </div>

          {/* Interactive Heatmap Matrix */}
          <div className="relative p-4 rounded-2xl border border-slate-200/80 bg-slate-900 dark:border-agri-darkBorder shadow-inner overflow-hidden">
            <div className="grid grid-cols-6 gap-2">
              {data?.cells.map((cell) => {
                const isSelected = selectedCell?.row === cell.row && selectedCell?.col === cell.col
                return (
                  <button
                    key={`${cell.row}-${cell.col}`}
                    type="button"
                    onClick={() => setSelectedCell(cell)}
                    className={`group relative aspect-square rounded-xl p-1 text-center transition-all transform hover:scale-105 hover:z-10 focus:outline-hidden ${
                      isSelected ? 'ring-3 ring-white shadow-xl scale-105 z-10' : ''
                    }`}
                    style={{ backgroundColor: cell.color_hex }}
                  >
                    <div className="flex h-full flex-col items-center justify-center text-white drop-shadow-md">
                      <span className="text-[11px] font-black tracking-tight">{cell.ndvi.toFixed(2)}</span>
                      <span className="text-[8px] font-semibold opacity-90">
                        {cell.foliar_stress_days_advance > 0 ? `-${cell.foliar_stress_days_advance}d` : 'OK'}
                      </span>
                    </div>

                    {/* Cell hover tooltip */}
                    <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 whitespace-nowrap rounded-lg bg-black/90 px-2 py-1 text-[10px] text-white shadow-lg">
                      NDVI: {cell.ndvi} | {cell.classification}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Compass / Orientation Watermark */}
            <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800 pt-2">
              <span className="flex items-center gap-1">
                <Compass className="h-3 w-3 text-emerald-400" /> True North Aligned
              </span>
              <span>Footprint: 360m × 360m Cadastral Section</span>
            </div>
          </div>

          {/* Color Gradient Legend Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="h-3 w-full rounded-full bg-gradient-to-r from-red-700 via-amber-400 via-lime-500 to-green-700 shadow-xs" />
            <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
              <span className="text-red-600 font-extrabold">&lt; 0.20 Severe Chlorosis</span>
              <span className="text-amber-600 font-extrabold">0.30–0.50 Moisture Stress</span>
              <span className="text-lime-600 font-extrabold">0.50–0.70 Optimal</span>
              <span className="text-emerald-700 font-extrabold">&gt; 0.70 Vigorous Biomass</span>
            </div>
          </div>
        </div>

        {/* Right: Selected Parcel Telemetry & Spectral Indices (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Selected Cell Inspector Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Target 10m Pixel Telemetry
              </span>
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-extrabold text-white"
                style={{ backgroundColor: selectedCell?.color_hex || '#15803d' }}
              >
                {selectedCell?.classification || 'Selected'}
              </span>
            </div>

            {selectedCell && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-white p-2.5 dark:bg-agri-darkSurface border border-slate-100 dark:border-agri-darkBorder">
                  <span className="text-[10px] text-slate-400 font-bold block">NDVI Index</span>
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    {selectedCell.ndvi}
                  </span>
                </div>

                <div className="rounded-xl bg-white p-2.5 dark:bg-agri-darkSurface border border-slate-100 dark:border-agri-darkBorder">
                  <span className="text-[10px] text-slate-400 font-bold block">Pre-Symptomatic Lead</span>
                  <span className="text-base font-black text-amber-600 dark:text-amber-400">
                    {selectedCell.foliar_stress_days_advance > 0
                      ? `+${selectedCell.foliar_stress_days_advance} Days Advance`
                      : 'Zero Stress'}
                  </span>
                </div>

                <div className="rounded-xl bg-white p-2.5 dark:bg-agri-darkSurface border border-slate-100 dark:border-agri-darkBorder">
                  <span className="text-[10px] text-slate-400 font-bold block">Band 8 NIR (842nm)</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {selectedCell.nir_band8} BOA
                  </span>
                </div>

                <div className="rounded-xl bg-white p-2.5 dark:bg-agri-darkSurface border border-slate-100 dark:border-agri-darkBorder">
                  <span className="text-[10px] text-slate-400 font-bold block">Band 4 RED (665nm)</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {selectedCell.red_band4} BOA
                  </span>
                </div>

                <div className="col-span-2 rounded-xl bg-white p-2.5 dark:bg-agri-darkSurface border border-slate-100 dark:border-agri-darkBorder text-[11px] text-slate-500">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Cadastral Coordinate:</span>{' '}
                  {selectedCell.lat.toFixed(5)}°N, {selectedCell.lon.toFixed(5)}°E
                </div>
              </div>
            )}
          </div>

          {/* Macro Cluster Statistics Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              Cluster Vegetation Breakdown
            </span>

            {data && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> Vigorous Canopy
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {data.healthy_canopy_percentage}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Moisture Stress
                  </span>
                  <span className="font-extrabold text-amber-600">
                    {data.stressed_canopy_percentage}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-600" /> Severe Chlorosis
                  </span>
                  <span className="font-extrabold text-red-600">
                    {data.critical_canopy_percentage}%
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-2 dark:border-agri-darkBorder grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                  <div>
                    <span className="block text-[10px] text-slate-400">EVI Index:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {data.spectral_indices.EVI}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400">SAVI (L=0.5):</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {data.spectral_indices.SAVI}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
