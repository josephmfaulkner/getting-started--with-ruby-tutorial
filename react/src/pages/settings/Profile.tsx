import { useState, type FormEvent } from "react"
import { api, ApiError } from "../../api/client"
import type { NoticePayload } from "../../api/types"
import Errors from "../../components/Errors"
import { useAuth } from "../../lib/auth"
import { useFlash } from "../../lib/flash"

export default function Profile() {
  const { user, refresh } = useAuth()
  const flash = useFlash()
  const [errors, setErrors] = useState<string[]>([])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const { notice } = await api.patch<NoticePayload>("/api/settings/profile", new FormData(event.currentTarget))
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
      <h1>Profile</h1>

      <form onSubmit={submit}>
        <Errors errors={errors} />

        <div>
          <label htmlFor="user_first_name">First name</label>
          <input type="text" id="user_first_name" name="user[first_name]" required autoComplete="given-name" defaultValue={user?.first_name} />
        </div>

        <div>
          <label htmlFor="user_last_name">Last name</label>
          <input type="text" id="user_last_name" name="user[last_name]" required autoComplete="family-name" defaultValue={user?.last_name} />
        </div>

        <div>
          <input type="submit" value="Update profile" />
        </div>
      </form>
    </>
  )
}
