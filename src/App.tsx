import { Suspense, lazy } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppShell } from './components/layout/AppShell'

// Lazy-loaded pages for fast initial bundle loading
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
)
const DiseaseDetectionPage = lazy(() =>
  import('./pages/DiseaseDetectionPage').then((m) => ({ default: m.DiseaseDetectionPage }))
)
const WeatherIntelligencePage = lazy(() =>
  import('./pages/WeatherIntelligencePage').then((m) => ({ default: m.WeatherIntelligencePage }))
)
const SoilHealthPage = lazy(() =>
  import('./pages/SoilHealthPage').then((m) => ({ default: m.SoilHealthPage }))
)
const RecommendationsPage = lazy(() =>
  import('./pages/RecommendationsPage').then((m) => ({ default: m.RecommendationsPage }))
)
const AnalyticsPage = lazy(() =>
  import('./pages/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage }))
)
const CalendarPage = lazy(() =>
  import('./pages/CalendarPage').then((m) => ({ default: m.CalendarPage }))
)
const ReportsPage = lazy(() =>
  import('./pages/ReportsPage').then((m) => ({ default: m.ReportsPage }))
)
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
)
const ExploreCrops = lazy(() =>
  import('./pages/ExploreCrops').then((m) => ({ default: m.ExploreCrops }))
)
const About = lazy(() =>
  import('./pages/About').then((m) => ({ default: m.About }))
)

function PageLoader() {
  return (
    <div className="flex h-96 w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-200 border-t-forest-800 dark:border-emerald-900 dark:border-t-emerald-400" />
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 animate-pulse">
          Loading Agronomic Intelligence Module...
        </p>
      </div>
    </div>
  )
}

function App() {
  return (
    <HashRouter>
      <AppShell>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Primary Agronomic Dashboard at Root */}
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />

            {/* Core Modules */}
            <Route path="/disease-detection" element={<DiseaseDetectionPage />} />
            <Route path="/weather" element={<WeatherIntelligencePage />} />
            <Route path="/soil-health" element={<SoilHealthPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />

            {/* Additional Knowledge Pages */}
            <Route path="/explore" element={<ExploreCrops />} />
            <Route path="/about" element={<About />} />

            {/* Catch-all redirect to root dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AppShell>
      <Toaster position="top-right" richColors />
    </HashRouter>
  )
}

export default App
