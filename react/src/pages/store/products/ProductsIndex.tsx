import { Link } from "react-router"
import type { NamedRecord } from "../../../api/types"
import Loadable from "../../../components/Loadable"
import { useApi } from "../../../lib/useApi"

export default function ProductsIndex() {
  const products = useApi<NamedRecord[]>("/api/store/products")

  return (
    <>
      <h1>Products</h1>

      <Link to="/store/products/new">New product</Link>

      <div>
        <Loadable result={products}>
          {(products) => products.map((product) => (
            <div key={product.id}>
              <Link to={`/store/products/${product.id}`}>{product.name}</Link>
            </div>
          ))}
        </Loadable>
      </div>
    </>
  )
}
