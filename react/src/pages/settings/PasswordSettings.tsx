import { useState, type FormEvent } from "react"
import { api, ApiError } from "../../api/client"
import type { NoticePayload } from "../../api/types"
import Errors from "../../components/Errors"
import { useFlashNavigate } from "../../lib/flash"

export default function PasswordSettings() {
  const flashNavigate = useFlashNavigate()
  const [errors, setErrors] = useState<string[]>([])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const { notice } = await api.patch<NoticePayload>("/api/settings/password", new FormData(event.currentTarget))
      flashNavigate("/settings/profile", { notice })
    } catch (error) {
      if (!(error instanceof ApiError)) throw error
      setErrors(error.errors)
    }
  }

  return (
    <>
      <h1>Password</h1>

      <form onSubmit={submit}>
        <Errors errors={errors} prefix="" />

        <div>
          <label htmlFor="user_password_challenge">Current password</label>
          <input type="password" id="user_password_challenge" name="user[password_challenge]" required autoComplete="current-password" />
        </div>

        <div>
          <label htmlFor="user_password">Password</label>
          <input type="password" id="user_password" name="user[password]" required autoComplete="new-password" />
        </div>

        <div>
          <label htmlFor="user_password_confirmation">Password confirmation</label>
          <input type="password" id="user_password_confirmation" name="user[password_confirmation]" required autoComplete="new-password" />
        </div>

        <div>
          <input type="submit" value="Update password" />
        </div>
      </form>
    </>
  )
}
