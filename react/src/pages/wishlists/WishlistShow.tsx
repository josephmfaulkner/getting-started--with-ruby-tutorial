import { useState } from "react"
import { Link, useParams } from "react-router"
import { Button, List, ListItem, ListItemText, Paper, Snackbar, Stack, Typography } from "@mui/material"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import LinkIcon from "@mui/icons-material/Link"
import { api, ApiError } from "../../api/client"
import type { NoticePayload, WishlistDetail, WishlistItem } from "../../api/types"
import Loadable from "../../components/Loadable"
import { AppLink, ConfirmButton, PageHeader, SelectField } from "../../components/ui"
import { useFlash, useFlashNavigate } from "../../lib/flash"
import { pluralize } from "../../lib/format"
import { useApi } from "../../lib/useApi"
import { useForm } from "../../lib/useForm"

export default function WishlistShow() {
  const { id } = useParams()
  const wishlist = useApi<WishlistDetail>(`/api/wishlists/${id}`)
  const flashNavigate = useFlashNavigate()
  const [copied, setCopied] = useState(false)

  async function copyLink(param: string) {
    await navigator.clipboard.writeText(`${location.origin}/wishlists/${param}`)
    setCopied(true)
  }

  return (
    <Loadable result={wishlist}>
      {(data) => (
        <>
          <PageHeader
            title={data.name}
            subtitle={data.owned ? undefined : `By ${data.user.full_name}`}
            actions={
              <>
                <Button variant="outlined" startIcon={<LinkIcon />} onClick={() => copyLink(data.param)}>Copy link</Button>
                {data.owned && (
                  <>
                    <Button component={Link} to={`/wishlists/${data.param}/edit`} startIcon={<EditOutlinedIcon />}>Edit</Button>
                    <ConfirmButton onConfirm={async () => { await api.delete(`/api/wishlists/${data.id}`); flashNavigate("/wishlists", {}) }}>Delete</ConfirmButton>
                  </>
                )}
              </>
            }
          />
          <Snackbar open={copied} autoHideDuration={3000} onClose={() => setCopied(false)} message="Link copied to clipboard" />

          <Paper>
            <Typography variant="h6" component="h3" sx={{ px: 2, pt: 2 }}>{pluralize(data.products_count, "Product")}</Typography>
            <List>
              {data.items.map((item) => <Item key={item.id} wishlist={data} item={item} onChange={wishlist.reload} />)}
            </List>
          </Paper>
        </>
      )}
    </Loadable>
  )
}

function Item({ wishlist, item, onChange }: { wishlist: WishlistDetail; item: WishlistItem; onChange: () => void }) {
  const flash = useFlash()
  const path = `/api/wishlists/${wishlist.id}/wishlist_products/${item.id}`
  const otherWishlists = wishlist.other_wishlists ?? []

  async function run(action: () => Promise<NoticePayload>) {
    try {
      flash({ notice: (await action()).notice })
    } catch (error) {
      if (!(error instanceof ApiError)) throw error
      flash({ alert: error.message })
    }
    onChange()
  }

  const move = useForm(async (form) => {
    const data = new FormData(form)
    await run(() => api.patch<NoticePayload>(path, data))
  })

  return (
    <ListItem divider sx={{ flexWrap: "wrap", gap: 1 }}>
      <ListItemText
        primary={<AppLink to={`/products/${item.product.id}`}>{item.product.name}</AppLink>}
        secondary={`Added ${item.added_on}`}
      />

      {wishlist.owned && (
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          {otherWishlists.length > 0 && (
            <Stack component="form" onSubmit={move.onSubmit} direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <SelectField name="new_wishlist_id" label="Move to wishlist" size="small" margin="none" sx={{ minWidth: 170, width: "auto" }}
                options={otherWishlists.map((other) => ({ value: other.id, label: other.name }))} />
              <Button type="submit" variant="outlined" loading={move.pending}>Move</Button>
            </Stack>
          )}
          <ConfirmButton onConfirm={() => run(() => api.delete<NoticePayload>(path))}>Remove</ConfirmButton>
        </Stack>
      )}
    </ListItem>
  )
}
