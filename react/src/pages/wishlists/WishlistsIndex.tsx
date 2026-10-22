import { Link } from "react-router"
import type { Wishlist } from "../../api/types"
import Loadable from "../../components/Loadable"
import { useApi } from "../../lib/useApi"

export default function WishlistsIndex() {
  const wishlists = useApi<Wishlist[]>("/api/wishlists")

  return (
    <>
      <h1>Your Wishlists</h1>
      <Link to="/wishlists/new">Create a wishlist</Link>
      <Loadable result={wishlists}>
        {(wishlists) => wishlists.map((wishlist) => (
          <div key={wishlist.id}>
            <Link to={`/wishlists/${wishlist.param}`}>{wishlist.name}</Link>
          </div>
        ))}
      </Loadable>
    </>
  )
}
