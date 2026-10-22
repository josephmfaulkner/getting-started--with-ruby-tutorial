import { useState, type FormEvent } from "react"
import { useParams } from "react-router"
import { api, ApiError } from "../../../api/client"
import type { NoticePayload, User } from "../../../api/types"
import Errors from "../../../components/Errors"
import Loadable from "../../../components/Loadable"
import { useFlashNavigate } from "../../../lib/flash"
import { useApi } from "../../../lib/useApi"

export default function EditUser() {
  const { id } = useParams()
  const user = useApi<User>(`/api/store/users/${id}`)

  return (
    <>
      <h1>Edit User</h1>
      <Loadable result={user}>{(user) => <UserForm user={user} />}</Loadable>
    </>
  )
}

function UserForm({ user }: { user: User }) {
  const flashNavigate = useFlashNavigate()
  const [errors, setErrors] = useState<string[]>([])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const { notice } = await api.patch<NoticePayload>(`/api/store/users/${user.id}`, new FormData(event.currentTarget))
      flashNavigate(`/store/users/${user.id}`, { notice })
    } catch (error) {
      if (!(error instanceof ApiError)) throw error
      setErrors(error.errors)
    }
  }

  return (
    <form onSubmit={submit}>
      <Errors errors={errors} />

      <div>
        <label htmlFor="user_first_name">First name</label>
        <input type="text" id="user_first_name" name="user[first_name]" required autoFocus autoComplete="given-name" defaultValue={user.first_name} />
      </div>

      <div>
        <label htmlFor="user_last_name">Last name</label>
        <input type="text" id="user_last_name" name="user[last_name]" required autoComplete="family-name" defaultValue={user.last_name} />
      </div>

      <div>
        <label htmlFor="user_email_address">Email address</label>
        <input type="email" id="user_email_address" name="user[email_address]" required autoComplete="email" defaultValue={user.email_address} />
      </div>

      <div>
        <input type="submit" value="Update User" />
      </div>
    </form>
  )
}
