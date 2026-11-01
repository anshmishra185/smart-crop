import { ArrowUpRight, Leaf } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">Smart Crop AI</p>
            </div>
          </div>
          <p className="max-w-sm text-sm text-slate-600">
            A frontend prototype designed to explore data-driven crop selection ideas for modern agricultural planning.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">
            Explore
          </h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li>
              <NavLink to="/" className="hover:text-slate-900">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard" className="hover:text-slate-900">
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/explore" className="hover:text-slate-900">
                Explore Crops
              </NavLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">
            Contact
          </h3>
          <a
            href="mailto:feedback@smartcropai.example"
            className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-emerald-700"
          >
            Share feedback
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <p className="mt-4 text-sm text-slate-600">Prototype project for educational demonstration.</p>
        </div>
      </div>
    </footer>
  )
}
