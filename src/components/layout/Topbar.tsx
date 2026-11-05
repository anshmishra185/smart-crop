import {
  Bell,
  Check,
  CheckCheck,
  Globe,
  Languages,
  MapPin,
  Menu,
  Moon,
  Search,
  Sparkles,
  Sun,
  SunMedium,
  User,
  X,
  ScanEye,
  CloudSun,
  FlaskConical,
  Compass,
  LogIn,
  LogOut
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { useAppStore } from '../../store/useAppStore'
import { mockWeatherService } from '../../services/mockWeatherService'
import { supportedLanguages } from '../../lib/translations'
import { PUNJAB_DISTRICT_COORDINATES } from '../../data/punjabDistricts'
import { AnimatedBrandLogo } from '../common/AnimatedBrandLogo'
import { OfflineSyncSentinel } from '../common/OfflineSyncSentinel'

interface TopbarProps {
  onOpenMobileSidebar: () => void
}

export function Topbar({ onOpenMobileSidebar }: TopbarProps) {
  const navigate = useNavigate()
  const {
    theme,
    toggleTheme,
    outdoorMode,
    toggleOutdoorMode,
    language,
    setLanguage,
    selectedRegion,
    setSelectedRegion,
    setSelectedPunjabDistrict,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useAppStore()

  const { user, openAuthModal, signOut } = useAuth()

  const [notifOpen, setNotifOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const notifRef = useRef<HTMLDivElement>(null)
  const langRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length
  const regions = mockWeatherService.getAvailableRegions()

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false)
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false)
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const [commandTab, setCommandTab] = useState<'all' | 'modules' | 'districts' | 'actions'>('all')

  const searchablePages = [
    { name: 'Crop Disease Detection (AI Scanner)', href: '/disease-detection', category: 'AI Tools', icon: ScanEye },
    { name: 'Weather Intelligence & Spraying Advisories', href: '/weather', category: 'Climate', icon: CloudSun },
    { name: 'Soil Health & NPK Monitoring', href: '/soil-health', category: 'Soil Science', icon: FlaskConical },
    { name: 'Crop Recommendation Engine', href: '/recommendations', category: 'Planning', icon: Sparkles },
    { name: 'Disease Distribution & Analytics', href: '/analytics', category: 'Analytics', icon: Sparkles },
    { name: 'Farming Calendar & Task Scheduler', href: '/calendar', category: 'Management', icon: Sparkles },
    { name: 'Agronomic Reports & Export', href: '/reports', category: 'Reporting', icon: Globe },
    { name: 'Crop Library & Botanical Profiles', href: '/explore', category: 'Library', icon: Globe },
  ]

  const punjabDistrictsList = Object.entries(PUNJAB_DISTRICT_COORDINATES).map(([key, info]) => ({
    key,
    name: info.name,
    subtext: `Lat: ${info.lat.toFixed(2)}, Lon: ${info.lon.toFixed(2)}`,
  }))

  const filteredDistricts = punjabDistrictsList.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.key.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const quickActions = [
    {
      title: 'Scan Leaf for Pathology',
      subtitle: 'Instant ResNet-50 convolutional leaf diagnostic',
      action: () => {
        navigate('/disease-detection')
        setSearchOpen(false)
      },
      icon: ScanEye,
    },
    {
      title: outdoorMode ? 'Turn Off Outdoor Sun Mode' : 'Turn On Outdoor Sun Mode',
      subtitle: 'High-contrast boosted outline and text clarity for field use',
      action: () => {
        toggleOutdoorMode()
        setSearchOpen(false)
      },
      icon: SunMedium,
    },
    {
      title: 'Switch Language to Punjabi (ਪੰਜਾਬੀ)',
      subtitle: 'Apply Gurmukhi Punjabi across entire platform',
      action: () => {
        setLanguage('pa')
        setSearchOpen(false)
      },
      icon: Languages,
    },
    {
      title: 'Switch Language to Hindi (हिंदी)',
      subtitle: 'Apply Hindi Devanagari across entire platform',
      action: () => {
        setLanguage('hi')
        setSearchOpen(false)
      },
      icon: Languages,
    },
    {
      title: 'Simulate Soil NPK & pH Matrix',
      subtitle: 'Interactive 10-parameter fertility and deficit simulator',
      action: () => {
        navigate('/soil-health')
        setSearchOpen(false)
      },
      icon: FlaskConical,
    },
  ].filter((a) => a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredNavResults = searchablePages.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md dark:border-agri-darkBorder dark:bg-agri-darkSurface/95 sm:px-6">
      {/* Left: Mobile trigger & Search */}
      <div className="flex items-center gap-3">
        <Link to="/landing" className="hidden sm:flex lg:hidden items-center mr-1">
          <AnimatedBrandLogo size="sm" showText={false} />
        </Link>
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 dark:border-agri-darkBorder dark:text-slate-300 dark:hover:bg-agri-darkCard lg:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Pill / Trigger */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="group flex h-9.5 w-44 sm:w-64 md:w-80 items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50/80 px-3.5 text-xs text-slate-500 shadow-sm transition-all hover:border-emerald-300 hover:bg-white dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-400 dark:hover:border-emerald-500"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
            <span className="truncate">Search disease, crops, weather...</span>
          </div>
          <kbd className="hidden rounded bg-slate-200/80 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-agri-darkBorder dark:text-slate-400 sm:inline-block">
            ⌘K
          </kbd>
        </button>

        {/* Region selector */}
        <div className="hidden items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-300 md:flex">
          <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-[11px] text-slate-400">Zone:</span>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="cursor-pointer bg-transparent text-xs font-bold text-slate-800 outline-none dark:text-slate-200"
            aria-label="Select farming location"
          >
            {regions.map((r) => (
              <option key={r} value={r} className="dark:bg-agri-darkSurface text-slate-900 dark:text-white">
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Navigation Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Landing Page Quick Shortcut */}
        <Link
          to="/landing"
          className="hidden xl:flex items-center gap-1.5 rounded-xl border border-slate-200/90 px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 hover:text-forest-800 dark:border-agri-darkBorder dark:text-slate-300 dark:hover:bg-agri-darkCard dark:hover:text-emerald-400"
          title="Visit Enterprise Landing Page"
        >
          <Compass className="h-3.5 w-3.5 text-emerald-600" />
          <span>Landing</span>
        </Link>

        {/* Offline Sentinel Network Sync Monitor */}
        <div className="hidden md:flex">
          <OfflineSyncSentinel />
        </div>

        {/* Language selector dropdown */}
        <div className="relative" ref={langRef}>
          <button
            type="button"
            onClick={() => setLangOpen((v) => !v)}
            className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200/90 px-2.5 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-agri-darkBorder dark:text-slate-300 dark:hover:bg-agri-darkCard"
            aria-label="Change language (5 Indian languages)"
            title="Select Language"
          >
            <Languages className="h-4 w-4 text-emerald-600" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider">
              {language}
            </span>
          </button>

          {langOpen && (
            <div className="animate-in fade-in slide-in-from-top-2 absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-agri-darkBorder dark:bg-agri-darkSurface z-50">
              <div className="border-b border-slate-100 px-3.5 py-2.5 dark:border-agri-darkBorder">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Select Language / भाषा चुनें
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">5 Indian agricultural languages</p>
              </div>
              <div className="p-1 space-y-0.5 max-h-80 overflow-y-auto">
                {supportedLanguages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLanguage(l.code)
                      setLangOpen(false)
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                      language === l.code
                        ? 'bg-emerald-50 text-emerald-900 font-bold dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-agri-darkCard'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{l.flag}</span>
                      <div>
                        <div className="font-bold">{l.nativeName}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{l.name} · {l.region}</div>
                      </div>
                    </div>
                    {language === l.code && <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/90 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:border-agri-darkBorder dark:text-slate-300 dark:hover:bg-agri-darkCard"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="h-4.5 w-4.5 text-amber-400" />
          ) : (
            <Moon className="h-4.5 w-4.5 text-slate-600" />
          )}
        </button>

        {/* High-Contrast Outdoor Field Mode (Sunlight Visibility) */}
        <button
          type="button"
          onClick={toggleOutdoorMode}
          className={`flex h-9 items-center gap-1.5 rounded-xl border px-2.5 text-xs font-bold transition active:scale-95 ${
            outdoorMode
              ? 'border-amber-500 bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 ring-2 ring-amber-400'
              : 'border-slate-200/90 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-agri-darkBorder dark:text-slate-300 dark:hover:bg-agri-darkCard'
          }`}
          aria-label={outdoorMode ? 'Disable outdoor sunlight mode' : 'Enable outdoor sunlight mode'}
          title={outdoorMode ? 'Outdoor Sunlight Mode: Active' : 'Switch to Outdoor High-Contrast Field Mode'}
        >
          <SunMedium className={`h-4 w-4 ${outdoorMode ? 'text-slate-950' : 'text-amber-500'}`} />
          <span className="hidden md:inline-block text-[11px] font-extrabold uppercase tracking-wide">
            {outdoorMode ? 'Sun Mode ON' : 'Sun Mode'}
          </span>
        </button>

        {/* Notifications Icon with Badge */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/90 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-agri-darkBorder dark:text-slate-300 dark:hover:bg-agri-darkCard"
            aria-label="Open notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-extrabold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {notifOpen && (
            <div className="animate-in fade-in slide-in-from-top-2 absolute right-0 top-full mt-2 w-80 sm:w-96 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-agri-darkBorder dark:bg-agri-darkSurface">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-agri-darkBorder">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">Notifications</p>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950/60 dark:text-red-400">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsAsRead}
                    className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                  >
                    <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-agri-darkBorder">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No active notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`flex cursor-pointer gap-3 p-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-agri-darkCard ${
                        !n.read ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : ''
                      }`}
                    >
                      <div
                        className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${
                          n.severity === 'critical'
                            ? 'bg-red-500'
                            : n.severity === 'warning'
                            ? 'bg-amber-500'
                            : n.severity === 'success'
                            ? 'bg-emerald-500'
                            : 'bg-blue-500'
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</p>
                          <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-slate-100 p-2.5 text-center dark:border-agri-darkBorder">
                <Link
                  to="/analytics"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
                >
                  View all farm alerts & analytics →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile / Auth Button */}
        {user ? (
          <div className="relative" ref={userRef}>
            <button
              type="button"
              onClick={() => setUserOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-slate-200/90 py-1 pl-1 pr-2.5 transition hover:border-emerald-300 dark:border-agri-darkBorder dark:hover:border-emerald-500"
            >
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="h-7 w-7 rounded-full object-cover shadow-sm ring-1 ring-emerald-500/30"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-forest-800 to-emerald-500 text-xs font-bold text-white shadow-sm">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="hidden text-xs font-bold text-slate-700 dark:text-slate-200 sm:inline-block max-w-[120px] truncate">
                {user.name}
              </span>
            </button>

            {userOpen && (
              <div className="animate-in fade-in slide-in-from-top-2 absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-agri-darkBorder dark:bg-agri-darkSurface z-50">
                <div className="border-b border-slate-100 p-3.5 dark:border-agri-darkBorder">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {user.phone || user.email || 'Verified Kisaan'}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 capitalize">
                      {user.role || 'Farmer'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {user.district ? `${user.district}, ${user.state}` : 'Punjab'}
                    </span>
                  </div>
                </div>
                <div className="p-1">
                  <Link
                    to="/settings"
                    onClick={() => setUserOpen(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-agri-darkCard"
                  >
                    <User className="h-4 w-4" /> Account Settings
                  </Link>
                  <Link
                    to="/reports"
                    onClick={() => setUserOpen(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-agri-darkCard"
                  >
                    <Globe className="h-4 w-4" /> Farm Reports & Export
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setUserOpen(false)
                      void signOut()
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={openAuthModal}
            className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm shadow-emerald-600/30 transition hover:bg-emerald-700 active:scale-95"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In / OTP</span>
          </button>
        )}
      </div>

      {/* Global Quick Jump Modal (Command Palette) */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 p-4 pt-20 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-agri-darkBorder dark:bg-agri-darkSurface"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 dark:border-agri-darkBorder">
              <Search className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search modules, 23 Punjab districts, or actions..."
                className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-agri-darkCard"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2 text-xs font-bold dark:border-agri-darkBorder">
              <button
                type="button"
                onClick={() => setCommandTab('all')}
                className={`rounded-lg px-2.5 py-1 transition ${
                  commandTab === 'all'
                    ? 'bg-forest-800 text-white dark:bg-emerald-600'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                All Results
              </button>
              <button
                type="button"
                onClick={() => setCommandTab('modules')}
                className={`rounded-lg px-2.5 py-1 transition ${
                  commandTab === 'modules'
                    ? 'bg-forest-800 text-white dark:bg-emerald-600'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                Modules ({filteredNavResults.length})
              </button>
              <button
                type="button"
                onClick={() => setCommandTab('districts')}
                className={`rounded-lg px-2.5 py-1 transition ${
                  commandTab === 'districts'
                    ? 'bg-forest-800 text-white dark:bg-emerald-600'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                Punjab Districts ({filteredDistricts.length})
              </button>
              <button
                type="button"
                onClick={() => setCommandTab('actions')}
                className={`rounded-lg px-2.5 py-1 transition ${
                  commandTab === 'actions'
                    ? 'bg-forest-800 text-white dark:bg-emerald-600'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                Quick Actions ({quickActions.length})
              </button>
            </div>

            <div className="max-h-84 overflow-y-auto p-2 space-y-3">
              {/* Modules Group */}
              {(commandTab === 'all' || commandTab === 'modules') && filteredNavResults.length > 0 && (
                <div>
                  <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Core Modules
                  </p>
                  {filteredNavResults.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.href}
                        type="button"
                        onClick={() => {
                          navigate(item.href)
                          setSearchOpen(false)
                        }}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-800 transition hover:bg-emerald-50 hover:text-emerald-900 dark:text-slate-200 dark:hover:bg-agri-darkCard"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          <span>{item.name}</span>
                        </div>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-agri-darkBorder dark:text-slate-400">
                          {item.category}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Punjab Districts Group */}
              {(commandTab === 'all' || commandTab === 'districts') && filteredDistricts.length > 0 && (
                <div>
                  <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Punjab Weather Districts (23 Regions)
                  </p>
                  <div className="grid grid-cols-2 gap-1 px-1">
                    {filteredDistricts.map((d) => (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() => {
                          setSelectedPunjabDistrict(d.key)
                          setSelectedRegion('Punjab')
                          navigate('/weather')
                          setSearchOpen(false)
                        }}
                        className="flex items-center justify-between rounded-xl p-2 text-left text-xs font-bold text-slate-800 transition hover:bg-emerald-50 hover:text-emerald-900 dark:text-slate-200 dark:hover:bg-agri-darkCard"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                          <span className="truncate">{d.name}</span>
                        </div>
                        <span className="text-[10px] font-normal text-slate-400 flex-shrink-0">
                          Inspect →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions Group */}
              {(commandTab === 'all' || commandTab === 'actions') && quickActions.length > 0 && (
                <div>
                  <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Quick Operations & Settings
                  </p>
                  {quickActions.map((act) => {
                    const Icon = act.icon
                    return (
                      <button
                        key={act.title}
                        type="button"
                        onClick={act.action}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-800 transition hover:bg-emerald-50 hover:text-emerald-900 dark:text-slate-200 dark:hover:bg-agri-darkCard"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          <div>
                            <div className="font-bold">{act.title}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{act.subtitle}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                          Execute ↵
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Empty state */}
              {filteredNavResults.length === 0 && filteredDistricts.length === 0 && quickActions.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400">
                  No matching modules, districts, or actions found for &ldquo;{searchQuery}&rdquo;.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

