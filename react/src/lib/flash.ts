import { useLocation, useNavigate } from "react-router"

// Flash messages travel in the router's location state, like Rails' flash survives a redirect.
export interface Flash {
  notice?: string
  alert?: string
}

// Navigate somewhere and show a flash message there
export function useFlashNavigate() {
  const navigate = useNavigate()
  return (to: string, flash: Flash, options: { replace?: boolean } = {}) => navigate(to, { state: flash, ...options })
}

// Show a flash message on the current page
export function useFlash() {
  const location = useLocation()
  const navigate = useNavigate()
  return (flash: Flash) => navigate(location.pathname + location.search, { replace: true, state: flash })
}
