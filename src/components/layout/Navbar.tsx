import { Menu, Sprout, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import { useAuth } from '../../auth/useAuth'
import { Button } from '../ui/button'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Explore Crops', href: '/explore' },
  { label: 'About', href: '/about' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [signOutError, setSignOutError] = useState('')
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    setSignOutError((await signOut()) ?? '')
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3" aria-label="Smart Crop AI home page">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">Smart Crop AI</p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-emerald-700' : 'text-slate-600 hover:text-slate-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="max-w-40 truncate text-sm text-slate-600">{user.email ?? user.phone}</span>
              <Button variant="outline" onClick={handleSignOut}>Sign out</Button>
            </div>
          ) : (
            <NavLink to="/auth">
              <Button>Sign in / Sign up</Button>
            </NavLink>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-slate-200 p-2 text-slate-700 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {user ? (
              <Button className="mt-2 w-full" onClick={handleSignOut} variant="outline">Sign out</Button>
            ) : (
              <NavLink to="/auth" onClick={() => setIsOpen(false)}>
                <Button className="mt-2 w-full">Sign in / Sign up</Button>
              </NavLink>
            )}
          </nav>
        </div>
      ) : null}
      {signOutError ? (
        <p className="border-t border-red-100 bg-red-50 px-4 py-2 text-center text-sm text-red-700" role="alert">
          Sign out failed: {signOutError}
        </p>
      ) : null}
    </header>
  )
}
