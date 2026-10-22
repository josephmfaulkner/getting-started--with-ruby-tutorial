import { useState, type FormEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router"
import { api, ApiError } from "../api/client"
import type { SessionPayload } from "../api/types"
import { useAuth } from "../lib/auth"

export default function Login() {
  const { setSession } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [alert, setAlert] = useState<string>()

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setSession(await api.post<SessionPayload>("/api/session", new FormData(event.currentTarget)))
      navigate((location.state as { from?: string } | null)?.from ?? "/")
    } catch (error) {
      if (!(error instanceof ApiError)) throw error
      setAlert(error.message)
    }
  }

  return (
    <>
      {alert && <div style={{ color: "red" }}>{alert}</div>}

      <form onSubmit={submit}>
        <input type="email" name="email_address" required autoFocus autoComplete="username" placeholder="Enter your email address" /><br />
        <input type="password" name="password" required autoComplete="current-password" placeholder="Enter your password" maxLength={72} /><br />
        <input type="submit" value="Sign in" />
      </form>
      <br />

      <Link to="/passwords/new">Forgot password?</Link>
    </>
  )
}
