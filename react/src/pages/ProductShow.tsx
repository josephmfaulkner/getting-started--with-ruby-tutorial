import { Link, useParams, useSearchParams } from "react-router"
import { Box, Button, Chip, Divider, Grid, LinearProgress, Paper, Stack, Typography } from "@mui/material"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined"
import StarIcon from "@mui/icons-material/Star"
import { api, formDataFrom } from "../api/client"
import type { NoticePayload, Product, ProductPage, Wishlist, WishlistRef } from "../api/types"
import Loadable from "../components/Loadable"
import ReviewCard from "../components/ReviewCard"
import Stars from "../components/Stars"
import { BackLink, Field, SelectField } from "../components/ui"
import { useAuth } from "../lib/auth"
import { useFlash, useFlashNavigate } from "../lib/flash"
import { pluralize } from "../lib/format"
import { useApi } from "../lib/useApi"
import { useForm } from "../lib/useForm"

export default function ProductShow() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const rating = searchParams.get("rating")
  const page = useApi<ProductPage>(`/api/products/${id}${rating ? `?rating=${encodeURIComponent(rating)}` : ""}`)

  return (
    <Loadable result={page}>
      {({ product, reviews }) => (
        <>
          <BackLink to="/" />

          <Grid container spacing={{ xs: 3, md: 6 }} className="product">
            <Grid size={{ xs: 12, md: 6 }}>
              {product.image_url ? (
                <Box component="img" src={product.image_url} alt={product.name} sx={{ width: "100%", borderRadius: 3, border: 1, borderColor: "divider", display: "block" }} />
              ) : (
                <Box sx={{ aspectRatio: "1", borderRadius: 3, bgcolor: "action.hover", display: "flex", alignItems: "center", justifyContent: "center", color: "text.disabled" }}>No image</Box>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h4" component="h1">{product.name}</Typography>
              {product.reviews_count > 0 && (
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 1 }}>
                  <Stars rating={product.rating} />
                  <Typography variant="body2" color="textSecondary">{pluralize(product.reviews_count, "review")}</Typography>
                </Stack>
              )}

              {product.description_html && (
                <Box sx={{ mt: 2, color: "text.secondary" }} dangerouslySetInnerHTML={{ __html: product.description_html }} />
              )}

              <Divider sx={{ my: 3 }} />
              <Inventory product={product} />
              <AddToWishlist product={product} />
            </Grid>
          </Grid>

          <Reviews page={{ product, reviews }} rating={rating} />
        </>
      )}
    </Loadable>
  )
}

function Inventory({ product }: { product: Product }) {
  const flash = useFlash()
  const { pending, onSubmit } = useForm(async (form) => {
    const { notice } = await api.post<NoticePayload>(`/api/products/${product.id}/subscribers`, formDataFrom(form))
    form.reset()
    flash({ notice })
  })

  if (product.inventory_count > 0) {
    return <Chip label={`${product.inventory_count} in stock`} color="success" variant="outlined" />
  }

  return (
    <Paper sx={{ p: 2, bgcolor: "action.hover", border: 0 }}>
      <Chip label="Out of stock" />
      <Typography sx={{ mt: 1.5 }}>Email me when available.</Typography>
      <Stack component="form" onSubmit={onSubmit} direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 1, alignItems: { sm: "center" } }}>
        <Field type="email" name="subscriber[email]" placeholder="you@example.com" required size="small" margin="none" slotProps={{ htmlInput: { "aria-label": "Email" } }} />
        <Button type="submit" variant="contained" loading={pending}>Submit</Button>
      </Stack>
    </Paper>
  )
}

function AddToWishlist({ product }: { product: Product }) {
  const { user } = useAuth()
  const wishlists = useApi<Wishlist[]>(user ? "/api/wishlists" : null)
  const flashNavigate = useFlashNavigate()
  const { pending, onSubmit } = useForm(async (form) => {
    const { notice, wishlist } = await api.post<NoticePayload & { wishlist: WishlistRef }>(`/api/products/${product.id}/wishlist`, formDataFrom(form))
    flashNavigate(`/wishlists/${wishlist.param}`, { notice })
  })

  if (!user) {
    return <Button component={Link} to="/sign_up" variant="outlined" startIcon={<FavoriteBorderIcon />} sx={{ mt: 2 }}>Add to wishlist</Button>
  }

  return (
    <Stack component="form" onSubmit={onSubmit} direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 2, alignItems: { sm: "center" } }}>
      {wishlists.data && wishlists.data.length > 0 && (
        <SelectField name="wishlist_id" label="Wishlist" size="small" margin="none" sx={{ minWidth: 200, width: "auto" }}
          options={wishlists.data.map((wishlist) => ({ value: wishlist.id, label: wishlist.name }))} />
      )}
      <Button type="submit" variant="outlined" startIcon={<FavoriteBorderIcon />} loading={pending}>Add to wishlist</Button>
    </Stack>
  )
}

function Reviews({ page: { product, reviews }, rating }: { page: ProductPage; rating: string | null }) {
  return (
    <Grid container spacing={4} component="section" className="reviews" sx={{ mt: 6 }}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper component="aside" sx={{ p: 3, position: { md: "sticky" }, top: 88 }}>
          <Typography variant="h5" component="h3">Reviews</Typography>

          {product.reviews_count > 0 ? (
            <>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 1 }}>
                <Stars rating={product.rating} size="medium" />
                <Typography sx={{ fontWeight: 600 }}>{product.rating.toFixed(1)} out of 5</Typography>
              </Stack>
              <Typography variant="body2" color="textSecondary">{pluralize(product.reviews_count, "review")}</Typography>

              <Stack spacing={0.5} sx={{ mt: 2 }}>
                {product.rating_breakdown.map(({ stars, percentage }) => (
                  <Box key={stars} component={Link} to={`/products/${product.id}?rating=${stars}`} className="review__summary"
                    aria-label={`${pluralize(stars, "star")} — ${percentage}% of reviews`}
                    sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.primary", textDecoration: "none", borderRadius: 1, px: 0.5, "&:hover": { bgcolor: "action.hover" } }}>
                    <Typography variant="body2" sx={{ width: 12 }} aria-hidden="true">{stars}</Typography>
                    <StarIcon sx={{ fontSize: 16, color: "#faaf00" }} aria-hidden="true" />
                    <LinearProgress variant="determinate" value={percentage} aria-hidden="true"
                      sx={{ flex: 1, height: 8, borderRadius: 4, bgcolor: "action.selected", "& .MuiLinearProgress-bar": { bgcolor: "#faaf00" } }} />
                    <Typography variant="body2" color="textSecondary" sx={{ width: 40, textAlign: "right" }} aria-hidden="true">{percentage}%</Typography>
                  </Box>
                ))}
              </Stack>
            </>
          ) : (
            <Typography color="textSecondary" sx={{ mt: 1 }}>None yet!</Typography>
          )}

          <Button component={Link} to={`/products/${product.id}/reviews/new`} variant="contained" fullWidth startIcon={<RateReviewOutlinedIcon />} sx={{ mt: 3 }}>
            Write a review
          </Button>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        {rating !== null && (
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2 }}>
            <Typography>Filtered by {pluralize(parseInt(rating, 10) || 0, "star")}.</Typography>
            <Button component={Link} to={`/products/${product.id}`} size="small">Clear filter</Button>
          </Stack>
        )}

        {reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
      </Grid>
    </Grid>
  )
}
