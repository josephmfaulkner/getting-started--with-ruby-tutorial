import { Link } from "react-router"
import { Box, Card, CardActionArea, CardContent, Chip, Grid, Typography } from "@mui/material"
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined"
import type { ProductSummary } from "../api/types"
import Loadable from "../components/Loadable"
import { PageHeader } from "../components/ui"
import { useApi } from "../lib/useApi"

export default function ProductsIndex() {
  const products = useApi<ProductSummary[]>("/api/products")

  return (
    <>
      <PageHeader title="Products" subtitle="Browse the store and save favorites to your wishlists." />

      <Loadable result={products}>
        {(products) => (
          <Grid id="products" container spacing={3}>
            {products.map((product) => (
              <Grid key={product.id} size={{ xs: 6, sm: 4, md: 3 }}>
                <Card sx={{ height: "100%", transition: "box-shadow .2s", "&:hover": { boxShadow: 4 } }}>
                  <CardActionArea component={Link} to={`/products/${product.id}`} className="product-card" sx={{ height: "100%", alignItems: "stretch" }}>
                    {product.thumbnail_url ? (
                      <Box component="img" src={product.thumbnail_url} alt="" className="product-card__image" sx={{ display: "block", width: "100%", aspectRatio: "1", objectFit: "cover" }} />
                    ) : (
                      <Box className="product-card__image product-card__placeholder" sx={{ aspectRatio: "1", display: "flex", flexDirection: "column", gap: 1, alignItems: "center", justifyContent: "center", bgcolor: "action.hover", color: "text.disabled" }}>
                        <ImageOutlinedIcon fontSize="large" />
                        No image
                      </Box>
                    )}
                    <CardContent>
                      <Typography className="product-card__name" sx={{ fontWeight: 600 }}>{product.name}</Typography>
                      {product.description_excerpt && (
                        <Typography variant="body2" color="textSecondary" className="product-card__description" sx={{ mt: 0.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {product.description_excerpt}
                        </Typography>
                      )}
                      {product.inventory_count === 0 && <Chip label="Out of stock" size="small" sx={{ mt: 1 }} />}
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
