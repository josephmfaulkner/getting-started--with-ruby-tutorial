import { useEffect } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router"
import { api } from "../api/client"
import type { SessionPayload } from "../api/types"
import { useAuth } from "../lib/auth"
import type { Flash } from "../lib/flash"

export default function Layout() {
  const { user, setSession } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const flash = (location.state ?? {}) as Flash

  useEffect(() => { window.scrollTo(0, 0) }, [location.pathname])

  async function logOut() {
    setSession(await api.delete<SessionPayload>("/api/session"))
    navigate("/session/new")
  }

  return (
    <>
      <div className="notice">{flash.notice}</div>
      <div className="alert">{flash.alert}</div>
      <nav className="navbar">
        <Link to="/">Home</Link>

        {user ? (
          <>
            <Link to="/wishlists">Wishlists</Link>
            <Link to="/settings">Settings</Link>
            <button type="button" onClick={logOut}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/sign_up">Sign Up</Link>
            <Link to="/session/new">Login</Link>
          </>
        )}
      </nav>

      <main>
        <Outlet />
      </main>
    </>
  )
}
