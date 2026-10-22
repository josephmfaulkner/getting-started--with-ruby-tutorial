import { Link } from "react-router"
import { Button, Chip } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import type { StoreProductRow } from "../../../api/types"
import Loadable from "../../../components/Loadable"
import Stars from "../../../components/Stars"
import { AppLink, PageHeader } from "../../../components/ui"
import { useApi } from "../../../lib/useApi"
import DataTable from "../DataTable"

export default function ProductsIndex() {
  const products = useApi<StoreProductRow[]>("/api/store/products")

  return (
    <>
      <PageHeader title="Products" actions={<Button component={Link} to="/store/products/new" variant="contained" startIcon={<AddIcon />}>New product</Button>} />

      <Loadable result={products}>
        {(products) => (
          <DataTable rows={products} empty="No products yet." columns={[
            { header: "Name", cell: (product) => <AppLink to={`/store/products/${product.id}`}>{product.name}</AppLink> },
            { header: "Stock", cell: (product) => product.inventory_count > 0 ? product.inventory_count : <Chip label="Out of stock" size="small" /> },
            { header: "Rating", cell: (product) => product.reviews_count > 0 ? <Stars rating={product.rating} /> : "—" },
            { header: "Reviews", cell: (product) => product.reviews_count, align: "right" }
          ]} />
        )}
      </Loadable>
    </>
  )
}
