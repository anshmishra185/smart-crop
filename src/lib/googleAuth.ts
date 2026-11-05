export interface GoogleUser {
  id: string
  email?: string
  phone?: string
  name: string
  givenName?: string
  familyName?: string
  picture?: string
  role?: string
  state?: string
  district?: string
  authMethod?: 'google' | 'phone_otp' | 'email_otp' | 'demo'
}

export const GOOGLE_CLIENT_ID =
  (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim() ?? ''

export const isGoogleConfigured = Boolean(
  GOOGLE_CLIENT_ID &&
    !/your[-_\s]|placeholder|example/i.test(GOOGLE_CLIENT_ID) &&
    GOOGLE_CLIENT_ID.includes('.apps.googleusercontent.com'),
)

/**
 * Safely parse a base64url encoded JWT payload from Google.
 */
export function parseJwt(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
    return JSON.parse(jsonPayload) as Record<string, unknown>
  } catch (error) {
    console.error('Failed to parse Google JWT payload:', error)
    return null
  }
}

/**
 * Ensures Google Identity Services client script is loaded on the page.
 */
export function loadGsiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return resolve()
    if (window.google?.accounts) return resolve()

    const existingScript = document.getElementById('google-identity-services')
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve())
      existingScript.addEventListener('error', (err) => reject(err))
      return
    }

    const script = document.createElement('script')
    script.id = 'google-identity-services'
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = (err) => reject(err)
    document.head.appendChild(script)
  })
}

// Global declaration for Google Identity Services SDK types
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: { credential?: string }) => void
            auto_select?: boolean
            cancel_on_tap_outside?: boolean
          }) => void
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon'
              theme?: 'outline' | 'filled_blue' | 'filled_black'
              size?: 'large' | 'medium' | 'small'
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
              shape?: 'rectangular' | 'pill' | 'circle' | 'square'
              logo_alignment?: 'left' | 'center'
              width?: number
              locale?: string
            },
          ) => void
          prompt: (momentListener?: (moment: unknown) => void) => void
          disableAutoSelect: () => void
          revoke: (hint: string, callback?: () => void) => void
        }
        oauth2: {
          initTokenClient: (config: {
            client_id: string
            scope: string
            callback: (response: {
              access_token?: string
              error?: string
              error_description?: string
            }) => void
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void
          }
        }
      }
    }
  }
}
