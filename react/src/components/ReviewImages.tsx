import type { ReviewImage } from "../api/types"

export default function ReviewImages({ images }: { images: ReviewImage[] }) {
  if (images.length === 0) return null

  return (
    <div className="review__images">
      {images.map((image) => (
        <a key={image.signed_id} href={image.url} target="_blank" rel="noreferrer" title="View full-size image (opens in new tab)" aria-label="View full-size image (opens in new tab)">
          <img src={image.thumbnail_url} alt="" />
        </a>
      ))}
    </div>
  )
}
