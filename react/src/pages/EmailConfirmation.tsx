import { useEffect, useRef } from "react"
import { useParams } from "react-router"
import { api, ApiError } from "../api/client"
import type { NoticePayload } from "../api/types"
import { useAuth } from "../lib/auth"
import { useFlashNavigate } from "../lib/flash"

// Opened from the link in the email confirmation email
export default function EmailConfirmation() {
  const { token = "" } = useParams()
  const { refresh } = useAuth()
  const flashNavigate = useFlashNavigate()
  const sent = useRef(false)

  useEffect(() => {
    if (sent.current) return
    sent.current = true

    api.patch<NoticePayload>(`/api/email/confirmations/${encodeURIComponent(token)}`)
      .then(async ({ notice }) => {
        await refresh()
        flashNavigate("/", { notice }, { replace: true })
      })
      .catch((error) => flashNavigate("/", { alert: error instanceof ApiError ? error.message : String(error) }, { replace: true }))
  }, [token])

  return <p>Confirming your email…</p>
}
