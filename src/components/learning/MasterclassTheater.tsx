import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  Sparkles,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Volume1,
  ListVideo,
  FileDown,
  Radio,
  Tv,
  Layers,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import {
  PUNJAB_MASTERCLASSES,
  type MasterclassVideo,
  type MasterclassChapter,
} from '../../data/punjabSchemesAndMasterclasses'
import { speechService } from '../../lib/speech'
import { useAppStore } from '../../store/useAppStore'

interface MasterclassTheaterProps {
  initialVideoId?: string
}

export function MasterclassTheater({ initialVideoId }: MasterclassTheaterProps) {
  const { language } = useAppStore()

  // Selected masterclass
  const [selectedVideo, setSelectedVideo] = useState<MasterclassVideo>(() => {
    return (
      PUNJAB_MASTERCLASSES.find((v) => v.id === initialVideoId) ||
      PUNJAB_MASTERCLASSES[0]
    )
  })

  // Stream mode: 'youtube' (direct reliable PAU embed stream) or 'html5' (direct video feed)
  const [streamEngine, setStreamEngine] = useState<'youtube' | 'html5'>('youtube')

  // Player state
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isBuffering, setIsBuffering] = useState<boolean>(false)
  const [hasVideoError, setHasVideoError] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(selectedVideo.totalSeconds)
  const [volume, setVolume] = useState<number>(1)
  const [isMuted, setIsMuted] = useState<boolean>(true)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0)
  const [isSpeakingNotes, setIsSpeakingNotes] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'chapters' | 'curriculum' | 'pauNotes'>('chapters')
  const [seekStartSeconds, setSeekStartSeconds] = useState<number>(0)

  // Stop speech synthesis on unmount
  useEffect(() => {
    return () => {
      speechService.stop()
    }
  }, [])

  // In HTML5 mode, load the video whenever selectedVideo changes
  useEffect(() => {
    if (streamEngine === 'html5' && videoRef.current) {
      setHasVideoError(false)
      videoRef.current.currentTime = 0
      videoRef.current.playbackRate = playbackSpeed
      videoRef.current.muted = isMuted
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true)
          setIsBuffering(false)
        })
        .catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true
            setIsMuted(true)
            videoRef.current
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => setIsPlaying(false))
          }
        })
    }
  }, [selectedVideo, streamEngine, isMuted, playbackSpeed])

  // Handle Play / Pause Toggle in HTML5 Mode
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  // Handle HTML5 Video Time Update
  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    const cur = videoRef.current.currentTime
    setCurrentTime(cur)

    // Calculate active chapter
    const activeIdx = selectedVideo.chapters.reduce(
      (acc, chapter, idx) => (cur >= chapter.seconds ? idx : acc),
      0
    )
    setActiveChapterIndex(activeIdx)
  }

  // Handle HTML5 Metadata Loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration) {
      setDuration(videoRef.current.duration)
      setIsBuffering(false)
      setHasVideoError(false)
    }
  }

  // Handle HTML5 Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = Number(e.target.value)
    setCurrentTime(target)
    if (videoRef.current) {
      videoRef.current.currentTime = target
    }
    const activeIdx = selectedVideo.chapters.reduce(
      (acc, chapter, idx) => (target >= chapter.seconds ? idx : acc),
      0
    )
    setActiveChapterIndex(activeIdx)
  }

  // Jump to specific chapter
  const seekToChapter = (chapter: MasterclassChapter, idx: number) => {
    setActiveChapterIndex(idx)
    setCurrentTime(chapter.seconds)
    setSeekStartSeconds(chapter.seconds)

    if (streamEngine === 'html5' && videoRef.current) {
      const maxSeek = videoRef.current.duration || selectedVideo.totalSeconds
      videoRef.current.currentTime = Math.min(chapter.seconds, maxSeek)
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
      }
    }
  }

  // Switch Video
  const handleSelectVideo = (video: MasterclassVideo) => {
    setSelectedVideo(video)
    setCurrentTime(0)
    setSeekStartSeconds(0)
    setActiveChapterIndex(0)
    setHasVideoError(false)
    speechService.stop()
    setIsSpeakingNotes(false)
  }

  // Volume slider
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setVolume(val)
    const muted = val === 0
    setIsMuted(muted)
    if (videoRef.current) {
      videoRef.current.volume = val
      videoRef.current.muted = muted
    }
  }

  // Toggle Mute
  const toggleMute = () => {
    const nextMuted = !isMuted
    setIsMuted(nextMuted)
    if (videoRef.current) {
      videoRef.current.muted = nextMuted
      if (!nextMuted && videoRef.current.volume === 0) {
        videoRef.current.volume = 0.8
        setVolume(0.8)
      }
    }
  }

  // Playback Speed
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed)
    if (videoRef.current) {
      videoRef.current.playbackRate = speed
    }
  }

  // Fullscreen
  const toggleFullscreen = () => {
    if (!stageRef.current) return
    if (!document.fullscreenElement) {
      stageRef.current.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

  // Speech Narration
  const handleNarrateChapter = () => {
    if (isSpeakingNotes) {
      speechService.stop()
      setIsSpeakingNotes(false)
      return
    }

    const currentChapter = selectedVideo.chapters[activeChapterIndex] || selectedVideo.chapters[0]
    const speechText =
      language === 'pa'
        ? `${selectedVideo.titlePa}। ਪਾਠ: ${currentChapter.titlePa}। ${currentChapter.description}। ਮੁੱਖ ਸਿਫਾਰਸ਼: ${currentChapter.keyTakeaway}`
        : `${selectedVideo.title}. Chapter: ${currentChapter.title}. ${currentChapter.description}. Core PAU scientific recommendation: ${currentChapter.keyTakeaway}`

    setIsSpeakingNotes(true)
    speechService.speak(speechText, language, () => {
      setIsSpeakingNotes(false)
    })
  }

  // Format seconds to mm:ss
  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const currentChapter =
    selectedVideo.chapters[activeChapterIndex] || selectedVideo.chapters[0]

  // Construct YouTube embed URL with auto-run and start chapter timestamp
  const youtubeEmbedSrc = `https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeVideoId}?autoplay=1&mute=0&rel=0&modestbranding=1&playsinline=1${
    seekStartSeconds > 0 ? `&start=${seekStartSeconds}` : ''
  }`

  return (
    <div
      id="masterclass-theater"
      className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-950 via-forest-950/40 to-slate-900 p-4 sm:p-6 lg:p-8 shadow-2xl backdrop-blur-xl"
    >
      {/* Theater Topbar Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-inner">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-300 border border-amber-500/30">
                PAU Ludhiana Certified Masterclass Stage
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                <Radio className="h-3 w-3 animate-pulse text-red-500" />
                <span>Running Video Stream</span>
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white mt-1">
              {selectedVideo.title}
            </h2>
            <p className="text-xs font-semibold text-emerald-400">
              {selectedVideo.titlePa} • {selectedVideo.organization}
            </p>
          </div>
        </div>

        {/* Action Controls & Stream Mode Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Stream Engine Selector */}
          <div className="flex items-center rounded-xl bg-slate-900/90 p-1 border border-white/10 text-xs font-bold">
            <button
              onClick={() => {
                setStreamEngine('youtube')
                setHasVideoError(false)
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition cursor-pointer ${
                streamEngine === 'youtube'
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Official PAU Lecture Stream (Ultra High-Def)"
            >
              <Tv className="h-3.5 w-3.5" />
              <span>PAU Masterclass HD</span>
            </button>
            <button
              onClick={() => {
                setStreamEngine('html5')
                setHasVideoError(false)
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition cursor-pointer ${
                streamEngine === 'html5'
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Direct HTML5 Video Stream"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Direct Feed</span>
            </button>
          </div>

          {/* Quick Voice Narration Button */}
          <button
            onClick={handleNarrateChapter}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition shadow-sm cursor-pointer ${
              isSpeakingNotes
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-emerald-600 text-white hover:bg-emerald-500'
            }`}
          >
            {isSpeakingNotes ? (
              <>
                <VolumeX className="h-3.5 w-3.5" />
                <span>Stop Voice</span>
              </>
            ) : (
              <>
                <Volume1 className="h-3.5 w-3.5" />
                <span>Narrate ({language.toUpperCase()})</span>
              </>
            )}
          </button>

          {/* External YouTube Search Link */}
          <a
            href={selectedVideo.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-600/20 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-600 hover:text-white transition cursor-pointer"
            title="Open in YouTube"
          >
            <span>YouTube</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Main Grid: Player Stage (Left 8 cols) + All Videos Playlist (Right 4 cols) */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: RUNNING VIDEO PLAYER STAGE */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div
            ref={stageRef}
            id="masterclass-video-stage"
            className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl border border-white/10 select-none"
          >
            {/* STREAM ENGINE 1: OFFICIAL HIGH-DEF YOUTUBE EMBED STREAM */}
            {streamEngine === 'youtube' && (
              <div className="relative h-full w-full">
                <iframe
                  key={`${selectedVideo.id}-${seekStartSeconds}`}
                  src={youtubeEmbedSrc}
                  title={selectedVideo.title}
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}

            {/* STREAM ENGINE 2: DIRECT HTML5 VIDEO PLAYER WITH LUXURY CONTROLS */}
            {streamEngine === 'html5' && (
              <>
                {hasVideoError ? (
                  <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center bg-slate-950">
                    <AlertCircle className="h-10 w-10 text-amber-400 mb-2" />
                    <h3 className="text-sm font-bold text-white">Direct Feed Optimization Notice</h3>
                    <p className="text-xs text-slate-400 max-w-sm mt-1">
                      Direct HTML5 feed could not be streamed by your browser. Switch to the official PAU Masterclass HD Stream for uninterrupted playback.
                    </p>
                    <button
                      onClick={() => {
                        setStreamEngine('youtube')
                        setHasVideoError(false)
                      }}
                      className="mt-4 flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition cursor-pointer"
                    >
                      <RefreshCw className="h-4 w-4" /> Switch to PAU Masterclass HD
                    </button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      src={selectedVideo.directVideoSrc}
                      poster={selectedVideo.thumbnailUrl}
                      autoPlay
                      muted={isMuted}
                      loop
                      playsInline
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onPlay={() => {
                        setIsPlaying(true)
                        setIsBuffering(false)
                      }}
                      onPause={() => setIsPlaying(false)}
                      onWaiting={() => setIsBuffering(true)}
                      onPlaying={() => {
                        setIsBuffering(false)
                        setIsPlaying(true)
                      }}
                      onError={() => setHasVideoError(true)}
                      onClick={togglePlay}
                      className="h-full w-full object-cover cursor-pointer"
                    />

                    {/* Gradient backdrop */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/40 pointer-events-none" />

                    {/* Buffering Spinner */}
                    {isBuffering && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
                        <div className="h-10 w-10 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                      </div>
                    )}

                    {/* Center Play Button Overlay when paused */}
                    {!isPlaying && !isBuffering && (
                      <button
                        onClick={togglePlay}
                        className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-2xl shadow-amber-500/50 transition-all hover:scale-110 hover:bg-amber-400 z-20 cursor-pointer"
                        title="Play Video"
                      >
                        <Play className="h-7 w-7 fill-current ml-1" />
                      </button>
                    )}

                    {/* Luxury Glassmorphic Controls Bar */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent p-3.5 flex flex-col gap-2 z-20">
                      {/* Timeline Scrubber */}
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={0}
                          max={duration || selectedVideo.totalSeconds}
                          value={currentTime}
                          onChange={handleSeek}
                          className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
                        />
                      </div>

                      {/* Control Buttons */}
                      <div className="flex items-center justify-between text-xs text-white">
                        <div className="flex items-center gap-3">
                          {/* Play/Pause */}
                          <button
                            onClick={togglePlay}
                            className="rounded-lg p-1.5 text-white hover:bg-white/20 transition cursor-pointer"
                          >
                            {isPlaying ? (
                              <Pause className="h-5 w-5 fill-current" />
                            ) : (
                              <Play className="h-5 w-5 fill-current ml-0.5" />
                            )}
                          </button>

                          {/* Rewind 10s */}
                          <button
                            onClick={() => {
                              if (videoRef.current) {
                                videoRef.current.currentTime = Math.max(0, currentTime - 10)
                              }
                            }}
                            className="rounded-lg p-1 text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
                            title="Rewind 10s"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>

                          {/* Volume & Mute */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={toggleMute}
                              className="rounded-lg p-1 text-slate-300 hover:text-white cursor-pointer"
                            >
                              {isMuted ? (
                                <VolumeX className="h-4 w-4 text-amber-400" />
                              ) : (
                                <Volume2 className="h-4 w-4 text-emerald-400" />
                              )}
                            </button>
                            <input
                              type="range"
                              min={0}
                              max={1}
                              step={0.05}
                              value={isMuted ? 0 : volume}
                              onChange={handleVolumeChange}
                              className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
                            />
                          </div>

                          {/* Time display */}
                          <span className="font-mono text-[11px] text-slate-300">
                            {formatSeconds(currentTime)} / {formatSeconds(duration || selectedVideo.totalSeconds)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Speed selector */}
                          <div className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-0.5 text-[11px] font-bold">
                            {[1, 1.25, 1.5].map((speed) => (
                              <button
                                key={speed}
                                onClick={() => handleSpeedChange(speed)}
                                className={`px-1.5 py-0.5 rounded cursor-pointer ${
                                  playbackSpeed === speed
                                    ? 'bg-amber-400 text-slate-950 font-black'
                                    : 'text-slate-300 hover:text-white'
                                }`}
                              >
                                {speed}x
                              </button>
                            ))}
                          </div>

                          {/* Fullscreen */}
                          <button
                            onClick={toggleFullscreen}
                            className="rounded-lg p-1 text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
                            title="Fullscreen"
                          >
                            <Maximize2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Top Status HUD: Category Badge & Active Chapter */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none z-10">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-slate-950/85 px-2.5 py-1 text-[10px] font-black uppercase text-amber-300 backdrop-blur-md border border-white/10 shadow">
                  {selectedVideo.category}
                </span>
                <span className="rounded-md bg-slate-950/85 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md border border-white/10 shadow">
                  Ch. {activeChapterIndex + 1}: {currentChapter.title}
                </span>
              </div>

              {/* Status Pill */}
              <div className="flex items-center gap-2 rounded-md bg-slate-950/85 px-2.5 py-1 backdrop-blur-md border border-white/10 shadow">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  {streamEngine === 'youtube' ? 'LIVE STREAM' : isPlaying ? 'RUNNING' : 'PAUSED'}
                </span>
              </div>
            </div>

            {/* Floating Protocol Card (bottom-left overlay on hover or when not controls) */}
            {streamEngine === 'youtube' && (
              <div className="absolute bottom-4 left-4 max-w-sm rounded-xl border border-white/20 bg-slate-950/85 p-3 backdrop-blur-md pointer-events-none z-10 hidden sm:block">
                <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                  <Tv className="h-3 w-3" />
                  <span>PAU Field Protocol #{activeChapterIndex + 1}</span>
                </div>
                <h4 className="text-xs font-bold text-white truncate mt-0.5">{currentChapter.title}</h4>
                <p className="text-[10px] text-emerald-300 font-medium truncate mt-0.5">
                  {currentChapter.keyTakeaway}
                </p>
              </div>
            )}
          </div>

          {/* Under-Player Topic Info Card */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Active Scientific Segment:
                </span>
                <span className="text-xs font-extrabold text-amber-300">
                  {currentChapter.title}
                </span>
              </div>

              <span className="text-xs text-slate-400">
                Speaker: <strong className="text-white">{selectedVideo.instructor}</strong>
              </span>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-slate-300">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Agronomic Protocol:
                </span>
                <p className="mt-1 leading-relaxed">{currentChapter.description}</p>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-200">
                <span className="text-[10px] font-bold uppercase text-emerald-400 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> PAU Golden Rule:
                </span>
                <p className="mt-1 font-semibold leading-relaxed">
                  {currentChapter.keyTakeaway}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: ALL 4 MASTERCLASSES PLAYLIST TRAY */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListVideo className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                All Masterclasses ({PUNJAB_MASTERCLASSES.length})
              </h3>
            </div>
            <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              Instant Switch
            </span>
          </div>

          {/* Playlist Cards List */}
          <div className="space-y-3 overflow-y-auto max-h-[580px] pr-1">
            {PUNJAB_MASTERCLASSES.map((video, idx) => {
              const isCurrent = video.id === selectedVideo.id
              return (
                <div
                  key={video.id}
                  onClick={() => handleSelectVideo(video)}
                  className={`group cursor-pointer rounded-2xl border p-3.5 transition-all duration-300 ${
                    isCurrent
                      ? 'border-amber-400 bg-amber-500/15 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400'
                      : 'border-white/10 bg-slate-900/70 hover:border-white/30 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Thumbnail with Live Playing Equalizer */}
                    <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-xl bg-slate-950">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      {isCurrent ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <div className="flex items-end gap-0.5 h-4">
                            <span className="w-1 bg-amber-400 animate-[pulse_0.6s_ease-in-out_infinite] h-3" />
                            <span className="w-1 bg-amber-400 animate-[pulse_0.4s_ease-in-out_infinite] h-4" />
                            <span className="w-1 bg-amber-400 animate-[pulse_0.8s_ease-in-out_infinite] h-2" />
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition">
                          <Play className="h-4 w-4 text-white fill-current" />
                        </div>
                      )}
                      <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[9px] font-bold text-white">
                        {video.duration}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-black uppercase text-amber-400 truncate">
                          Lesson {idx + 1} • {video.category}
                        </span>
                        <span className="text-[10px] rounded bg-white/10 px-1.5 py-0.2 text-slate-300 font-bold">
                          {video.level}
                        </span>
                      </div>
                      <h4 className="mt-1 text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-amber-300">
                        {video.title}
                      </h4>
                      <p className="mt-1 text-[11px] text-slate-400 line-clamp-1">
                        {video.instructor}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Download Official PAU Practices Package */}
          <a
            href="https://www.pau.edu/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs font-bold text-emerald-300 hover:bg-emerald-900/50 transition cursor-pointer"
          >
            <FileDown className="h-4 w-4 text-emerald-400" />
            <span>Download Official PAU Package of Practices (PDF)</span>
          </a>
        </div>
      </div>

      {/* Chapter Timestamps & Learning Dossier Tabs */}
      <div className="mt-8 border-t border-white/10 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex rounded-xl bg-slate-900/90 p-1 ring-1 ring-white/10 text-xs font-bold">
            <button
              onClick={() => setActiveTab('chapters')}
              className={`rounded-lg px-3.5 py-1.5 transition cursor-pointer ${
                activeTab === 'chapters'
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Chapters &amp; Timestamps ({selectedVideo.chapters.length})
            </button>
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`rounded-lg px-3.5 py-1.5 transition cursor-pointer ${
                activeTab === 'curriculum'
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Full Curriculum Syllabus
            </button>
            <button
              onClick={() => setActiveTab('pauNotes')}
              className={`rounded-lg px-3.5 py-1.5 transition cursor-pointer ${
                activeTab === 'pauNotes'
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              PAU Field Takeaways ({selectedVideo.pauTakeaways.length})
            </button>
          </div>

          <span className="text-xs text-slate-400">
            Selected: <strong className="text-white">{selectedVideo.title}</strong>
          </span>
        </div>

        {/* Tab 1: Chapters */}
        {activeTab === 'chapters' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {selectedVideo.chapters.map((ch, idx) => {
              const isActive = idx === activeChapterIndex
              return (
                <button
                  key={ch.time}
                  onClick={() => seekToChapter(ch, idx)}
                  className={`text-left rounded-xl p-3 border transition-all cursor-pointer ${
                    isActive
                      ? 'border-amber-400 bg-amber-500/20 text-white shadow-md ring-1 ring-amber-400'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-slate-900 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-400">
                      {ch.time}
                    </span>
                    <span className="text-[10px] text-slate-400">Ch. {idx + 1}</span>
                  </div>
                  <h5 className="mt-2 text-xs font-bold line-clamp-1">{ch.title}</h5>
                  <p className="text-[10px] text-emerald-400 line-clamp-1">{ch.titlePa}</p>
                </button>
              )
            })}
          </div>
        )}

        {/* Tab 2: Curriculum Checklist */}
        {activeTab === 'curriculum' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedVideo.curriculum.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-200"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: PAU Takeaways */}
        {activeTab === 'pauNotes' && (
          <div className="space-y-2.5">
            {selectedVideo.pauTakeaways.map((note, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3.5 text-xs text-emerald-200"
              >
                <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="font-medium">{note}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
