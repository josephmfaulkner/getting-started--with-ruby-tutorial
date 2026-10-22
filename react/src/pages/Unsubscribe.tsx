import { useEffect, useRef } from "react"
import { useSearchParams } from "react-router"
import { api } from "../api/client"
import type { NoticePayload } from "../api/types"
import { useFlashNavigate } from "../lib/flash"

// Opened from the unsubscribe link in "back in stock" emails
export default function Unsubscribe() {
  const [searchParams] = useSearchParams()
  const flashNavigate = useFlashNavigate()
  const sent = useRef(false)

  useEffect(() => {
    if (sent.current) return
    sent.current = true

    api.post<NoticePayload>("/api/unsubscribe", { token: searchParams.get("token") ?? "" })
      .then(({ notice }) => flashNavigate("/", { notice }, { replace: true }))
  }, [])

  return <p>Unsubscribing…</p>
}
