import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router"
import { useAuth } from "../lib/auth"

// Sends signed-out visitors to the login page, then back here after signing in
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return null
  if (!user) return <Navigate to="/session/new" replace state={{ from: location.pathname + location.search }} />
  return children
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user?.admin) return <Navigate to="/" replace state={{ alert: "You aren't allowed to do that." }} />
  return children
}

// For sign up: signed-in users don't need it
export function RequireGuest({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return null
  if (user) return <Navigate to="/" replace />
  return children
}
