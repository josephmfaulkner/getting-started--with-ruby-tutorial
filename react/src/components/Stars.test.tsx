import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import Stars from "./Stars"

describe("Stars", () => {
  it("shows the rating to the nearest half star", () => {
    render(<Stars rating={3.6} />)
    expect(screen.getByRole("img")).toHaveAccessibleName("3.5 out of 5 stars")
  })
})
