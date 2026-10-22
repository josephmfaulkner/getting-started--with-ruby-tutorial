import { Link, useNavigate, useParams } from "react-router"
import { api } from "../../../api/client"
import type { StoreProduct } from "../../../api/types"
import Loadable from "../../../components/Loadable"
import { pluralize } from "../../../lib/format"
import { useApi } from "../../../lib/useApi"

export default function ProductShow() {
  const { id } = useParams()
  const product = useApi<StoreProduct>(`/api/store/products/${id}`)
  const navigate = useNavigate()

  async function destroy() {
    if (!confirm("Are you sure?")) return
    await api.delete(`/api/store/products/${id}`)
    navigate("/store/products")
  }

  return (
    <Loadable result={product}>
      {(product) => (
        <>
          <p><Link to="/store/products">Back</Link></p>

          <section className="product">
            {product.image_url && <img src={product.image_url} alt={product.name} />}

            <section className="product-info">
              <h1>{product.name}</h1>
              {product.description_html && <div dangerouslySetInnerHTML={{ __html: product.description_html }} />}

              <Link to={`/products/${product.id}`}>View in Storefront</Link>{" "}
              <Link to={`/store/products/${product.id}/edit`}>Edit</Link>
              <button type="button" onClick={destroy}>Delete</button>
            </section>
          </section>

          <section>
            <Link to={`/store/reviews?product_id=${product.id}`}>{pluralize(product.reviews_count, "review")}</Link>{" "}
            <Link to={`/store/wishlists?product_id=${product.id}`}>{pluralize(product.wishlists_count, "wishlist")}</Link>{" "}
            <Link to={`/store/subscribers?product_id=${product.id}`}>{pluralize(product.subscribers_count, "subscriber")}</Link>
          </section>
        </>
      )}
    </Loadable>
  )
}
