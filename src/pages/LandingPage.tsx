import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Leaf,
  Play,
  Languages,
  Sun,
  Moon,
  Coins,
  ChevronRight,
  Sparkles,
  Zap,
  Activity,
  Radio,
  ScanEye,
  Tractor,
  Wifi,
  Eye,
  X,
  GraduationCap,
  Landmark
} from 'lucide-react'
import { AnimatedBrandLogo } from '../components/common/AnimatedBrandLogo'
import { ModuleAnimatedLogo, type AgriModuleKey } from '../components/common/ModuleAnimatedLogo'
import { useAppStore } from '../store/useAppStore'
import { supportedLanguages } from '../lib/translations'

const ALL_MODULES_LIST: { key: AgriModuleKey; name: string; tag: string; desc: string; route: string }[] = [
  { key: 'dashboard', name: 'Operations Command Center', tag: 'RTK GIS Cadastre & UAV', desc: 'Centralized 4-sector estate GIS map, real-time drone passes, and IoT telemetry.', route: '/' },
  { key: 'disease-detection', name: 'Disease Detection Scanner', tag: 'ResNet-50 Optical AI', desc: 'Real-time leaf scanner diagnosing 120+ foliar crop diseases with CIB&RC recipes.', route: '/disease-detection' },
  { key: 'weather', name: 'Weather Intelligence', tag: 'Doppler Radar & Delta-T', desc: 'Real-time micro-climate weather forecasting with foliar spray drift gating.', route: '/weather' },
  { key: 'soil-health', name: 'Soil Health Studio', tag: 'Chemosensory NPK & VRA', desc: 'Multi-axis fertility radar comparing NPK, pH buffering, and variable-rate fertilizer grids.', route: '/soil-health' },
  { key: 'recommendations', name: 'Crop Recommendation', tag: 'MCDA Suitability & Gross Margin', desc: 'Weighted decision matrix projecting net profit (₹/Acre) and legume nitrogen rotation.', route: '/recommendations' },
  { key: 'analytics', name: 'Disease Analytics', tag: 'SEIR Micro-Climate Spore Model', desc: 'Epidemiological spore pressure index tracking pathogen basic reproduction rate R0.', route: '/analytics' },
  { key: 'calendar', name: 'Farming Calendar', tag: 'BBCH Phenology Chronometer', desc: 'Interactive 30-day phenological schedule with Delta-T spray windows and REI/PHI countdown.', route: '/calendar' },
  { key: 'reports', name: 'Reports & Interoperability', tag: 'ISO-XML, APEDA & PMFBY', desc: 'ISO 11783 prescription task exporter, APEDA export certificate, and PMFBY claim dossier.', route: '/reports' },
  { key: 'settings', name: 'Settings & Farm Hub', tag: 'LoRaWAN IoT & Security Key', desc: 'Cadastral base station geodetics, hardware sensor mesh, and digital signing keys.', route: '/settings' },
  { key: 'schemes', name: 'Punjab Schemes & Masterclass', tag: 'Govt DBT & Video Masterclasses', desc: 'Direct DBT ₹1,500/ac DSR, 50-80% CRM machinery subsidy, PMFBY, and PAU video masterclasses.', route: '/schemes' },
  { key: 'marketplace', name: 'Mandi Marketplace & Escrow', tag: 'Crop Trade & Razorpay/COD', desc: 'Direct farmer-to-buyer crop exchange with APMC e-NAM live rates, Razorpay escrow, and COD weighbridge settlement.', route: '/marketplace' },
]

const MANDI_TICKERS = [
  { crop: 'Basmati 1121 Paddy', mandi: 'Khanna Mandi, PB', price: '₹3,850', change: '+1.4%', state: 'up' },
  { crop: 'HD-3086 Wheat (Kanak)', mandi: 'Ludhiana Central', price: '₹2,275', change: '+0.8%', state: 'up' },
  { crop: 'Bt Cotton (Medium Staple)', mandi: 'Bathinda APMC', price: '₹6,920', change: '+2.1%', state: 'up' },
  { crop: 'Mustard / Raya (PBR-357)', mandi: 'Fazilka Yard', price: '₹5,440', change: '-0.4%', state: 'down' },
  { crop: 'Sharbati Paddy', mandi: 'Patiala Grain Market', price: '₹2,420', change: '+0.6%', state: 'up' },
  { crop: 'Moong (Green Gram Summer)', mandi: 'Jalandhar APMC', price: '₹8,450', change: '+1.9%', state: 'up' },
]

const TRUST_PARTNERS = [
  'ICAR-ATARI Zone 1 (Ludhiana)',
  'Punjab Agricultural University (PAU)',
  'Ministry of Agriculture & Farmers Welfare',
  'APEDA Agri-Exchange',
  'ISO 11783 ISOBUS Consortium',
  'PMFBY Crop Insurance Framework',
  'ESA Copernicus Sentinel-2 Hub',
  'GlobalGAP Certified Phytosanitary Standards',
]

export function LandingPage() {
  const navigate = useNavigate()
  const { theme, toggleTheme, language, setLanguage } = useAppStore()

  // Interactive Layer Switcher
  const [activeLayer, setActiveLayer] = useState<'aerial' | 'ndvi' | 'npk'>('ndvi')
  const [selectedParcel, setSelectedParcel] = useState<string>('Sector B2 - HD-3086 Wheat')

  // 9 Module Logo Gallery Modal
  const [showLogoGallery, setShowLogoGallery] = useState(false)

  // Interactive Farm ROI Savings Slider
  const [acres, setAcres] = useState<number>(30)

  // Dynamic calculations for savings
  const annualFertilizerSavedInr = Math.round(acres * 3850)
  const dieselPumpingSavedInr = Math.round(acres * 2400)
  const totalFinancialBenefitInr = annualFertilizerSavedInr + dieselPumpingSavedInr + Math.round(acres * 8200)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-agri-darkBg dark:text-slate-100 overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      {/* 1. 21st.dev Sticky Frosted Glassmorphism Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-[#09130D]/80 border-b border-slate-200/80 dark:border-agri-darkBorder transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo with 21st.dev glowing animation */}
          <Link to="/landing" className="flex items-center gap-3 group">
            <AnimatedBrandLogo size="md" showText={true} />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
            <a href="#hero" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Quantum Engine</a>
            <a href="#bento" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Bento Grid</a>
            <a href="#recon" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Drone Cadastre</a>
            <a href="#roi" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Savings ROI</a>
            <a href="#mandi" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">APMC Mandi</a>
          </nav>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-3">
            {/* 21st.dev Animated Logos Gallery Trigger Button */}
            <button
              onClick={() => setShowLogoGallery(true)}
              className="hidden lg:flex items-center gap-1.5 rounded-2xl border border-emerald-500/30 bg-emerald-50/80 px-3 py-1.5 text-xs font-black text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-950/40 dark:text-emerald-300 hover:scale-105 transition shadow-sm"
              title="Inspect All 9 Modular Animated Logos"
            >
              <Eye className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span>9 Module Logos</span>
            </button>

            {/* Language Picker */}
            <div className="relative hidden sm:flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-100/80 px-2.5 py-1.5 dark:border-agri-darkBorder dark:bg-agri-darkCard text-xs font-bold">
              <Languages className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                aria-label="Select Language"
                className="bg-transparent outline-none font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                {supportedLanguages.map((l) => (
                  <option key={l.code} value={l.code} className="dark:bg-slate-900">
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-200"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
            </button>

            {/* Launch Command Center Button with Shimmering Glow */}
            <button
              onClick={() => navigate('/')}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden rounded-2xl font-bold group bg-gradient-to-br from-emerald-500 to-forest-800 group-hover:from-emerald-400 group-hover:to-emerald-600 shadow-lg shadow-emerald-500/25 active:scale-95 transition"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-forest-900 rounded-[14px] text-white text-xs font-black flex items-center gap-2 group-hover:bg-opacity-0">
                <span>Launch FMS</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Stage with 21st.dev Perspective Grid, Shimmering Text & Radial Beams */}
      <section id="hero" className="relative pt-16 pb-24 lg:pt-24 lg:pb-36 overflow-hidden bg-perspective-grid">
        {/* Radial Light Beam Backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-emerald-500/25 via-teal-400/20 to-transparent rounded-full blur-[110px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* 21st.dev Glowing Pill Chip Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-50/80 px-4 py-1.5 text-xs font-black text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 shadow-sm backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>ICAR &amp; ISO 11783 AUTONOMOUS PRECISION AGRONOMIC OS</span>
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
            </div>

            {/* 21st.dev Shimmering Multi-Tone Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]">
              Autonomous Agronomic Intelligence From{' '}
              <span className="bg-[linear-gradient(110deg,#059669,45%,#6ee7b7,55%,#059669)] bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer">
                Soil Micro-Biome
              </span>{' '}
              To Satellite NDVI.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Industrial-grade precision farming platform orchestrating airborne SEIR fungal spore pressure, automated variable-rate prescriptions, APEDA EU-MRL export certificates, and PMFBY actuarial insurance loss claims.
            </p>

            {/* 21st.dev Magnetic Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => navigate('/')}
                className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-forest-800 via-emerald-700 to-forest-900 px-8 py-4 text-sm font-black text-white shadow-2xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all group"
              >
                <Zap className="h-4 w-4 text-emerald-300 fill-emerald-300 animate-pulse" />
                <span>Enter Operations Command Center</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="#bento"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white/80 px-6 py-4 text-sm font-bold text-slate-800 shadow-sm hover:bg-slate-50 transition active:scale-95 dark:border-agri-darkBorder dark:bg-agri-darkSurface/90 dark:text-slate-200 backdrop-blur"
              >
                <Play className="h-4 w-4 text-emerald-600 fill-emerald-600" />
                <span>Explore Interactive Bento Grid</span>
              </a>
            </div>
          </div>

          {/* Floating 3D Holographic Orbitals Container */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Card 1: SEIR Spore Pressure Floating Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-white/90 p-5 shadow-xl backdrop-blur-md dark:border-agri-darkBorder dark:bg-agri-darkSurface/90 animate-float-gentle transition hover:scale-105">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-amber-500 animate-pulse" /> SEIR Micro-Climate
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  R0: 1.18 Contained
                </span>
              </div>
              <p className="mt-2 text-xl font-black text-slate-900 dark:text-white">
                Spore Pressure: 24/100
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Foliar spray window favourable for next 8 hours. Delta-T: 4.8°C.
              </p>
            </div>

            {/* Card 2: Central Quantum Emblem Orbit */}
            <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-forest-900/20 to-transparent p-5 shadow-2xl backdrop-blur-md flex flex-col items-center justify-center text-center">
              <AnimatedBrandLogo size="hero" showText={false} showPulseDot={true} />
              <p className="mt-2 text-xs font-black uppercase text-slate-800 dark:text-slate-200">
                Quantum FMS Engine
              </p>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                RTK Lat: 30.9010° N · Lon: 75.8573° E
              </span>
            </div>

            {/* Card 3: Sentinel-2 Satellite Pass */}
            <div className="rounded-3xl border border-slate-200/90 bg-white/90 p-5 shadow-xl backdrop-blur-md dark:border-agri-darkBorder dark:bg-agri-darkSurface/90 animate-float-gentle [animation-delay:1.5s] transition hover:scale-105">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <Leaf className="h-3.5 w-3.5 text-emerald-500" /> Sentinel-2 MSI
                </span>
                <span className="font-mono text-xs font-black text-emerald-700 dark:text-emerald-400">
                  0.78 NDVI
                </span>
              </div>
              <p className="mt-2 text-xl font-black text-slate-900 dark:text-white">
                Vigorous Biomass
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Next orbital pass in 42 hours across Punjab Central Zone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Infinite APMC Mandi Commodity Rates Marquee */}
      <section id="mandi" className="py-4 border-y border-slate-200 bg-white dark:bg-agri-darkSurface dark:border-agri-darkBorder overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
          {[...MANDI_TICKERS, ...MANDI_TICKERS].map((t, idx) => (
            <div key={idx} className="inline-flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-slate-900 dark:text-white font-black">{t.crop}</span>
              <span className="text-[10px] text-slate-400">({t.mandi}):</span>
              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">{t.price}/Qtl</span>
              <span className={`text-[10px] font-extrabold ${t.state === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                {t.change}
              </span>
              <span className="text-slate-300 dark:text-slate-700 ml-3">|</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. 21st.dev Animated Bento Grid Showcase */}
      <section id="bento" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">
            <Layers className="h-4 w-4" /> 21st.dev Next-Gen Bento Architecture
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
            Seven Precision Farm Capabilities. One Screen.
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Engineered with spotlight hover reactions, animated SVG laser beams, and real-time telemetry connections.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Bento 1: Large Neural Leaf Scanner (Span 2) */}
          <div className="md:col-span-2 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl dark:border-agri-darkBorder dark:bg-agri-darkSurface relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
                <ScanEye className="h-3.5 w-3.5" /> Computer Vision Scanner
              </span>
              <span className="text-xs font-mono font-bold text-emerald-600">ResNet-50 Neural Engine</span>
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Sub-Second Foliar Disease Optical Diagnostic
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Live scanning across 120+ crop pathologies with automated CIB&amp;RC compliant chemical prescriptions.
            </p>

            {/* Simulated Scanning Leaf Container */}
            <div className="mt-6 relative h-52 rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 flex items-center justify-center">
              {/* Laser Beam Scanner Animation */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-beam-scan z-10" />

              {/* Bounding Box Visualizer */}
              <div className="relative border-2 border-dashed border-emerald-400/80 rounded-xl p-4 bg-emerald-950/20 text-center">
                <p className="text-xs font-black text-emerald-300">Puccinia striiformis (Yellow Rust)</p>
                <span className="text-[10px] font-mono text-emerald-400">Confidence: 98.4% · Sector B2</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Curative Prescription: Mancozeb 75% WP @ 2.5 g/L</span>
              <button
                onClick={() => navigate('/disease-detection')}
                className="text-xs font-bold text-forest-800 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                Scan Leaf <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Bento 2: IoT Sensor Hardware Telemetry */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-bold text-sky-800 dark:bg-sky-950 dark:text-sky-300 flex items-center gap-1">
                <Radio className="h-3 w-3" /> IoT Mesh
              </span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <h3 className="text-base font-black text-slate-900 dark:text-white">
              In-Situ Capacitive Soil Probes
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-agri-darkCard flex justify-between items-center">
                <span className="text-slate-500">Rootzone VWC:</span>
                <span className="font-mono font-black text-slate-900 dark:text-white">38.2%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-agri-darkCard flex justify-between items-center">
                <span className="text-slate-500">Delta-T Window:</span>
                <span className="font-mono font-black text-emerald-600">4.8°C (Optimal)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-agri-darkCard flex justify-between items-center">
                <span className="text-slate-500">Wind Velocity:</span>
                <span className="font-mono font-black text-slate-900 dark:text-white">9.4 km/h NW</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/settings')}
              className="w-full rounded-xl bg-slate-100 dark:bg-agri-darkCard py-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition"
            >
              Configure Hardware
            </button>
          </div>

          {/* Bento 3: 21st.dev Animated Beam Connector (Drone -> Terminal) */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl dark:border-agri-darkBorder dark:bg-agri-darkSurface flex flex-col justify-between">
            <div>
              <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300 flex items-center gap-1 w-max">
                <Wifi className="h-3 w-3" /> Telematics Beam
              </span>
              <h3 className="mt-3 text-base font-black text-slate-900 dark:text-white">
                ISOBUS Terminal Cloud Sync
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Direct ISO 11783 prescription streaming into John Deere &amp; Trimble in-cab consoles.
              </p>
            </div>

            {/* Beam Animation Illustration */}
            <div className="my-4 p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <div className="flex flex-col items-center gap-1">
                <div className="h-8 w-8 rounded-xl bg-emerald-900/60 flex items-center justify-center text-emerald-400">
                  <Radio className="h-4 w-4" />
                </div>
                <span className="text-[10px]">Drone</span>
              </div>

              {/* Animated Glowing Connection Line */}
              <div className="flex-1 mx-2 relative h-0.5 bg-slate-700 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-300 animate-[marquee_2s_linear_infinite]" />
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="h-8 w-8 rounded-xl bg-forest-900/60 flex items-center justify-center text-emerald-300">
                  <Tractor className="h-4 w-4" />
                </div>
                <span className="text-[10px]">Tractor</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/reports')}
              className="w-full rounded-xl bg-forest-800 py-2 text-xs font-bold text-white hover:bg-forest-900 transition dark:bg-emerald-600"
            >
              Export ISO-XML Task
            </button>
          </div>

          {/* Bento 4: Punjab Govt Schemes & Video Masterclass */}
          <div className="md:col-span-3 lg:col-span-4 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-slate-900 to-forest-950/30 p-6 shadow-xl relative overflow-hidden group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Landmark className="h-6 w-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-0.5 text-xs font-bold text-amber-300 border border-amber-500/20">
                    <GraduationCap className="h-3.5 w-3.5" /> Punjab Agriculture &amp; PAU Extension Hub
                  </div>
                  <h3 className="text-lg font-black text-white mt-1">
                    Punjab Official Schemes &amp; Video Masterclasses
                  </h3>
                  <p className="text-xs text-amber-200/80">
                    Direct DBT (₹1,500/Acre DSR), 50% to 80% CRM machinery subsidies (agrimachinerypb.com), PM-KUSUM 60% solar pump, and PAU scientific masterclasses.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/schemes')}
                  className="rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5"
                >
                  <span>Explore Schemes &amp; Masterclasses</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Interactive Cadastral Parcel & Drone Reconnaissance Visualizer */}
      <section id="recon" className="py-20 bg-white dark:bg-agri-darkSurface border-y border-slate-200/80 dark:border-agri-darkBorder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">
                <Cpu className="h-4 w-4" /> Geospatial Reconnaissance Engine
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                Interactive Cadastral GIS &amp; Autonomous UAV Drone Sentinel
              </h2>
            </div>

            {/* Layer Switcher */}
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 p-1.5 dark:border-agri-darkBorder dark:bg-agri-darkCard text-xs font-bold">
              <button
                onClick={() => setActiveLayer('aerial')}
                className={`rounded-xl px-3 py-1.5 transition ${
                  activeLayer === 'aerial' ? 'bg-white shadow text-slate-900 dark:bg-forest-800 dark:text-white' : 'text-slate-500'
                }`}
              >
                True Color RGB
              </button>
              <button
                onClick={() => setActiveLayer('ndvi')}
                className={`rounded-xl px-3 py-1.5 transition ${
                  activeLayer === 'ndvi' ? 'bg-white shadow text-slate-900 dark:bg-forest-800 dark:text-white' : 'text-slate-500'
                }`}
              >
                NDVI Infrared Spectrum
              </button>
              <button
                onClick={() => setActiveLayer('npk')}
                className={`rounded-xl px-3 py-1.5 transition ${
                  activeLayer === 'npk' ? 'bg-white shadow text-slate-900 dark:bg-forest-800 dark:text-white' : 'text-slate-500'
                }`}
              >
                Soil Chemometrics NPK
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 rounded-3xl border border-slate-200 bg-slate-950 p-6 shadow-2xl relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent animate-[pulse_4s_ease-in-out_infinite]" />

              {/* Vector SVG Cadastral Map */}
              <svg viewBox="0 0 600 360" className="w-full h-auto rounded-2xl">
                {/* Sector A1 */}
                <polygon
                  points="30,30 270,40 250,170 40,160"
                  fill={activeLayer === 'ndvi' ? '#047857' : activeLayer === 'npk' ? '#0284c7' : '#15803d'}
                  stroke="#34d399"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition"
                  onClick={() => setSelectedParcel('Sector A1 - Basmati 1121 Rice (8.5 Ac)')}
                />
                <text x="70" y="90" fill="#ffffff" fontSize="12" fontWeight="bold">Sector A1: Basmati Rice</text>
                <text x="70" y="110" fill="#a7f3d0" fontSize="10">8.5 Acres · 0.82 NDVI</text>

                {/* Sector B2 */}
                <polygon
                  points="290,45 560,30 550,165 270,175"
                  fill={activeLayer === 'ndvi' ? '#b45309' : activeLayer === 'npk' ? '#eab308' : '#854d0e'}
                  stroke="#fbbf24"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition"
                  onClick={() => setSelectedParcel('Sector B2 - HD-3086 Wheat (12.0 Ac)')}
                />
                <text x="330" y="90" fill="#ffffff" fontSize="12" fontWeight="bold">Sector B2: HD-3086 Wheat</text>
                <text x="330" y="110" fill="#fde68a" fontSize="10">12.0 Acres · Blight Alert</text>

                {/* Sector C1 */}
                <polygon
                  points="45,185 255,195 240,330 35,320"
                  fill={activeLayer === 'ndvi' ? '#059669' : activeLayer === 'npk' ? '#06b6d4' : '#166534'}
                  stroke="#6ee7b7"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition"
                  onClick={() => setSelectedParcel('Sector C1 - Bt Cotton (6.5 Ac)')}
                />
                <text x="70" y="250" fill="#ffffff" fontSize="12" fontWeight="bold">Sector C1: Bt Cotton</text>
                <text x="70" y="270" fill="#a7f3d0" fontSize="10">6.5 Acres · Squaring Stage</text>

                {/* Sector D3 */}
                <polygon
                  points="275,200 550,190 535,335 260,325"
                  fill={activeLayer === 'ndvi' ? '#10b981' : activeLayer === 'npk' ? '#38bdf8' : '#14532d'}
                  stroke="#34d399"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition"
                  onClick={() => setSelectedParcel('Sector D3 - Mustard Raya (4.2 Ac)')}
                />
                <text x="330" y="250" fill="#ffffff" fontSize="12" fontWeight="bold">Sector D3: Mustard Raya</text>
                <text x="330" y="270" fill="#a7f3d0" fontSize="10">4.2 Acres · Pod Formation</text>

                {/* Drone Animated Vector */}
                <g className="animate-[bounce_3s_infinite]">
                  <circle cx="280" cy="180" r="16" fill="rgba(16, 185, 129, 0.25)" />
                  <circle cx="280" cy="180" r="6" fill="#10b981" />
                  <text x="270" y="215" fill="#34d399" fontSize="10" fontWeight="bold">DJI Agras T40 Sentinel</text>
                </g>
              </svg>
            </div>

            {/* Inspector Panel */}
            <div className="lg:col-span-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-agri-darkBorder dark:bg-agri-darkCard space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-agri-darkBorder">
                <span className="text-xs font-black uppercase text-slate-400">Parcel Inspector</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Live
                </span>
              </div>

              <h3 className="text-lg font-black text-slate-900 dark:text-white">{selectedParcel}</h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-agri-darkBorder">
                  <span className="text-slate-500">Canopy Health:</span>
                  <span className="font-bold text-emerald-600">0.78 NDVI (Vigorous)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-agri-darkBorder">
                  <span className="text-slate-500">Soil Moisture:</span>
                  <span className="font-bold text-slate-900 dark:text-white">38% VWC Root Zone</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-agri-darkBorder">
                  <span className="text-slate-500">Active Work Order:</span>
                  <span className="font-bold text-forest-800 dark:text-emerald-400">Foliar Micronutrient Pass</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">EU-MRL Compliance:</span>
                  <span className="font-bold text-emerald-600">PASS (0.004 mg/kg)</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-forest-800 py-3 text-xs font-black text-white hover:bg-forest-900 transition dark:bg-emerald-600"
              >
                <span>Open in Full Command Center</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Dynamic Farm ROI Calculator with Animated Numbers */}
      <section id="roi" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              <Coins className="h-4 w-4" /> Economic Feasibility &amp; Savings Model
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Calculate Your Realized Ag-Input &amp; Pumping Savings
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              By optimizing variable-rate nitrogen dosing and gating irrigation with real-time 48-hour rainfall radar, large farms drastically reduce wastage while maximizing crop yield.
            </p>

            {/* Glowing Range Slider */}
            <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-agri-darkCard border border-slate-200 dark:border-agri-darkBorder space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Your Operational Farm Land Size:
                </span>
                <span className="text-lg font-black text-forest-800 dark:text-emerald-400">
                  {acres} Acres ({(acres * 0.404686).toFixed(1)} Ha)
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="150"
                step="5"
                value={acres}
                onChange={(e) => setAcres(parseInt(e.target.value))}
                className="w-full accent-forest-800 dark:accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>5 Acres</span>
                <span>75 Acres</span>
                <span>150 Acres</span>
              </div>
            </div>
          </div>

          {/* Dynamic Savings Display Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkCard">
              <span className="text-[10px] font-black uppercase text-slate-400">Fertilizer Saved</span>
              <p className="mt-2 text-3xl font-black text-emerald-700 dark:text-emerald-400">
                ₹{annualFertilizerSavedInr.toLocaleString('en-IN')}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Reduced Urea &amp; DAP over-application via VRA soil mapping.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkCard">
              <span className="text-[10px] font-black uppercase text-slate-400">Diesel Pumping Saved</span>
              <p className="mt-2 text-3xl font-black text-sky-700 dark:text-sky-400">
                ₹{dieselPumpingSavedInr.toLocaleString('en-IN')}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Pumping power conserved by rain-gated tubewell dispatch.
              </p>
            </div>

            <div className="sm:col-span-2 rounded-3xl border border-emerald-200 bg-emerald-50/80 p-6 shadow-card dark:border-emerald-900/60 dark:bg-emerald-950/30">
              <span className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-300">
                Total Projected Net Farm Advantage
              </span>
              <p className="mt-1 text-4xl font-black text-forest-800 dark:text-emerald-300">
                +₹{totalFinancialBenefitInr.toLocaleString('en-IN')}{' '}
                <span className="text-sm font-bold text-slate-500">/ season</span>
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                Includes yield gains (+24.6%) and direct input cost reductions across {acres} monitored acres.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Infinite Institutional Trust Partner Proof Marquee */}
      <section className="py-8 bg-slate-100/80 dark:bg-[#070e0a] border-t border-slate-200 dark:border-agri-darkBorder overflow-hidden">
        <div className="text-center text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">
          Institutional Accreditations &amp; Interoperability Protocols
        </div>
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 text-xs font-black text-slate-600 dark:text-slate-300">
          {[...TRUST_PARTNERS, ...TRUST_PARTNERS].map((partner, idx) => (
            <span key={idx} className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>{partner}</span>
              <span className="text-slate-300 dark:text-slate-700 ml-6">·</span>
            </span>
          ))}
        </div>
      </section>

      {/* 8. Agritech Footer */}
      <footer className="bg-white dark:bg-agri-darkSurface border-t border-slate-200/80 dark:border-agri-darkBorder py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-3">
            <AnimatedBrandLogo size="sm" showText={true} />
          </div>
          <p>© 2026 Krishi Saarthi · Enterprise Precision Farm Operating System (FMS 2.0)</p>
          <div className="flex items-center gap-4 font-bold text-slate-600 dark:text-slate-300">
            <Link to="/" className="hover:text-emerald-600">Command Center</Link>
            <Link to="/reports" className="hover:text-emerald-600">ISO-XML Reports</Link>
            <Link to="/settings" className="hover:text-emerald-600">FMS Settings</Link>
          </div>
        </div>
      </footer>

      {/* 9. Interactive Module Animated Logo Gallery Modal (21st.dev Showcase) */}
      {showLogoGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xl dark:border-agri-darkBorder dark:bg-agri-darkSurface">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-agri-darkBorder">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  21st.dev Component Registry Showcase
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  9 Custom Animated Modular Vector Emblems
                </h3>
              </div>
              <button
                onClick={() => setShowLogoGallery(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-agri-darkCard dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 3x3 Grid of Animated Module Logos */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ALL_MODULES_LIST.map((m) => (
                <div
                  key={m.key}
                  className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard hover:scale-[1.02] transition shadow-sm flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3">
                    <ModuleAnimatedLogo module={m.key} size="md" showTelemetryBeacon={true} />
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white">{m.name}</p>
                      <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">{m.tag}</p>
                    </div>
                  </div>
                  <p className="mt-2.5 text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {m.desc}
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-agri-darkBorder flex justify-end">
                    <button
                      onClick={() => {
                        setShowLogoGallery(false)
                        navigate(m.route)
                      }}
                      className="text-xs font-bold text-forest-800 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      Open Module <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
