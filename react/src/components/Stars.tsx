import type { ReactNode } from "react"

// Displays a 1-5 star rating, e.g. ★★★★☆
export default function Stars({ rating, children }: { rating: number; children?: ReactNode }) {
  const rounded = Math.round(rating)

  return (
    <div role="img" aria-label={`${rounded} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={i < rounded ? "gold" : "gray"} aria-hidden="true">★</span>
      ))}
      {children}
    </div>
  )
}
