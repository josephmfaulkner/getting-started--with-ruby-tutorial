import { Link, useLocation } from "react-router"
import type { Subscriber } from "../../../api/types"
import Loadable from "../../../components/Loadable"
import { pluralize } from "../../../lib/format"
import { useApi } from "../../../lib/useApi"
import FilterForm, { FilterSelect } from "../FilterForm"
import { useProductOptions } from "../filterOptions"

export default function SubscribersIndex() {
  const { search } = useLocation()
  const subscribers = useApi<Subscriber[]>(`/api/store/subscribers${search}`)
  const productOptions = useProductOptions()

  return (
    <Loadable result={subscribers}>
      {(subscribers) => (
        <>
          <h1>{pluralize(subscribers.length, "Subscriber")}</h1>

          <FilterForm>
            <FilterSelect name="product_id" label="Product" blank="All Products" options={productOptions} />
          </FilterForm>

          {subscribers.map((subscriber) => (
            <div key={subscriber.id}>
              <Link to={`/store/subscribers/${subscriber.id}`}>{subscriber.email}</Link> subscribed to <Link to={`/store/products/${subscriber.product.id}`}>{subscriber.product.name}</Link> on {subscriber.subscribed_on}
            </div>
          ))}
        </>
      )}
    </Loadable>
  )
}
