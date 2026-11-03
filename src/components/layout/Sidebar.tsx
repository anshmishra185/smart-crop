import { NavLink } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import { AnimatedBrandLogo } from '../common/AnimatedBrandLogo'
import { ModuleAnimatedLogo, type AgriModuleKey } from '../common/ModuleAnimatedLogo'
import {
  HelpCircle,
  Leaf,
  Compass,
  X,
  ShieldCheck
} from 'lucide-react'

interface SidebarProps {
  onCloseMobile?: () => void
}

interface NavItem {
  key: string
  defaultLabel: string
  href: string
  moduleKey: AgriModuleKey
  badge?: string
}

const mainNavConfig: NavItem[] = [
  { key: 'nav.dashboard', defaultLabel: 'Dashboard', href: '/', moduleKey: 'dashboard' },
  { key: 'nav.diseaseDetection', defaultLabel: 'Disease Detection', href: '/disease-detection', moduleKey: 'disease-detection', badge: 'AI' },
  { key: 'nav.weatherIntelligence', defaultLabel: 'Weather Intelligence', href: '/weather', moduleKey: 'weather' },
  { key: 'nav.soilHealth', defaultLabel: 'Soil Health Analysis', href: '/soil-health', moduleKey: 'soil-health' },
  { key: 'nav.cropRecommendations', defaultLabel: 'Crop Recommendations', href: '/recommendations', moduleKey: 'recommendations' },
  { key: 'nav.diseaseAnalytics', defaultLabel: 'Disease Analytics', href: '/analytics', moduleKey: 'analytics' },
  { key: 'nav.farmingCalendar', defaultLabel: 'Farming Calendar', href: '/calendar', moduleKey: 'calendar' },
  { key: 'nav.schemes', defaultLabel: 'Schemes & Masterclass', href: '/schemes', moduleKey: 'schemes', badge: 'DBT' },
  { key: 'nav.marketplace', defaultLabel: 'Mandi Marketplace', href: '/marketplace', moduleKey: 'marketplace', badge: 'Mandi' },
  { key: 'nav.reports', defaultLabel: 'Reports & Export', href: '/reports', moduleKey: 'reports' },
  { key: 'nav.settings', defaultLabel: 'Settings', href: '/settings', moduleKey: 'settings' },
]

const secondaryNavConfig = [
  { key: 'nav.welcomeLanding', defaultLabel: 'Enterprise Landing Page', href: '/landing', icon: Compass },
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
          to="/landing"
          onClick={onCloseMobile}
          className="group flex items-center transition-transform"
        >
          <AnimatedBrandLogo size="sm" showText={true} />
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
          {mainNavConfig.map(({ key, defaultLabel, href, moduleKey, badge }) => (
            <NavLink
              key={href}
              to={href}
              onClick={onCloseMobile}
              end={href === '/'}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-xl px-2.5 py-1.5 text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-forest-800 text-white shadow-sm shadow-forest-900/30 dark:bg-emerald-600 dark:text-white'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-agri-darkCard dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5">
                    <div className="shrink-0 transition-transform group-hover:scale-105">
                      <ModuleAnimatedLogo
                        module={moduleKey}
                        size="sm"
                        showTelemetryBeacon={isActive}
                      />
                    </div>
                    <span className="truncate">{t(key) || defaultLabel}</span>
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

