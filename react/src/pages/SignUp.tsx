import { useNavigate } from "react-router"
import { Stack } from "@mui/material"
import { api } from "../api/client"
import type { SessionPayload } from "../api/types"
import { Field, FormCard, FormErrors, SubmitButton } from "../components/ui"
import { useAuth } from "../lib/auth"
import { useForm } from "../lib/useForm"

export default function SignUp() {
  const { setSession } = useAuth()
  const navigate = useNavigate()
  const { pending, errors, onSubmit } = useForm(async (form) => {
    setSession(await api.post<SessionPayload>("/api/sign_up", new FormData(form)))
    navigate("/")
  })

  return (
    <FormCard title="Sign Up" subtitle="Create an account to save wishlists and write reviews." centered>
      <form onSubmit={onSubmit}>
        <FormErrors errors={errors} />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={{ sm: 2 }}>
          <Field id="user_first_name" name="user[first_name]" label="First name" required autoFocus autoComplete="given-name" />
          <Field id="user_last_name" name="user[last_name]" label="Last name" required autoComplete="family-name" />
        </Stack>
        <Field id="user_email_address" type="email" name="user[email_address]" label="Email address" required autoComplete="email" />
        <Field id="user_password" type="password" name="user[password]" label="Password" required autoComplete="new-password" />
        <Field id="user_password_confirmation" type="password" name="user[password_confirmation]" label="Password confirmation" required autoComplete="new-password" />
        <SubmitButton pending={pending} fullWidth>Sign up</SubmitButton>
      </form>
    </FormCard>
  )
}
