import { useState } from 'react'
import {
  BookOpen,
  GraduationCap,
  Play,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  PhoneCall,
  Download,
  Landmark,
  FileText,
  BadgePercent,
  X,
  Lightbulb,
  Radio,
  Tv,
} from 'lucide-react'
import { ModuleAnimatedLogo } from '../components/common/ModuleAnimatedLogo'
import { MasterclassTheater } from '../components/learning/MasterclassTheater'
import {
  PUNJAB_MASTERCLASSES,
  PUNJAB_GOVT_SCHEMES,
  type MasterclassVideo,
  type PunjabGovtScheme,
} from '../data/punjabSchemesAndMasterclasses'

export function SchemesAndLearningPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'masterclasses' | 'schemes'>('all')
  const [selectedCrop, setSelectedCrop] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedTheaterVideoId, setSelectedTheaterVideoId] = useState<string>(PUNJAB_MASTERCLASSES[0].id)
  const [activeVideoModal, setActiveVideoModal] = useState<MasterclassVideo | null>(null)
  const [activeSchemeModal, setActiveSchemeModal] = useState<PunjabGovtScheme | null>(null)

  const handlePlayInTheater = (videoId: string) => {
    setSelectedTheaterVideoId(videoId)
    const element = document.getElementById('masterclass-theater')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Subsidy Calculator State
  const [calcAcreage, setCalcAcreage] = useState<number>(5)
  const [calcCrop, setCalcCrop] = useState<string>('Paddy (DSR)')
  const [calcHasTractor, setCalcHasTractor] = useState<boolean>(true)

  const cropFilters = ['All', 'Wheat', 'Paddy', 'Basmati', 'Cotton', 'Mustard', 'Moong']

  // Filter Masterclasses
  const filteredMasterclasses = PUNJAB_MASTERCLASSES.filter((mc) => {
    const matchesCrop =
      selectedCrop === 'All' ||
      mc.crops.some((c) => c.toLowerCase().includes(selectedCrop.toLowerCase()))
    const matchesSearch =
      mc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mc.titlePa.includes(searchQuery) ||
      mc.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mc.organization.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCrop && matchesSearch
  })

  // Filter Schemes
  const filteredSchemes = PUNJAB_GOVT_SCHEMES.filter((scheme) => {
    const matchesCrop =
      selectedCrop === 'All' ||
      scheme.applicableCrops.some((c) => c.toLowerCase().includes(selectedCrop.toLowerCase())) ||
      scheme.applicableCrops.some((c) => c.toLowerCase().includes('all'))
    const matchesSearch =
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.namePa.includes(searchQuery) ||
      scheme.financialSubsidy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.portalName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCrop && matchesSearch
  })

  // Estimated Subsidy Calculation
  const calculateEstimatedBenefit = () => {
    let benefit = 0
    if (calcCrop === 'Paddy (DSR)') {
      benefit += calcAcreage * 1500 // DSR incentive
    }
    if (calcHasTractor) {
      benefit += 125000 // Estimated 50% subsidy on Super Seeder (~₹2.5L base)
    }
    return benefit
  }

  return (
    <div className="space-y-8 pb-16">
      {/* 21st.dev Hero Header with Conic Animated Emblem */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-950/30 via-slate-900 to-forest-950/50 p-6 sm:p-8 backdrop-blur-xl">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <ModuleAnimatedLogo module="schemes" size="lg" showTelemetryBeacon={true} />
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                ICAR & Punjab Agricultural University (PAU) Extension Network
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                Punjab Agronomic Masterclasses & Govt Schemes
              </h1>
              <p className="text-sm font-medium text-amber-200/80">
                ਪੰਜਾਬ ਖੇਤੀਬਾੜੀ ਮਾਸਟਰਕਲਾਸਾਂ ਅਤੇ ਸਰਕਾਰੀ ਸਬਸਿਡੀ ਪੋਰਟਲ (Direct DBT, CRM, PMFBY, PM-KUSUM)
              </p>
            </div>
          </div>

          {/* Quick Metrics Badge */}
          <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 text-center">
              <span className="text-xs font-semibold text-slate-400">Direct DBT</span>
              <div className="text-lg font-black text-amber-400">₹1,500/ac</div>
              <span className="text-[10px] text-slate-500">DSR Incentive</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 text-center">
              <span className="text-xs font-semibold text-slate-400">CRM Machines</span>
              <div className="text-lg font-black text-emerald-400">50% - 80%</div>
              <span className="text-[10px] text-slate-500">Super Seeder</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 text-center">
              <span className="text-xs font-semibold text-slate-400">Solar Pump</span>
              <div className="text-lg font-black text-cyan-400">60% Off</div>
              <span className="text-[10px] text-slate-500">PM-KUSUM</span>
            </div>
          </div>
        </div>

        {/* Search & Navigation Bar */}
        <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-t border-white/10 pt-6">
          {/* Primary View Switcher */}
          <div className="flex rounded-xl bg-slate-950/70 p-1 ring-1 ring-white/10">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Landmark className="h-3.5 w-3.5" />
              All Content ({PUNJAB_MASTERCLASSES.length + PUNJAB_GOVT_SCHEMES.length})
            </button>
            <button
              onClick={() => setActiveTab('masterclasses')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'masterclasses'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5" />
              Video Masterclasses ({PUNJAB_MASTERCLASSES.length})
            </button>
            <button
              onClick={() => setActiveTab('schemes')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'schemes'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BadgePercent className="h-3.5 w-3.5" />
              Punjab Schemes ({PUNJAB_GOVT_SCHEMES.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scheme, PAU scientist, crop, or machinery..."
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 py-2 pl-10 pr-4 text-xs font-medium text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Crop Filter Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Filter Crop:</span>
          {cropFilters.map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                selectedCrop === crop
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: MASTERCLASSES THEATER & FULL CURRICULUM */}
      {(activeTab === 'all' || activeTab === 'masterclasses') && (
        <div className="space-y-6">
          {/* 1. Persistent High-Motion Theater Stage */}
          <MasterclassTheater
            key={selectedTheaterVideoId}
            initialVideoId={selectedTheaterVideoId}
          />

          {/* 2. Grid of All Masterclasses with Quick Actions */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tv className="h-5 w-5 text-amber-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  PAU Ludhiana &amp; ICAR Scientific Masterclasses Catalog
                </h3>
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {filteredMasterclasses.length} Sessions Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredMasterclasses.map((mc) => (
                <div
                  key={mc.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                >
                  {/* Thumbnail Stage */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <img
                      src={mc.thumbnailUrl}
                      alt={mc.title}
                      className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />

                    {/* Play in Theater Overlay Button */}
                    <button
                      onClick={() => handlePlayInTheater(mc.id)}
                      className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/50 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-400"
                      title="Load and Play in Theater"
                    >
                      <Play className="h-5 w-5 fill-current ml-0.5" />
                    </button>

                    {/* Level & Duration Badges */}
                    <div className="absolute top-3 left-3 rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] font-bold text-amber-300 backdrop-blur-md">
                      {mc.level}
                    </div>
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                      <Clock className="h-3 w-3 text-slate-300" />
                      {mc.duration}
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                          {mc.category}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          {mc.chapters.length} Chapters
                        </span>
                      </div>
                      <h4 className="line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400 leading-snug">
                        {mc.title}
                      </h4>
                      <p className="line-clamp-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {mc.titlePa}
                      </p>
                      <p className="line-clamp-2 text-xs text-slate-600 dark:text-slate-400">
                        {mc.description}
                      </p>
                    </div>

                    {/* Instructor & Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {mc.instructor}
                        </p>
                        <p className="text-[10px] text-slate-500">{mc.organization}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePlayInTheater(mc.id)}
                          className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
                        >
                          <Play className="h-3.5 w-3.5 fill-current" />
                          <span>Play Theater</span>
                        </button>

                        <button
                          onClick={() => setActiveVideoModal(mc)}
                          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                          title="Full Screen Dialog Preview"
                        >
                          <Radio className="h-3.5 w-3.5 text-emerald-500" />
                        </button>

                        <a
                          href={mc.youtubeSearchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:border-slate-700 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-950/30"
                          title="Open Video on YouTube"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PUNJAB GOVT OFFICIAL SCHEMES GRID */}
      {(activeTab === 'all' || activeTab === 'schemes') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Landmark className="h-5 w-5 text-emerald-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Official Punjab Government Schemes & Direct Application Portals
              </h2>
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Showing {filteredSchemes.length} Active Official Portals
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                {/* Header Tag & Status */}
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {scheme.category}
                  </span>
                  <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    {scheme.statusBadge}
                  </span>
                </div>

                {/* Scheme Title & Ministry */}
                <div className="mt-4 space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {scheme.name}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    {scheme.namePa}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Nodal Body: {scheme.nodalMinistry}
                  </p>
                </div>

                {/* Financial Subsidy Callout Box */}
                <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    <BadgePercent className="h-4 w-4 text-emerald-500" />
                    Subsidy / Incentive:
                  </div>
                  <p className="mt-1 text-xs font-extrabold text-slate-900 dark:text-white">
                    {scheme.financialSubsidy}
                  </p>
                </div>

                {/* Key Eligibility & Documents Preview */}
                <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <span>
                      <strong className="text-slate-800 dark:text-slate-200">Eligibility:</strong>{' '}
                      {scheme.eligibility}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                    <span>
                      <strong className="text-slate-800 dark:text-slate-200">Window:</strong>{' '}
                      {scheme.applicationWindow}
                    </span>
                  </div>
                </div>

                {/* Target Crops */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {scheme.applicableCrops.map((crop) => (
                    <span
                      key={crop}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {crop}
                    </span>
                  ))}
                </div>

                {/* Direct Official Link & Details Modal Buttons */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <a
                    href={scheme.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/30 transition-all hover:bg-emerald-500 hover:shadow-lg"
                  >
                    Apply on Official Portal
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>

                  <button
                    onClick={() => setActiveSchemeModal(scheme)}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    title="View Document Checklist & Guide"
                  >
                    <FileText className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: INTERACTIVE SUBSIDY ESTIMATOR & HELPLINE DIRECTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Punjab Farm Subsidy Calculator */}
        <div className="lg:col-span-2 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-forest-950/40 via-slate-900 to-slate-950 p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <BadgePercent className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Punjab Farm Benefit & Subsidy Estimator</h3>
              <p className="text-xs text-slate-400">
                Calculate estimated direct DBT payout and machinery capital subsidy for your acreage
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300">Total Farm Land (Acres):</label>
              <input
                type="number"
                min="1"
                max="100"
                value={calcAcreage}
                onChange={(e) => setCalcAcreage(Math.max(1, Number(e.target.value)))}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-2 text-sm font-bold text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300">Target Crop Practice:</label>
              <select
                value={calcCrop}
                onChange={(e) => setCalcCrop(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-2 text-xs font-bold text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="Paddy (DSR)">Paddy / Basmati (DSR Tar-Wattar)</option>
                <option value="Wheat">Wheat (PBW-826 / HD-3086)</option>
                <option value="Cotton">Bt Cotton (IPM Protected)</option>
                <option value="Mustard">Mustard (Giriraj / RH-749)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300">Tractor Ownership (50+ HP):</label>
              <select
                value={calcHasTractor ? 'yes' : 'no'}
                onChange={(e) => setCalcHasTractor(e.target.value === 'yes')}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-2 text-xs font-bold text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="yes">Yes (Eligible for 50% Super Seeder)</option>
                <option value="no">No (Custom Hiring Center rate)</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4">
            <div>
              <span className="text-xs font-semibold text-emerald-300">
                Estimated Govt Support & Capital Incentive:
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white">
                ₹{calculateEstimatedBenefit().toLocaleString('en-IN')}{' '}
                <span className="text-xs font-normal text-emerald-400">Total Unlocked Value</span>
              </div>
            </div>
            <a
              href="https://agrimachinerypb.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400"
            >
              Verify on Punjab Portal
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Official Punjab Agronomic Helplines */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <PhoneCall className="h-5 w-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Official Helpline Directory
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Toll-free government helplines for immediate scheme and disease advisory
          </p>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Kisan Call Centre (MoA&FW)
                </p>
                <p className="text-[11px] text-slate-500">24x7 Agronomy Help in Punjabi</p>
              </div>
              <a
                href="tel:18001801551"
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500"
              >
                1800-180-1551
              </a>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Punjab CRM Machinery Help
                </p>
                <p className="text-[11px] text-slate-500">Dept. of Agri, Punjab</p>
              </div>
              <a
                href="tel:01722970605"
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-700 dark:bg-slate-800"
              >
                0172-2970605
              </a>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  PMFBY Crop Insurance
                </p>
                <p className="text-[11px] text-slate-500">Direct Claims Portal</p>
              </div>
              <a
                href="tel:14447"
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-700"
              >
                14447
              </a>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  PEDA Solar Pump Subsidy
                </p>
                <p className="text-[11px] text-slate-500">Chandigarh HQ</p>
              </div>
              <a
                href="tel:01722663328"
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-700"
              >
                0172-2663328
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: FULL VIDEO MASTERCLASS THEATER */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="relative flex flex-col max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-amber-500/30 bg-slate-950 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-amber-500/20 p-2 text-amber-400">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">{activeVideoModal.title}</h3>
                  <p className="text-xs text-amber-400">{activeVideoModal.organization}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={activeVideoModal.youtubeSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-xl border border-red-500/30 bg-red-600/20 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-red-600 hover:text-white transition"
                  title="Open on YouTube"
                >
                  <span>YouTube</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Running Video Stage in Modal */}
            <div className="relative aspect-video w-full bg-black overflow-hidden">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideoModal.youtubeVideoId}?autoplay=1&mute=0&rel=0&modestbranding=1&playsinline=1`}
                title={activeVideoModal.title}
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />

              <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
                <span className="rounded-md bg-slate-950/80 px-2.5 py-1 text-[10px] font-bold text-amber-300 border border-white/10">
                  Duration: {activeVideoModal.duration} • {activeVideoModal.level}
                </span>
                <span className="rounded-md bg-slate-950/80 px-2.5 py-1 text-[10px] font-bold text-emerald-300 border border-white/10">
                  {activeVideoModal.chapters.length} Key Segments
                </span>
              </div>
            </div>

            {/* Curriculum Checklist & Details */}
            <div className="overflow-y-auto p-6 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-amber-400" />
                  Core Agronomic Syllabus &amp; PAU Protocol
                </h4>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeVideoModal.curriculum.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 p-3 text-xs text-slate-200"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                <div className="text-xs text-slate-400">
                  Instructor:{' '}
                  <strong className="text-white">{activeVideoModal.instructor}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://www.pau.edu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/20"
                  >
                    <Download className="h-3.5 w-3.5" />
                    PAU Package of Practices (PDF)
                  </a>
                  <button
                    onClick={() => setActiveVideoModal(null)}
                    className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SCHEME APPLICATION DOSSIER */}
      {activeSchemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="relative flex flex-col max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-emerald-500/30 bg-slate-950 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400">
                  <Landmark className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">{activeSchemeModal.name}</h3>
                  <p className="text-xs text-emerald-400">{activeSchemeModal.nodalMinistry}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveSchemeModal(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scheme Content */}
            <div className="overflow-y-auto p-6 space-y-5">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4">
                <span className="text-xs font-semibold text-emerald-300">Financial Benefit:</span>
                <p className="text-lg font-black text-white">
                  {activeSchemeModal.financialSubsidy}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Eligibility Criteria
                </h4>
                <p className="mt-1 text-xs font-medium text-slate-200">
                  {activeSchemeModal.eligibility}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Required Documents Checklist
                </h4>
                <div className="mt-2 space-y-2">
                  {activeSchemeModal.documentsRequired.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-200"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-200 flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                <span>
                  Tip: Keep your Aadhaar-linked bank account active and ensure land revenue records
                  (Fard / Jamabandi) match the name on your Aadhaar card before submitting.
                </span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between border-t border-white/10 bg-slate-900/50 px-6 py-4">
              <span className="text-xs text-slate-400">
                Helpline: <strong className="text-white">{activeSchemeModal.helpline}</strong>
              </span>
              <a
                href={activeSchemeModal.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400"
              >
                Go to {activeSchemeModal.portalName}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
