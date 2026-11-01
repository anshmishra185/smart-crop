import { createContext } from 'react'
import type { GoogleUser } from '../lib/googleAuth'

export interface AuthContextValue {
  user: GoogleUser | null
  loading: boolean
  isAuthModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  signInWithGoogle: () => Promise<void>
  signInDemo: () => void
  signOut: () => Promise<string | null>
  isGoogleConfigured: boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)
