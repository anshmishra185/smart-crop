import { ArrowRight, BarChart3, CloudSun, Leaf, Sprout, SunMedium } from 'lucide-react'
import { Link } from 'react-router-dom'

import farmFieldImage from '../assets/farm-field.svg'
import { PageContainer } from '../components/layout/PageContainer'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const features = [
  {
    icon: Leaf,
    title: 'Soil nutrient analysis',
    description: 'Explore how essential nutrient levels can guide crop fit and inform early planning decisions.',
  },
  {
    icon: CloudSun,
    title: 'Climate-aware crop selection',
    description: 'Review soil and weather conditions through a clear, structured prototype dashboard.',
  },
  {
    icon: BarChart3,
    title: 'Data-driven agricultural insights',
    description: 'Understand how a future AI system could compare crop candidates using field observations.',
  },
  {
    icon: SunMedium,
    title: 'Sustainable farming support',
    description: 'Support a more informed, responsible approach to crop planning and field optimization.',
  },
]

const steps = [
  'Enter soil and climate values into the dashboard form.',
  'Compare crop options with clearly labeled demo outputs.',
  'Review crop insights and continue refining agricultural scenarios.',
]

export function Home() {
  return (
    <div className="pb-16">
      <section className="bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_rgba(255,255,255,0)_42%)] py-16 sm:py-20">
        <PageContainer className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Precision agriculture prototype
            </span>
            <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Grow Smarter with AI-Powered Crop Recommendations
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Explore how soil nutrients and environmental conditions can help identify suitable crop options for future agricultural planning.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/dashboard">
                <Button size="lg">Explore Crop Recommendation</Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg">
                  Explore Features
                </Button>
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-10 h-28 w-28 rounded-full bg-emerald-200/60 blur-2xl" />
            <div className="absolute -right-6 bottom-10 h-28 w-28 rounded-full bg-amber-200/60 blur-2xl" />
            <img
              src={farmFieldImage}
              alt="Agricultural field with crop rows"
              className="relative h-[480px] w-full rounded-[2rem] object-cover shadow-[0_30px_90px_rgba(15,23,42,0.15)]"
            />
          </div>
        </PageContainer>
      </section>

      <section id="features" className="py-16">
        <PageContainer>
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Why it matters</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">A better view of crop planning</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="h-full border-slate-200 bg-white">
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-slate-600">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageContainer>
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <PageContainer>
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold">A simple front-end workflow</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-semibold text-emerald-300">
                  {index + 1}
                </div>
                <p className="text-base leading-7 text-slate-200">{step}</p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      <section className="py-16">
        <PageContainer className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Dashboard preview</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">A structured recommendation experience</h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">
              This prototype focuses on a clean UI, accessible form controls, and sample visualizations that are easy to evolve when a real model or backend becomes available.
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm text-slate-600">
              <Sprout className="h-4 w-4 text-emerald-700" />
              Educational demo only — not a connected prediction service.
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Prediction summary</p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-900">Rice</h3>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
                  86% demo confidence
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Nitrogen</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">80</p>
                </div>
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Rainfall</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">190 mm</p>
                </div>
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Temperature</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">28°C</p>
                </div>
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Humidity</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">72%</p>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      <section className="bg-emerald-50 py-16">
        <PageContainer>
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Educational disclaimer</p>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
              Crop suitability depends on local agricultural conditions, field management practices, seasonal variation, and regional agronomic factors. This frontend prototype is intended to illustrate product design and interaction patterns, not to provide real agronomic recommendations.
            </p>
          </div>
        </PageContainer>
      </section>

      <section className="py-10">
        <PageContainer className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-lg text-slate-700">Ready to review the recommendation workflow?</p>
          <Link to="/dashboard">
            <Button className="gap-2">
              Go to dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </PageContainer>
      </section>
    </div>
  )
}
