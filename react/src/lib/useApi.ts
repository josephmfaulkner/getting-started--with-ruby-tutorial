import { useCallback, useEffect, useState } from "react"
import { api, ApiError } from "../api/client"

export interface ApiResult<T> {
  data?: T
  error?: ApiError
  reload: () => void
}

// Loads JSON from the API whenever `path` changes. Keeps showing the previous data while reloading.
export function useApi<T>(path: string | null): ApiResult<T> {
  const [data, setData] = useState<T>()
  const [error, setError] = useState<ApiError>()
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (!path) return
    let cancelled = false
    api.get<T>(path).then(
      (result) => { if (!cancelled) { setData(result); setError(undefined) } },
      (failure) => { if (!cancelled) setError(failure instanceof ApiError ? failure : new ApiError(0, [String(failure)])) }
    )
    return () => { cancelled = true }
  }, [path, version])

  const reload = useCallback(() => setVersion((v) => v + 1), [])
  return { data, error, reload }
}
