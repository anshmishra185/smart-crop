import { useState } from 'react'
import {
  Building2,
  MapPin,
  Radio,
  FileCheck2,
  Droplets,
  Layers,
  Save,
  CheckCircle2
} from 'lucide-react'

export interface EstateProfile {
  legalEntityName: string
  apedaRcmcNumber: string
  gstinPan: string
  districtKvk: string
  latitude: number
  longitude: number
  elevationMsl: number
  rtkCorrectionMode: 'NTRIP CORS (Sub-cm)' | 'LoRa Base Station (868MHz)' | 'Satellite SBAS (GAGAN)'
  cultivableAreaAcres: number
  canalCommandPercent: number
  tubewellBoresCount: number
}

const DEFAULT_PROFILE: EstateProfile = {
  legalEntityName: 'Ludhiana Central Agro Precision Estate LLP',
  apedaRcmcNumber: 'APEDA/PUN/2026/89412',
  gstinPan: '03AABCL4921E1Z4',
  districtKvk: 'KVK Ludhiana (Punjab Agricultural University PAU)',
  latitude: 30.9010,
  longitude: 75.8573,
  elevationMsl: 244,
  rtkCorrectionMode: 'NTRIP CORS (Sub-cm)',
  cultivableAreaAcres: 31.2,
  canalCommandPercent: 65,
  tubewellBoresCount: 3,
}

export function MultiTenantEstateProfile() {
  const [profile, setProfile] = useState<EstateProfile>(DEFAULT_PROFILE)
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-agri-darkBorder">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest-50 text-forest-800 dark:bg-forest-950/60 dark:text-emerald-400">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Institutional Cadastre &amp; Organization Manager
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                RTK Sub-cm Calibrated
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Multi-Tenant Estate Profile &amp; Cadastral GIS Coordinate Boundary Manager
            </h2>
          </div>
        </div>

        {saved && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4" /> Parameters Persisted
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="mt-5 space-y-6">
        {/* Row 1: Enterprise Legal Entity & Regulatory Credentials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-forest-700 dark:text-emerald-400" />
              Enterprise / Estate Legal Name:
            </label>
            <input
              type="text"
              value={profile.legalEntityName}
              onChange={(e) => setProfile({ ...profile, legalEntityName: e.target.value })}
              className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-forest-700 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileCheck2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              APEDA Registration (RCMC Number):
            </label>
            <input
              type="text"
              value={profile.apedaRcmcNumber}
              onChange={(e) => setProfile({ ...profile, apedaRcmcNumber: e.target.value })}
              className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-forest-700 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              GSTIN / PAN Tax Identification:
            </label>
            <input
              type="text"
              value={profile.gstinPan}
              onChange={(e) => setProfile({ ...profile, gstinPan: e.target.value })}
              className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-forest-700 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Assigned District Krishi Vigyan Kendra (KVK):
            </label>
            <input
              type="text"
              value={profile.districtKvk}
              onChange={(e) => setProfile({ ...profile, districtKvk: e.target.value })}
              className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-forest-700 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-white"
            />
          </div>
        </div>

        {/* Row 2: Cadastral Coordinates & RTK Correction Mode */}
        <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-agri-darkCard border border-slate-100 dark:border-agri-darkBorder space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-red-500" />
              Central Base Station Geodetic Benchmark &amp; RTK Corrections
            </span>
            <span className="text-[10px] font-mono text-emerald-600 font-bold">WGS 84 / Ellipsoid HAE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Latitude (°N):
              </label>
              <input
                type="number"
                step="0.0001"
                value={profile.latitude}
                onChange={(e) => setProfile({ ...profile, latitude: parseFloat(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-mono font-bold text-slate-800 dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-slate-200"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Longitude (°E):
              </label>
              <input
                type="number"
                step="0.0001"
                value={profile.longitude}
                onChange={(e) => setProfile({ ...profile, longitude: parseFloat(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-mono font-bold text-slate-800 dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-slate-200"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Elevation (MSL):
              </label>
              <input
                type="number"
                value={profile.elevationMsl}
                onChange={(e) => setProfile({ ...profile, elevationMsl: parseInt(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-mono font-bold text-slate-800 dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-slate-200"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Radio className="h-3 w-3 text-sky-500" /> RTK Correction Link:
              </label>
              <select
                value={profile.rtkCorrectionMode}
                onChange={(e) => setProfile({ ...profile, rtkCorrectionMode: e.target.value as any })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-800 dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-slate-200"
              >
                <option value="NTRIP CORS (Sub-cm)">NTRIP CORS (Sub-cm)</option>
                <option value="LoRa Base Station (868MHz)">LoRa Base (868MHz)</option>
                <option value="Satellite SBAS (GAGAN)">Satellite SBAS (GAGAN)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Row 3: Land Bank & Hydrology Assets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-forest-700" /> Total Cultivable Land
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <input
                type="number"
                step="0.1"
                value={profile.cultivableAreaAcres}
                onChange={(e) => setProfile({ ...profile, cultivableAreaAcres: parseFloat(e.target.value) })}
                className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm font-black text-slate-900 dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-white"
              />
              <span className="text-xs font-bold text-slate-500">Acres ({(profile.cultivableAreaAcres * 0.404686).toFixed(1)} Ha)</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
              <Droplets className="h-3.5 w-3.5 text-sky-600" /> Canal Command Surface Water
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <input
                type="number"
                value={profile.canalCommandPercent}
                onChange={(e) => setProfile({ ...profile, canalCommandPercent: parseInt(e.target.value) })}
                className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm font-black text-slate-900 dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-white"
              />
              <span className="text-xs font-bold text-slate-500">% of Farm Land</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5 dark:border-agri-darkBorder dark:bg-agri-darkCard">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
              <Radio className="h-3.5 w-3.5 text-amber-600" /> Deep Tubewell Bores
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <input
                type="number"
                value={profile.tubewellBoresCount}
                onChange={(e) => setProfile({ ...profile, tubewellBoresCount: parseInt(e.target.value) })}
                className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm font-black text-slate-900 dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-white"
              />
              <span className="text-xs font-bold text-slate-500">Active Bores (Solar/Grid)</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-2xl bg-forest-800 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-forest-900/20 hover:bg-forest-900 transition dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            <Save className="h-4 w-4" /> Save Cadastral Profile
          </button>
        </div>
      </form>
    </div>
  )
}

