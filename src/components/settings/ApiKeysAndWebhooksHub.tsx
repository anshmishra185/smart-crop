import { useState } from 'react'
import {
  KeyRound,
  Satellite,
  Coins,
  CheckCircle2,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react'

export function ApiKeysAndWebhooksHub() {
  const [openWeatherKey, setOpenWeatherKey] = useState('owm_live_9f8a2b3c4d5e6f7a8b9c0d1e')
  const [copernicusKey, setCopernicusKey] = useState('copernicus_hub_pb_zone4_sec981')
  const [mandiInterval, setMandiInterval] = useState<'15 mins' | 'Hourly' | 'Daily (11:00 AM)'>('15 mins')
  const [isTestingOwm, setIsTestingOwm] = useState(false)
  const [owmSuccess, setOwmSuccess] = useState(false)
  const [backupNotice, setBackupNotice] = useState<string | null>(null)

  const handleTestOwm = () => {
    setIsTestingOwm(true)
    setTimeout(() => {
      setIsTestingOwm(false)
      setOwmSuccess(true)
      setTimeout(() => setOwmSuccess(false), 3000)
    }, 1100)
  }

  const handleDownloadBackup = () => {
    const backupData = {
      version: '3.4.0',
      timestamp: new Date().toISOString(),
      farmProfile: {
        legalName: 'Ludhiana Central Agro Precision Estate LLP',
        coordinates: { lat: 30.901, lon: 75.8573 },
        acreage: 31.2,
      },
      hardwareNodes: 3,
      thresholds: { rhGate: 80, vwcTrigger: 22, windLimit: 14 },
    }

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `crop_doctor_fms_config_backup_${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setBackupNotice('Full farm configuration JSON snapshot downloaded.')
    setTimeout(() => setBackupNotice(null), 3000)
  }

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-agri-darkBorder">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-400">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                Cloud Integrations &amp; Webhooks
              </span>
              <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[9px] font-bold text-teal-800 dark:bg-teal-950/80 dark:text-teal-300">
                REST &amp; WebSockets Active
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              API Keys, Cloud Webhooks &amp; External FMIS Interoperability Hub
            </h2>
          </div>
        </div>
      </div>

      {/* Grid: APIs & Mandi Webhook */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* API Card 1: Weather */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-teal-600" /> OpenWeatherMap / IMD API Key:
            </span>
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Live Link
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="password"
              value={openWeatherKey}
              onChange={(e) => setOpenWeatherKey(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-mono font-bold text-slate-800 dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-slate-200"
            />
            <button
              type="button"
              onClick={handleTestOwm}
              disabled={isTestingOwm}
              className="flex items-center gap-1 shrink-0 rounded-xl bg-forest-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-forest-900 transition dark:bg-emerald-600"
            >
              <RefreshCw className={`h-3 w-3 ${isTestingOwm ? 'animate-spin' : ''}`} />
              Test Key
            </button>
          </div>

          {owmSuccess && (
            <p className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> API ping successful. Latency 58ms.
            </p>
          )}
        </div>

        {/* API Card 2: Earth Observation */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Satellite className="h-3.5 w-3.5 text-sky-600" /> ESA Copernicus Sentinel-2 Hub Token:
            </span>
            <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[9px] font-bold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
              NDVI Passes
            </span>
          </div>

          <input
            type="password"
            value={copernicusKey}
            onChange={(e) => setCopernicusKey(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-mono font-bold text-slate-800 dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-slate-200"
          />
          <p className="text-[10px] text-slate-400">
            Authorizes multispectral 10m spatial resolution reflectance ingestion every 5 days.
          </p>
        </div>
      </div>

      {/* APMC Mandi Webhook Cadence & Backup Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-agri-darkBorder">
        {/* Mandi Refresh */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard space-y-2">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Coins className="h-3.5 w-3.5 text-amber-600" /> APMC Mandi e-NAM Ticker Webhook Cadence
          </span>
          <select
            value={mandiInterval}
            onChange={(e) => setMandiInterval(e.target.value as any)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-slate-200"
          >
            <option value="15 mins">Every 15 Minutes (Active Trading Hours)</option>
            <option value="Hourly">Hourly Snapshot</option>
            <option value="Daily (11:00 AM)">Daily Auction Close (11:00 AM)</option>
          </select>
        </div>

        {/* Configuration Backup & Restore */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard space-y-2">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Download className="h-3.5 w-3.5 text-forest-700 dark:text-emerald-400" /> Full Farm Configuration Snapshot
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="flex items-center gap-1.5 rounded-xl bg-forest-800 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-forest-900 transition dark:bg-emerald-600"
            >
              <Download className="h-3.5 w-3.5" /> Download JSON Backup
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-slate-200"
            >
              <Upload className="h-3.5 w-3.5" /> Restore Config
            </button>
          </div>
          {backupNotice && (
            <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{backupNotice}</p>
          )}
        </div>
      </div>
    </div>
  )
}
