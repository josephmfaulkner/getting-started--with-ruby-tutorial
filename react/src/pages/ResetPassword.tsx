import { useEffect } from "react"
import { useParams } from "react-router"
import { api, ApiError } from "../api/client"
import type { NoticePayload } from "../api/types"
import { Field, FormCard, FormErrors, SubmitButton } from "../components/ui"
import { useFlashNavigate } from "../lib/flash"
import { useForm } from "../lib/useForm"

export default function ResetPassword() {
  const { token = "" } = useParams()
  const path = `/api/passwords/${encodeURIComponent(token)}`
  const flashNavigate = useFlashNavigate()
  const { pending, errors, onSubmit } = useForm(async (form) => {
    const { notice } = await api.patch<NoticePayload>(path, new FormData(form))
    flashNavigate("/session/new", { notice })
  })

  // Send expired or invalid links back to the "forgot password" page
  useEffect(() => {
    api.get(path).catch((error) => {
      if (error instanceof ApiError && error.status === 404) flashNavigate("/passwords/new", { alert: error.message }, { replace: true })
    })
  }, [path])

  return (
    <FormCard title="Update your password" centered>
      <form onSubmit={onSubmit}>
        <FormErrors errors={errors} prefix="" />
        <Field type="password" name="password" label="New password" required autoComplete="new-password" placeholder="Enter new password" slotProps={{ htmlInput: { maxLength: 72 } }} />
        <Field type="password" name="password_confirmation" label="Repeat new password" required autoComplete="new-password" placeholder="Repeat new password" slotProps={{ htmlInput: { maxLength: 72 } }} />
        <SubmitButton pending={pending} fullWidth>Save</SubmitButton>
      </form>
    </FormCard>
  )
}
