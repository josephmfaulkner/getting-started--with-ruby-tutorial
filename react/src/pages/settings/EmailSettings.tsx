import { api } from "../../api/client"
import type { NoticePayload } from "../../api/types"
import { Field, FormCard, FormErrors, SubmitButton } from "../../components/ui"
import { useAuth } from "../../lib/auth"
import { useFlash } from "../../lib/flash"
import { useForm } from "../../lib/useForm"

export default function EmailSettings() {
  const { user, refresh } = useAuth()
  const flash = useFlash()
  const { pending, errors, onSubmit } = useForm(async (form) => {
    const { notice } = await api.patch<NoticePayload>("/api/settings/email", new FormData(form))
    form.reset()
    await refresh()
    flash({ notice })
  })

  return (
    <FormCard title="Change Email" subtitle={user && `Your email address is ${user.email_address}.`}>
      <form onSubmit={onSubmit}>
        <FormErrors errors={errors} />
        <Field id="user_unconfirmed_email" type="email" name="user[unconfirmed_email]" label="New email address" required />
        <Field id="user_password_challenge" type="password" name="user[password_challenge]" label="Current password" required autoComplete="current-password" />
        <SubmitButton pending={pending}>Update email address</SubmitButton>
      </form>
    </FormCard>
  )
}
