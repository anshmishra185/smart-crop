import { Menu, Sprout, User as UserIcon, X, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
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
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { user, signOut, openAuthModal } = useAuth()

  // Scroll-aware shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignOut = async () => {
    setSignOutError((await signOut()) ?? '')
    setIsOpen(false)
    setUserMenuOpen(false)
  }

  const handleOpenAuth = () => {
    setIsOpen(false)
    openAuthModal()
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/70 bg-white/90 shadow-nav backdrop-blur-xl'
          : 'border-b border-transparent bg-white/70 backdrop-blur-lg'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <NavLink
          to="/"
          className="group flex items-center gap-3"
          aria-label="Smart Crop AI home page"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-glow-emerald">
            <Sprout className="h-5 w-5 drop-shadow-sm" />
            <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div>
            <p className="text-[15px] font-semibold tracking-tight text-slate-900">Smart Crop AI</p>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-600">
              Precision Agriculture
            </p>
          </div>
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                `relative rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-emerald-500" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex md:items-center md:gap-3">
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2.5 rounded-full border border-slate-200/90 bg-white/70 py-1 pl-1.5 pr-3 shadow-sm backdrop-blur-sm transition-all hover:border-emerald-200 hover:bg-emerald-50/60"
              >
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="h-7 w-7 rounded-full object-cover ring-2 ring-emerald-400/30"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-xs font-bold text-white shadow-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="h-3.5 w-3.5" />}
                  </div>
                )}
                <span className="max-w-[120px] truncate text-xs font-medium text-slate-700">
                  {user.givenName || user.name || user.email}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                    userMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* User dropdown */}
              {userMenuOpen && (
                <div className="animate-slide-down absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card-hover">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={openAuthModal}
              className="rounded-full px-5 shadow-sm transition-all active:scale-95"
            >
              Sign in / Sign up
            </Button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200/90 bg-white/80 p-2 text-slate-700 transition-colors hover:bg-slate-50 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((v) => !v)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="animate-slide-down border-t border-slate-200/70 bg-white/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="mr-3 h-4 w-1 rounded-full bg-emerald-500" />
                    )}
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}

            <div className="mt-2 border-t border-slate-100 pt-3">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                    {user.picture ? (
                      <img src={user.picture} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-bold text-white">
                        {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="truncate text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleSignOut} variant="outline">
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
      )}

      {signOutError && (
        <p className="border-t border-red-100 bg-red-50 px-4 py-2 text-center text-xs text-red-700" role="alert">
          Sign out failed: {signOutError}
        </p>
      )}
    </header>
  )
}
