import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Leaf,
  Sparkles,
  X,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  RotateCw,
  CheckCircle2,
  Lock,
  User,
  Check
} from 'lucide-react'
import { useAuth } from '../../auth/useAuth'
import { isGoogleConfigured } from '../../lib/googleAuth'

type AuthChannel = 'phone' | 'email'
type AuthMode = 'login' | 'signup'

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    signInWithGoogle,
    signInDemo,
    requestOtp,
    verifyOtp,
    loading,
  } = useAuth()

  const [channel, setChannel] = useState<AuthChannel>('phone')
  const [mode, setMode] = useState<AuthMode>('login')
  const [step, setStep] = useState<'input' | 'otp'>('input')

  // Form Inputs
  const [phoneNumber, setPhoneNumber] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'farmer' | 'buyer' | 'agronomist'>('farmer')
  const [otpCode, setOtpCode] = useState('')

  // Telemetry & Feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successNotice, setSuccessNotice] = useState<string | null>(null)
  const [maskedIdentifier, setMaskedIdentifier] = useState('')
  const [devOtp, setDevOtp] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(60)
  const [isResending, setIsResending] = useState(false)

  const googleBtnRef = useRef<HTMLDivElement>(null)
  const otpInputRef = useRef<HTMLInputElement>(null)

  const handleClose = useCallback(() => {
    setErrorMessage(null)
    setSuccessNotice(null)
    setStep('input')
    setOtpCode('')
    closeAuthModal()
  }, [closeAuthModal])

  // ESC key and body scroll lock
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

  // Countdown timer for OTP resend
  useEffect(() => {
    if (step !== 'otp' || countdown <= 0) return
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [step, countdown])

  // Auto-focus OTP input on step change
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => {
        otpInputRef.current?.focus()
      }, 150)
    }
  }, [step])

  // Native Google One-Tap / GIS Button Setup
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

  // Handle Dispatching OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setErrorMessage(null)
    setSuccessNotice(null)

    const targetId = channel === 'phone' ? phoneNumber.trim() : emailAddress.trim()

    if (!targetId) {
      setErrorMessage(
        channel === 'phone'
          ? 'Please enter your 10-digit mobile number.'
          : 'Please enter your valid email address.'
      )
      return
    }

    if (channel === 'phone' && targetId.replace(/\D/g, '').length < 10) {
      setErrorMessage('Mobile number must be at least 10 digits.')
      return
    }

    if (channel === 'email' && !targetId.includes('@')) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    if (mode === 'signup' && !fullName.trim()) {
      setErrorMessage('Please enter your full name for registration.')
      return
    }

    try {
      const res = await requestOtp(
        targetId,
        channel,
        mode,
        mode === 'signup' ? fullName : undefined,
        role
      )

      setMaskedIdentifier(res.maskedIdentifier)
      if (res.devOtp) {
        setDevOtp(res.devOtp)
      }
      setSuccessNotice(res.message)
      setStep('otp')
      setCountdown(60)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send OTP.'
      setErrorMessage(msg)
    }
  }

  // Handle Verifying OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setErrorMessage(null)
    setSuccessNotice(null)

    if (!otpCode || otpCode.trim().length < 6) {
      setErrorMessage('Please enter the complete 6-digit OTP code.')
      return
    }

    const targetId = channel === 'phone' ? phoneNumber.trim() : emailAddress.trim()

    try {
      const success = await verifyOtp(targetId, otpCode.trim())
      if (success) {
        handleClose()
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid OTP code. Please try again.'
      setErrorMessage(msg)
    }
  }

  // Quick Auto-Fill for Testing & Hackathon Evaluation
  const handleQuickFillOtp = () => {
    if (devOtp) {
      setOtpCode(devOtp)
    } else {
      setOtpCode('999999')
    }
  }

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return
    setIsResending(true)
    setErrorMessage(null)
    try {
      await handleSendOtp()
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-md transition-all duration-300 sm:items-center sm:p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md rounded-t-[32px] border border-white/60 bg-white/95 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.2)] backdrop-blur-2xl transition-all sm:rounded-[32px] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="mx-auto -mt-2 mb-4 h-1.5 w-10 rounded-full bg-slate-300/80 sm:hidden" />

        {/* Circular Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-800 active:scale-95 sm:right-6 sm:top-6"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header with Krishi Saarthi Squircle */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/25 ring-4 ring-emerald-50">
            <Leaf className="h-7 w-7" />
          </div>

          <h2
            id="auth-modal-title"
            className="mt-4 text-2xl font-black tracking-tight text-slate-900"
          >
            Krishi Saarthi
          </h2>
          <p className="mx-auto mt-1 max-w-xs text-xs text-slate-500 font-medium">
            AI-Powered Agronomic Intelligence & Fintech APMC Escrow
          </p>
        </div>

        {/* Channel Selector Tabs (Mobile OTP vs Email OTP) */}
        {step === 'input' && (
          <div className="mt-5">
            {/* Login / Register Toggle */}
            <div className="flex rounded-2xl bg-slate-100 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 rounded-xl py-2 transition-all ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In (Login)
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 rounded-xl py-2 transition-all ${
                  mode === 'signup'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Register (New Farmer)
              </button>
            </div>

            {/* Verification Channel Pill Toggle */}
            <div className="mt-3 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setChannel('phone')}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                  channel === 'phone'
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Mobile OTP</span>
              </button>
              <button
                type="button"
                onClick={() => setChannel('email')}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                  channel === 'email'
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Email OTP</span>
              </button>
            </div>
          </div>
        )}

        {/* Error / Notice Banners */}
        {errorMessage && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50/90 p-3 text-center text-xs font-semibold text-red-700 animate-in fade-in">
            {errorMessage}
          </div>
        )}

        {successNotice && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-3 text-center text-xs font-bold text-emerald-800 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* STEP 1: INPUT IDENTIFIER */}
        {step === 'input' && (
          <form onSubmit={handleSendOtp} className="mt-4 space-y-3.5">
            {/* If Sign Up mode: ask for Full Name & Role */}
            {mode === 'signup' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Farmer / User Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Balwinder Singh Dhillon"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Select Platform Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'farmer' | 'buyer' | 'agronomist')}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs font-bold text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  >
                    <option value="farmer">🌾 Farmer / Cultivator (ਕਿਸਾਨ)</option>
                    <option value="buyer">🏢 APMC Mandi Trader / Grain Buyer</option>
                    <option value="agronomist">🔬 Agronomist / Soil Scientist</option>
                  </select>
                </div>
              </div>
            )}

            {/* Mobile Number Input */}
            {channel === 'phone' ? (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Number (India)
                </label>
                <div className="flex gap-2">
                  <span className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-100 px-3.5 text-xs font-bold text-slate-700 select-none">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="98140 23891"
                    maxLength={14}
                    className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    autoFocus
                  />
                </div>
              </div>
            ) : (
              /* Email ID Input */
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="farmer.grower@punjabagri.in"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* Send OTP Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 text-sm font-bold text-white shadow-md shadow-emerald-600/25 transition-all hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] disabled:opacity-60"
            >
              <span>{loading ? 'Dispatching OTP…' : 'Send One-Time Password'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* STEP 2: VERIFY OTP CODE */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="mt-4 space-y-4">
            <div className="rounded-2xl bg-slate-50 p-3.5 text-center border border-slate-200/80">
              <p className="text-xs text-slate-500">
                Enter the 6-digit verification code dispatched to:
              </p>
              <p className="mt-0.5 text-sm font-black text-slate-900 tracking-wide">
                {maskedIdentifier || phoneNumber || emailAddress}
              </p>
            </div>

            {/* Dev / Hackathon Auto-fill Pill */}
            {devOtp && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleQuickFillOtp}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 border border-emerald-300 hover:bg-emerald-200 active:scale-95 transition-all"
                  title="Click to automatically fill test OTP"
                >
                  <Sparkles className="h-3 w-3 text-emerald-600" />
                  <span>Test Code: {devOtp} (Click to Fill)</span>
                </button>
              </div>
            )}

            {/* 6-Digit OTP Code Input */}
            <div>
              <label className="block text-center text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                6-Digit Security Code
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  ref={otpInputRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[0.4em] font-mono text-xl font-bold rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-10 text-slate-900 placeholder-slate-300 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || otpCode.length < 6}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-bold text-white shadow-md shadow-emerald-600/25 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{loading ? 'Verifying Code…' : 'Verify & Enter Platform'}</span>
            </button>

            {/* Resend & Change Identifier Links */}
            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="font-medium text-slate-500 hover:text-slate-800 hover:underline"
              >
                ← Change Number / Email
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={countdown > 0 || isResending}
                className="flex items-center gap-1 font-bold text-emerald-700 hover:underline disabled:opacity-50 disabled:no-underline"
              >
                <RotateCw className={`h-3 w-3 ${isResending ? 'animate-spin' : ''}`} />
                <span>
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                </span>
              </button>
            </div>
          </form>
        )}

        {/* Alternative 1-Click Access Methods */}
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5">
          {/* Instant Demo Sign-In Button */}
          <button
            type="button"
            onClick={signInDemo}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/80 px-4 text-xs font-bold text-emerald-800 transition-all hover:bg-emerald-100 hover:border-emerald-400 active:scale-[0.98]"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Instant Demo: Sardar Balwinder Singh (Punjab)</span>
          </button>

          {/* Google Sign-In Option */}
          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={loading}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
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
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Security & Regulatory Footer */}
        <p className="mt-4 text-center text-[10px] leading-relaxed text-slate-400">
          Encrypted with SHA-256 OTP tokens & compliant with IT Act 2000.
        </p>
      </div>
    </div>
  )
}
