import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import Stars from "./Stars"

describe("Stars", () => {
  it("rounds the rating and colors that many stars gold", () => {
    const { container } = render(<Stars rating={3.6} />)

    expect(screen.getByRole("img")).toHaveAccessibleName("4 out of 5 stars")
    expect(container.querySelectorAll(".gold")).toHaveLength(4)
    expect(container.querySelectorAll(".gray")).toHaveLength(1)
  })
})
