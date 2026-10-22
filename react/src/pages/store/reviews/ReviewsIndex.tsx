import { useLocation } from "react-router"
import { Typography } from "@mui/material"
import type { Review } from "../../../api/types"
import Loadable from "../../../components/Loadable"
import ReviewCard from "../../../components/ReviewCard"
import { AppLink, PageHeader } from "../../../components/ui"
import { pluralize } from "../../../lib/format"
import { useApi } from "../../../lib/useApi"
import FilterForm, { FilterSelect } from "../FilterForm"
import { useProductOptions, useUserOptions } from "../filterOptions"

const ratingOptions = [5, 4, 3, 2, 1].map((stars) => ({ value: pluralize(stars, "star"), label: pluralize(stars, "star") }))

export default function ReviewsIndex() {
  const { search } = useLocation()
  const reviews = useApi<Review[]>(`/api/store/reviews${search}`)
  const productOptions = useProductOptions()
  const userOptions = useUserOptions()

  return (
    <>
      <PageHeader title="Reviews" />

      <FilterForm>
        <FilterSelect name="product_id" label="Product" blank="All Products" options={productOptions} />
        <FilterSelect name="rating" label="Rating" blank="All Ratings" options={ratingOptions} />
        <FilterSelect name="user_id" label="User" blank="All Users" options={userOptions} />
      </FilterForm>

      <Loadable result={reviews}>
        {(reviews) => reviews.length === 0 ? <Typography color="textSecondary">No reviews match.</Typography> : reviews.map((review) => (
          <ReviewCard key={review.id} review={review}
            heading={<><AppLink to={`/store/users/${review.user.id}`}>{review.user.full_name}</AppLink> reviewed <AppLink to={`/store/products/${review.product.id}`}>{review.product.name}</AppLink></>}
            footer={<Typography sx={{ mt: 1.5 }}><AppLink to={`/store/reviews/${review.id}`}>View review</AppLink></Typography>} />
        ))}
      </Loadable>
    </>
  )
}
