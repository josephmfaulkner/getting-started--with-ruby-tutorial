import type { FormEvent } from "react"
import { Link, useParams, useSearchParams } from "react-router"
import { api, formDataFrom } from "../api/client"
import type { NoticePayload, Product, ProductPage, Review, Wishlist, WishlistRef } from "../api/types"
import Loadable from "../components/Loadable"
import ReviewImages from "../components/ReviewImages"
import Stars from "../components/Stars"
import { useAuth } from "../lib/auth"
import { useFlash, useFlashNavigate } from "../lib/flash"
import { pluralize } from "../lib/format"
import { useApi } from "../lib/useApi"

export default function ProductShow() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const rating = searchParams.get("rating")
  const page = useApi<ProductPage>(`/api/products/${id}${rating ? `?rating=${encodeURIComponent(rating)}` : ""}`)

  return (
    <Loadable result={page}>
      {({ product, reviews }) => (
        <>
          <p><Link to="/">Back</Link></p>

          <section className="product">
            {product.image_url && <img src={product.image_url} alt={product.name} />}
            <section className="product-info">
              <h1>{product.name}</h1>
              {product.description_html && <div dangerouslySetInnerHTML={{ __html: product.description_html }} />}

              <Inventory product={product} />
              <AddToWishlist product={product} />
            </section>
          </section>

          <Reviews page={{ product, reviews }} rating={rating} />
        </>
      )}
    </Loadable>
  )
}

function Inventory({ product }: { product: Product }) {
  const flash = useFlash()

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const { notice } = await api.post<NoticePayload>(`/api/products/${product.id}/subscribers`, formDataFrom(form))
    form.reset()
    flash({ notice })
  }

  if (product.inventory_count > 0) return <p>{product.inventory_count} in stock</p>

  return (
    <>
      <p>Out of stock</p>
      <p>Email me when available.</p>

      <form onSubmit={subscribe}>
        <input type="email" name="subscriber[email]" placeholder="you@example.com" required />
        <input type="submit" value="Submit" />
      </form>
    </>
  )
}

function AddToWishlist({ product }: { product: Product }) {
  const { user } = useAuth()
  const wishlists = useApi<Wishlist[]>(user ? "/api/wishlists" : null)
  const flashNavigate = useFlashNavigate()

  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { notice, wishlist } = await api.post<NoticePayload & { wishlist: WishlistRef }>(
      `/api/products/${product.id}/wishlist`, formDataFrom(event.currentTarget)
    )
    flashNavigate(`/wishlists/${wishlist.param}`, { notice })
  }

  if (!user) return <Link to="/sign_up">Add to wishlist</Link>

  return (
    <form onSubmit={add}>
      {wishlists.data && wishlists.data.length > 0 && (
        <div>
          <select name="wishlist_id" aria-label="Wishlist">
            {wishlists.data.map((wishlist) => <option key={wishlist.id} value={wishlist.id}>{wishlist.name}</option>)}
          </select>
        </div>
      )}

      <div>
        <input type="submit" value="Add to wishlist" />
      </div>
    </form>
  )
}

function Reviews({ page: { product, reviews }, rating }: { page: ProductPage; rating: string | null }) {
  return (
    <section className="reviews">
      <aside>
        <h3>Reviews</h3>

        {product.reviews_count > 0 ? (
          <>
            <Stars rating={product.rating}> {product.rating.toFixed(1)} out of 5</Stars>

            <div>{pluralize(product.reviews_count, "review")}</div>

            <div>
              {product.rating_breakdown.map(({ stars, percentage }) => (
                <Link key={stars} to={`/products/${product.id}?rating=${stars}`} className="review__summary" aria-label={`${pluralize(stars, "star")} — ${percentage}% of reviews`}>
                  <div aria-hidden="true">
                    <div className="review__stars">{stars}</div>
                    <div className="gold">★</div>
                    <div className="review__bars">
                      <div className="review__bar--background"></div>
                      <div className="review__bar" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <div className="review__percentage">{percentage}%</div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <p>None yet!</p>
        )}

        <Link to={`/products/${product.id}/reviews/new`}>Write a review</Link>
      </aside>

      <div>
        {rating !== null && (
          <div>
            Filtered by {pluralize(parseInt(rating, 10) || 0, "star")}. <Link to={`/products/${product.id}`}>Clear filter</Link>
          </div>
        )}

        {reviews.map((review) => <ReviewItem key={review.id} review={review} />)}
      </div>
    </section>
  )
}

function ReviewItem({ review }: { review: Review }) {
  return (
    <div id={`review_${review.id}`} className="review">
      <div><strong>{review.user.full_name}</strong></div>
      <Stars rating={review.rating} />
      {review.body}
      <ReviewImages images={review.images} />
    </div>
  )
}

