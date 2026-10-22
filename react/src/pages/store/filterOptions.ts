import type { NamedRecord, UserOption } from "../../api/types"
import { useApi } from "../../lib/useApi"

export function useProductOptions() {
  const products = useApi<NamedRecord[]>("/api/store/products")
  return (products.data ?? []).map((product) => ({ value: String(product.id), label: product.name }))
}

export function useUserOptions() {
  const users = useApi<UserOption[]>("/api/store/users")
  return (users.data ?? []).map((user) => ({ value: String(user.id), label: user.full_name }))
}
