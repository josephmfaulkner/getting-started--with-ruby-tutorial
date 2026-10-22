import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { api, setCsrfToken } from "../api/client"
import type { SessionPayload, User } from "../api/types"

interface AuthState {
  user: User | null
  loading: boolean
  // Store the session returned by sign in / sign up / sign out
  setSession: (session: SessionPayload) => void
  // Re-fetch the current user, e.g. after changing their name or email
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

// Rails embeds the session in the page (app/views/spa/show.html.erb)
function embeddedSession(): SessionPayload | null {
  const json = document.getElementById("root")?.dataset.session
  return json ? JSON.parse(json) : null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [initialSession] = useState(embeddedSession)
  const [user, setUser] = useState<User | null>(initialSession?.user ?? null)
  const [loading, setLoading] = useState(!initialSession)

  const setSession = useCallback((session: SessionPayload) => {
    setCsrfToken(session.csrf_token)
    setUser(session.user)
  }, [])

  const refresh = useCallback(async () => {
    setSession(await api.get<SessionPayload>("/api/session"))
  }, [setSession])

  useEffect(() => {
    if (initialSession) {
      setCsrfToken(initialSession.csrf_token)
    } else {
      refresh().finally(() => setLoading(false))
    }
  }, [initialSession, refresh])

  return <AuthContext.Provider value={{ user, loading, setSession, refresh }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const auth = useContext(AuthContext)
  if (!auth) throw new Error("useAuth must be used inside <AuthProvider>")
  return auth
}
