import { useParams } from "react-router"
import { List, ListItem, ListItemText, Paper, Typography } from "@mui/material"
import type { WishlistDetail } from "../../../api/types"
import Loadable from "../../../components/Loadable"
import { AppLink, BackLink, PageHeader } from "../../../components/ui"
import { pluralize } from "../../../lib/format"
import { useApi } from "../../../lib/useApi"

export default function WishlistShow() {
  const { id } = useParams()
  const wishlist = useApi<WishlistDetail>(`/api/store/wishlists/${id}`)

  return (
    <Loadable result={wishlist}>
      {(wishlist) => (
        <>
          <BackLink to="/store/wishlists" />
          <PageHeader title={wishlist.name} subtitle={<>By <AppLink to={`/store/users/${wishlist.user.id}`}>{wishlist.user.full_name}</AppLink></>} />

          <Paper>
            <Typography variant="h6" component="h3" sx={{ px: 2, pt: 2 }}>{pluralize(wishlist.products_count, "Product")}</Typography>
            <List>
              {wishlist.items.map((item) => (
                <ListItem key={item.id} divider>
                  <ListItemText primary={<AppLink to={`/store/products/${item.product.id}`}>{item.product.name}</AppLink>} secondary={`Added ${item.added_on}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </>
      )}
    </Loadable>
  )
}
