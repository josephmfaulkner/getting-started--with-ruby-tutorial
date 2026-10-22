// Small fetch wrapper for the Rails JSON API. Sends the CSRF token Rails requires on
// non-GET requests and turns { errors: [...] } responses into an ApiError.

export class ApiError extends Error {
  constructor(public status: number, public errors: string[]) {
    super(errors[0] ?? `Request failed (${status})`)
  }
}

let csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? ""

export function setCsrfToken(token: string) {
  csrfToken = token
}

type Body = FormData | Record<string, unknown>

async function request<T>(method: string, path: string, body?: Body): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" }
  if (method !== "GET") headers["X-CSRF-Token"] = csrfToken

  let payload: BodyInit | undefined
  if (body instanceof FormData) {
    payload = body
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json"
    payload = JSON.stringify(body)
  }

  const response = await fetch(path, { method, headers, body: payload, credentials: "same-origin" })
  const data = response.status === 204 ? null : await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(response.status, data?.errors ?? [`Request failed (${response.status})`])
  }
  return data as T
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: Body) => request<T>("POST", path, body),
  patch: <T>(path: string, body?: Body) => request<T>("PATCH", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path)
}

// FormData for a form, without empty file inputs (so an untouched file field doesn't
// replace an existing attachment)
export function formDataFrom(form: HTMLFormElement): FormData {
  const data = new FormData(form)
  for (const [key, value] of [...data.entries()]) {
    if (value instanceof File && value.size === 0 && value.name === "") data.delete(key)
  }
  return data
}
