import type { ReactNode } from "react"
import { Alert, Box, CircularProgress } from "@mui/material"
import type { ApiResult } from "../lib/useApi"
import NotFound from "../pages/NotFound"

// Renders API data once it has loaded, or a spinner / not found / error message
export default function Loadable<T>({ result, children }: { result: ApiResult<T>; children: (data: T) => ReactNode }) {
  if (result.error?.status === 404) return <NotFound />
  if (result.error) return <Alert severity="error">{result.error.message}</Alert>
  if (result.data === undefined) {
    return <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress aria-label="Loading" /></Box>
  }
  return <>{children(result.data)}</>
}
