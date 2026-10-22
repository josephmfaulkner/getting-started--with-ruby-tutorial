import { api } from "../../api/client"
import type { NoticePayload } from "../../api/types"
import { useAuth } from "../../lib/auth"
import { useFlashNavigate } from "../../lib/flash"

export default function Account() {
  const { refresh } = useAuth()
  const flashNavigate = useFlashNavigate()

  async function deleteAccount() {
    if (!confirm("Are you sure? This cannot be undone.")) return
    const { notice } = await api.delete<NoticePayload>("/api/settings/user")
    // Leave the signed-in-only settings page before the app learns the user is gone
    flashNavigate("/", { notice })
    await refresh()
  }

  return (
    <>
      <h1>Account</h1>

      <button type="button" onClick={deleteAccount}>Delete my account</button>
    </>
  )
}
