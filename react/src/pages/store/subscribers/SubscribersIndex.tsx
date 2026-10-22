import { useLocation } from "react-router"
import type { Subscriber } from "../../../api/types"
import Loadable from "../../../components/Loadable"
import { AppLink, PageHeader } from "../../../components/ui"
import { pluralize } from "../../../lib/format"
import { useApi } from "../../../lib/useApi"
import DataTable from "../DataTable"
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
          <PageHeader title={pluralize(subscribers.length, "Subscriber")} subtitle="People waiting for an out of stock product." />

          <FilterForm>
            <FilterSelect name="product_id" label="Product" blank="All Products" options={productOptions} />
          </FilterForm>

          <DataTable rows={subscribers} empty="No subscribers match." columns={[
            { header: "Email", cell: (subscriber) => <AppLink to={`/store/subscribers/${subscriber.id}`}>{subscriber.email}</AppLink> },
            { header: "Product", cell: (subscriber) => <AppLink to={`/store/products/${subscriber.product.id}`}>{subscriber.product.name}</AppLink> },
            { header: "Subscribed", cell: (subscriber) => subscriber.subscribed_on }
          ]} />
        </>
      )}
    </Loadable>
  )
}
