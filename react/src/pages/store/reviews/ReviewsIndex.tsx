import { Link, useLocation } from "react-router"
import type { Review } from "../../../api/types"
import Loadable from "../../../components/Loadable"
import ReviewImages from "../../../components/ReviewImages"
import Stars from "../../../components/Stars"
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
      <h1>Reviews</h1>

      <FilterForm>
        <FilterSelect name="product_id" label="Product" blank="All Products" options={productOptions} />
        <FilterSelect name="rating" label="Rating" blank="All Ratings" options={ratingOptions} />
        <FilterSelect name="user_id" label="User" blank="All Users" options={userOptions} />
      </FilterForm>

      <Loadable result={reviews}>
        {(reviews) => reviews.map((review) => (
          <div key={review.id} id={`review_${review.id}`} className="review">
            <div><Link to={`/store/users/${review.user.id}`}>{review.user.full_name}</Link> reviewed <Link to={`/store/products/${review.product.id}`}>{review.product.name}</Link></div>
            <Stars rating={review.rating} />
            {review.body}
            <ReviewImages images={review.images} />
            <div>
              <Link to={`/store/reviews/${review.id}`}>View review</Link>
            </div>
          </div>
        ))}
      </Loadable>
    </>
  )
}
