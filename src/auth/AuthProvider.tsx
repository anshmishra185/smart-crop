import { useEffect, useState, type ReactNode } from 'react'
import {
  GOOGLE_CLIENT_ID,
  isGoogleConfigured,
  loadGsiScript,
  parseJwt,
  type GoogleUser,
} from '../lib/googleAuth'
import { AuthContext } from './authContext'

const USER_STORAGE_KEY = 'smart_crop_google_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GoogleUser | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY)
      return stored ? (JSON.parse(stored) as GoogleUser) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const openAuthModal = () => setIsAuthModalOpen(true)
  const closeAuthModal = () => setIsAuthModalOpen(false)

  const saveUser = (nextUser: GoogleUser | null) => {
    setUser(nextUser)
    if (typeof window !== 'undefined') {
      if (nextUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser))
      } else {
        localStorage.removeItem(USER_STORAGE_KEY)
      }
    }
  }

  // Load Google Identity Services script on mount
  useEffect(() => {
    void loadGsiScript().catch((err) => {
      console.warn('Google Identity Services script load failed:', err)
    })
  }, [])

  // Initialize GIS ID service when configured
  useEffect(() => {
    if (!isGoogleConfigured) return

    let cancelled = false
    void loadGsiScript().then(() => {
      if (cancelled || !window.google?.accounts?.id) return

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          if (!response.credential) return
          const payload = parseJwt(response.credential)
          if (!payload) return

          const authenticatedUser: GoogleUser = {
            id: String(payload.sub ?? ''),
            email: String(payload.email ?? ''),
            name: String(payload.name ?? payload.email ?? 'Google User'),
            givenName: typeof payload.given_name === 'string' ? payload.given_name : undefined,
            familyName: typeof payload.family_name === 'string' ? payload.family_name : undefined,
            picture: typeof payload.picture === 'string' ? payload.picture : undefined,
          }

          saveUser(authenticatedUser)
          closeAuthModal()
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      })
    })

    return () => {
      cancelled = true
    }
  }, [])

  const signInWithGoogle = async (): Promise<void> => {
    if (!isGoogleConfigured) {
      throw new Error(
        'Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID in your .env file.',
      )
    }

    setLoading(true)
    try {
      await loadGsiScript()

      if (!window.google?.accounts?.oauth2) {
        throw new Error('Google Identity Services is not ready yet.')
      }

      await new Promise<void>((resolve, reject) => {
        const client = window.google!.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              setLoading(false)
              reject(new Error(tokenResponse.error_description || tokenResponse.error))
              return
            }

            try {
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              })

              if (!res.ok) {
                throw new Error('Failed to fetch user profile from Google.')
              }

              const profile = (await res.json()) as {
                sub: string
                email: string
                name: string
                given_name?: string
                family_name?: string
                picture?: string
              }

              const authenticatedUser: GoogleUser = {
                id: profile.sub,
                email: profile.email,
                name: profile.name,
                givenName: profile.given_name,
                familyName: profile.family_name,
                picture: profile.picture,
              }

              saveUser(authenticatedUser)
              closeAuthModal()
              resolve()
            } catch (fetchErr) {
              reject(fetchErr)
            } finally {
              setLoading(false)
            }
          },
        })

        client.requestAccessToken({ prompt: 'select_account' })
      })
    } catch (err) {
      setLoading(false)
      throw err
    }
  }

  const signInDemo = () => {
    const demoUser: GoogleUser = {
      id: 'demo-farmer-01',
      email: 'demo.grower@smartcrop.ai',
      name: 'Alex Rivera',
      givenName: 'Alex',
      familyName: 'Rivera',
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    }
    saveUser(demoUser)
    closeAuthModal()
  }

  const signOut = async (): Promise<string | null> => {
    try {
      if (typeof window !== 'undefined' && window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect()
      }
      saveUser(null)
      return null
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error signing out'
      return message
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle,
        signInDemo,
        signOut,
        isGoogleConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
