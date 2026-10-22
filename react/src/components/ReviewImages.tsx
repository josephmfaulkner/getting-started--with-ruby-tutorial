import { Box } from "@mui/material"
import type { ReviewImage } from "../api/types"

export default function ReviewImages({ images }: { images: ReviewImage[] }) {
  if (images.length === 0) return null

  return (
    <Box className="review__images" sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.5 }}>
      {images.map((image) => (
        <a key={image.signed_id} href={image.url} target="_blank" rel="noreferrer" title="View full-size image (opens in new tab)" aria-label="View full-size image (opens in new tab)">
          <Box component="img" src={image.thumbnail_url} alt="" sx={{ display: "block", width: 96, height: 96, objectFit: "cover", borderRadius: 2, border: 1, borderColor: "divider" }} />
        </a>
      ))}
    </Box>
  )
}
