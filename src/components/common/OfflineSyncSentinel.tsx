import { useState, useEffect } from 'react'
import {
  Wifi,
  Radio,
  HardDrive,
  RefreshCw,
  CheckCircle2,
  CloudOff
} from 'lucide-react'

export function OfflineSyncSentinel() {
  const [onlineStatus, setOnlineStatus] = useState<'online-5g' | 'lora-mesh' | 'offline'>('online-5g')
  const [pendingUploads, setPendingUploads] = useState<number>(0)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const [syncedNotice, setSyncedNotice] = useState<boolean>(false)

  // Listen to browser network connectivity
  useEffect(() => {
    const handleOnline = () => setOnlineStatus('online-5g')
    const handleOffline = () => setOnlineStatus('offline')

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleSimulateSync = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      setPendingUploads(0)
      setSyncedNotice(true)
      setTimeout(() => setSyncedNotice(false), 2500)
    }, 1100)
  }

  const handleToggleLoRaMesh = () => {
    if (onlineStatus === 'online-5g') {
      setOnlineStatus('lora-mesh')
      setPendingUploads(3)
    } else if (onlineStatus === 'lora-mesh') {
      setOnlineStatus('offline')
      setPendingUploads(5)
    } else {
      setOnlineStatus('online-5g')
      setPendingUploads(0)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Network Connectivity Pill */}
      <div
        onClick={handleToggleLoRaMesh}
        title="Click to toggle simulated offline/mesh mode"
        className="cursor-pointer flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold shadow-sm transition-all hover:scale-105 select-none bg-white/90 dark:bg-agri-darkCard/90 border-slate-200 dark:border-agri-darkBorder"
      >
        {onlineStatus === 'online-5g' && (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <Wifi className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
            <span className="text-slate-800 dark:text-slate-200 font-extrabold hidden sm:inline">Online 5G</span>
          </>
        )}

        {onlineStatus === 'lora-mesh' && (
          <>
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <Radio className="h-3 w-3 text-amber-600 animate-pulse" />
            <span className="text-amber-700 dark:text-amber-400 font-extrabold hidden sm:inline">LoRa 868MHz</span>
          </>
        )}

        {onlineStatus === 'offline' && (
          <>
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <CloudOff className="h-3 w-3 text-red-600" />
            <span className="text-red-700 dark:text-red-400 font-extrabold hidden sm:inline">Edge Offline</span>
          </>
        )}
      </div>

      {/* Pending Uploads Badge & Manual Sync Trigger */}
      {pendingUploads > 0 && (
        <button
          onClick={handleSimulateSync}
          disabled={isSyncing}
          className="flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 px-2.5 py-0.5 text-[10px] font-black text-amber-800 dark:text-amber-300 shadow-sm animate-pulse hover:scale-105 transition"
        >
          <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : `${pendingUploads} Scans Pending`}</span>
        </button>
      )}

      {syncedNotice && (
        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
          <CheckCircle2 className="h-3 w-3" /> Synced!
        </span>
      )}

      {/* Local Storage Cache Monitor */}
      <div className="hidden lg:flex items-center gap-1 text-[10px] font-mono text-slate-400 dark:text-slate-500">
        <HardDrive className="h-3 w-3" />
        <span>Cache: 48.2 MB</span>
      </div>
    </div>
  )
}

