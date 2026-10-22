import { Link, useParams } from "react-router"
import { Alert, Button, Stack } from "@mui/material"
import { api } from "../../api/client"
import type { NoticePayload, WishlistDetail, WishlistRef } from "../../api/types"
import Loadable from "../../components/Loadable"
import { Field, FormCard, SubmitButton } from "../../components/ui"
import { useFlashNavigate } from "../../lib/flash"
import { toSentence } from "../../lib/format"
import { useApi } from "../../lib/useApi"
import { useForm } from "../../lib/useForm"

export function NewWishlist() {
  return (
    <FormCard title="New Wishlist" centered>
      <WishlistForm />
    </FormCard>
  )
}

export function EditWishlist() {
  const { id } = useParams()
  const wishlist = useApi<WishlistDetail>(`/api/wishlists/${id}`)

  return (
    <FormCard title="Edit Wishlist" centered>
      <Loadable result={wishlist}>{(wishlist) => <WishlistForm wishlist={wishlist} />}</Loadable>
    </FormCard>
  )
}

function WishlistForm({ wishlist }: { wishlist?: WishlistDetail }) {
  const flashNavigate = useFlashNavigate()
  const { pending, errors, onSubmit } = useForm(async (form) => {
    const data = new FormData(form)
    const result = wishlist
      ? await api.patch<NoticePayload & { wishlist: WishlistRef }>(`/api/wishlists/${wishlist.id}`, data)
      : await api.post<NoticePayload & { wishlist: WishlistRef }>("/api/wishlists", data)
    flashNavigate(`/wishlists/${result.wishlist.param}`, { notice: result.notice })
  })

  return (
    <form onSubmit={onSubmit}>
      {errors.length > 0 && <Alert severity="error" sx={{ mt: 2 }}>{toSentence(errors)}</Alert>}
      <Field id="wishlist_name" name="wishlist[name]" label="Name" defaultValue={wishlist?.name} autoFocus />
      <Stack direction="row" spacing={1}>
        <SubmitButton pending={pending}>{wishlist ? "Update Wishlist" : "Create Wishlist"}</SubmitButton>
        <Button component={Link} to={wishlist ? `/wishlists/${wishlist.param}` : "/wishlists"} size="large" sx={{ mt: 2 }}>Cancel</Button>
      </Stack>
    </form>
  )
}
