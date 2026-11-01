import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CloudSun,
  Cpu,
  FlaskConical,
  Leaf,
  ShieldCheck,
  Sprout,
  SunMedium,
  Thermometer,
  Droplets,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import farmFieldImage from '../assets/farm-field.svg'
import { PageContainer } from '../components/layout/PageContainer'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const features = [
  {
    icon: Leaf,
    title: 'Soil nutrient analysis',
    description:
      'Analyse N–P–K ratios alongside micro-nutrients to match the right crop to your exact field conditions.',
    color: 'from-emerald-500 to-teal-400',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-700',
  },
  {
    icon: CloudSun,
    title: 'Climate-aware selection',
    description:
      'Cross-reference real rainfall, humidity, and temperature profiles with crop climate requirements.',
    color: 'from-sky-500 to-blue-400',
    bg: 'bg-sky-50',
    iconColor: 'text-sky-700',
  },
  {
    icon: BarChart3,
    title: 'Data-driven insights',
    description:
      'Visualise candidate crop scores through an interactive dashboard powered by structured field data.',
    color: 'from-violet-500 to-purple-400',
    bg: 'bg-violet-50',
    iconColor: 'text-violet-700',
  },
  {
    icon: SunMedium,
    title: 'Sustainable farming',
    description:
      'Align crop choices with soil health, water efficiency, and long-term field productivity goals.',
    color: 'from-amber-500 to-orange-400',
    bg: 'bg-amber-50',
    iconColor: 'text-amber-700',
  },
]

const steps = [
  {
    icon: FlaskConical,
    title: 'Input field data',
    description: 'Enter soil nutrient levels, pH values, and local climate measurements into the structured form.',
    step: '01',
  },
  {
    icon: Cpu,
    title: 'AI scoring engine',
    description: 'The system evaluates each crop candidate against your submitted conditions using a confidence model.',
    step: '02',
  },
  {
    icon: TrendingUp,
    title: 'Review & refine',
    description: 'Explore ranked crop recommendations with score breakdowns, alternatives, and soil charts.',
    step: '03',
  },
]

const stats = [
  { value: '22+', label: 'Crop varieties', icon: Leaf },
  { value: '7', label: 'Input parameters', icon: FlaskConical },
  { value: '86%', label: 'Demo confidence', icon: TrendingUp },
  { value: '< 1s', label: 'Result latency', icon: Zap },
]

const highlights = [
  'Real-time soil condition visualisation',
  'Multi-crop confidence scoring',
  'Interactive filterable crop library',
  'Responsive & accessible design',
  'Demo-ready without a backend',
  'Built with React + TypeScript',
]

export function Home() {
  return (
    <div className="overflow-x-hidden pb-20">
      {/* ── Hero ── */}
      <section className="relative bg-hero-gradient py-20 sm:py-28">
        {/* Dot grid decoration */}
        <div
          className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-[0.03]"
          style={{ backgroundSize: '24px 24px' }}
        />

        <PageContainer className="relative grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          {/* Left copy */}
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-ring" />
              Precision agriculture prototype
            </span>

            <h1 className="mt-6 max-w-xl text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]">
              Grow Smarter with{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                AI-Powered
              </span>{' '}
              Crop Recommendations
            </h1>

            <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">
              Harness soil nutrients and environmental data to identify optimal crop candidates —
              before a single seed is planted.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/dashboard">
                <Button size="lg" className="group gap-2 rounded-full px-7 shadow-md transition-all hover:shadow-glow-emerald active:scale-95">
                  Get a Recommendation
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="rounded-full px-7 transition-all active:scale-95">
                  See Features
                </Button>
              </a>
            </div>

            {/* Micro-trust badges */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              {[
                { icon: ShieldCheck, label: 'No signup required' },
                { icon: Cpu, label: 'ML-ready architecture' },
                { icon: CheckCircle2, label: 'Open-source stack' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Icon className="h-4 w-4 text-emerald-500" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Right — floating hero card */}
          <div className="relative flex items-center justify-center animate-float">
            {/* Glow blobs */}
            <div className="absolute -left-8 top-12 h-36 w-36 rounded-full bg-emerald-300/25 blur-3xl" />
            <div className="absolute -right-8 bottom-12 h-36 w-36 rounded-full bg-teal-300/25 blur-3xl" />

            <div className="relative w-full overflow-hidden rounded-4xl shadow-[0_32px_100px_rgba(15,23,42,0.18)]">
              <img
                src={farmFieldImage}
                alt="Agricultural field with crop rows"
                className="h-[440px] w-full object-cover"
              />
              {/* Overlay card */}
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/30 bg-white/80 p-4 shadow-lg backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Top recommendation
                    </p>
                    <p className="mt-1 text-xl font-bold text-slate-900">Rice</p>
                  </div>
                  <span className="rounded-full bg-emerald-500 px-3 py-1 text-sm font-bold text-white shadow-sm">
                    86% match
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {[
                    { icon: Leaf, label: 'N', value: '80' },
                    { icon: Thermometer, label: '°C', value: '28' },
                    { icon: Droplets, label: 'mm', value: '190' },
                    { icon: FlaskConical, label: 'pH', value: '6.5' },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl bg-slate-50 px-2 py-2 text-center">
                      <p className="text-[10px] text-slate-400">{label}</p>
                      <p className="mt-0.5 text-sm font-bold text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* ── Stats strip ── */}
      <section className="border-y border-slate-100 bg-white py-10">
        <PageContainer>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
                <p className="text-sm text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20">
        <PageContainer>
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
              Why it matters
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              A better view of crop planning
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Every feature is designed to turn raw field data into actionable agricultural intelligence.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map(({ icon: Icon, title, description, bg, iconColor }, i) => (
              <Card
                key={title}
                className="group h-full border-slate-200/80 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <CardHeader>
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${bg} ${iconColor} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base font-semibold text-slate-900">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-slate-600">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* ── How it works ── */}
      <section className="bg-slate-900 py-20">
        <PageContainer>
          <div className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-400">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Three steps to your recommendation
            </h2>
          </div>

          <div className="relative grid gap-6 md:grid-cols-3">
            {/* Connector line (desktop) */}
            <div className="absolute left-1/6 right-1/6 top-10 hidden h-px border-t border-dashed border-slate-600 md:block" />

            {steps.map(({ icon: Icon, title, description, step }, i) => (
              <div
                key={step}
                className="group relative flex flex-col gap-5 rounded-3xl border border-slate-700/80 bg-slate-800/60 p-7 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/40 hover:bg-slate-800"
              >
                {/* Step number */}
                <div className="absolute right-5 top-5 text-[2.5rem] font-black leading-none text-slate-700/50 transition-colors group-hover:text-emerald-500/20">
                  {step}
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30 transition-all group-hover:bg-emerald-500/25">
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-400">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* ── Dashboard Preview ── */}
      <section className="py-20">
        <PageContainer className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
              Dashboard preview
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              A structured recommendation experience
            </h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">
              A clean, accessible form collects soil and climate inputs. Results are displayed with confidence
              scores, alternative crops, and a visual soil conditions chart — all in one responsive view.
            </p>

            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>

            <Link to="/dashboard" className="mt-8 inline-block">
              <Button className="group gap-2 rounded-full px-6 shadow-md transition-all hover:shadow-glow-emerald active:scale-95">
                Open Dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Mock dashboard widget */}
          <div className="rounded-4xl border border-slate-200 bg-white p-5 shadow-card-hover">
            <div className="rounded-3xl bg-slate-50 p-5">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Prediction summary
                  </p>
                  <h3 className="mt-1.5 text-2xl font-extrabold text-slate-900">Rice</h3>
                </div>
                <span className="flex-shrink-0 rounded-full bg-emerald-500 px-3 py-1 text-sm font-bold text-white shadow-sm">
                  86% confidence
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span>Suitability score</span>
                  <span className="font-semibold text-emerald-700">86 / 100</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm"
                    style={{ width: '86%' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: 'Nitrogen', value: '80', unit: 'mg/kg' },
                  { label: 'Rainfall', value: '190', unit: 'mm' },
                  { label: 'Temp.', value: '28°C', unit: '' },
                  { label: 'Humidity', value: '72%', unit: '' },
                ].map(({ label, value, unit }) => (
                  <div key={label} className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
                    <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">{label}</p>
                    <p className="mt-1.5 text-base font-bold text-slate-900">{value}</p>
                    {unit && <p className="text-[10px] text-slate-400">{unit}</p>}
                  </div>
                ))}
              </div>

              {/* Alternative crops */}
              <div className="mt-4 space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Alternatives</p>
                {[
                  { name: 'Maize', score: 74 },
                  { name: 'Soybean', score: 68 },
                ].map(({ name, score }) => (
                  <div key={name} className="flex items-center gap-3">
                    <span className="w-16 text-xs font-medium text-slate-600">{name}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-slate-200">
                      <div
                        className="h-1.5 rounded-full bg-slate-400"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs text-slate-500">{score}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* ── Disclaimer ── */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-10">
        <PageContainer>
          <div className="flex flex-col items-start gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:flex-row sm:items-center sm:p-8">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Educational prototype</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                This application demonstrates how a precision-agriculture AI interface could be structured.
                Outputs are illustrative demo values — not live agronomic recommendations.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-14">
        <PageContainer>
          <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 px-8 py-12 text-center shadow-[0_20px_60px_rgba(16,185,129,0.35)] sm:px-14">
            {/* Decorative circles */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

            <Sprout className="mx-auto mb-5 h-10 w-10 text-white/80" />
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Ready to explore crop recommendations?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-emerald-50">
              Input your soil and climate data, and review a full AI-powered recommendation — no account needed.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="group gap-2 rounded-full border-0 bg-white px-8 text-emerald-700 shadow-lg hover:bg-emerald-50 active:scale-95"
                >
                  Open Dashboard
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/explore">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/40 bg-white/10 px-8 text-white backdrop-blur-sm hover:bg-white/20 active:scale-95"
                >
                  Browse Crop Library
                </Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>
    </div>
  )
}
