import { Typography } from "@mui/material"
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined"
import { api } from "../../api/client"
import type { NoticePayload } from "../../api/types"
import { ConfirmButton, FormCard } from "../../components/ui"
import { useAuth } from "../../lib/auth"
import { useFlashNavigate } from "../../lib/flash"

export default function Account() {
  const { refresh } = useAuth()
  const flashNavigate = useFlashNavigate()

  async function deleteAccount() {
    const { notice } = await api.delete<NoticePayload>("/api/settings/user")
    // Leave the signed-in-only settings page before the app learns the user is gone
    flashNavigate("/", { notice })
    await refresh()
  }

  return (
    <FormCard title="Account">
      <Typography color="textSecondary" sx={{ mt: 1, mb: 2 }}>
        Deleting your account removes your wishlists and reviews.
      </Typography>
      <ConfirmButton variant="outlined" startIcon={<DeleteForeverOutlinedIcon />} onConfirm={deleteAccount}
        message="Are you sure? This cannot be undone." confirmLabel="Delete my account">
        Delete my account
      </ConfirmButton>
    </FormCard>
  )
}
