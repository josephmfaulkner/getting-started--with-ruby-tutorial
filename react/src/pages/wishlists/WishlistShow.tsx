import type { FormEvent } from "react"
import { Link, useParams } from "react-router"
import { api, ApiError } from "../../api/client"
import type { NoticePayload, WishlistDetail, WishlistItem } from "../../api/types"
import Loadable from "../../components/Loadable"
import { useFlash, useFlashNavigate } from "../../lib/flash"
import { pluralize } from "../../lib/format"
import { useApi } from "../../lib/useApi"

export default function WishlistShow() {
  const { id } = useParams()
  const wishlist = useApi<WishlistDetail>(`/api/wishlists/${id}`)
  const flashNavigate = useFlashNavigate()

  async function destroy(wishlist: WishlistDetail) {
    if (!confirm("Are you sure?")) return
    await api.delete(`/api/wishlists/${wishlist.id}`)
    flashNavigate("/wishlists", {})
  }

  return (
    <Loadable result={wishlist}>
      {(data) => (
        <>
          <h1>{data.name}</h1>
          {data.owned && (
            <>
              <Link to={`/wishlists/${data.param}/edit`}>Edit</Link>
              <button type="button" onClick={() => destroy(data)}>Delete</button>
            </>
          )}

          <button type="button" onClick={() => navigator.clipboard.writeText(`${location.origin}/wishlists/${data.param}`)}>
            Copy to clipboard
          </button>

          <h3>{pluralize(data.products_count, "Product")}</h3>
          {data.items.map((item) => <Item key={item.id} wishlist={data} item={item} onChange={wishlist.reload} />)}
        </>
      )}
    </Loadable>
  )
}

function Item({ wishlist, item, onChange }: { wishlist: WishlistDetail; item: WishlistItem; onChange: () => void }) {
  const flash = useFlash()
  const path = `/api/wishlists/${wishlist.id}/wishlist_products/${item.id}`

  async function run(action: () => Promise<NoticePayload>) {
    try {
      flash({ notice: (await action()).notice })
    } catch (error) {
      if (!(error instanceof ApiError)) throw error
      flash({ alert: error.message })
    }
    onChange()
  }

  function move(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    run(() => api.patch<NoticePayload>(path, data))
  }

  function remove() {
    if (confirm("Are you sure?")) run(() => api.delete<NoticePayload>(path))
  }

  const otherWishlists = wishlist.other_wishlists ?? []

  return (
    <div>
      <Link to={`/products/${item.product.id}`}>{item.product.name}</Link>
      {" "}<small>Added {item.added_on}</small>

      {wishlist.owned && (
        <>
          {otherWishlists.length > 0 && (
            <form onSubmit={move}>
              <select name="new_wishlist_id" aria-label="Move to wishlist">
                {otherWishlists.map((other) => <option key={other.id} value={other.id}>{other.name}</option>)}
              </select>
              <input type="submit" value="Move" />
            </form>
          )}

          <button type="button" onClick={remove}>Remove</button>
        </>
      )}
    </div>
  )
}
