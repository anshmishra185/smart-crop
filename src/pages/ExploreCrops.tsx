import { PageContainer } from '../components/layout/PageContainer'
import { CropSearch } from '../components/crop/CropSearch'

export function ExploreCrops() {
  return (
    <PageContainer className="py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Explore crops</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Discover crop profiles</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          Browse a curated set of sample crop profiles and learn how environmental suitability is presented in this frontend prototype.
        </p>
      </div>

      <CropSearch />
    </PageContainer>
  )
}
