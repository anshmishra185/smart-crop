import { useCallback, useEffect, useRef, useState } from 'react'
import { Leaf, Sparkles, X } from 'lucide-react'
import { useAuth } from '../../auth/useAuth'
import { isGoogleConfigured } from '../../lib/googleAuth'

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    signInWithGoogle,
    signInDemo,
    loading,
  } = useAuth()

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const googleBtnRef = useRef<HTMLDivElement>(null)

  const handleClose = useCallback(() => {
    setErrorMessage(null)
    closeAuthModal()
  }, [closeAuthModal])

  // ESC key and body scroll-lock handling
  useEffect(() => {
    if (!isAuthModalOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isAuthModalOpen, handleClose])

  // Render official GIS button when Google Client ID is configured
  useEffect(() => {
    if (!isAuthModalOpen || !isGoogleConfigured || !googleBtnRef.current) return

    try {
      if (window.google?.accounts?.id) {
        googleBtnRef.current.innerHTML = ''
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          shape: 'pill',
          text: 'continue_with',
          logo_alignment: 'left',
          width: 280,
        })
      }
    } catch (err) {
      console.warn('Unable to render native Google button:', err)
    }
  }, [isAuthModalOpen])

  if (!isAuthModalOpen) return null

  const handleGoogleClick = async () => {
    setErrorMessage(null)
    try {
      if (!isGoogleConfigured) {
        setErrorMessage(
          'Google Sign-In is not configured yet. Please add your Google Client ID to your .env file or use Instant Demo Mode.',
        )
        return
      }
      await signInWithGoogle()
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Google sign-in could not be completed.'
      setErrorMessage(message)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-md transition-all duration-300 sm:items-center sm:p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={handleClose}
    >
      {/* iOS sheet on mobile, macOS centered floating card on desktop */}
      <div
        className="relative w-full max-w-sm rounded-t-[32px] border border-white/60 bg-white/95 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.18)] backdrop-blur-2xl transition-all sm:rounded-[32px] sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* iOS Grab Handle for Mobile */}
        <div className="mx-auto -mt-2 mb-4 h-1.5 w-10 rounded-full bg-slate-300/80 sm:hidden" />

        {/* macOS / iOS Circular Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-800 active:scale-95 sm:right-6 sm:top-6"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header with Apple-style Squircle Badge */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/25 ring-4 ring-emerald-50">
            <Leaf className="h-7 w-7" />
          </div>

          <h2
            id="auth-modal-title"
            className="mt-4 text-2xl font-bold tracking-tight text-slate-900"
          >
            Smart Crop AI
          </h2>
          <p className="mx-auto mt-1 max-w-xs text-xs text-slate-500">
            Sign in to access your recommendations and crop records.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50/80 p-3 text-center text-xs text-red-700 backdrop-blur-sm">
            {errorMessage}
          </div>
        )}

        {/* Primary Action Section */}
        <div className="mt-6 space-y-3">
          {/* Custom Apple-inspired Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={loading}
            className="group relative flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {/* Authentic Google Multi-Color G Icon */}
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.78-2.1-6.73-4.93H1.24v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.24 6.58l4.03 3.15c.95-2.83 3.61-4.98 6.73-4.98z"
              />
            </svg>

            <span>{loading ? 'Connecting to Google…' : 'Continue with Google'}</span>
          </button>

          {/* Embedded native GIS button container (when configured) */}
          {isGoogleConfigured && (
            <div className="flex justify-center pt-1">
              <div ref={googleBtnRef} />
            </div>
          )}

          {/* Divider */}
          <div className="relative py-1.5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200/80" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider text-slate-400">
              <span className="bg-white px-2.5">or</span>
            </div>
          </div>

          {/* Instant Demo Sign-In Button */}
          <button
            type="button"
            onClick={signInDemo}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/70 px-4 text-xs font-semibold text-emerald-800 transition-all hover:bg-emerald-100/70 hover:border-emerald-400 active:scale-[0.98]"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Try Instant Demo Mode</span>
          </button>
        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-[11px] leading-relaxed text-slate-400">
          By signing in, you agree to our Terms of Service & Privacy Policy.
        </p>
      </div>
    </div>
  )
}
