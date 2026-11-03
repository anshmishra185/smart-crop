interface AnimatedBrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero'
  showText?: boolean
  showPulseDot?: boolean
  className?: string
}

export function AnimatedBrandLogo({
  size = 'md',
  showText = false,
  showPulseDot = true,
  className = '',
}: AnimatedBrandLogoProps) {
  // Sizing mapping
  const sizeConfig = {
    sm: { box: 'h-8 w-8', svg: 'h-4.5 w-4.5', text: 'text-sm', badge: 'text-[9px]' },
    md: { box: 'h-11 w-11', svg: 'h-6 w-6', text: 'text-base', badge: 'text-[10px]' },
    lg: { box: 'h-16 w-16', svg: 'h-9 w-9', text: 'text-xl', badge: 'text-xs' },
    hero: { box: 'h-24 w-24', svg: 'h-14 w-14', text: 'text-3xl', badge: 'text-sm' },
  }[size]

  return (
    <div className={`inline-flex items-center gap-3.5 select-none ${className}`}>
      {/* 21st.dev Conic Gradient Spinning Aura Box */}
      <div className="relative group cursor-pointer">
        {/* 1. Infinite 360° Rotating Conic Gradient Outer Halo */}
        <div className="absolute -inset-1 rounded-2xl bg-[conic-gradient(from_0deg,#10b981,#047857,#34d399,#10b981)] opacity-70 blur-[6px] animate-[spin_6s_linear_infinite] group-hover:opacity-100 group-hover:blur-md transition duration-500" />

        {/* 2. Secondary Ambient Glow Ring */}
        <div className="absolute -inset-2 rounded-3xl bg-emerald-500/20 blur-xl group-hover:bg-emerald-400/35 transition duration-500 pointer-events-none" />

        {/* 3. Core Badge Container with Specular Shine Effect */}
        <div
          className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 via-forest-950 to-slate-900 shadow-2xl ring-1 ring-white/30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-1 overflow-hidden ${sizeConfig.box}`}
        >
          {/* Subtle Dynamic Shine Sweep across Badge */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

          {/* Precision SVG Vector Emblem */}
          <svg
            className={`${sizeConfig.svg} text-emerald-400 transition-transform duration-700 group-hover:scale-105`}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Hexagonal Telemetry Ring (Dotted Spin) */}
            <circle
              cx="24"
              cy="24"
              r="22"
              stroke="#34d399"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              strokeOpacity="0.5"
              className="animate-[spin_12s_linear_infinite]"
            />

            {/* Elliptical Satellite Orbit 1 */}
            <ellipse
              cx="24"
              cy="24"
              rx="20"
              ry="10"
              stroke="#10b981"
              strokeWidth="0.8"
              strokeOpacity="0.3"
              transform="rotate(35 24 24)"
            />

            {/* Orbiting Micro-Satellite Planet */}
            <g transform="rotate(35 24 24)" className="animate-[spin_7s_linear_infinite] origin-center">
              <circle cx="44" cy="24" r="2.2" fill="#34d399" className="shadow-lg shadow-emerald-400" />
            </g>

            {/* Reverse Orbiting Satellite */}
            <g transform="rotate(-45 24 24)" className="animate-[spin_9s_linear_infinite] origin-center">
              <circle cx="4" cy="24" r="1.8" fill="#6ee7b7" />
            </g>

            {/* Living Chlorophyll Leaf Geometry with Neural Gradient */}
            <path
              d="M24 7C24 7 37 13 37 26C37 33.1797 31.1797 39 24 39C16.8203 39 11 33.1797 11 26C11 17 20 10 24 7Z"
              fill="url(#quantumLeafGradient)"
              className="drop-shadow-[0_2px_10px_rgba(16,185,129,0.4)]"
            />

            {/* Circuit Micro-Traces (Animated Dashoffset effect) */}
            <path
              d="M13 25H18L21 21H27L30 25H35"
              stroke="#a7f3d0"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeDasharray="20"
              className="animate-[pulse_2s_ease-in-out_infinite]"
            />

            {/* Main Central Nutrient Stem */}
            <path
              d="M24 13V35M24 20L31 16M24 25L17 21M24 29L30 26"
              stroke="#ffffff"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            {/* Optical Sensor Core with Multi-Ring Radars */}
            <circle cx="24" cy="24" r="4.5" fill="#ffffff" />
            <circle cx="24" cy="24" r="2.5" fill="#047857" />

            <defs>
              <linearGradient
                id="quantumLeafGradient"
                x1="11"
                y1="7"
                x2="37"
                y2="39"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#34d399" />
                <stop offset="0.45" stopColor="#10b981" />
                <stop offset="0.85" stopColor="#047857" />
                <stop offset="1" stopColor="#064e3b" />
              </linearGradient>
            </defs>
          </svg>

          {/* Real-time Telemetry Pulse Beacon */}
          {showPulseDot && (
            <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 ring-2 ring-slate-950" />
            </span>
          )}
        </div>
      </div>

      {/* Brand Wordmark with Shimmering Accent */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight text-slate-900 dark:text-white ${sizeConfig.text}`}>
              Krishi<span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 bg-clip-text text-transparent ml-1">Saarthi</span>
            </span>
            <span className={`rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 px-2 py-0.5 font-black uppercase text-emerald-800 dark:text-emerald-300 ${sizeConfig.badge}`}>
              AI FMS
            </span>
          </div>
          <span className="text-[10px] font-medium tracking-wide text-slate-500 dark:text-slate-400">
            Autonomous Agronomic Operating System
          </span>
        </div>
      )}
    </div>
  )
}
