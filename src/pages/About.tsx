import { PageContainer } from '../components/layout/PageContainer'

export function About() {
  return (
    <PageContainer className="py-12">
      <div className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">About</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">About Smart Crop AI</h1>
        <p className="mt-5 text-base leading-8 text-slate-600">
          Smart Crop AI is a frontend prototype designed to explore how digital tools can help farmers, students, and researchers consider crop suitability based on soil nutrients and environmental conditions. The goal is to make the concept clear and approachable before a connected machine-learning model, backend service, or agricultural data source is introduced.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Problem it aims to address</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Crop selection can be complex, especially when conditions vary across fields, seasons, and regions. A structured recommendation interface can help users reason about potential crop fit using soil and climate data in a clear, guided format.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Planned role of machine learning</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            A future model could learn patterns from historical agronomic data, field conditions, and crop behavior. This prototype demonstrates the interface and user flow without claiming a trained model is currently active.
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-sm">
        <h2 className="text-xl font-semibold">Prototype limitations</h2>
        <p className="mt-4 text-base leading-7">
          This frontend prototype does not yet contain a connected machine-learning model, live weather service, real field database, or real-time agricultural data source. It is intentionally limited to a polished front-end experience for product design and demonstration.
        </p>
      </div>
    </PageContainer>
  )
}
