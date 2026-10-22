import { useParams } from "react-router"
import { Stack } from "@mui/material"
import { api } from "../../../api/client"
import type { NoticePayload, User } from "../../../api/types"
import Loadable from "../../../components/Loadable"
import { Field, FormCard, FormErrors, SubmitButton } from "../../../components/ui"
import { useFlashNavigate } from "../../../lib/flash"
import { useApi } from "../../../lib/useApi"
import { useForm } from "../../../lib/useForm"

export default function EditUser() {
  const { id } = useParams()
  const user = useApi<User>(`/api/store/users/${id}`)

  return (
    <FormCard title="Edit User">
      <Loadable result={user}>{(user) => <UserForm user={user} />}</Loadable>
    </FormCard>
  )
}

function UserForm({ user }: { user: User }) {
  const flashNavigate = useFlashNavigate()
  const { pending, errors, onSubmit } = useForm(async (form) => {
    const { notice } = await api.patch<NoticePayload>(`/api/store/users/${user.id}`, new FormData(form))
    flashNavigate(`/store/users/${user.id}`, { notice })
  })

  return (
    <form onSubmit={onSubmit}>
      <FormErrors errors={errors} />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={{ sm: 2 }}>
        <Field id="user_first_name" name="user[first_name]" label="First name" required autoFocus autoComplete="given-name" defaultValue={user.first_name} />
        <Field id="user_last_name" name="user[last_name]" label="Last name" required autoComplete="family-name" defaultValue={user.last_name} />
      </Stack>
      <Field id="user_email_address" type="email" name="user[email_address]" label="Email address" required autoComplete="email" defaultValue={user.email_address} />
      <SubmitButton pending={pending}>Update User</SubmitButton>
    </form>
  )
}
