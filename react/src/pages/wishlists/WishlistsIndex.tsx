import { Link } from "react-router"
import { Button, Card, CardActionArea, CardContent, Grid, Paper, Typography } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import FavoriteIcon from "@mui/icons-material/Favorite"
import type { Wishlist } from "../../api/types"
import Loadable from "../../components/Loadable"
import { PageHeader } from "../../components/ui"
import { pluralize } from "../../lib/format"
import { useApi } from "../../lib/useApi"

export default function WishlistsIndex() {
  const wishlists = useApi<Wishlist[]>("/api/wishlists")

  return (
    <>
      <PageHeader title="Your Wishlists" actions={<Button component={Link} to="/wishlists/new" variant="contained" startIcon={<AddIcon />}>Create a wishlist</Button>} />
      <Loadable result={wishlists}>
        {(wishlists) => wishlists.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>No wishlists yet. Add a product to a wishlist from its page, or create one.</Paper>
        ) : (
          <Grid container spacing={2}>
            {wishlists.map((wishlist) => (
              <Grid key={wishlist.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card>
                  <CardActionArea component={Link} to={`/wishlists/${wishlist.param}`}>
                    <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <FavoriteIcon color="secondary" />
                      <div>
                        <Typography sx={{ fontWeight: 600 }}>{wishlist.name}</Typography>
                        <Typography variant="body2" color="textSecondary">{pluralize(wishlist.products_count, "product")}</Typography>
                      </div>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Loadable>
    </>
  )
}
