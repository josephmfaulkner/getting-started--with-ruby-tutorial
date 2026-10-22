import { useState, type FormEvent } from "react"
import { api, ApiError } from "../api/client"
import type { NoticePayload } from "../api/types"
import { useFlashNavigate } from "../lib/flash"

export default function ForgotPassword() {
  const flashNavigate = useFlashNavigate()
  const [alert, setAlert] = useState<string>()

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const { notice } = await api.post<NoticePayload>("/api/passwords", new FormData(event.currentTarget))
      flashNavigate("/session/new", { notice })
    } catch (error) {
      if (!(error instanceof ApiError)) throw error
      setAlert(error.message)
    }
  }

  return (
    <>
      <h1>Forgot your password?</h1>

      {alert && <div style={{ color: "red" }}>{alert}</div>}

      <form onSubmit={submit}>
        <input type="email" name="email_address" required autoFocus autoComplete="username" placeholder="Enter your email address" /><br />
        <input type="submit" value="Email reset instructions" />
      </form>
    </>
  )
}
