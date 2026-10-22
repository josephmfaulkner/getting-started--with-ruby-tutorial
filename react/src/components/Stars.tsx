import { Rating } from "@mui/material"

// Read-only star rating, shown to the nearest half star
export default function Stars({ rating, size = "small" }: { rating: number; size?: "small" | "medium" | "large" }) {
  const rounded = Math.round(rating * 2) / 2
  return <Rating value={rounded} precision={0.5} readOnly size={size} getLabelText={(value) => `${value} out of 5 stars`} />
}
