import { Link, useLocation } from "react-router"
import type { Wishlist } from "../../../api/types"
import Loadable from "../../../components/Loadable"
import { pluralize } from "../../../lib/format"
import { useApi } from "../../../lib/useApi"
import FilterForm, { FilterSelect } from "../FilterForm"
import { useProductOptions, useUserOptions } from "../filterOptions"

export default function WishlistsIndex() {
  const { search } = useLocation()
  const wishlists = useApi<Wishlist[]>(`/api/store/wishlists${search}`)
  const userOptions = useUserOptions()
  const productOptions = useProductOptions()

  return (
    <Loadable result={wishlists}>
      {(wishlists) => (
        <>
          <h1>{pluralize(wishlists.length, "Wishlist")}</h1>

          <FilterForm>
            <FilterSelect name="user_id" label="User" blank="All Users" options={userOptions} />
            <FilterSelect name="product_id" label="Product" blank="All Products" options={productOptions} />
          </FilterForm>

          {wishlists.map((wishlist) => (
            <div key={wishlist.id}>
              <Link to={`/store/wishlists/${wishlist.param}`}>{wishlist.name}</Link> by <Link to={`/store/users/${wishlist.user.id}`}>{wishlist.user.full_name}</Link>
            </div>
          ))}
        </>
      )}
    </Loadable>
  )
}
