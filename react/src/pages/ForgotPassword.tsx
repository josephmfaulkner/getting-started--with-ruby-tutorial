import { api } from "../api/client"
import type { NoticePayload } from "../api/types"
import { Field, FormCard, FormErrors, SubmitButton } from "../components/ui"
import { useFlashNavigate } from "../lib/flash"
import { useForm } from "../lib/useForm"

export default function ForgotPassword() {
  const flashNavigate = useFlashNavigate()
  const { pending, errors, onSubmit } = useForm(async (form) => {
    const { notice } = await api.post<NoticePayload>("/api/passwords", new FormData(form))
    flashNavigate("/session/new", { notice })
  })

  return (
    <FormCard title="Forgot your password?" subtitle="We'll email you a link to choose a new one." centered>
      <form onSubmit={onSubmit}>
        <FormErrors errors={errors} prefix="" />
        <Field type="email" name="email_address" label="Email address" required autoFocus autoComplete="username" placeholder="Enter your email address" />
        <SubmitButton pending={pending} fullWidth>Email reset instructions</SubmitButton>
      </form>
    </FormCard>
  )
}
