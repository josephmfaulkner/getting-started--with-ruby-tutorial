import { Link, useNavigate, useParams } from "react-router"
import { Button, Stack } from "@mui/material"
import { api, formDataFrom } from "../../../api/client"
import type { StoreProduct } from "../../../api/types"
import Loadable from "../../../components/Loadable"
import TrixEditor from "../../../components/TrixEditor"
import { Field, FileField, FormCard, FormErrors, SubmitButton } from "../../../components/ui"
import { useApi } from "../../../lib/useApi"
import { useForm } from "../../../lib/useForm"

export function NewProduct() {
  return (
    <FormCard title="New product">
      <ProductForm cancelTo="/store/products" />
    </FormCard>
  )
}

export function EditProduct() {
  const { id } = useParams()
  const product = useApi<StoreProduct>(`/api/store/products/${id}`)

  return (
    <FormCard title="Edit product">
      <Loadable result={product}>{(product) => <ProductForm product={product} cancelTo={`/store/products/${id}`} />}</Loadable>
    </FormCard>
  )
}

function ProductForm({ product, cancelTo }: { product?: StoreProduct; cancelTo: string }) {
  const navigate = useNavigate()
  const { pending, errors, onSubmit } = useForm(async (form) => {
    const data = formDataFrom(form)
    const saved = product
      ? await api.patch<StoreProduct>(`/api/store/products/${product.id}`, data)
      : await api.post<StoreProduct>("/api/store/products", data)
    navigate(`/store/products/${saved.id}`)
  })

  return (
    <form onSubmit={onSubmit}>
      <FormErrors errors={errors} prefix="" />
      <Field id="product_name" name="product[name]" label="Name" defaultValue={product?.name} />
      <TrixEditor id="product_description" name="product[description]" label="Description" defaultValue={product?.description_trix_html} />
      <FileField id="product_featured_image" name="product[featured_image]" label="Featured image" />
      <Field id="product_inventory_count" type="number" name="product[inventory_count]" label="Inventory count" defaultValue={product?.inventory_count ?? 0} sx={{ maxWidth: 200 }} />
      <Stack direction="row" spacing={1}>
        <SubmitButton pending={pending}>{product ? "Update Product" : "Create Product"}</SubmitButton>
        <Button component={Link} to={cancelTo} size="large" sx={{ mt: 2 }}>Cancel</Button>
      </Stack>
    </form>
  )
}
