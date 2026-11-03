import {
  BatteryCharging,
  CheckCircle2,
  Radio,
  Signal,
  Waves,
} from 'lucide-react'

export function IotSensorMeshStatus() {
  const nodes = [
    {
      id: 'gateway-01',
      name: 'Central LoRaWAN Gateway',
      location: 'Barn Rooftop (Tower #1)',
      status: 'Online',
      battery: 100,
      signal: '-74 dBm',
      telemetry: 'Ping: 18ms • 4G LTE Backhaul',
    },
    {
      id: 'node-01',
      name: 'Rhizosphere Multi-Depth Probe',
      location: 'Sector B2 (Wheat Core)',
      status: 'Online',
      battery: 94,
      signal: '-81 dBm',
      telemetry: 'VWC 34% • 10/20/30 cm Depths',
    },
    {
      id: 'node-02',
      name: 'Leaf Wetness & Micro-Climate Hub',
      location: 'Sector A1 (Basmati)',
      status: 'Online',
      battery: 91,
      signal: '-78 dBm',
      telemetry: '1.5 hrs wetness • 82% Humidity',
    },
    {
      id: 'node-03',
      name: 'Solar Irrigation Solenoid Controller',
      location: 'Sector C1 (Bt Cotton)',
      status: 'Standby',
      battery: 89,
      signal: '-85 dBm',
      telemetry: 'Valve #3 Ready • 2.4 bar Pressure',
    },
  ]

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-agri-darkBorder">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
              <Radio className="h-4 w-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-300">
              Hardware Telemetry Mesh
            </span>
          </div>
          <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
            LoRaWAN Field IoT Sensor Hardware Status
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time wireless probe link quality, battery float charge, and reference evapotranspiration.
          </p>
        </div>

        {/* Global Mesh Status */}
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-3.5 py-1.5 text-xs font-black text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>All 4 Field Nodes Synchronized</span>
        </div>
      </div>

      {/* Sensor Nodes Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-1">
        {nodes.map((node) => (
          <div
            key={node.id}
            className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-black text-slate-400">
                {node.id.toUpperCase()}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle2 className="h-3 w-3" /> {node.status}
              </span>
            </div>

            <h4 className="mt-2 text-xs font-black text-slate-900 dark:text-white truncate">
              {node.name}
            </h4>
            <p className="text-[10px] text-slate-500 truncate">{node.location}</p>

            <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-2 text-[11px] dark:border-agri-darkBorder">
              <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                <BatteryCharging className="h-3.5 w-3.5 text-emerald-600" /> {node.battery}%
              </span>
              <span className="flex items-center gap-1 font-mono text-slate-500">
                <Signal className="h-3.5 w-3.5 text-blue-500" /> {node.signal}
              </span>
            </div>

            <p className="mt-1.5 text-[10px] font-medium text-slate-500 truncate">
              {node.telemetry}
            </p>
          </div>
        ))}
      </div>

      {/* Evapotranspiration Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-teal-50/80 p-3.5 text-xs text-teal-950 dark:bg-teal-950/20 dark:text-teal-200 border border-teal-200 dark:border-teal-900">
        <div className="flex items-center gap-2">
          <Waves className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <span className="font-bold">
            Daily Reference Evapotranspiration (ET₀): <strong>4.2 mm/day</strong>
          </span>
        </div>
        <span className="mt-1 sm:mt-0 font-medium text-teal-800 dark:text-teal-300 text-[11px]">
          Dynamic FAO-56 Penman-Monteith equation calibrated
        </span>
      </div>
    </div>
  )
}
