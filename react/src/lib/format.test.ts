import { describe, expect, it } from "vitest"
import { pluralize, toSentence } from "./format"

describe("pluralize", () => {
  it("matches Rails' pluralize helper", () => {
    expect(pluralize(1, "review")).toBe("1 review")
    expect(pluralize(0, "review")).toBe("0 reviews")
    expect(pluralize(2, "Wishlist")).toBe("2 Wishlists")
  })
})

describe("toSentence", () => {
  it("matches Rails' Array#to_sentence", () => {
    expect(toSentence(["a"])).toBe("a")
    expect(toSentence(["a", "b"])).toBe("a and b")
    expect(toSentence(["a", "b", "c"])).toBe("a, b, and c")
  })
})
