import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"
import App from "./App"
import { mockFetch } from "./test/fetchMock"

const products = [
  { id: 1, name: "T-Shirt", inventory_count: 3, description_excerpt: "Soft cotton", thumbnail_url: "/thumb.png" },
  { id: 2, name: "Shoes", inventory_count: 0, description_excerpt: null, thumbnail_url: null }
]
const user = { id: 1, first_name: "Ada", last_name: "L", full_name: "Ada L", email_address: "ada@example.org", admin: false }

describe("App", () => {
  beforeEach(() => window.history.pushState({}, "", "/"))

  it("shows the product grid and sign up/login links to guests", async () => {
    mockFetch({ "GET /api/session": { user: null, csrf_token: "t" }, "GET /api/products": products })
    render(<App />)

    const tshirt = await screen.findByRole("link", { name: /T-Shirt/ })
    expect(tshirt).toHaveAttribute("href", "/products/1")
    expect(tshirt.querySelector("img")).toHaveAttribute("src", "/thumb.png")
    expect(tshirt).toHaveTextContent("Soft cotton")
    expect(screen.getByRole("link", { name: /Shoes/ })).toHaveTextContent("No image")
    expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument()
  })

  it("shows account links to signed-in users", async () => {
    mockFetch({ "GET /api/session": { user, csrf_token: "t" }, "GET /api/products": products })
    render(<App />)

    expect(await screen.findByRole("button", { name: "Log out" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Wishlists" })).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: "Login" })).not.toBeInTheDocument()
  })

  it("uses the session Rails embedded in the page without fetching it", async () => {
    const root = document.createElement("div")
    root.id = "root"
    root.dataset.session = JSON.stringify({ user, csrf_token: "t" })
    document.body.appendChild(root)
    const fetch = mockFetch({ "GET /api/products": products })

    render(<App />, { container: root })

    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument()
    expect(fetch.mock.calls.map(([path]) => path)).not.toContain("/api/session")
    root.remove()
  })

  it("sends signed-out visitors from settings to the login page", async () => {
    window.history.pushState({}, "", "/settings/profile")
    mockFetch({ "GET /api/session": { user: null, csrf_token: "t" } })
    render(<App />)

    expect(await screen.findByRole("link", { name: "Forgot password?" })).toBeInTheDocument()
    expect(window.location.pathname).toBe("/session/new")
  })

  it("keeps regular users out of the store admin", async () => {
    window.history.pushState({}, "", "/store/products")
    mockFetch({ "GET /api/session": { user, csrf_token: "t" }, "GET /api/products": products })
    render(<App />)

    expect(await screen.findByText("You aren't allowed to do that.")).toBeInTheDocument()
    expect(window.location.pathname).toBe("/")
  })
})
