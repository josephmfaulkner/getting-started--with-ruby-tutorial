import { Link as RouterLink, useLocation, useNavigate } from "react-router"
import { Link, Stack, Typography } from "@mui/material"
import { api } from "../api/client"
import type { SessionPayload } from "../api/types"
import { Field, FormCard, FormErrors, SubmitButton } from "../components/ui"
import { useAuth } from "../lib/auth"
import { useForm } from "../lib/useForm"

export default function Login() {
  const { setSession } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { pending, errors, onSubmit } = useForm(async (form) => {
    setSession(await api.post<SessionPayload>("/api/session", new FormData(form)))
    navigate((location.state as { from?: string } | null)?.from ?? "/")
  })

  return (
    <FormCard title="Sign in" subtitle="Welcome back! Sign in to manage your wishlists and reviews." centered>
      <form onSubmit={onSubmit}>
        <FormErrors errors={errors} prefix="" />
        <Field type="email" name="email_address" label="Email address" required autoFocus autoComplete="username" placeholder="Enter your email address" />
        <Field type="password" name="password" label="Password" required autoComplete="current-password" placeholder="Enter your password" slotProps={{ htmlInput: { maxLength: 72 } }} />
        <SubmitButton pending={pending} fullWidth>Sign in</SubmitButton>
      </form>

      <Stack direction="row" sx={{ justifyContent: "space-between", mt: 3 }}>
        <Link component={RouterLink} to="/passwords/new">Forgot password?</Link>
        <Typography variant="body2" color="textSecondary">
          New here? <Link component={RouterLink} to="/sign_up">Create an account</Link>
        </Typography>
      </Stack>
    </FormCard>
  )
}
