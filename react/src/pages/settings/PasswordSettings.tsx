import { api } from "../../api/client"
import type { NoticePayload } from "../../api/types"
import { Field, FormCard, FormErrors, SubmitButton } from "../../components/ui"
import { useFlashNavigate } from "../../lib/flash"
import { useForm } from "../../lib/useForm"

export default function PasswordSettings() {
  const flashNavigate = useFlashNavigate()
  const { pending, errors, onSubmit } = useForm(async (form) => {
    const { notice } = await api.patch<NoticePayload>("/api/settings/password", new FormData(form))
    flashNavigate("/settings/profile", { notice })
  })

  return (
    <FormCard title="Password">
      <form onSubmit={onSubmit}>
        <FormErrors errors={errors} prefix="" />
        <Field id="user_password_challenge" type="password" name="user[password_challenge]" label="Current password" required autoComplete="current-password" />
        <Field id="user_password" type="password" name="user[password]" label="Password" required autoComplete="new-password" />
        <Field id="user_password_confirmation" type="password" name="user[password_confirmation]" label="Password confirmation" required autoComplete="new-password" />
        <SubmitButton pending={pending}>Update password</SubmitButton>
      </form>
    </FormCard>
  )
}
