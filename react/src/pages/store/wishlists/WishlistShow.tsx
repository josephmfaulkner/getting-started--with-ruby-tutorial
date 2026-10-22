import { Link, useParams } from "react-router"
import type { WishlistDetail } from "../../../api/types"
import Loadable from "../../../components/Loadable"
import { pluralize } from "../../../lib/format"
import { useApi } from "../../../lib/useApi"

export default function WishlistShow() {
  const { id } = useParams()
  const wishlist = useApi<WishlistDetail>(`/api/store/wishlists/${id}`)

  return (
    <Loadable result={wishlist}>
      {(wishlist) => (
        <>
          <h1>{wishlist.name}</h1>
          <p>By <Link to={`/store/users/${wishlist.user.id}`}>{wishlist.user.full_name}</Link></p>

          <h3>{pluralize(wishlist.products_count, "Product")}</h3>
          {wishlist.items.map((item) => (
            <div key={item.id}>
              <Link to={`/store/products/${item.product.id}`}>{item.product.name}</Link>
              {" "}<small>Added {item.added_on}</small>
            </div>
          ))}
        </>
      )}
    </Loadable>
  )
}
