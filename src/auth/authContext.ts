import { createContext } from 'react'
import type { GoogleUser } from '../lib/googleAuth'

export interface OtpRequestResult {
  success: boolean
  message: string
  maskedIdentifier: string
  devOtp?: string
}

export interface AuthContextValue {
  user: GoogleUser | null
  loading: boolean
  isAuthModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  signInWithGoogle: () => Promise<void>
  signInGoogleQuick?: (email?: string, name?: string) => void
  signInDemo: () => void

  requestOtp: (
    identifier: string,
    channel: 'phone' | 'email',
    purpose?: 'login' | 'signup',
    fullName?: string,
    role?: string
  ) => Promise<OtpRequestResult>
  verifyOtp: (identifier: string, otpCode: string) => Promise<boolean>
  signOut: () => Promise<string | null>
  isGoogleConfigured: boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)
