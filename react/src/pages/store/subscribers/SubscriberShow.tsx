import { Link, useParams } from "react-router"
import { api } from "../../../api/client"
import type { NoticePayload, Subscriber } from "../../../api/types"
import Loadable from "../../../components/Loadable"
import { useFlashNavigate } from "../../../lib/flash"
import { useApi } from "../../../lib/useApi"

export default function SubscriberShow() {
  const { id } = useParams()
  const subscriber = useApi<Subscriber>(`/api/store/subscribers/${id}`)
  const flashNavigate = useFlashNavigate()

  async function remove() {
    if (!confirm("Are you sure?")) return
    const { notice } = await api.delete<NoticePayload>(`/api/store/subscribers/${id}`)
    flashNavigate("/store/subscribers", { notice })
  }

  return (
    <Loadable result={subscriber}>
      {(subscriber) => (
        <>
          <h1>{subscriber.email}</h1>
          <p>Subscribed to <Link to={`/store/products/${subscriber.product.id}`}>{subscriber.product.name}</Link> on {subscriber.subscribed_on}</p>

          <button type="button" onClick={remove}>Remove</button>
        </>
      )}
    </Loadable>
  )
}
