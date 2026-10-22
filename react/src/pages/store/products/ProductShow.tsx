import { Link, useNavigate, useParams } from "react-router"
import { Box, Button, Card, CardActionArea, CardContent, Chip, Grid, Stack, Typography } from "@mui/material"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import { api } from "../../../api/client"
import type { StoreProduct } from "../../../api/types"
import Loadable from "../../../components/Loadable"
import { BackLink, ConfirmButton, PageHeader } from "../../../components/ui"
import { pluralize } from "../../../lib/format"
import { useApi } from "../../../lib/useApi"

function Stat({ to, children }: { to: string; children: string }) {
  return (
    <Card>
      <CardActionArea component={Link} to={to}>
        <CardContent><Typography sx={{ fontWeight: 600 }}>{children}</Typography></CardContent>
      </CardActionArea>
    </Card>
  )
}

export default function ProductShow() {
  const { id } = useParams()
  const product = useApi<StoreProduct>(`/api/store/products/${id}`)
  const navigate = useNavigate()

  return (
    <Loadable result={product}>
      {(product) => (
        <>
          <BackLink to="/store/products" />
          <PageHeader title={product.name} actions={
            <>
              <Button component={Link} to={`/products/${product.id}`} startIcon={<OpenInNewIcon />}>View in Storefront</Button>
              <Button component={Link} to={`/store/products/${product.id}/edit`} variant="outlined" startIcon={<EditOutlinedIcon />}>Edit</Button>
              <ConfirmButton onConfirm={async () => { await api.delete(`/api/store/products/${id}`); navigate("/store/products") }}>Delete</ConfirmButton>
            </>
          } />

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 4 }}><Stat to={`/store/reviews?product_id=${product.id}`}>{pluralize(product.reviews_count, "review")}</Stat></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><Stat to={`/store/wishlists?product_id=${product.id}`}>{pluralize(product.wishlists_count, "wishlist")}</Stat></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><Stat to={`/store/subscribers?product_id=${product.id}`}>{pluralize(product.subscribers_count, "subscriber")}</Stat></Grid>
          </Grid>

          <Grid container spacing={3} className="product">
            {product.image_url && (
              <Grid size={{ xs: 12, sm: 5 }}>
                <Box component="img" src={product.image_url} alt={product.name} sx={{ width: "100%", borderRadius: 3, border: 1, borderColor: "divider", display: "block" }} />
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: product.image_url ? 7 : 12 }}>
              <Stack spacing={2}>
                <Box><Chip label={product.inventory_count > 0 ? `${product.inventory_count} in stock` : "Out of stock"} /></Box>
                {product.description_html && <Box dangerouslySetInnerHTML={{ __html: product.description_html }} />}
              </Stack>
            </Grid>
          </Grid>
        </>
      )}
    </Loadable>
  )
}
