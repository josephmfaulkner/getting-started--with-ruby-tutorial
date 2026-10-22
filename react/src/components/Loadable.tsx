import type { ReactNode } from "react"
import type { ApiResult } from "../lib/useApi"
import NotFound from "../pages/NotFound"

// Renders API data once it has loaded, or a not found / error message
export default function Loadable<T>({ result, children }: { result: ApiResult<T>; children: (data: T) => ReactNode }) {
  if (result.error?.status === 404) return <NotFound />
  if (result.error) return <p className="alert">{result.error.message}</p>
  if (result.data === undefined) return <p>Loading…</p>
  return <>{children(result.data)}</>
}
