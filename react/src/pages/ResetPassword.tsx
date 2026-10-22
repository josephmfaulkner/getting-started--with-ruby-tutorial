import { useEffect, useState, type FormEvent } from "react"
import { useParams } from "react-router"
import { api, ApiError } from "../api/client"
import type { NoticePayload } from "../api/types"
import { useFlashNavigate } from "../lib/flash"

export default function ResetPassword() {
  const { token = "" } = useParams()
  const path = `/api/passwords/${encodeURIComponent(token)}`
  const flashNavigate = useFlashNavigate()
  const [alert, setAlert] = useState<string>()

  // Send expired or invalid links back to the "forgot password" page
  useEffect(() => {
    api.get(path).catch((error) => {
      if (error instanceof ApiError && error.status === 404) flashNavigate("/passwords/new", { alert: error.message }, { replace: true })
    })
  }, [path])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const { notice } = await api.patch<NoticePayload>(path, new FormData(event.currentTarget))
      flashNavigate("/session/new", { notice })
    } catch (error) {
      if (!(error instanceof ApiError)) throw error
      setAlert(error.message)
    }
  }

  return (
    <>
      <h1>Update your password</h1>

      {alert && <div style={{ color: "red" }}>{alert}</div>}

      <form onSubmit={submit}>
        <input type="password" name="password" required autoComplete="new-password" placeholder="Enter new password" maxLength={72} /><br />
        <input type="password" name="password_confirmation" required autoComplete="new-password" placeholder="Repeat new password" maxLength={72} /><br />
        <input type="submit" value="Save" />
      </form>
    </>
  )
}
