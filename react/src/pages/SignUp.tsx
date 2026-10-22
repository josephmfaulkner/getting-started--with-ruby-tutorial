import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import { api, ApiError } from "../api/client"
import type { SessionPayload } from "../api/types"
import Errors from "../components/Errors"
import { useAuth } from "../lib/auth"

export default function SignUp() {
  const { setSession } = useAuth()
  const navigate = useNavigate()
  const [errors, setErrors] = useState<string[]>([])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setSession(await api.post<SessionPayload>("/api/sign_up", new FormData(event.currentTarget)))
      navigate("/")
    } catch (error) {
      if (!(error instanceof ApiError)) throw error
      setErrors(error.errors)
    }
  }

  return (
    <>
      <h1>Sign Up</h1>

      <form onSubmit={submit}>
        <Errors errors={errors} />

        <div>
          <label htmlFor="user_first_name">First name</label>
          <input type="text" id="user_first_name" name="user[first_name]" required autoFocus autoComplete="given-name" />
        </div>

        <div>
          <label htmlFor="user_last_name">Last name</label>
          <input type="text" id="user_last_name" name="user[last_name]" required autoComplete="family-name" />
        </div>

        <div>
          <label htmlFor="user_email_address">Email address</label>
          <input type="email" id="user_email_address" name="user[email_address]" required autoComplete="email" />
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
          <input type="submit" value="Sign up" />
        </div>
      </form>
    </>
  )
}
