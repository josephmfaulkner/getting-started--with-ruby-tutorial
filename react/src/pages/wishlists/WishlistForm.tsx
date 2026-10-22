import { useState, type FormEvent } from "react"
import { Link, useParams } from "react-router"
import { api, ApiError } from "../../api/client"
import type { NoticePayload, WishlistDetail, WishlistRef } from "../../api/types"
import Loadable from "../../components/Loadable"
import { useFlashNavigate } from "../../lib/flash"
import { toSentence } from "../../lib/format"
import { useApi } from "../../lib/useApi"

export function NewWishlist() {
  return (
    <>
      <h1>New Wishlist</h1>
      <WishlistForm />
    </>
  )
}

export function EditWishlist() {
  const { id } = useParams()
  const wishlist = useApi<WishlistDetail>(`/api/wishlists/${id}`)

  return (
    <>
      <h1>Edit Wishlist</h1>
      <Loadable result={wishlist}>{(wishlist) => <WishlistForm wishlist={wishlist} />}</Loadable>
    </>
  )
}

function WishlistForm({ wishlist }: { wishlist?: WishlistDetail }) {
  const flashNavigate = useFlashNavigate()
  const [errors, setErrors] = useState<string[]>([])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    try {
      const result = wishlist
        ? await api.patch<NoticePayload & { wishlist: WishlistRef }>(`/api/wishlists/${wishlist.id}`, data)
        : await api.post<NoticePayload & { wishlist: WishlistRef }>("/api/wishlists", data)
      flashNavigate(`/wishlists/${result.wishlist.param}`, { notice: result.notice })
    } catch (error) {
      if (!(error instanceof ApiError)) throw error
      setErrors(error.errors)
    }
  }

  return (
    <form onSubmit={submit}>
      {errors.length > 0 && <div>{toSentence(errors)}</div>}

      <div>
        <label htmlFor="wishlist_name">Name</label>
        <input type="text" id="wishlist_name" name="wishlist[name]" defaultValue={wishlist?.name} />
      </div>

      <div>
        <input type="submit" value={wishlist ? "Update Wishlist" : "Create Wishlist"} />
        <Link to={wishlist ? `/wishlists/${wishlist.param}` : "/wishlists"}>Cancel</Link>
      </div>
    </form>
  )
}
