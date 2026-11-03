import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ScanEye,
  Radio,
  Lock,
  Unlock,
  Bot,
  MapPin,
  X,
  CheckCircle2,
  AlertTriangle,
  GraduationCap
} from 'lucide-react'
import { VoiceCopilotModal } from './VoiceCopilotModal'

export function FieldActionDock() {
  const navigate = useNavigate()
  const [isCopilotOpen, setIsCopilotOpen] = useState(false)
  const [sprayLockActive, setSprayLockActive] = useState(false)
  const [showSprayLockToast, setShowSprayLockToast] = useState(false)
  const [showGisPopover, setShowGisPopover] = useState(false)
  const [dronePassDispatched, setDronePassDispatched] = useState(false)

  const handleToggleSprayLock = () => {
    const nextState = !sprayLockActive
    setSprayLockActive(nextState)
    setShowSprayLockToast(true)
    setTimeout(() => setShowSprayLockToast(false), 3000)
  }

  const handleDispatchDrone = () => {
    setDronePassDispatched(true)
    setTimeout(() => setDronePassDispatched(false), 3500)
  }

  return (
    <>
      {/* Toast Notification for Emergency Spray Lock */}
      {showSprayLockToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 text-white px-4 py-3 shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-4">
          {sprayLockActive ? (
            <>
              <Lock className="h-4 w-4 text-red-400" />
              <span className="text-xs font-bold text-red-200">
                EMERGENCY CHEMICAL SPRAY LOCK ACTIVE (Wind Drift Hazard)
              </span>
            </>
          ) : (
            <>
              <Unlock className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-200">
                Spray Operations Resumed (Delta-T Gating Active)
              </span>
            </>
          )}
        </div>
      )}

      {/* Drone Scout Dispatched Toast */}
      {dronePassDispatched && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-2xl bg-forest-900 text-white px-4 py-3 shadow-2xl border border-emerald-500/50 animate-in fade-in slide-in-from-top-4">
          <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
          <div className="text-xs">
            <p className="font-black text-white">DJI Agras T40 Sentinel Dispatched!</p>
            <p className="text-[10px] text-emerald-300">Multispectral recon pass initiated on Sector B2.</p>
          </div>
        </div>
      )}

      {/* Floating GIS Parcel Quick Popover */}
      {showGisPopover && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-80 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-agri-darkBorder dark:bg-agri-darkSurface text-xs animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-agri-darkBorder">
            <span className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-red-500" /> Current GNSS Cadastre
            </span>
            <button
              onClick={() => setShowGisPopover(false)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 space-y-1.5 text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Parcel:</span>
              <strong className="text-slate-800 dark:text-slate-100">Ludhiana Central Cluster</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Base RTK:</span>
              <span className="font-mono text-emerald-600 font-bold">30.9010° N, 75.8573° E</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Elevation:</span>
              <span className="font-mono">244m MSL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">RTK Link:</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Sub-cm CORS
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 21st.dev In-Field Floating Action Dock (Desktop + Mobile) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 select-none">
        <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/85 px-3.5 py-2 shadow-2xl backdrop-blur-xl dark:border-agri-darkBorder dark:bg-agri-darkSurface/90 ring-1 ring-black/5 dark:ring-white/10 transition-all hover:border-emerald-500/50">
          {/* Action 1: Instant Leaf Scanner */}
          <button
            onClick={() => navigate('/disease-detection')}
            title="Instant Leaf Pathology Diagnostic"
            className="group flex h-11 w-11 items-center justify-center rounded-full bg-forest-800 text-white shadow-md shadow-forest-900/30 transition hover:scale-110 active:scale-95 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            <ScanEye className="h-5 w-5 transition-transform group-hover:rotate-6" />
          </button>

          {/* Action 2: Voice Copilot */}
          <button
            onClick={() => setIsCopilotOpen(true)}
            title="Launch Voice Agronomist Copilot"
            className="group flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-800 transition hover:scale-110 hover:bg-emerald-100 hover:text-emerald-800 dark:bg-agri-darkCard dark:text-slate-200 dark:hover:bg-emerald-950 dark:hover:text-emerald-300"
          >
            <Bot className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
          </button>

          {/* Action 3: Dispatch Drone Recon */}
          <button
            onClick={handleDispatchDrone}
            title="Dispatch Drone Sentinel Pass (Sector B2)"
            className="group flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-800 transition hover:scale-110 hover:bg-sky-100 hover:text-sky-800 dark:bg-agri-darkCard dark:text-slate-200 dark:hover:bg-sky-950 dark:hover:text-sky-300"
          >
            <Radio className="h-4.5 w-4.5 text-sky-600 dark:text-sky-400" />
          </button>

          {/* Action 4: Emergency Spray Lock Toggle */}
          <button
            onClick={handleToggleSprayLock}
            title={sprayLockActive ? 'Unlock Spray Work Orders' : 'Emergency Lock Spraying (Wind Drift Hazard)'}
            className={`group flex h-10 w-10 items-center justify-center rounded-full transition hover:scale-110 active:scale-95 ${
              sprayLockActive
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 animate-pulse'
                : 'bg-slate-100 text-slate-800 hover:bg-amber-100 hover:text-amber-800 dark:bg-agri-darkCard dark:text-slate-200 dark:hover:bg-amber-950 dark:hover:text-amber-400'
            }`}
          >
            {sprayLockActive ? (
              <Lock className="h-4.5 w-4.5 text-white" />
            ) : (
              <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />
            )}
          </button>

          {/* Action 5: GIS Parcel Radar Quick View */}
          <button
            onClick={() => setShowGisPopover(!showGisPopover)}
            title="Inspect Cadastral Coordinates"
            className="group flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-800 transition hover:scale-110 hover:bg-slate-200 dark:bg-agri-darkCard dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <MapPin className="h-4.5 w-4.5 text-red-500" />
          </button>

          {/* Action 6: Punjab Schemes & Masterclasses */}
          <button
            onClick={() => navigate('/schemes')}
            title="Punjab Govt Schemes & Video Masterclasses"
            className="group flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-800 transition hover:scale-110 hover:bg-amber-100 hover:text-amber-800 dark:bg-agri-darkCard dark:text-slate-200 dark:hover:bg-amber-950 dark:hover:text-amber-400"
          >
            <GraduationCap className="h-4.5 w-4.5 text-amber-500" />
          </button>
        </div>
      </div>

      {/* Voice Copilot Modal */}
      <VoiceCopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />
    </>
  )
}

