import { useState } from 'react'
import {
  Download,
  FileCode,
  Layers,
  MapPin,
  CheckCircle2,
  Globe,
  Settings2,
  HardDrive
} from 'lucide-react'

export interface ExportConfig {
  format: 'isobus' | 'geojson' | 'shapefile' | 'agroxml' | 'icar-csv'
  selectedSectors: string[]
  crs: 'EPSG:4326 (WGS 84)' | 'EPSG:32643 (UTM Zone 43N)'
  dateRange: string
  includeTelemetry: boolean
  includePrescriptions: boolean
}

interface PrecisionDataExporterProps {
  onExportTriggered?: (config: ExportConfig) => void
}

const SECTORS = [
  { id: 'Sector A1', name: 'Sector A1 - Basmati Rice', acres: 8.5, activePrescription: 'VRN Nitrogen Grid' },
  { id: 'Sector B2', name: 'Sector B2 - HD-3086 Wheat', acres: 12.0, activePrescription: 'Fungicide Variable Spray' },
  { id: 'Sector C1', name: 'Sector C1 - Bt Cotton', acres: 6.5, activePrescription: 'PGR & Defoliation Plan' },
  { id: 'Sector D3', name: 'Sector D3 - Mustard / Raya', acres: 4.2, activePrescription: 'Sulphur Topdress' },
]

export function PrecisionDataExporter({ onExportTriggered }: PrecisionDataExporterProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportConfig['format']>('isobus')
  const [selectedSectors, setSelectedSectors] = useState<string[]>(['Sector A1', 'Sector B2', 'Sector C1', 'Sector D3'])
  const [crs, setCrs] = useState<ExportConfig['crs']>('EPSG:4326 (WGS 84)')
  const [includePrescriptions, setIncludePrescriptions] = useState(true)
  const [includeTelemetry, setIncludeTelemetry] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [exportedFilename, setExportedFilename] = useState<string | null>(null)

  const toggleSector = (sectorId: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sectorId) ? prev.filter((s) => s !== sectorId) : [...prev, sectorId]
    )
  }

  const selectAllSectors = () => {
    if (selectedSectors.length === SECTORS.length) {
      setSelectedSectors([])
    } else {
      setSelectedSectors(SECTORS.map((s) => s.id))
    }
  }

  // Calculate dynamic export file size preview
  const estimatedSizeKb = Math.round(
    (selectedSectors.length * 42 +
      (includePrescriptions ? 65 : 10) +
      (includeTelemetry ? 120 : 15) +
      (selectedFormat === 'shapefile' ? 180 : selectedFormat === 'isobus' ? 95 : 35)) *
      1.15
  )

  const handleExecuteExport = () => {
    setIsExporting(true)
    const config: ExportConfig = {
      format: selectedFormat,
      selectedSectors,
      crs,
      dateRange: 'Nov 01, 2026 - Nov 02, 2026',
      includeTelemetry,
      includePrescriptions,
    }

    setTimeout(() => {
      let filename = `CROP_DOCTOR_${Date.now()}`
      let content = ''
      let mimeType = 'text/plain'

      if (selectedFormat === 'isobus') {
        filename = `TASKDATA_${Date.now()}.XML`
        mimeType = 'application/xml'
        content = `<?xml version="1.0" encoding="UTF-8"?>
<ISO11783TaskData VersionMajor="4" VersionMinor="2" ManagementSoftwareManufacturer="KrishiSaarthi" ManagementSoftwareVersion="3.4">
  <CTR A="CTR-001" B="Ludhiana Smart Farm Collective" />
  <FRM A="FRM-001" B="Punjab Central Estate" />
  <PFD A="PFD-101" C="${selectedSectors.join(', ')}">
    <GGP A="GGP-1" C="Cadastral Boundary Polygon" />
  </PFD>
  <TSK A="TSK-2026" B="VRA Foliar & Topdress Mission" G="1">
    <TZN A="1" B="Zone 1 - High Biomass" C="0.78 NDVI" />
    <TZN A="2" B="Zone 2 - Chlorotic Patch" C="0.41 NDVI" />
  </TSK>
</ISO11783TaskData>`
      } else if (selectedFormat === 'geojson') {
        filename = `PARCEL_BOUNDARIES_${Date.now()}.geojson`
        mimeType = 'application/geo+json'
        content = JSON.stringify(
          {
            type: 'FeatureCollection',
            crs: { type: 'name', properties: { name: crs } },
            features: selectedSectors.map((sId, idx) => ({
              type: 'Feature',
              properties: {
                parcelId: sId,
                name: SECTORS.find((s) => s.id === sId)?.name,
                hectares: (
                  (SECTORS.find((s) => s.id === sId)?.acres || 10) * 0.404686
                ).toFixed(2),
                ndviScore: 0.74,
                soilPh: 6.8,
              },
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [75.8573 + idx * 0.005, 30.901],
                    [75.8615 + idx * 0.005, 30.9012],
                    [75.861 + idx * 0.005, 30.8975],
                    [75.8568 + idx * 0.005, 30.8972],
                    [75.8573 + idx * 0.005, 30.901],
                  ],
                ],
              },
            })),
          },
          null,
          2
        )
      } else if (selectedFormat === 'shapefile') {
        filename = `CADASTRE_SHP_BUNDLE_${Date.now()}.zip`
        mimeType = 'application/zip'
        content = 'PK... ESRI Shapefile Bundle Simulation (shp, shx, dbf, prj)'
      } else if (selectedFormat === 'agroxml') {
        filename = `AGRO_EXCHANGE_${Date.now()}.xml`
        mimeType = 'application/xml'
        content = `<?xml version="1.0" encoding="UTF-8"?>
<agroXML version="2.0">
  <FarmDescription name="Punjab Agro Zone 4" auditor="ICAR Accredited" />
  <WorkOrderBatch count="${selectedSectors.length}" />
</agroXML>`
      } else {
        filename = `ICAR_SOIL_HEALTH_LEDGER_${Date.now()}.csv`
        mimeType = 'text/csv'
        content = `Parcel_ID,Crop,Acres,Soil_pH,Nitrogen_kg_ha,Phosphorus_kg_ha,Potassium_kg_ha,OC_pct,NDVI,Fertility_Index
Sector A1,Basmati 1121,8.5,6.8,118,48,190,0.82,0.82,High
Sector B2,HD-3086 Wheat,12.0,7.1,105,42,175,0.74,0.64,Moderate
Sector C1,Bt Cotton,6.5,7.4,124,39,185,0.68,0.76,Optimal
Sector D3,Mustard Raya,4.2,6.9,112,52,210,0.79,0.71,High`
      }

      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setIsExporting(false)
      setExportedFilename(filename)
      if (onExportTriggered) onExportTriggered(config)
    }, 900)
  }

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-agri-darkBorder">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest-50 text-forest-800 dark:bg-forest-950/60 dark:text-emerald-400">
            <FileCode className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Interoperability Layer (ISO 11783 / OGC)
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                Terminal Sync Ready
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Multi-Format Precision Geospatial & Telemetry Exporter
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <HardDrive className="h-4 w-4 text-slate-400" />
          <span>Est. Payload:</span>
          <span className="font-bold text-slate-900 dark:text-white">~{estimatedSizeKb} KB</span>
        </div>
      </div>

      {/* Grid: Format Selector + Configuration */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Formats */}
        <div className="lg:col-span-7 space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-forest-700 dark:text-emerald-400" />
            1. Select Industry Precision AG Format
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Format 1: ISOBUS */}
            <div
              onClick={() => setSelectedFormat('isobus')}
              className={`cursor-pointer rounded-2xl border p-3.5 transition-all ${
                selectedFormat === 'isobus'
                  ? 'border-forest-700 bg-forest-50/70 shadow-sm dark:border-emerald-500 dark:bg-emerald-950/30 ring-1 ring-forest-700 dark:ring-emerald-500'
                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 dark:border-agri-darkBorder dark:bg-agri-darkCard'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 dark:text-white">ISOBUS ISO-XML</span>
                    <span className="rounded bg-forest-800/10 px-1.5 py-0.5 text-[9px] font-bold text-forest-900 dark:bg-emerald-950 dark:text-emerald-300">
                      ISO 11783-10
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                    Prescription tasks (`TASKDATA.XML`) for John Deere Gen 4, Trimble GFX-750, Raven Viper.
                  </p>
                </div>
                {selectedFormat === 'isobus' && (
                  <CheckCircle2 className="h-4 w-4 text-forest-800 dark:text-emerald-400 shrink-0" />
                )}
              </div>
            </div>

            {/* Format 2: GeoJSON */}
            <div
              onClick={() => setSelectedFormat('geojson')}
              className={`cursor-pointer rounded-2xl border p-3.5 transition-all ${
                selectedFormat === 'geojson'
                  ? 'border-forest-700 bg-forest-50/70 shadow-sm dark:border-emerald-500 dark:bg-emerald-950/30 ring-1 ring-forest-700 dark:ring-emerald-500'
                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 dark:border-agri-darkBorder dark:bg-agri-darkCard'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 dark:text-white">GeoJSON Polygons</span>
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      RFC 7946
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                    Cadastral vector boundaries, NDVI zones, and soil chemometrics for GIS web mapping.
                  </p>
                </div>
                {selectedFormat === 'geojson' && (
                  <CheckCircle2 className="h-4 w-4 text-forest-800 dark:text-emerald-400 shrink-0" />
                )}
              </div>
            </div>

            {/* Format 3: ESRI Shapefile */}
            <div
              onClick={() => setSelectedFormat('shapefile')}
              className={`cursor-pointer rounded-2xl border p-3.5 transition-all ${
                selectedFormat === 'shapefile'
                  ? 'border-forest-700 bg-forest-50/70 shadow-sm dark:border-emerald-500 dark:bg-emerald-950/30 ring-1 ring-forest-700 dark:ring-emerald-500'
                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 dark:border-agri-darkBorder dark:bg-agri-darkCard'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 dark:text-white">ESRI Shapefile Bundle</span>
                    <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[9px] font-bold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                      .SHP Bundle
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                    Full spatial archive (`.shp`, `.shx`, `.dbf`, `.prj`) for ArcGIS &amp; QGIS field analysis.
                  </p>
                </div>
                {selectedFormat === 'shapefile' && (
                  <CheckCircle2 className="h-4 w-4 text-forest-800 dark:text-emerald-400 shrink-0" />
                )}
              </div>
            </div>

            {/* Format 4: ICAR CSV / Excel */}
            <div
              onClick={() => setSelectedFormat('icar-csv')}
              className={`cursor-pointer rounded-2xl border p-3.5 transition-all ${
                selectedFormat === 'icar-csv'
                  ? 'border-forest-700 bg-forest-50/70 shadow-sm dark:border-emerald-500 dark:bg-emerald-950/30 ring-1 ring-forest-700 dark:ring-emerald-500'
                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 dark:border-agri-darkBorder dark:bg-agri-darkCard'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 dark:text-white">ICAR Soil Health Ledger</span>
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      CSV / XLSX
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                    Govt. Soil Health Card compatible tabular logs with NPK, EC, micronutrients and yield.
                  </p>
                </div>
                {selectedFormat === 'icar-csv' && (
                  <CheckCircle2 className="h-4 w-4 text-forest-800 dark:text-emerald-400 shrink-0" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Parcel Scope & Projection */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-forest-700 dark:text-emerald-400" />
              2. Estate Parcel Scope
            </label>
            <button
              onClick={selectAllSectors}
              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
            >
              {selectedSectors.length === SECTORS.length ? 'Deselect All' : 'Select All (4)'}
            </button>
          </div>

          <div className="space-y-2">
            {SECTORS.map((s) => {
              const isChecked = selectedSectors.includes(s.id)
              return (
                <div
                  key={s.id}
                  onClick={() => toggleSector(s.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                    isChecked
                      ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/20'
                      : 'border-slate-200 bg-white dark:border-agri-darkBorder dark:bg-agri-darkCard'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="rounded text-forest-700 focus:ring-forest-700"
                    />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{s.name}</span>
                      <p className="text-[10px] text-slate-400">{s.activePrescription}</p>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    {s.acres} Ac
                  </span>
                </div>
              )
            })}
          </div>

          {/* Coordinate System & Layer Toggles */}
          <div className="pt-2 border-t border-slate-100 dark:border-agri-darkBorder space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-slate-400" /> Projection (CRS):
              </span>
              <select
                value={crs}
                onChange={(e) => setCrs(e.target.value as ExportConfig['crs'])}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-200"
              >
                <option value="EPSG:4326 (WGS 84)">EPSG:4326 (WGS 84 Lat/Lon)</option>
                <option value="EPSG:32643 (UTM Zone 43N)">EPSG:32643 (UTM Zone 43N)</option>
              </select>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Settings2 className="h-3.5 w-3.5 text-slate-400" /> Prescriptions &amp; Telemetry:
              </span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includePrescriptions}
                    onChange={(e) => setIncludePrescriptions(e.target.checked)}
                    className="rounded text-forest-700"
                  />
                  VRA Grid
                </label>
                <label className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeTelemetry}
                    onChange={(e) => setIncludeTelemetry(e.target.checked)}
                    className="rounded text-forest-700"
                  />
                  IoT Sensors
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-agri-darkBorder">
        <div className="text-xs text-slate-500">
          {exportedFilename ? (
            <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> Downloaded: {exportedFilename}
            </span>
          ) : (
            <span>Ready to generate verified terminal package for {selectedSectors.length} active sectors.</span>
          )}
        </div>

        <button
          onClick={handleExecuteExport}
          disabled={isExporting || selectedSectors.length === 0}
          className="flex items-center gap-2 rounded-2xl bg-forest-800 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-forest-900/20 transition hover:bg-forest-900 disabled:opacity-50 active:scale-95 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        >
          {isExporting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Packaging ISO-XML Binary...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Export {selectedFormat.toUpperCase()} Package (~{estimatedSizeKb} KB)
            </>
          )}
        </button>
      </div>
    </div>
  )
}
