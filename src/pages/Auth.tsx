import { useState, type FormEvent } from 'react'
import { CheckCircle2, Leaf, Mail, MessageSquare, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/useAuth'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

type AuthMode = 'login' | 'signup'
type AuthStep =
  | 'form'
  | 'signup-email'
  | 'signup-phone'
  | 'login-email'
  | 'login-phone'
  | 'complete'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^\+[1-9]\d{7,14}$/

export function Auth() {
  const navigate = useNavigate()
  const { user, session, assuranceLevel, loading: authLoading, signOut } = useAuth()
  const [mode, setMode] = useState<AuthMode>('signup')
  const [step, setStep] = useState<AuthStep>('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [emailCode, setEmailCode] = useState('')
  const [phoneCode, setPhoneCode] = useState('')
  const [factorId, setFactorId] = useState<string>()
  const [challengeId, setChallengeId] = useState<string>()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const normalizedEmail = email.trim().toLowerCase()
  const normalizedPhone = phone.trim()

  const clearFeedback = () => {
    setError('')
    setMessage('')
  }

  const sendEmailCode = async (shouldCreateUser: boolean) => {
    const client = supabase
    if (!client) {
      setError('Authentication is not configured yet.')
      return false
    }

    const emailResponse = await client.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        shouldCreateUser,
        ...(shouldCreateUser ? { data: { full_name: name.trim() } } : {}),
      },
    })
    if (emailResponse.error) {
      setError(`Email code could not be sent: ${emailResponse.error.message}`)
      return false
    }

    setMessage(`A verification code was sent to ${normalizedEmail}.`)
    return true
  }

  const sendPhoneChallenge = async (nextFactorId: string) => {
    const client = supabase
    if (!client) {
      setError('Authentication is not configured yet.')
      return false
    }

    const { data, error: challengeError } = await client.auth.mfa.challenge({
      factorId: nextFactorId,
      channel: 'sms',
    })
    if (challengeError) {
      setError(`Mobile code could not be sent: ${challengeError.message}`)
      return false
    }

    setFactorId(nextFactorId)
    setChallengeId(data.id)
    return true
  }

  const enrollPhoneFactor = async () => {
    const client = supabase
    if (!client) {
      setError('Authentication is not configured yet.')
      return false
    }

    const { data: factors, error: factorsError } = await client.auth.mfa.listFactors()
    if (factorsError) {
      setError(`Unable to check your mobile verification setup: ${factorsError.message}`)
      return false
    }

    const existingFactor = factors.all.find(
      (factor) =>
        factor.factor_type === 'phone' &&
        factor.friendly_name === normalizedPhone,
    )
    let nextFactorId = existingFactor?.id

    if (!nextFactorId) {
      const { data, error: enrollError } = await client.auth.mfa.enroll({
        factorType: 'phone',
        phone: normalizedPhone,
        friendlyName: normalizedPhone,
      })
      if (enrollError) {
        setError(`Mobile verification could not be started: ${enrollError.message}`)
        return false
      }
      nextFactorId = data.id
    }

    const challengeSent = await sendPhoneChallenge(nextFactorId)
    if (challengeSent) {
      setStep('signup-phone')
      setMessage(`Email verified. Enter the mobile code sent to ${normalizedPhone}.`)
    }
    return challengeSent
  }

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    clearFeedback()

    if (!isSupabaseConfigured || !supabase) {
      setError('Authentication is not configured. Add a valid Supabase project URL and publishable or anon key to the root .env file, then restart the app.')
      return
    }

    if (!emailPattern.test(normalizedEmail)) {
      setError('Enter a valid email address.')
      return
    }
    if (!phonePattern.test(normalizedPhone)) {
      setError('Enter a mobile number in international format, including the + and country code.')
      return
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Enter your name.')
        return
      }
    }

    setBusy(true)
    try {
      if (mode === 'signup') {
        const sent = await sendEmailCode(true)
        if (!sent) return
        setStep('signup-email')
        setMessage(`Enter the verification code sent to ${normalizedEmail}.`)
        return
      }

      const sent = await sendEmailCode(false)
      if (sent) setStep('login-email')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'The authentication request failed.')
    } finally {
      setBusy(false)
    }
  }

  const handleCodeSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    clearFeedback()
    const client = supabase
    if (!client) {
      setError('Authentication is not configured yet.')
      return
    }

    if ((step === 'signup-email' || step === 'login-email') && !/^\d{6}$/.test(emailCode)) {
      setError('Enter the 6-digit code sent to your email.')
      return
    }
    if ((step === 'signup-phone' || step === 'login-phone') && !/^\d{6}$/.test(phoneCode)) {
      setError('Enter the 6-digit code sent to your mobile.')
      return
    }

    setBusy(true)
    try {
      if (step === 'signup-email') {
        const { error: verifyError } = await client.auth.verifyOtp({
          email: normalizedEmail,
          token: emailCode,
          type: 'email',
        })
        if (verifyError) {
          setError(verifyError.message)
          return
        }
        await enrollPhoneFactor()
        return
      }

      if (step === 'login-email') {
        const { data: emailData, error: emailError } = await client.auth.verifyOtp({
          email: normalizedEmail,
          token: emailCode,
          type: 'email',
        })
        if (emailError) {
          setError(emailError.message)
          return
        }
        if (!emailData.user) {
          setError('Email verification succeeded without an account session. Please try signing in again.')
          return
        }

        const { data: factors, error: factorsError } = await client.auth.mfa.listFactors()
        if (factorsError) {
          setError(`Unable to load your mobile verification method: ${factorsError.message}`)
          return
        }
        const phoneFactor = factors.all.find(
          (factor) =>
            factor.factor_type === 'phone' &&
            factor.status === 'verified' &&
            factor.friendly_name === normalizedPhone,
        )
        if (!phoneFactor) {
          await client.auth.signOut()
          setError('No verified mobile factor matches this account. Check the mobile number used at signup.')
          setStep('form')
          return
        }

        if (!await sendPhoneChallenge(phoneFactor.id)) return
        setStep('login-phone')
        setMessage('Email verified. Enter the code sent to your registered mobile.')
        return
      }

      if (step === 'signup-phone' || step === 'login-phone') {
        if (!factorId || !challengeId) {
          await client.auth.signOut()
          setError('This verification request expired. Start signing in again.')
          setStep('form')
          return
        }

        const { error: verifyError } = await client.auth.mfa.verify({
          factorId,
          challengeId,
          code: phoneCode,
        })
        if (verifyError) {
          setError(verifyError.message)
          return
        }

        const { data: assurance, error: assuranceError } =
          await client.auth.mfa.getAuthenticatorAssuranceLevel()
        if (assuranceError) {
          setError(`The mobile code was accepted, but sign-in could not be confirmed: ${assuranceError.message}`)
          return
        }
        if (assurance.currentLevel !== 'aal2') {
          setError('The mobile code was accepted, but the session is not fully verified. Please try again.')
          return
        }

        setStep('complete')
        setMessage(
          step === 'signup-phone'
            ? 'Email and mobile verified. Your account is ready.'
            : 'Email and mobile verified. You are signed in.',
        )
        return
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'The verification request failed.')
    } finally {
      setBusy(false)
    }
  }

  const handleResend = async () => {
    clearFeedback()
    const client = supabase
    if (!client) {
      setError('Authentication is not configured yet.')
      return
    }
    setBusy(true)
    try {
      if (step === 'signup-email' || step === 'login-email') {
        const sent = await sendEmailCode(step === 'signup-email')
        if (!sent) return
        setMessage(`A new code was sent to ${normalizedEmail}.`)
      } else if (step === 'signup-phone' || step === 'login-phone') {
        if (!factorId) {
          setError('This verification request expired. Start signing in again.')
          return
        }
        const sent = await sendPhoneChallenge(factorId)
        if (sent) setMessage('A new mobile verification code was sent.')
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to resend the verification code.')
    } finally {
      setBusy(false)
    }
  }

  const resetFlow = async () => {
    setStep('form')
    setEmailCode('')
    setPhoneCode('')
    setFactorId(undefined)
    setChallengeId(undefined)
    clearFeedback()
    if (session && assuranceLevel !== 'aal2') {
      const signOutError = await signOut()
      if (signOutError) setError(`Unable to clear the incomplete sign-in: ${signOutError}`)
    }
  }

  if (authLoading) {
    return (
      <main className="mx-auto max-w-xl px-4 py-20 text-center text-slate-600">
        Restoring your sign-in…
      </main>
    )
  }

  if (user && step === 'form') {
    return (
      <main className="mx-auto max-w-xl px-4 py-20">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-700" />
          <h1 className="mt-4 text-2xl font-semibold text-slate-900">You’re signed in</h1>
          <p className="mt-2 text-slate-600">{user.email ?? user.phone}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={() => navigate('/dashboard')}>Go to dashboard</Button>
            <Button variant="outline" onClick={async () => setError((await signOut()) ?? '')}>
              Sign out
            </Button>
          </div>
          {error ? <p className="mt-4 text-sm text-red-700" role="alert">{error}</p> : null}
        </div>
      </main>
    )
  }

  if (step === 'complete') {
    return (
      <main className="mx-auto max-w-xl px-4 py-20">
        <div className="rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-700" />
          <h1 className="mt-4 text-2xl font-semibold text-slate-900">Verification complete</h1>
          <p className="mt-2 text-slate-600">{message}</p>
          <Button className="mt-6" onClick={() => navigate('/dashboard')}>Continue to dashboard</Button>
        </div>
      </main>
    )
  }

  const heading =
    step === 'signup-email'
      ? 'Verify your email'
      : step === 'signup-phone'
        ? 'Verify your mobile'
        : step === 'login-email'
          ? 'Verify your email'
          : step === 'login-phone'
            ? 'Verify your mobile'
            : mode === 'signup'
              ? 'Create your account'
              : 'Welcome back'

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-slate-900 px-6 py-7 text-white sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-300">Smart Crop AI</p>
              <h1 className="mt-1 text-2xl font-semibold">{heading}</h1>
            </div>
          </div>
          <p className="mt-4 max-w-lg text-sm leading-6 text-slate-300">
            {step === 'login-email' || step === 'login-phone'
              ? 'Sign in securely with an email code and a second verification code sent to your registered mobile.'
              : mode === 'signup'
                ? 'Verify your email and mobile number to finish setting up your account.'
                : 'Sign in securely with verification codes sent to both your registered contacts.'}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {!isSupabaseConfigured ? (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900" role="status">
              <p className="font-semibold">Valid Supabase settings are required to enable OTP delivery.</p>
              <p className="mt-1">
                Add your project URL and publishable/anon key as <code>VITE_SUPABASE_URL</code> and
                <code> VITE_SUPABASE_ANON_KEY</code> in a root <code>.env</code> file. Replace any
                example placeholders and restart the app. Then enable email OTP and phone MFA in
                Supabase and configure an SMS provider.
                See the Supabase authentication setup section in the project README.
              </p>
            </div>
          ) : null}
          {step === 'form' ? (
            <>
              <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
                {(['signup', 'login'] as const).map((nextMode) => (
                  <button
                    key={nextMode}
                    type="button"
                    onClick={() => {
                      setMode(nextMode)
                      resetFlow()
                    }}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition ${
                      mode === nextMode ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    {nextMode === 'signup' ? 'Sign up' : 'Log in'}
                  </button>
                ))}
              </div>

              <form className="space-y-4" onSubmit={handleFormSubmit}>
                {mode === 'signup' ? (
                  <label className="block space-y-2 text-sm font-medium text-slate-700">
                    Full name
                    <Input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required />
                  </label>
                ) : null}
                <label className="block space-y-2 text-sm font-medium text-slate-700">
                  Email address
                  <span className="relative block">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="email"
                      autoComplete="email"
                      className="pl-10"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </span>
                </label>
                <label className="block space-y-2 text-sm font-medium text-slate-700">
                  Mobile number
                  <span className="relative block">
                    <MessageSquare className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="tel"
                      autoComplete="tel"
                      placeholder="+14155552671"
                      className="pl-10"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      required
                    />
                  </span>
                  <span className="block text-xs font-normal text-slate-500">Use international format, including + and country code.</span>
                </label>
                <Button className="w-full" disabled={busy} type="submit">
                  {busy ? 'Please wait…' : mode === 'signup' ? 'Create account and send email code' : 'Send email code'}
                </Button>
              </form>
            </>
          ) : (
            <form className="space-y-4" onSubmit={handleCodeSubmit}>
              {step === 'login-email' || step === 'signup-email' ? (
                <label className="block space-y-2 text-sm font-medium text-slate-700">
                  <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> Email code</span>
                  <Input
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={emailCode}
                    onChange={(event) => setEmailCode(event.target.value.replace(/\D/g, ''))}
                    placeholder="6-digit code"
                    required
                  />
                </label>
              ) : null}
              {step === 'login-phone' || step === 'signup-phone' ? (
                <label className="block space-y-2 text-sm font-medium text-slate-700">
                  <span className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Mobile verification code</span>
                  <Input
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={phoneCode}
                    onChange={(event) => setPhoneCode(event.target.value.replace(/\D/g, ''))}
                    placeholder="6-digit code"
                    required
                  />
                </label>
              ) : null}
              <Button className="w-full" disabled={busy} type="submit">
                {busy ? 'Verifying…' : 'Verify and continue'}
              </Button>
              <Button className="w-full" disabled={busy} onClick={handleResend} type="button" variant="outline">
                Resend code
              </Button>
              <button
                className="w-full text-center text-sm font-medium text-slate-600 hover:text-slate-900"
                onClick={resetFlow}
                type="button"
              >
                Use different contact details
              </button>
            </form>
          )}

          {message ? <p className="mt-5 text-sm text-emerald-800" role="status">{message}</p> : null}
          {error ? <p className="mt-3 text-sm text-red-700" role="alert">{error}</p> : null}

          <div className="mt-6 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-xs leading-5 text-emerald-900">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <p>Never share verification codes. They expire and can only be used once.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
