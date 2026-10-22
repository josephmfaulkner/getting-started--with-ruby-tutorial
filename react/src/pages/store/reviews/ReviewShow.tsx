import { Link, useNavigate, useParams } from "react-router"
import { api } from "../../../api/client"
import type { Review } from "../../../api/types"
import Loadable from "../../../components/Loadable"
import ReviewImages from "../../../components/ReviewImages"
import Stars from "../../../components/Stars"
import { useApi } from "../../../lib/useApi"

export default function ReviewShow() {
  const { id } = useParams()
  const review = useApi<Review>(`/api/store/reviews/${id}`)
  const navigate = useNavigate()

  async function destroy() {
    if (!confirm("Are you sure?")) return
    await api.delete(`/api/store/reviews/${id}`)
    navigate("/store/reviews")
  }

  return (
    <>
      <Link to="/store/reviews">Back to all reviews</Link>

      <h1>Review</h1>

      <Loadable result={review}>
        {(review) => (
          <>
            <div id={`review_${review.id}`} className="review">
              <div><Link to={`/store/users/${review.user.id}`}>{review.user.full_name}</Link> reviewed <Link to={`/store/products/${review.product.id}`}>{review.product.name}</Link></div>
              <Stars rating={review.rating} />
              {review.body}
              <ReviewImages images={review.images} />
            </div>

            <div>
              <Link to={`/store/reviews/${review.id}/edit`}>Edit</Link>
              <button type="button" onClick={destroy}>Delete</button>
            </div>
          </>
        )}
      </Loadable>
    </>
  )
}
