import { Stack } from "@mui/material"
import { api } from "../../api/client"
import type { NoticePayload } from "../../api/types"
import { Field, FormCard, FormErrors, SubmitButton } from "../../components/ui"
import { useAuth } from "../../lib/auth"
import { useFlash } from "../../lib/flash"
import { useForm } from "../../lib/useForm"

export default function Profile() {
  const { user, refresh } = useAuth()
  const flash = useFlash()
  const { pending, errors, onSubmit } = useForm(async (form) => {
    const { notice } = await api.patch<NoticePayload>("/api/settings/profile", new FormData(form))
    await refresh()
    flash({ notice })
  })

  return (
    <FormCard title="Profile" subtitle="How your name appears on reviews and wishlists.">
      <form onSubmit={onSubmit}>
        <FormErrors errors={errors} />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={{ sm: 2 }}>
          <Field id="user_first_name" name="user[first_name]" label="First name" required autoComplete="given-name" defaultValue={user?.first_name} />
          <Field id="user_last_name" name="user[last_name]" label="Last name" required autoComplete="family-name" defaultValue={user?.last_name} />
        </Stack>
        <SubmitButton pending={pending}>Update profile</SubmitButton>
      </form>
    </FormCard>
  )
}
