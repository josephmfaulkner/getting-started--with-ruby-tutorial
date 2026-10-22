import { useState, type FormEvent } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { api, ApiError, formDataFrom } from "../../../api/client"
import type { StoreProduct } from "../../../api/types"
import Loadable from "../../../components/Loadable"
import TrixEditor from "../../../components/TrixEditor"
import { useApi } from "../../../lib/useApi"

export function NewProduct() {
  return (
    <>
      <h1>New product</h1>
      <ProductForm />
      <Link to="/store/products">Cancel</Link>
    </>
  )
}

export function EditProduct() {
  const { id } = useParams()
  const product = useApi<StoreProduct>(`/api/store/products/${id}`)

  return (
    <>
      <h1>Edit product</h1>
      <Loadable result={product}>{(product) => <ProductForm product={product} />}</Loadable>
      <Link to={`/store/products/${id}`}>Cancel</Link>
    </>
  )
}

function ProductForm({ product }: { product?: StoreProduct }) {
  const navigate = useNavigate()
  const [errors, setErrors] = useState<string[]>([])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = formDataFrom(event.currentTarget)
    try {
      const saved = product
        ? await api.patch<StoreProduct>(`/api/store/products/${product.id}`, data)
        : await api.post<StoreProduct>("/api/store/products", data)
      navigate(`/store/products/${saved.id}`)
    } catch (error) {
      if (!(error instanceof ApiError)) throw error
      setErrors(error.errors)
    }
  }

  return (
    <form onSubmit={submit}>
      {errors.length > 0 && <p className="error">{errors[0]}</p>}

      <div>
        <label htmlFor="product_name">Name</label>
        <input type="text" id="product_name" name="product[name]" defaultValue={product?.name} />
      </div>

      <div>
        <label htmlFor="product_description" style={{ display: "block" }}>Description</label>
        <TrixEditor id="product_description" name="product[description]" defaultValue={product?.description_trix_html} />
      </div>

      <div>
        <label htmlFor="product_featured_image" style={{ display: "block" }}>Featured image</label>
        <input type="file" id="product_featured_image" name="product[featured_image]" accept="image/*" />
      </div>

      <div>
        <label htmlFor="product_inventory_count" style={{ display: "block" }}>Inventory count</label>
        <input type="number" id="product_inventory_count" name="product[inventory_count]" defaultValue={product?.inventory_count ?? 0} />
      </div>

      <div>
        <input type="submit" value={product ? "Update Product" : "Create Product"} />
      </div>
    </form>
  )
}
