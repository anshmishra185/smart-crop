import { Home } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '../components/ui/button'

export function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          The page you are looking for does not exist or has moved.
        </p>
        <Link to="/" className="mt-6 inline-block">
          <Button>
            <Home className="mr-2 h-4 w-4" />
            Return home
          </Button>
        </Link>
      </div>
    </div>
  )
}
