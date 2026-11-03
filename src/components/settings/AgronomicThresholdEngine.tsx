import { useState } from 'react'
import {
  BellRing,
  Wind,
  Droplets,
  AlertTriangle,
  Send,
  MessageSquare,
  Mail,
  Smartphone,
  Save,
  CheckCircle2
} from 'lucide-react'

export interface AgronomicThresholds {
  rhThresholdPct: number
  rhHoursSustained: number
  minDeltaT: number
  maxDeltaT: number
  vwcDepletionLimitPct: number
  maxSprayingWindSpeedKmh: number
  rainWashoffWindowHours: number
  enableInAppPush: boolean
  enableSmsWhatsapp: boolean
  enableSupervisorEmail: boolean
}

const DEFAULT_THRESHOLDS: AgronomicThresholds = {
  rhThresholdPct: 80,
  rhHoursSustained: 6,
  minDeltaT: 2.0,
  maxDeltaT: 8.0,
  vwcDepletionLimitPct: 22,
  maxSprayingWindSpeedKmh: 14,
  rainWashoffWindowHours: 6,
  enableInAppPush: true,
  enableSmsWhatsapp: true,
  enableSupervisorEmail: true,
}

export function AgronomicThresholdEngine() {
  const [thresholds, setThresholds] = useState<AgronomicThresholds>(DEFAULT_THRESHOLDS)
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
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
            <BellRing className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Phytosanitary Safety &amp; Rule Engine
              </span>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                Autonomous Dispatch
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Agronomic Threshold Engine &amp; Multi-Tier Phytosanitary Notification Matrix
            </h2>
          </div>
        </div>

        {saved && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4" /> Threshold Rules Active
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="mt-5 space-y-6">
        {/* Threshold Sliders & Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Spore Pressure */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Airborne Spore RH Gate
              </span>
              <span className="font-mono text-xs font-black text-amber-600">
                &gt;{thresholds.rhThresholdPct}% for {thresholds.rhHoursSustained}h
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Triggers fungal sporulation alert when micro-climate canopy humidity remains high.
            </p>
            <input
              type="range"
              min="65"
              max="95"
              value={thresholds.rhThresholdPct}
              onChange={(e) => setThresholds({ ...thresholds, rhThresholdPct: parseInt(e.target.value) })}
              className="mt-3 w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>65% (Sensitive)</span>
              <span>80% (ICAR Standard)</span>
              <span>95% (Extreme)</span>
            </div>
          </div>

          {/* Card 2: Soil Moisture Depletion */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Droplets className="h-3.5 w-3.5 text-sky-600" /> Rootzone VWC Limit
              </span>
              <span className="font-mono text-xs font-black text-sky-600">
                &lt;{thresholds.vwcDepletionLimitPct}% VWC
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Critical irrigation threshold triggering smart solenoid drip / tubewell dispatch.
            </p>
            <input
              type="range"
              min="15"
              max="35"
              value={thresholds.vwcDepletionLimitPct}
              onChange={(e) => setThresholds({ ...thresholds, vwcDepletionLimitPct: parseInt(e.target.value) })}
              className="mt-3 w-full accent-sky-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>15% (Wilting Point)</span>
              <span>22% (Optimum Trigger)</span>
              <span>35% (Field Capacity)</span>
            </div>
          </div>

          {/* Card 3: Foliar Spray Wind Drift Gate */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Wind className="h-3.5 w-3.5 text-forest-700 dark:text-emerald-400" /> Wind Drift Cutoff
              </span>
              <span className="font-mono text-xs font-black text-forest-700 dark:text-emerald-400">
                &gt;{thresholds.maxSprayingWindSpeedKmh} km/h
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Locks chemical spray work orders to prevent off-target herbicide/fungicide drift.
            </p>
            <input
              type="range"
              min="8"
              max="22"
              value={thresholds.maxSprayingWindSpeedKmh}
              onChange={(e) => setThresholds({ ...thresholds, maxSprayingWindSpeedKmh: parseInt(e.target.value) })}
              className="mt-3 w-full accent-forest-700 dark:accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>8 km/h (Strict)</span>
              <span>14 km/h (POP Standard)</span>
              <span>22 km/h (High Drift)</span>
            </div>
          </div>
        </div>

        {/* Dispatch Notification Channels */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Send className="h-3.5 w-3.5 text-forest-700 dark:text-emerald-400" />
            Agronomic Multi-Channel Dispatch Routing
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-agri-darkSurface border border-slate-200 dark:border-agri-darkBorder text-xs cursor-pointer">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-emerald-600" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">In-App Push</p>
                  <p className="text-[10px] text-slate-400">Instant web push alert</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={thresholds.enableInAppPush}
                onChange={(e) => setThresholds({ ...thresholds, enableInAppPush: e.target.checked })}
                className="rounded accent-emerald-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-agri-darkSurface border border-slate-200 dark:border-agri-darkBorder text-xs cursor-pointer">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">WhatsApp &amp; SMS</p>
                  <p className="text-[10px] text-slate-400">Supervisor phone dispatch</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={thresholds.enableSmsWhatsapp}
                onChange={(e) => setThresholds({ ...thresholds, enableSmsWhatsapp: e.target.checked })}
                className="rounded accent-emerald-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-agri-darkSurface border border-slate-200 dark:border-agri-darkBorder text-xs cursor-pointer">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-sky-600" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Shift Sheet Email</p>
                  <p className="text-[10px] text-slate-400">Daily 06:00 AM PDF digest</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={thresholds.enableSupervisorEmail}
                onChange={(e) => setThresholds({ ...thresholds, enableSupervisorEmail: e.target.checked })}
                className="rounded accent-emerald-600"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-2xl bg-forest-800 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-forest-900/20 hover:bg-forest-900 transition dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            <Save className="h-4 w-4" /> Save Threshold Matrix
          </button>
        </div>
      </form>
    </div>
  )
}

