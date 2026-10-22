import { useLocation } from "react-router"
import type { Wishlist } from "../../../api/types"
import Loadable from "../../../components/Loadable"
import { AppLink, PageHeader } from "../../../components/ui"
import { pluralize } from "../../../lib/format"
import { useApi } from "../../../lib/useApi"
import DataTable from "../DataTable"
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
          <PageHeader title={pluralize(wishlists.length, "Wishlist")} />

          <FilterForm>
            <FilterSelect name="user_id" label="User" blank="All Users" options={userOptions} />
            <FilterSelect name="product_id" label="Product" blank="All Products" options={productOptions} />
          </FilterForm>

          <DataTable rows={wishlists} empty="No wishlists match." columns={[
            { header: "Wishlist", cell: (wishlist) => <AppLink to={`/store/wishlists/${wishlist.param}`}>{wishlist.name}</AppLink> },
            { header: "Owner", cell: (wishlist) => <AppLink to={`/store/users/${wishlist.user.id}`}>{wishlist.user.full_name}</AppLink> },
            { header: "Products", cell: (wishlist) => wishlist.products_count, align: "right" }
          ]} />
        </>
      )}
    </Loadable>
  )
}
