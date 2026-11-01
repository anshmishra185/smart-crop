import { useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'

import { supabase } from '../lib/supabase'
import { AuthContext } from './authContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(Boolean(supabase))
  const [assuranceLevel, setAssuranceLevel] = useState<string | null>(null)

  useEffect(() => {
    const client = supabase
    if (!client) return

    let active = true
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (active) {
        setSession(nextSession)
        setAssuranceLevel(null)
        setLoading(false)
      }
    })

    void client.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) return
        if (error) console.error('Unable to restore the authentication session:', error.message)
        setSession(data.session)
        setAssuranceLevel(null)
        setLoading(false)
      })
      .catch((error: unknown) => {
        if (!active) return
        console.error('Unable to restore the authentication session:', error)
        setLoading(false)
      })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const client = supabase
    if (!client || !session) return

    let active = true
    void client.auth.mfa
      .getAuthenticatorAssuranceLevel()
      .then(({ data, error }) => {
        if (!active) return
        if (error) {
          console.error('Unable to check the authentication assurance level:', error.message)
          setAssuranceLevel('unknown')
          return
        }
        setAssuranceLevel(data.currentLevel)
      })
      .catch((error: unknown) => {
        if (!active) return
        console.error('Unable to check the authentication assurance level:', error)
        setAssuranceLevel('unknown')
      })

    return () => {
      active = false
    }
  }, [session])

  const signOut = async () => {
    if (!supabase) return 'Authentication is not configured.'

    try {
      const { error } = await supabase.auth.signOut()
      return error?.message ?? null
    } catch (error) {
      return error instanceof Error ? error.message : 'Unable to sign out.'
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: assuranceLevel === 'aal2' ? session?.user ?? null : null,
        loading,
        assuranceLevel,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
