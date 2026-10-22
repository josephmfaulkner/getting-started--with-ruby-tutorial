import { useState, type FormEvent } from "react"
import { api, ApiError } from "../../api/client"
import type { NoticePayload } from "../../api/types"
import Errors from "../../components/Errors"
import { useAuth } from "../../lib/auth"
import { useFlash } from "../../lib/flash"

export default function EmailSettings() {
  const { refresh } = useAuth()
  const flash = useFlash()
  const [errors, setErrors] = useState<string[]>([])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    try {
      const { notice } = await api.patch<NoticePayload>("/api/settings/email", new FormData(form))
      form.reset()
      setErrors([])
      await refresh()
      flash({ notice })
    } catch (error) {
      if (!(error instanceof ApiError)) throw error
      setErrors(error.errors)
    }
  }

  return (
    <>
      <h1>Change Email</h1>

      <form onSubmit={submit}>
        <Errors errors={errors} />

        <div>
          <label htmlFor="user_unconfirmed_email">New email address</label>
          <input type="email" id="user_unconfirmed_email" name="user[unconfirmed_email]" required />
        </div>

        <div>
          <label htmlFor="user_password_challenge">Current password</label>
          <input type="password" id="user_password_challenge" name="user[password_challenge]" required autoComplete="current-password" />
        </div>

        <div>
          <input type="submit" value="Update email address" />
        </div>
      </form>
    </>
  )
}
