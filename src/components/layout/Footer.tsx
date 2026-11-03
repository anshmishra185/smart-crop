import { Globe, Mail, Share2, Sprout } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Explore Crops', href: '/explore' },
  { label: 'About', href: '/about' },
]

const socialLinks = [
  { icon: Globe, href: '#', label: 'Website' },
  { icon: Share2, href: '#', label: 'Share' },
  { icon: Mail, href: 'mailto:feedback@smartcropai.example', label: 'Email' },
]

const CURRENT_YEAR = 2026

export function Footer() {
  const year = CURRENT_YEAR

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-md">
                <Sprout className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-white">Smart Crop AI</p>
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-400">
                  Precision Agriculture
                </p>
              </div>
            </div>
            <p className="max-w-xs text-sm leading-7 text-slate-400">
              A frontend prototype exploring how AI-powered soil and climate analysis can guide smarter,
              more sustainable crop planning.
            </p>

            {/* Social icons */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-400 transition-all hover:border-emerald-500/40 hover:bg-emerald-900/30 hover:text-emerald-400"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Navigate
            </h3>
            <ul className="space-y-3">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <NavLink
                    to={href}
                    end={href === '/'}
                    className={({ isActive }) =>
                      `text-sm transition-colors ${
                        isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Features
            </h3>
            <ul className="space-y-3 text-sm">
              {['Soil analysis', 'Climate scoring', 'Crop library', 'Confidence scores'].map((item) => (
                <li key={item} className="text-slate-400">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Contact
            </h3>
            <a
              href="mailto:feedback@smartcropai.example"
              className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-emerald-400"
            >
              <Mail className="h-4 w-4" />
              Share feedback
            </a>
            <p className="mt-4 text-xs leading-6 text-slate-500">
              Educational prototype — not a production recommendation service. Use for research and design
              evaluation only.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>© {year} Smart Crop AI. Frontend prototype for educational use.</p>
          <div className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400">Demo mode active</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
