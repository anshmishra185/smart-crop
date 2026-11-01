import { Menu, Sprout, User as UserIcon, X } from 'lucide-react'
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
  const { user, signOut, openAuthModal } = useAuth()

  const handleSignOut = async () => {
    setSignOutError((await signOut()) ?? '')
    setIsOpen(false)
  }

  const handleOpenAuth = () => {
    setIsOpen(false)
    openAuthModal()
  }

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100/80 bg-white/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3 group" aria-label="Smart Crop AI home page">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-sm transition-transform group-hover:scale-105">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-slate-900">Smart Crop AI</p>
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

        {/* Desktop Profile / Sign-in */}
        <div className="hidden md:flex md:items-center md:gap-3">
          {user ? (
            <div className="flex items-center gap-2.5 rounded-full border border-slate-200/90 bg-white/70 py-1 pl-1.5 pr-2.5 shadow-sm backdrop-blur-sm">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="h-7 w-7 rounded-full object-cover ring-2 ring-emerald-500/20"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                  {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="h-3.5 w-3.5" />}
                </div>
              )}
              <span className="max-w-[130px] truncate text-xs font-medium text-slate-700">
                {user.givenName || user.name || user.email}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="ml-1 rounded-full px-2.5 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Button
              onClick={openAuthModal}
              className="rounded-full shadow-sm active:scale-95 transition-all"
            >
              Sign in / Sign up
            </Button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200/90 bg-white/80 p-2 text-slate-700 md:hidden transition-colors"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen ? (
        <div className="border-t border-slate-200/80 bg-white/95 backdrop-blur-xl md:hidden animate-in slide-in-from-top-2">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1.5 px-4 py-4 sm:px-6">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="mt-2 border-t border-slate-100 pt-3">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-2 py-1">
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                        {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="truncate text-sm font-medium text-slate-900">{user.name}</p>
                      <p className="truncate text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <Button className="mt-1 w-full" onClick={handleSignOut} variant="outline">
                    Sign out
                  </Button>
                </div>
              ) : (
                <Button className="w-full rounded-2xl" onClick={handleOpenAuth}>
                  Sign in / Sign up
                </Button>
              )}
            </div>
          </nav>
        </div>
      ) : null}

      {signOutError ? (
        <p className="border-t border-red-100 bg-red-50 px-4 py-2 text-center text-xs text-red-700" role="alert">
          Sign out failed: {signOutError}
        </p>
      ) : null}
    </header>
  )
}
