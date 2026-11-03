import { AlertTriangle, Cpu, Database, ExternalLink, Leaf, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { PageContainer } from '../components/layout/PageContainer'
import { Button } from '../components/ui/button'

const teamValues = [
  {
    icon: Leaf,
    title: 'Agronomic relevance',
    description:
      'Every feature is grounded in real-world crop science — N–P–K analysis, pH thresholds, and climate tolerance ranges.',
  },
  {
    icon: Cpu,
    title: 'ML-ready architecture',
    description:
      'The frontend is designed to slot in a trained classification model without structural changes to the UI layer.',
  },
  {
    icon: Users,
    title: 'Farmer-centred UX',
    description:
      'Forms, outputs, and visualisations are optimised for quick comprehension, even for non-technical users.',
  },
  {
    icon: Database,
    title: 'Extensible data model',
    description:
      'Crop profiles and scoring schemas are cleanly separated, making it easy to expand the dataset or swap backends.',
  },
]

export function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
      {/* Hero */}
      <div className="border-b border-slate-100 bg-white py-10 shadow-sm">
        <PageContainer>
          <div className="animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-600">About</p>
            <h1 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              About Smart Crop AI
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              Smart Crop AI is a precision-agriculture interface prototype that demonstrates how AI and
              soil science can work together to help farmers, students, and researchers make informed
              crop selection decisions — before a live model is ever connected.
            </p>
          </div>
        </PageContainer>
      </div>

      <PageContainer className="pt-10 space-y-10">
        {/* Problem + ML sections */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-4xl border border-slate-200 bg-white p-7 shadow-card">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Leaf className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">Problem it addresses</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Crop selection is complex. Field conditions vary across parcels, seasons, and regions.
              Soil lab reports are often hard to interpret. This platform structures that complexity
              into a guided, data-driven recommendation workflow that any agronomist or farmer can follow.
            </p>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-7 shadow-card">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
              <Cpu className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">Role of machine learning</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              A future classification model trained on historical agronomic datasets (crop yield,
              soil profiles, weather records) will replace the demo scoring layer. The UI, validation
              rules, and chart components are already designed to accept live model outputs with zero
              structural change.
            </p>
          </div>
        </div>

        {/* Values grid */}
        <div>
          <h2 className="mb-6 text-xl font-extrabold text-slate-900">Design principles</h2>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {teamValues.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200/60 hover:shadow-card-hover"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="rounded-4xl border border-slate-200 bg-white p-7 shadow-card">
          <h2 className="mb-5 text-lg font-extrabold text-slate-900">Technology stack</h2>
          <div className="flex flex-wrap gap-2">
            {[
              'React 18',
              'TypeScript',
              'Tailwind CSS',
              'Vite',
              'Recharts',
              'React Router',
              'Supabase Auth',
              'class-variance-authority',
              'Lucide Icons',
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-4 rounded-4xl border border-amber-200 bg-amber-50 p-7 shadow-sm">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-amber-900">Prototype limitations</h2>
            <p className="mt-2 text-sm leading-7 text-amber-800">
              This application does not yet connect to a trained ML model, live weather API, real-time
              field database, or agronomic data source. All confidence scores and recommendations shown
              are illustrative demo values intended for interface demonstration only.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center">
          <Link to="/">
            <Button className="gap-2 rounded-full px-7 shadow-md transition-all hover:shadow-glow-emerald active:scale-95">
              Launch Farm Dashboard
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/explore">
            <Button variant="outline" className="gap-2 rounded-full px-7 transition-all active:scale-95">
              <Leaf className="h-4 w-4" />
              Browse crops
            </Button>
          </Link>
        </div>
      </PageContainer>
    </div>
  )
}
