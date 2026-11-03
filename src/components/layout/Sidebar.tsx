import {
  BarChart3,
  Calendar,
  CloudSun,
  FileText,
  FlaskConical,
  HelpCircle,
  LayoutDashboard,
  Leaf,
  ScanEye,
  Settings,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'

interface SidebarProps {
  onCloseMobile?: () => void
}

const mainNavConfig = [
  { key: 'nav.dashboard', defaultLabel: 'Dashboard', href: '/', icon: LayoutDashboard },
  { key: 'nav.diseaseDetection', defaultLabel: 'Disease Detection', href: '/disease-detection', icon: ScanEye, badge: 'AI' },
  { key: 'nav.weatherIntelligence', defaultLabel: 'Weather Intelligence', href: '/weather', icon: CloudSun },
  { key: 'nav.soilHealth', defaultLabel: 'Soil Health Analysis', href: '/soil-health', icon: FlaskConical },
  { key: 'nav.cropRecommendations', defaultLabel: 'Crop Recommendations', href: '/recommendations', icon: Sparkles },
  { key: 'nav.diseaseAnalytics', defaultLabel: 'Disease Analytics', href: '/analytics', icon: BarChart3 },
  { key: 'nav.farmingCalendar', defaultLabel: 'Farming Calendar', href: '/calendar', icon: Calendar },
  { key: 'nav.reports', defaultLabel: 'Reports & Export', href: '/reports', icon: FileText },
  { key: 'nav.settings', defaultLabel: 'Settings', href: '/settings', icon: Settings },
]

const secondaryNavConfig = [
  { key: 'nav.cropLibrary', defaultLabel: 'Crop Library (30+ Species)', href: '/explore', icon: Leaf },
  { key: 'nav.docs', defaultLabel: 'Agronomic Help & Docs', href: '/about', icon: HelpCircle },
]

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const { t } = useAppStore()
  return (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200/80 bg-white dark:border-agri-darkBorder dark:bg-agri-darkSurface">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5 dark:border-agri-darkBorder">
        <NavLink
          to="/"
          onClick={onCloseMobile}
          className="group flex items-center gap-3 transition-transform"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-forest-800 to-emerald-500 text-white shadow-md shadow-emerald-500/20 transition-all duration-300 group-hover:scale-105">
            <Leaf className="h-5 w-5 drop-shadow-sm" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-lime-500" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                Crop Doctor <span className="text-emerald-600 dark:text-emerald-400">AI</span>
              </p>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Smart Agri SaaS
            </p>
          </div>
        </NavLink>

        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-agri-darkCard lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4">
        <div className="mb-2 px-2.5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-400">
            {t('sidebar.platformModules')}
          </p>
        </div>
        <nav className="space-y-1">
          {mainNavConfig.map(({ key, defaultLabel, href, icon: Icon, badge }) => (
            <NavLink
              key={href}
              to={href}
              onClick={onCloseMobile}
              end={href === '/'}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-forest-800 text-white shadow-sm shadow-forest-900/30 dark:bg-emerald-600 dark:text-white'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-agri-darkCard dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4.5 w-4.5 transition-transform group-hover:scale-110 ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-400 group-hover:text-forest-800 dark:text-slate-400 dark:group-hover:text-emerald-400'
                      }`}
                    />
                    <span>{t(key) || defaultLabel}</span>
                  </div>
                  {badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                        isActive
                          ? 'bg-lime-400 text-slate-900'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Secondary Navigation */}
        <div className="mt-6 mb-2 px-2.5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-400">
            {t('sidebar.resources')}
          </p>
        </div>
        <nav className="space-y-1">
          {secondaryNavConfig.map(({ key, defaultLabel, href, icon: Icon }) => (
            <NavLink
              key={href}
              to={href}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-agri-darkCard dark:text-emerald-400'
                    : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-agri-darkCard dark:hover:text-white'
                }`
              }
            >
              <Icon className="h-4.5 w-4.5 text-slate-400 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-white" />
              <span>{t(key) || defaultLabel}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Farm Status Widget */}
      <div className="border-t border-slate-100 p-3.5 dark:border-agri-darkBorder">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3.5 dark:border-emerald-900/40 dark:bg-agri-darkCard">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-bold text-slate-900 dark:text-white">{t('sidebar.activeFarm')}</p>
            </div>
            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
              {t('sidebar.online')}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
            Ludhiana Central Plot · 120 Acres
          </p>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> {t('sidebar.healthyRatio')}
            </span>
            <span>{t('sidebar.soilScore')}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

