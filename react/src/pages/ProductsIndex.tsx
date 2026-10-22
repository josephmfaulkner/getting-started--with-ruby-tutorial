import { Link } from "react-router"
import type { ProductSummary } from "../api/types"
import Loadable from "../components/Loadable"
import { useApi } from "../lib/useApi"

export default function ProductsIndex() {
  const products = useApi<ProductSummary[]>("/api/products")

  return (
    <>
      <h1>Products</h1>

      <Loadable result={products}>
        {(products) => (
          <div id="products">
            {products.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`} className="product-card">
                {product.thumbnail_url ? (
                  <img src={product.thumbnail_url} alt="" className="product-card__image" />
                ) : (
                  <div className="product-card__image product-card__placeholder">No image</div>
                )}
                <div className="product-card__name">{product.name}</div>
                {product.description_excerpt && <p className="product-card__description">{product.description_excerpt}</p>}
              </Link>
            ))}
          </div>
        )}
      </Loadable>
    </>
  )
}
