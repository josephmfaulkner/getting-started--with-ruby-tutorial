import { describe, expect, it, vi } from "vitest"
import { api, ApiError, formDataFrom, setCsrfToken } from "./client"

describe("api", () => {
  it("sends the CSRF token and JSON body on writes", async () => {
    setCsrfToken("token-123")
    const fetch = vi.spyOn(window, "fetch").mockResolvedValue(new Response(JSON.stringify({ notice: "Saved" })))

    await expect(api.post("/api/things", { name: "Hat" })).resolves.toEqual({ notice: "Saved" })

    const [path, init] = fetch.mock.calls[0]
    expect(path).toBe("/api/things")
    expect(init?.method).toBe("POST")
    expect((init?.headers as Record<string, string>)["X-CSRF-Token"]).toBe("token-123")
    expect(init?.body).toBe('{"name":"Hat"}')
  })

  it("does not send the CSRF token on reads", async () => {
    const fetch = vi.spyOn(window, "fetch").mockResolvedValue(new Response("[]"))
    await api.get("/api/things")
    expect((fetch.mock.calls[0][1]?.headers as Record<string, string>)["X-CSRF-Token"]).toBeUndefined()
  })

  it("raises Rails validation errors as an ApiError", async () => {
    vi.spyOn(window, "fetch").mockResolvedValue(new Response(JSON.stringify({ errors: ["Name can't be blank"] }), { status: 422 }))

    const error = await api.post<never>("/api/things", {}).catch((e: unknown) => e as ApiError)
    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(422)
    expect(error.message).toBe("Name can't be blank")
  })

  it("handles empty 204 responses", async () => {
    vi.spyOn(window, "fetch").mockResolvedValue(new Response(null, { status: 204 }))
    await expect(api.delete("/api/things/1")).resolves.toBeNull()
  })
})

describe("formDataFrom", () => {
  it("drops untouched file inputs", () => {
    const form = document.createElement("form")
    form.innerHTML = '<input name="product[name]" value="Hat"><input type="file" name="product[featured_image]">'

    const data = formDataFrom(form)
    expect(data.get("product[name]")).toBe("Hat")
    expect(data.has("product[featured_image]")).toBe(false)
  })
})
