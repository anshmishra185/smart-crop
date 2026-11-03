import { useState } from 'react'
import {
  UploadCloud,
  FileCheck2,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  RefreshCw,
  Eye,
  Sparkles
} from 'lucide-react'

export interface ParsedRecord {
  zoneId: string
  crop: string
  nitrogen: number
  phosphorus: number
  potassium: number
  ph: number
  status: 'valid' | 'warning' | 'error'
  statusMsg: string
}

const SAMPLE_SOIL_DATA: ParsedRecord[] = [
  { zoneId: 'Zone-A1-North', crop: 'Basmati Rice', nitrogen: 118, phosphorus: 48, potassium: 190, ph: 6.8, status: 'valid', statusMsg: 'Calibrated' },
  { zoneId: 'Zone-A1-South', crop: 'Basmati Rice', nitrogen: 122, phosphorus: 52, potassium: 195, ph: 6.9, status: 'valid', statusMsg: 'Calibrated' },
  { zoneId: 'Zone-B2-East', crop: 'HD-3086 Wheat', nitrogen: 85, phosphorus: 32, potassium: 140, ph: 7.8, status: 'warning', statusMsg: 'Low N / Alkaline' },
  { zoneId: 'Zone-B2-West', crop: 'HD-3086 Wheat', nitrogen: 104, phosphorus: 45, potassium: 172, ph: 7.1, status: 'valid', statusMsg: 'Calibrated' },
  { zoneId: 'Zone-C1-Core', crop: 'Bt Cotton', nitrogen: 135, phosphorus: 38, potassium: 180, ph: 7.4, status: 'valid', statusMsg: 'Calibrated' },
  { zoneId: 'Zone-D3-Ridge', crop: 'Mustard Raya', nitrogen: 110, phosphorus: 54, potassium: 215, ph: 6.8, status: 'valid', statusMsg: 'Calibrated' },
]

export function UniversalDataIngestionStudio() {
  const [selectedPreset, setSelectedPreset] = useState<'soil-csv' | 'drone-geotiff' | 'yield-logs'>('soil-csv')
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [parsedRows, setParsedRows] = useState<ParsedRecord[]>(SAMPLE_SOIL_DATA)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    simulateIngestion()
  }

  const simulateIngestion = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setParsedRows([
        ...SAMPLE_SOIL_DATA,
        {
          zoneId: `Zone-E4-New-${Date.now().toString().slice(-3)}`,
          crop: 'Chickpea / Gram',
          nitrogen: 112,
          phosphorus: 44,
          potassium: 168,
          ph: 7.0,
          status: 'valid',
          statusMsg: 'Ingested & Normalized'
        }
      ])
    }, 1100)
  }

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-agri-darkBorder">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                Climate FieldView Data Inbox Engine
              </span>
              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[9px] font-bold text-sky-800 dark:bg-sky-950/80 dark:text-sky-300">
                Auto-Schema Mapper
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Universal Telemetry &amp; Soil Lab Data Ingestion Studio
            </h2>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50/80 p-1 dark:border-agri-darkBorder dark:bg-agri-darkCard text-xs font-bold">
          <button
            onClick={() => setSelectedPreset('soil-csv')}
            className={`rounded-xl px-2.5 py-1.5 transition ${
              selectedPreset === 'soil-csv'
                ? 'bg-white shadow text-slate-900 dark:bg-forest-800 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            Soil Lab CSV
          </button>
          <button
            onClick={() => setSelectedPreset('drone-geotiff')}
            className={`rounded-xl px-2.5 py-1.5 transition ${
              selectedPreset === 'drone-geotiff'
                ? 'bg-white shadow text-slate-900 dark:bg-forest-800 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            Drone GeoTIFF / KML
          </button>
          <button
            onClick={() => setSelectedPreset('yield-logs')}
            className={`rounded-xl px-2.5 py-1.5 transition ${
              selectedPreset === 'yield-logs'
                ? 'bg-white shadow text-slate-900 dark:bg-forest-800 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            Harvester Yield Log
          </button>
        </div>
      </div>

      {/* Drag & Drop Dropzone */}
      <div className="mt-5">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={simulateIngestion}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
            isDragging
              ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/30'
              : 'border-slate-200 bg-slate-50/40 hover:border-slate-300 dark:border-agri-darkBorder dark:bg-agri-darkCard/40'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-slate-800 text-sky-600 dark:text-sky-400">
              {isProcessing ? (
                <RefreshCw className="h-6 w-6 animate-spin text-sky-600" />
              ) : (
                <UploadCloud className="h-6 w-6" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {isProcessing
                  ? 'Parsing telemetry schema & validating spatial bounds...'
                  : 'Drag & drop external Soil CSV, Shapefile (.zip), or Harvester raw logs here'}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                Supports standard laboratory chemosensory columns: Nitrogen, P2O5, K2O, Organic Carbon, pH, and Geotags
              </p>
            </div>
            <button
              type="button"
              className="mt-1 flex items-center gap-1.5 rounded-xl bg-sky-600 px-3 py-1.5 text-[11px] font-extrabold text-white shadow-sm hover:bg-sky-700 transition"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              Simulate Ingestion of ICAR Lab Batch (6 Records)
            </button>
          </div>
        </div>
      </div>

      {/* Schema Match & Ingestion Telemetry Preview */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              Normalized Ingestion Buffer Preview
            </span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {parsedRows.length} Zones Loaded
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> Schema Validated (100%)
            </span>
          </div>
        </div>

        {/* Tabular Data View */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-agri-darkBorder">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-300">
              <tr>
                <th className="p-2.5">Field / Zone ID</th>
                <th className="p-2.5">Target Crop</th>
                <th className="p-2.5">N (kg/ha)</th>
                <th className="p-2.5">P (kg/ha)</th>
                <th className="p-2.5">K (kg/ha)</th>
                <th className="p-2.5">Soil pH</th>
                <th className="p-2.5">Validation State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-agri-darkBorder">
              {parsedRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="p-2.5 font-bold text-slate-900 dark:text-white">{row.zoneId}</td>
                  <td className="p-2.5 text-slate-600 dark:text-slate-300">{row.crop}</td>
                  <td className="p-2.5 font-mono font-bold text-slate-700 dark:text-slate-200">{row.nitrogen}</td>
                  <td className="p-2.5 font-mono font-bold text-slate-700 dark:text-slate-200">{row.phosphorus}</td>
                  <td className="p-2.5 font-mono font-bold text-slate-700 dark:text-slate-200">{row.potassium}</td>
                  <td className="p-2.5 font-mono font-bold text-slate-700 dark:text-slate-200">{row.ph}</td>
                  <td className="p-2.5">
                    {row.status === 'valid' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <FileCheck2 className="h-3 w-3" /> {row.statusMsg}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        <AlertTriangle className="h-3 w-3" /> {row.statusMsg}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Live Synchronization Chip */}
        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-agri-darkCard text-xs border border-slate-100 dark:border-agri-darkBorder">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-sky-600" />
            <span className="text-slate-600 dark:text-slate-400">
              Synced with Soil Health Studio &amp; Variable-Rate Prescriptions across 4 active parcels.
            </span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">CRC-32 Checksum: 0x9F42B1</span>
        </div>
      </div>
    </div>
  )
}
