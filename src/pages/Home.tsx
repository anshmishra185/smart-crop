import {
  ArrowRight,
  CheckCircle2,
  CloudSun,
  Cpu,
  FlaskConical,
  Leaf,
  ScanEye,
  ShieldCheck,
  Sparkles,
  Sprout,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { HERO_IMAGE } from '../data/imageSources'
import { PageContainer } from '../components/layout/PageContainer'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { useAppStore } from '../store/useAppStore'

const features = [
  {
    icon: ScanEye,
    titleKey: 'nav.diseaseDetection',
    defaultTitle: 'Computer Vision Disease Detection',
    description:
      'Deep convolutional diagnostic networks (ResNet-50) deliver real-time pathology identification with Grad-CAM saliency heatmaps and commercial chemical prescriptions.',
    color: 'from-emerald-500 to-teal-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    iconColor: 'text-emerald-700 dark:text-emerald-400',
  },
  {
    icon: CloudSun,
    titleKey: 'nav.weatherIntelligence',
    defaultTitle: 'Agro-Climatic Weather Intelligence',
    description:
      'High-resolution micro-climate telemetry tracking hourly precipitation, wind velocity, and ambient humidity to compute precision spraying windows and disease risk alerts.',
    color: 'from-sky-500 to-blue-400',
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    iconColor: 'text-sky-700 dark:text-sky-400',
  },
  {
    icon: FlaskConical,
    titleKey: 'nav.soilHealth',
    defaultTitle: '10-Parameter Soil Health Telemetry',
    description:
      'Continuous monitoring of soil pH, available N-P-K reserves, electrical conductivity, volumetric moisture, and organic carbon with instant interactive simulator.',
    color: 'from-violet-500 to-purple-400',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    iconColor: 'text-violet-700 dark:text-violet-400',
  },
  {
    icon: Sparkles,
    titleKey: 'nav.cropRecommendations',
    defaultTitle: 'Smart Crop Recommendation Engine',
    description:
      'Multi-variate algorithmic matching pairing soil chemistry and regional seasonal weather against 30+ commercial Indian crop cultivars to maximize harvest yield.',
    color: 'from-amber-500 to-orange-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    iconColor: 'text-amber-700 dark:text-amber-400',
  },
]

const steps = [
  {
    icon: ScanEye,
    title: '1. Scan & Inspect Foliage',
    description: 'Capture or drag-and-drop leaf photography. The neural vision scanner segments lesions and flags early pathogens.',
    step: '01',
  },
  {
    icon: Cpu,
    title: '2. Multi-Variate Telemetry',
    description: 'Soil NPK sensors, micro-climate stations, and seasonal data are synthesized into actionable agronomic ratings.',
    step: '02',
  },
  {
    icon: TrendingUp,
    title: '3. Act with Precision',
    description: 'Deploy targeted chemical dosages, execute optimal spraying windows, and schedule tasks on the operations calendar.',
    step: '03',
  },
]

const stats = [
  { value: '30+', label: 'Cultivated Crop Species', icon: Leaf },
  { value: '98.4%', label: 'Diagnostic Benchmark', icon: ShieldCheck },
  { value: '10', label: 'Soil Health Telemetry Metrics', icon: FlaskConical },
  { value: '< 1s', label: 'Inference Latency', icon: Zap },
]

export function Home() {
  const { t } = useAppStore()

  return (
    <div className="overflow-x-hidden pb-20">
      {/* Hero Section */}
      <section className="relative bg-hero-gradient py-16 sm:py-24 dark:bg-none">
        <PageContainer className="relative grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          {/* Left Text */}
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-ring" />
              {t('dashboard.badge')}
            </span>

            <h1 className="mt-6 max-w-xl text-4xl font-black leading-[1.15] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] dark:text-white">
              Cultivate Smarter with{' '}
              <span className="bg-gradient-to-r from-forest-800 via-emerald-600 to-lime-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-lime-300">
                Crop Doctor AI
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
              {t('dashboard.subtitle')}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/">
                <Button size="lg" className="group gap-2 rounded-2xl bg-forest-800 px-7 shadow-lg shadow-forest-900/25 transition-all hover:bg-forest-900 active:scale-95 dark:bg-emerald-600 dark:hover:bg-emerald-500">
                  {t('nav.dashboard')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/disease-detection">
                <Button variant="outline" size="lg" className="gap-2 rounded-2xl border-slate-200 bg-white px-7 transition-all active:scale-95 dark:border-agri-darkBorder dark:bg-agri-darkSurface dark:text-white">
                  <ScanEye className="h-4 w-4 text-emerald-600" />
                  {t('nav.diseaseDetection')}
                </Button>
              </Link>
            </div>

            {/* Micro Badges */}
            <div className="mt-10 flex flex-wrap items-center gap-5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> Commercial Farm Telemetry
              </span>
              <span className="flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-emerald-600" /> ResNet-50 AI Engine
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 10-Parameter Soil Matrix
              </span>
            </div>
          </div>

          {/* Right: High-Res Real Farm Photography Card */}
          <div className="relative flex items-center justify-center">
            {/* Glow blobs */}
            <div className="absolute -left-8 top-12 h-44 w-44 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="absolute -right-8 bottom-12 h-44 w-44 rounded-full bg-teal-400/20 blur-3xl" />

            <div className="relative w-full overflow-hidden rounded-4xl border border-slate-200/90 bg-white p-3 shadow-2xl dark:border-agri-darkBorder dark:bg-agri-darkSurface">
              <div className="relative overflow-hidden rounded-3xl">
                <img
                  src={HERO_IMAGE.src}
                  alt={HERO_IMAGE.alt}
                  className="h-[430px] w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                {/* Overlay Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Field Telemetry: Active
                </div>

                {/* Bottom Overlay Card */}
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-white/90 p-4 shadow-xl backdrop-blur-md dark:border-agri-darkBorder dark:bg-agri-darkSurface/90">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Primary Estate Sector
                      </p>
                      <p className="text-base font-black text-slate-900 dark:text-white">
                        Ludhiana Central Agricultural Hub
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-extrabold text-white shadow-sm">
                      76.6% Certified Healthy
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                    <div className="rounded-xl bg-slate-50 p-2 dark:bg-agri-darkCard">
                      <p className="text-[10px] text-slate-400 font-bold">Soil N</p>
                      <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">112 kg/ha</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2 dark:bg-agri-darkCard">
                      <p className="text-[10px] text-slate-400 font-bold">Soil pH</p>
                      <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">6.8 (Neutral)</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2 dark:bg-agri-darkCard">
                      <p className="text-[10px] text-slate-400 font-bold">Temp</p>
                      <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">24°C</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2 dark:bg-agri-darkCard">
                      <p className="text-[10px] text-slate-400 font-bold">Rainfall Prob</p>
                      <p className="text-xs font-extrabold text-emerald-600">15% (Dry)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* KPI Stats Strip */}
      <section className="border-y border-slate-100 bg-white py-10 dark:border-agri-darkBorder dark:bg-agri-darkSurface">
        <PageContainer>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 shadow-sm">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{value}</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Core Platform Capabilities Grid */}
      <section id="features" className="py-20">
        <PageContainer>
          <div className="mb-14 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-400">
              End-to-End Precision Agriculture
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl dark:text-white">
              Industrial Architecture Built for Crop Health
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every system is engineered to provide actionable field intelligence, minimizing crop loss and optimizing chemical expenditures.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map(({ icon: Icon, titleKey, defaultTitle, description, bg, iconColor }) => (
              <Card
                key={defaultTitle}
                className="group h-full border-slate-200/90 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-300 hover:shadow-card-hover dark:border-agri-darkBorder dark:bg-agri-darkSurface"
              >
                <CardHeader>
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${bg} ${iconColor} transition-transform group-hover:scale-110`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white">
                    {t(titleKey) || defaultTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* How it Works / 3-Step Workflow */}
      <section className="bg-slate-900 py-20 text-white dark:bg-agri-darkCard">
        <PageContainer>
          <div className="mb-14 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
              Operational Workflow
            </p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              From Leaf Imagery to Agronomic Prescription
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, description, step }) => (
              <div
                key={step}
                className="relative flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-850 p-7 dark:border-slate-800 transition hover:border-emerald-500/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-extrabold">{title}</h3>
                <p className="text-xs leading-relaxed text-slate-400">{description}</p>
                <span className="absolute right-6 top-6 text-3xl font-black text-slate-800 dark:text-slate-700">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16">
        <PageContainer>
          <div className="relative overflow-hidden rounded-4xl bg-gradient-to-r from-forest-900 via-forest-800 to-emerald-700 p-8 text-center text-white shadow-2xl sm:p-14">
            <Sprout className="mx-auto mb-4 h-12 w-12 text-emerald-300" />
            <h2 className="text-2xl font-black sm:text-3xl">
              Experience the Crop Doctor AI Platform
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Explore live simulated disease diagnostics, weather advisories, soil health gauges, and interactive charts right in your browser.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/">
                <Button size="lg" className="rounded-2xl bg-lime-400 px-8 font-extrabold text-slate-900 shadow-md hover:bg-lime-300 active:scale-95">
                  Launch Platform Dashboard
                </Button>
              </Link>
              <Link to="/explore">
                <Button size="lg" variant="outline" className="rounded-2xl border-white/30 bg-white/10 px-8 font-bold text-white backdrop-blur-md hover:bg-white/20 active:scale-95">
                  Browse 30+ Crops Library
                </Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>
    </div>
  )
}
