import { useEffect, useRef, useState } from 'react'
import {
  Camera,
  RefreshCw,
  Sun,
  X,
  Zap,
} from 'lucide-react'

interface LiveFieldCameraModalProps {
  isOpen: boolean
  onClose: () => void
  onCapture: (imageDataUrl: string, fileName: string) => void
}

export function LiveFieldCameraModal({ isOpen, onClose, onCapture }: LiveFieldCameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [lightingStatus, setLightingStatus] = useState<'optimal' | 'low' | 'bright'>('optimal')
  const [isCapturing, setIsCapturing] = useState(false)

  // Start camera stream
  useEffect(() => {
    if (!isOpen) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
      return
    }

    let isMounted = true

    async function initCamera() {
      setCameraError(null)
      try {
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        }
        const s = await navigator.mediaDevices.getUserMedia(constraints)
        if (!isMounted) {
          s.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = s
        if (videoRef.current) {
          videoRef.current.srcObject = s
        }
      } catch (err) {
        if (isMounted) {
          console.warn('Camera access unavailable:', err)
          setCameraError('Camera access unavailable or permission denied. You can use sample photos or file upload.')
        }
      }
    }

    void initCamera()

    return () => {
      isMounted = false
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
    }
  }, [isOpen, facingMode])

  // Real-time lighting check via video frame sampling
  useEffect(() => {
    if (!isOpen || !streamRef.current) return

    const interval = setInterval(() => {
      if (!videoRef.current || !canvasRef.current) return
      const video = videoRef.current
      if (video.readyState < 2) return

      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = 64
      canvas.height = 64
      ctx.drawImage(video, 0, 0, 64, 64)
      const data = ctx.getImageData(0, 0, 64, 64).data

      let brightnessSum = 0
      for (let i = 0; i < data.length; i += 4) {
        // Luminance formula
        brightnessSum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      }
      const avgBrightness = brightnessSum / (data.length / 4)

      if (avgBrightness < 50) setLightingStatus('low')
      else if (avgBrightness > 210) setLightingStatus('bright')
      else setLightingStatus('optimal')
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen])

  const playShutterSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(800, audioCtx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1)
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1)
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start()
      osc.stop(audioCtx.currentTime + 0.1)
    } catch {
      // AudioContext unavailable
    }
  }

  const handleCapture = () => {
    setIsCapturing(true)
    playShutterSound()

    // Trigger haptic vibration if supported on mobile
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(50)
      } catch {
        // Safe ignore
      }
    }

    setTimeout(() => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current
        const canvas = canvasRef.current
        canvas.width = video.videoWidth || 800
        canvas.height = video.videoHeight || 600
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
          onCapture(dataUrl, `field_leaf_capture_${Date.now()}.jpg`)
          onClose()
        }
      }
      setIsCapturing(false)
    }, 200)
  }

  // Fallback demo simulation capture if camera is unavailable
  const handleSimulatedCapture = () => {
    setIsCapturing(true)
    playShutterSound()
    setTimeout(() => {
      const demoUrl = 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80'
      onCapture(demoUrl, 'simulated_camera_capture.jpg')
      onClose()
      setIsCapturing(false)
    }, 300)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 sm:p-6 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl text-white">
        {/* Top HUD Bar */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between bg-linear-to-b from-black/80 via-black/40 to-transparent p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Camera className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                Live Leaf Viewfinder HUD
              </h3>
              <p className="text-[10px] text-slate-300">
                Hold leaf steady within the alignment frame
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Ambient Lighting Indicator */}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                lightingStatus === 'optimal'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : lightingStatus === 'low'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}
            >
              <Sun className="h-3 w-3" />
              {lightingStatus === 'optimal' ? 'Optimal Light' : lightingStatus === 'low' ? 'Low Light Warning' : 'Bright'}
            </span>

            {/* Flip Camera */}
            <button
              type="button"
              onClick={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
              className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition"
              title="Flip camera"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Video Preview with Viewfinder Crosshair */}
        <div className="relative aspect-4/3 w-full bg-black flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center max-w-md">
              <Camera className="h-12 w-12 text-slate-500 mx-auto mb-3" />
              <p className="text-xs text-amber-300 font-bold">{cameraError}</p>
              <p className="mt-2 text-[11px] text-slate-400">
                You can capture a high-resolution simulated leaf image below to test real-time vision diagnosis.
              </p>
              <button
                type="button"
                onClick={handleSimulatedCapture}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white hover:bg-emerald-700 shadow-md"
              >
                <Zap className="h-4 w-4" /> Take Simulated Foliage Photo
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
              />

              {/* Viewfinder Leaf Outline Overlay */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="relative h-64 w-64 rounded-full border-2 border-dashed border-emerald-400/70 shadow-2xl flex items-center justify-center">
                  {/* Crosshairs */}
                  <div className="absolute h-4 w-0.5 bg-emerald-400 -top-2 left-1/2 -translate-x-1/2" />
                  <div className="absolute h-4 w-0.5 bg-emerald-400 -bottom-2 left-1/2 -translate-x-1/2" />
                  <div className="absolute w-4 h-0.5 bg-emerald-400 -left-2 top-1/2 -translate-y-1/2" />
                  <div className="absolute w-4 h-0.5 bg-emerald-400 -right-2 top-1/2 -translate-y-1/2" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300/80 bg-black/40 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                    Target Leaf Blade
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Flash Effect on capture */}
          {isCapturing && (
            <div className="absolute inset-0 bg-white transition-opacity duration-150 animate-out fade-out" />
          )}

          {/* Hidden Canvas for capture processing */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Bottom Shutter Action Bar */}
        <div className="flex items-center justify-around bg-slate-950 p-4 border-t border-slate-800">
          <p className="text-[11px] text-slate-400 hidden sm:block">
            High-Resolution RGB Capture • 224x224 Tensor Ready
          </p>

          {!cameraError && (
            <button
              type="button"
              onClick={handleCapture}
              disabled={isCapturing}
              className="relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-emerald-400 bg-white text-slate-900 transition hover:scale-105 active:scale-95 shadow-xl disabled:opacity-50"
            >
              <div className="h-11 w-11 rounded-full bg-emerald-600 hover:bg-emerald-700 transition" />
            </button>
          )}

          <button
            type="button"
            onClick={handleSimulatedCapture}
            className="text-[11px] font-bold text-emerald-400 hover:underline"
          >
            Use Demo Sample
          </button>
        </div>
      </div>
    </div>
  )
}
