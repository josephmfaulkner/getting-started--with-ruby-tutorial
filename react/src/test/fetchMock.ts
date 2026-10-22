import { vi } from "vitest"

// Stubs window.fetch with JSON responses keyed by "METHOD /path"
export function mockFetch(routes: Record<string, unknown>) {
  return vi.spyOn(window, "fetch").mockImplementation(async (input, init) => {
    const key = `${init?.method ?? "GET"} ${input.toString()}`
    if (!(key in routes)) return new Response(JSON.stringify({ errors: ["Not found."] }), { status: 404 })
    return new Response(JSON.stringify(routes[key]), { status: 200, headers: { "Content-Type": "application/json" } })
  })
}
