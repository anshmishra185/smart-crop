import { Leaf, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

import { PageContainer } from '../components/layout/PageContainer'
import { CropSearch } from '../components/crop/CropSearch'
import { Button } from '../components/ui/button'
import { useAppStore } from '../store/useAppStore'

export function ExploreCrops() {
  const { t } = useAppStore()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20 dark:from-agri-darkBg dark:to-agri-darkSurface">
      {/* Page hero */}
      <div className="border-b border-slate-100 bg-white py-10 shadow-sm dark:border-agri-darkBorder dark:bg-agri-darkSurface">
        <PageContainer>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="animate-fade-up">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white shadow-md">
                  <Search className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-600 dark:text-emerald-400">
                  {t('explore.badge')}
                </p>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {t('explore.title')}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                {t('explore.subtitle')}
              </p>
            </div>

            <Link to="/recommendations">
              <Button className="flex-shrink-0 gap-2 rounded-full px-6 shadow-md transition-all hover:shadow-glow-emerald active:scale-95">
                <Leaf className="h-4 w-4" />
                {t('nav.cropRecommendations')}
              </Button>
            </Link>
          </div>
        </PageContainer>
      </div>

      <PageContainer className="pt-8">
        <CropSearch />
      </PageContainer>
    </div>
  )
}

