import { useState } from 'react'
import {
  Cpu,
  Wifi,
  Radio,
  CheckCircle2,
  RefreshCw,
  Tractor,
  Layers
} from 'lucide-react'

export interface HardwareNode {
  id: string
  name: string
  type: 'AWS Weather Station' | 'Capacitive Moisture Probe' | 'In-Cab ISOBUS Gateway'
  signalRssi: number
  batteryPct: number
  reportingFreqMins: number
  status: 'online' | 'standby' | 'alert'
  lastPing: string
}

const INITIAL_NODES: HardwareNode[] = [
  {
    id: 'NODE-AWS-01',
    name: 'Davis Vantage Pro2 Weather Station',
    type: 'AWS Weather Station',
    signalRssi: -68,
    batteryPct: 94,
    reportingFreqMins: 15,
    status: 'online',
    lastPing: '2 mins ago',
  },
  {
    id: 'NODE-SOIL-A1',
    name: 'Sentek Drill & Drop Multi-Depth Probe',
    type: 'Capacitive Moisture Probe',
    signalRssi: -74,
    batteryPct: 88,
    reportingFreqMins: 30,
    status: 'online',
    lastPing: '8 mins ago',
  },
  {
    id: 'NODE-CAB-T40',
    name: 'DJI Agras / John Deere Gen 4 Terminal',
    type: 'In-Cab ISOBUS Gateway',
    signalRssi: -58,
    batteryPct: 100,
    reportingFreqMins: 5,
    status: 'online',
    lastPing: '34 secs ago',
  },
]

export function SensorHardwareNetworkManager() {
  const [nodes] = useState<HardwareNode[]>(INITIAL_NODES)
  const [soilRetentionCurve, setSoilRetentionCurve] = useState<'Alluvial Loam (Van Genuchten)' | 'Black Vertisol (High Plasticity)' | 'Sandy Loam (Rapid Drainage)'>('Alluvial Loam (Van Genuchten)')
  const [jdLinkSync, setJdLinkSync] = useState(true)
  const [trimbleSync, setTrimbleSync] = useState(true)
  const [ravenSync, setRavenSync] = useState(false)
  const [isPinging, setIsPinging] = useState(false)
  const [pingSuccess, setPingSuccess] = useState(false)

  const handlePingNetwork = () => {
    setIsPinging(true)
    setTimeout(() => {
      setIsPinging(false)
      setPingSuccess(true)
      setTimeout(() => setPingSuccess(false), 3000)
    }, 1200)
  }

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-agri-darkBorder">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                LoRaWAN &amp; Cellular NB-IoT Mesh
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                3/3 Nodes Active
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Micro-Climate Sensor Hardware &amp; IoT Telemetry Network Manager
            </h2>
          </div>
        </div>

        <button
          onClick={handlePingNetwork}
          disabled={isPinging}
          className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition active:scale-95 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-200"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-sky-600 ${isPinging ? 'animate-spin' : ''}`} />
          {isPinging ? 'Pinging Hardware...' : 'Ping Telemetry Mesh'}
        </button>
      </div>

      {pingSuccess && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-50 p-3 text-xs font-bold text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" /> All in-situ hardware telemetry nodes responded with round-trip latency &lt; 42ms.
        </div>
      )}

      {/* Nodes Telemetry Grid */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {nodes.map((node) => (
          <div
            key={node.id}
            className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-slate-400">{node.id}</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <Wifi className="h-3 w-3" /> {node.signalRssi} dBm
              </span>
            </div>

            <p className="mt-1 text-xs font-black text-slate-900 dark:text-white">{node.name}</p>
            <p className="text-[10px] text-slate-400">{node.type}</p>

            <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-agri-darkBorder flex items-center justify-between text-[11px]">
              <span className="text-slate-500">LiFePO4: <strong className="text-slate-800 dark:text-slate-200">{node.batteryPct}%</strong></span>
              <span className="text-slate-400">Ping: {node.lastPing}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Moisture Retention Curve & In-Cab Fleet Telematics Sync */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Probe Calibration Curve */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-forest-700 dark:text-emerald-400" />
            Capacitive Soil Probe Retention Curve (Pedotransfer Function)
          </span>
          <p className="mt-1 text-[11px] text-slate-400">
            Converts raw dielectric permittivity ($\epsilon$) into volumetric water content (VWC %).
          </p>
          <select
            value={soilRetentionCurve}
            onChange={(e) => setSoilRetentionCurve(e.target.value as any)}
            className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-sm dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-slate-200"
          >
            <option value="Alluvial Loam (Van Genuchten)">Alluvial Loam (Van Genuchten $\alpha=0.036, n=1.56$)</option>
            <option value="Black Vertisol (High Plasticity)">Black Vertisol (High Plasticity Clay, Shrink-Swell)</option>
            <option value="Sandy Loam (Rapid Drainage)">Sandy Loam (Rapid Coarse Drainage)</option>
          </select>
        </div>

        {/* Fleet Cloud Sync */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Tractor className="h-3.5 w-3.5 text-amber-600" />
            In-Cab Fleet ISOBUS Terminal Telematics Sync
          </span>

          <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl bg-white dark:bg-agri-darkSurface border border-slate-200 dark:border-agri-darkBorder text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Radio className="h-3.5 w-3.5 text-emerald-600" /> John Deere Operations Center (JDLink)
            </span>
            <input
              type="checkbox"
              checked={jdLinkSync}
              onChange={(e) => setJdLinkSync(e.target.checked)}
              className="rounded accent-emerald-600"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl bg-white dark:bg-agri-darkSurface border border-slate-200 dark:border-agri-darkBorder text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Radio className="h-3.5 w-3.5 text-sky-600" /> Trimble Connected Farm Sync
            </span>
            <input
              type="checkbox"
              checked={trimbleSync}
              onChange={(e) => setTrimbleSync(e.target.checked)}
              className="rounded accent-emerald-600"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl bg-white dark:bg-agri-darkSurface border border-slate-200 dark:border-agri-darkBorder text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Radio className="h-3.5 w-3.5 text-slate-400" /> Raven Slingshot Telematics
            </span>
            <input
              type="checkbox"
              checked={ravenSync}
              onChange={(e) => setRavenSync(e.target.checked)}
              className="rounded accent-emerald-600"
            />
          </label>
        </div>
      </div>
    </div>
  )
}
