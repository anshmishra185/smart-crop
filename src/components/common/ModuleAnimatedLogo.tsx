export type AgriModuleKey =
  | 'dashboard'
  | 'disease-detection'
  | 'weather'
  | 'soil-health'
  | 'recommendations'
  | 'analytics'
  | 'calendar'
  | 'reports'
  | 'settings'
  | 'schemes'
  | 'marketplace'

interface ModuleAnimatedLogoProps {
  module: AgriModuleKey
  size?: 'sm' | 'md' | 'lg' | 'hero'
  showLabel?: boolean
  showTelemetryBeacon?: boolean
  className?: string
}

export function ModuleAnimatedLogo({
  module,
  size = 'md',
  showLabel = false,
  showTelemetryBeacon = true,
  className = '',
}: ModuleAnimatedLogoProps) {
  // Sizing definitions
  const sizeMap = {
    sm: { box: 'h-8 w-8', svg: 'h-4.5 w-4.5', label: 'text-xs' },
    md: { box: 'h-11 w-11', svg: 'h-6 w-6', label: 'text-sm' },
    lg: { box: 'h-16 w-16', svg: 'h-9 w-9', label: 'text-lg' },
    hero: { box: 'h-24 w-24', svg: 'h-14 w-14', label: 'text-2xl' },
  }[size]

  // Module configuration with gradients, themes, and labels
  const moduleConfig: Record<
    AgriModuleKey,
    {
      name: string
      sub: string
      conicBorder: string
      beaconColor: string
      renderSvg: (svgSize: string) => React.ReactNode
    }
  > = {
    dashboard: {
      name: 'Operations Command',
      sub: 'RTK GIS Cadastre & UAV',
      conicBorder: 'from-emerald-500 via-teal-400 to-green-600',
      beaconColor: 'bg-emerald-400',
      renderSvg: (svgSize) => (
        <svg className={`${svgSize} text-emerald-400`} viewBox="0 0 48 48" fill="none">
          {/* Cadastral Polygon Grid Lines */}
          <polygon points="10,12 24,6 38,14 36,36 12,38" stroke="#10b981" strokeWidth="1.2" strokeOpacity="0.4" />
          <line x1="24" y1="6" x2="24" y2="38" stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity="0.5" />
          <line x1="10" y1="24" x2="38" y2="24" stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity="0.5" />
          {/* Rotating Radar Sweep Line */}
          <circle cx="24" cy="24" r="18" stroke="#34d399" strokeWidth="1.2" strokeDasharray="3 3" className="animate-[spin_10s_linear_infinite]" />
          <g className="animate-[spin_4s_linear_infinite] origin-center">
            <line x1="24" y1="24" x2="42" y2="24" stroke="#6ee7b7" strokeWidth="1.8" strokeLinecap="round" />
          </g>
          {/* Central Autonomous Drone Telemetry Beacon */}
          <circle cx="24" cy="24" r="3.5" fill="#10b981" />
          <circle cx="24" cy="24" r="1.5" fill="#ffffff" />
        </svg>
      ),
    },

    'disease-detection': {
      name: 'Disease Detection',
      sub: 'ResNet-50 Optical Scanner',
      conicBorder: 'from-lime-400 via-emerald-500 to-amber-500',
      beaconColor: 'bg-lime-400',
      renderSvg: (svgSize) => (
        <svg className={`${svgSize} text-lime-400`} viewBox="0 0 48 48" fill="none">
          {/* Chlorophyll Leaf Silhouette */}
          <path
            d="M24 7C24 7 36 13 36 26C36 33.18 30.63 39 24 39C17.37 39 12 33.18 12 26C12 17 20 10 24 7Z"
            fill="url(#diseaseLeafGrad)"
          />
          {/* Neural Circuit Veins */}
          <path d="M24 13V35M24 20L30 17M24 26L18 22M24 30L29 27" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          {/* Active Vertical Laser Scanner Beam */}
          <g className="animate-beam-scan">
            <line x1="10" y1="24" x2="38" y2="24" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
            <circle cx="24" cy="24" r="4" fill="#ef4444" fillOpacity="0.4" />
          </g>
          <defs>
            <linearGradient id="diseaseLeafGrad" x1="12" y1="7" x2="36" y2="39" gradientUnits="userSpaceOnUse">
              <stop stopColor="#84cc16" />
              <stop offset="0.7" stopColor="#15803d" />
              <stop offset="1" stopColor="#064e3b" />
            </linearGradient>
          </defs>
        </svg>
      ),
    },

    weather: {
      name: 'Weather Intelligence',
      sub: 'Doppler Radar & Delta-T',
      conicBorder: 'from-sky-400 via-cyan-500 to-blue-600',
      beaconColor: 'bg-sky-400',
      renderSvg: (svgSize) => (
        <svg className={`${svgSize} text-sky-400`} viewBox="0 0 48 48" fill="none">
          {/* Doppler Storm Isobar Cloud */}
          <path
            d="M14 30C11.79 30 10 28.21 10 26C10 23.95 11.54 22.26 13.54 22.04C14.07 17.52 17.9 14 22.5 14C26.43 14 29.8 16.59 30.93 20.24C32.74 20.61 34 22.15 34 24C34 26.21 32.21 28 30 28H14"
            fill="url(#cloudGrad)"
            stroke="#38bdf8"
            strokeWidth="1.2"
          />
          {/* Animated Lightning Discharge Bolt */}
          <path d="M22 24L18 32H24L21 40L29 29H23L26 24H22Z" fill="#facc15" className="animate-[pulse_1.5s_infinite]" />
          {/* Descending Rain Droplet Stream */}
          <circle cx="15" cy="36" r="1.5" fill="#38bdf8" className="animate-[bounce_2s_infinite]" />
          <circle cx="31" cy="35" r="1.5" fill="#38bdf8" className="animate-[bounce_2.5s_infinite]" />
          <defs>
            <linearGradient id="cloudGrad" x1="10" y1="14" x2="34" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0284c7" />
              <stop offset="1" stopColor="#082f49" />
            </linearGradient>
          </defs>
        </svg>
      ),
    },

    'soil-health': {
      name: 'Soil Health Studio',
      sub: 'Chemosensory NPK & VRA',
      conicBorder: 'from-indigo-500 via-purple-500 to-pink-500',
      beaconColor: 'bg-purple-400',
      renderSvg: (svgSize) => (
        <svg className={`${svgSize} text-purple-400`} viewBox="0 0 48 48" fill="none">
          {/* Laboratory Erlenmeyer Flask */}
          <path d="M20 8H28M22 8V16L12 34C10.5 36.5 12.3 40 15.2 40H32.8C35.7 40 37.5 36.5 36 34L26 16V8" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Glowing NPK Fluid Bed */}
          <path d="M14 32L17 26H31L34 32C35 34 33.5 37 31 37H17C14.5 37 13 34 14 32Z" fill="url(#soilFluidGrad)" />
          {/* 3D Elliptical Atomic Orbit 1 */}
          <ellipse cx="24" cy="26" rx="16" ry="7" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 2" transform="rotate(-30 24 26)" />
          {/* Orbiting Electron Particle */}
          <g transform="rotate(-30 24 26)" className="animate-[spin_6s_linear_infinite] origin-center">
            <circle cx="40" cy="26" r="2" fill="#e879f9" />
          </g>
          <defs>
            <linearGradient id="soilFluidGrad" x1="14" y1="26" x2="34" y2="37" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9333ea" />
              <stop offset="1" stopColor="#4c1d95" />
            </linearGradient>
          </defs>
        </svg>
      ),
    },

    recommendations: {
      name: 'Crop Recommendation',
      sub: 'MCDA Suitability & Gross Margin',
      conicBorder: 'from-emerald-400 via-amber-400 to-teal-500',
      beaconColor: 'bg-amber-400',
      renderSvg: (svgSize) => (
        <svg className={`${svgSize} text-emerald-400`} viewBox="0 0 48 48" fill="none">
          {/* Financial Stepped Bar Chart (Rising Yield Advantage) */}
          <rect x="8" y="28" width="6" height="12" rx="1.5" fill="#065f46" />
          <rect x="18" y="22" width="6" height="18" rx="1.5" fill="#047857" />
          <rect x="28" y="16" width="6" height="24" rx="1.5" fill="#059669" />
          <rect x="38" y="10" width="6" height="30" rx="1.5" fill="#10b981" />
          {/* Rising Genetic Crop Sprout */}
          <path d="M14 34Q24 26 28 12" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
          <path d="M28 12C28 12 34 10 36 15C38 20 31 20 28 12Z" fill="#34d399" />
          <path d="M28 14C28 14 22 14 21 19C20 24 26 23 28 14Z" fill="#10b981" />
          {/* Golden Growth Sparkle */}
          <circle cx="36" cy="10" r="2" fill="#facc15" className="animate-ping" />
        </svg>
      ),
    },

    analytics: {
      name: 'Disease Analytics',
      sub: 'SEIR Micro-Climate Spore Model',
      conicBorder: 'from-rose-500 via-amber-500 to-red-600',
      beaconColor: 'bg-rose-500',
      renderSvg: (svgSize) => (
        <svg className={`${svgSize} text-rose-500`} viewBox="0 0 48 48" fill="none">
          {/* SEIR Network Nodes & Vectors */}
          <line x1="14" y1="16" x2="24" y2="24" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="2 2" />
          <line x1="34" y1="14" x2="24" y2="24" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="2 2" />
          <line x1="18" y1="36" x2="24" y2="24" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="2 2" />
          <line x1="36" y1="34" x2="24" y2="24" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="2 2" />
          {/* Peripheral Infection Nodes */}
          <circle cx="14" cy="16" r="3" fill="#fb7185" />
          <circle cx="34" cy="14" r="3" fill="#fb7185" />
          <circle cx="18" cy="36" r="3" fill="#fb7185" />
          <circle cx="36" cy="34" r="3" fill="#fb7185" />
          {/* Core Spore Outbreak Inoculum Beacon with Ripple Waves */}
          <circle cx="24" cy="24" r="10" stroke="#f43f5e" strokeWidth="1" strokeOpacity="0.4" className="animate-ping" />
          <circle cx="24" cy="24" r="6" fill="#e11d48" />
          <circle cx="24" cy="24" r="2.5" fill="#ffffff" />
        </svg>
      ),
    },

    calendar: {
      name: 'Farming Calendar',
      sub: 'BBCH Phenology Chronometer',
      conicBorder: 'from-amber-400 via-orange-500 to-yellow-500',
      beaconColor: 'bg-amber-400',
      renderSvg: (svgSize) => (
        <svg className={`${svgSize} text-amber-400`} viewBox="0 0 48 48" fill="none">
          {/* 12-Spoke Phenological Chronometer Wheel */}
          <circle cx="24" cy="24" r="18" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" className="animate-[spin_18s_linear_infinite]" />
          <circle cx="24" cy="24" r="14" stroke="#fbbf24" strokeWidth="0.8" strokeOpacity="0.5" />
          {/* Clock Hands Tick */}
          <line x1="24" y1="24" x2="24" y2="12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <line x1="24" y1="24" x2="32" y2="24" stroke="#fde68a" strokeWidth="1.5" strokeLinecap="round" />
          {/* Solar Apex Indicator */}
          <circle cx="24" cy="24" r="3" fill="#d97706" />
          <circle cx="24" cy="24" r="1.5" fill="#ffffff" />
        </svg>
      ),
    },

    reports: {
      name: 'Reports & Interoperability',
      sub: 'ISO 11783 & APEDA Dossier',
      conicBorder: 'from-teal-400 via-cyan-500 to-emerald-600',
      beaconColor: 'bg-teal-400',
      renderSvg: (svgSize) => (
        <svg className={`${svgSize} text-teal-400`} viewBox="0 0 48 48" fill="none">
          {/* Official ISO Document Certificate */}
          <rect x="12" y="8" width="24" height="32" rx="3" fill="#0f291e" stroke="#2dd4bf" strokeWidth="1.5" />
          <line x1="16" y1="16" x2="28" y2="16" stroke="#5eead4" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="16" y1="22" x2="32" y2="22" stroke="#5eead4" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="16" y1="28" x2="26" y2="28" stroke="#5eead4" strokeWidth="1.2" strokeLinecap="round" />
          {/* Cryptographic Verified Checkmark Stamp */}
          <circle cx="28" cy="32" r="5" fill="#059669" />
          <path d="M26 32L27.5 33.5L30.5 30.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
          {/* Satellite Downlink Ray */}
          <line x1="24" y1="4" x2="24" y2="8" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="1 1" className="animate-pulse" />
        </svg>
      ),
    },

    settings: {
      name: 'Settings & Farm Hub',
      sub: 'LoRaWAN IoT & Security Key',
      conicBorder: 'from-slate-400 via-teal-500 to-indigo-600',
      beaconColor: 'bg-emerald-400',
      renderSvg: (svgSize) => (
        <svg className={`${svgSize} text-slate-300`} viewBox="0 0 48 48" fill="none">
          {/* Hexagonal Mesh IoT Gateway */}
          <polygon points="24,6 38,14 38,34 24,42 10,34 10,14" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 2" className="animate-[spin_20s_linear_infinite]" />
          {/* Concentric RF Radio Broadcast Waves */}
          <circle cx="24" cy="24" r="10" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.4" className="animate-[ping_3s_infinite]" />
          {/* Central Security Keyhole / Hardware Core */}
          <circle cx="24" cy="21" r="4" fill="#10b981" />
          <path d="M22 23H26L27 33H21L22 23Z" fill="#10b981" />
          <circle cx="24" cy="21" r="1.5" fill="#ffffff" />
        </svg>
      ),
    },

    schemes: {
      name: 'Learning & Schemes Hub',
      sub: 'Govt DBT & Video Masterclasses',
      conicBorder: 'from-amber-400 via-emerald-400 to-yellow-500',
      beaconColor: 'bg-amber-400',
      renderSvg: (svgSize) => (
        <svg className={`${svgSize} text-amber-300`} viewBox="0 0 48 48" fill="none">
          {/* Rotating Academic Halo / Government Seal Ring */}
          <circle cx="24" cy="24" r="19" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="5 3" className="animate-[spin_16s_linear_infinite]" />
          {/* Open Agricultural Knowledge Scroll / Book Base */}
          <path d="M8 34C14 31 19 32 24 35C29 32 34 31 40 34V16C34 13 29 14 24 17C19 14 14 13 8 16V34Z" fill="#047857" fillOpacity="0.3" stroke="#34d399" strokeWidth="1.5" />
          {/* Central Graduation Cap / Seal Peak */}
          <polygon points="24,11 36,17 24,23 12,17" fill="#fbbf24" fillOpacity="0.85" stroke="#f59e0b" strokeWidth="1.2" />
          <path d="M17 20V26C17 28.5 20.1 30.5 24 30.5C27.9 30.5 31 28.5 31 26V20" stroke="#fbbf24" strokeWidth="1.2" />
          {/* Hanging Tassel */}
          <path d="M36 17V26" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="36" cy="27" r="1.5" fill="#f59e0b" className="animate-ping" />
        </svg>
      ),
    },

    marketplace: {
      name: 'Mandi Marketplace',
      sub: 'Crop Trade & Razorpay/COD',
      conicBorder: 'from-amber-400 via-emerald-400 to-teal-500',
      beaconColor: 'bg-emerald-400',
      renderSvg: (svgSize) => (
        <svg className={`${svgSize} text-amber-300`} viewBox="0 0 48 48" fill="none">
          {/* Outer Rotating Currency / Blockchain Escrow Ring with Dashes */}
          <circle
            cx="24"
            cy="24"
            r="19"
            stroke="#10b981"
            strokeWidth="1.2"
            strokeDasharray="6 3"
            className="animate-[spin_12s_linear_infinite]"
          />
          {/* Digital Mandi Scales / Trade Balance Bar */}
          <path d="M13 16H35M24 16V30" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <circle cx="24" cy="16" r="2.5" fill="#f59e0b" />
          {/* Left Pan: Golden Grain Sheaf / Wheat Sacks */}
          <path d="M13 16L9 24H17L13 16Z" fill="#10b981" fillOpacity="0.45" stroke="#10b981" strokeWidth="1.2" />
          <circle cx="13" cy="26" r="1.5" fill="#fbbf24" className="animate-pulse" />
          {/* Right Pan: Digital Escrow Shield / Commodity Pan */}
          <path d="M35 16L31 24H39L35 16Z" fill="#f59e0b" fillOpacity="0.45" stroke="#f59e0b" strokeWidth="1.2" />
          <circle cx="35" cy="26" r="1.5" fill="#34d399" className="animate-pulse" />
          {/* Bidirectional Trade Arrows */}
          <path d="M16 38H32M32 38L28 35M32 38L28 41" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M32 34H16M16 34L20 31M16 34L20 37" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Center Rupee (₹) Emblem Badge */}
          <circle cx="24" cy="30" r="4.5" fill="#047857" stroke="#34d399" strokeWidth="1" />
          <text x="24" y="33" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontWeight="bold" fontFamily="system-ui, sans-serif">₹</text>
        </svg>
      ),
    },
  }

  const current = moduleConfig[module] || moduleConfig.dashboard

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* 21st.dev Conic Radiant Glow Container */}
      <div className="relative group cursor-pointer">
        {/* Rotating Outer Conic Gradient Glow Halo */}
        <div
          className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${current.conicBorder} opacity-60 blur-[5px] animate-[spin_8s_linear_infinite] group-hover:opacity-95 group-hover:blur-md transition duration-500`}
        />

        {/* Core Emblem Badge */}
        <div
          className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 via-forest-950 to-slate-900 shadow-xl ring-1 ring-white/20 transition-all duration-300 group-hover:scale-110 overflow-hidden ${sizeMap.box}`}
        >
          {/* Dynamic Light Sweep */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

          {/* Render Customized Vector */}
          {current.renderSvg(sizeMap.svg)}

          {/* Real-Time Telemetry Beacon */}
          {showTelemetryBeacon && (
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${current.beaconColor} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${current.beaconColor} ring-1 ring-slate-950`} />
            </span>
          )}
        </div>
      </div>

      {/* Optional Wordmark Label */}
      {showLabel && (
        <div className="flex flex-col">
          <span className={`font-black tracking-tight text-slate-900 dark:text-white ${sizeMap.label}`}>
            {current.name}
          </span>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
            {current.sub}
          </span>
        </div>
      )}
    </div>
  )
}

