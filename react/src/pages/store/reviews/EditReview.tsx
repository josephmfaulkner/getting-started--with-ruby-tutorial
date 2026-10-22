import { useState, type FormEvent } from "react"
import { useNavigate, useParams } from "react-router"
import { api, ApiError, formDataFrom } from "../../../api/client"
import type { Review } from "../../../api/types"
import Errors from "../../../components/Errors"
import Loadable from "../../../components/Loadable"
import RatingInput from "../../../components/RatingInput"
import { useApi } from "../../../lib/useApi"

export default function EditReview() {
  const { id } = useParams()
  const review = useApi<Review>(`/api/store/reviews/${id}`)

  return (
    <>
      <h1>Edit Review</h1>
      <Loadable result={review}>{(review) => <ReviewForm review={review} />}</Loadable>
    </>
  )
}

function ReviewForm({ review }: { review: Review }) {
  const navigate = useNavigate()
  const [errors, setErrors] = useState<string[]>([])
  // Existing images to keep; new uploads are added to these
  const [keptImages, setKeptImages] = useState(review.images)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = formDataFrom(event.currentTarget)
    // Assigning images replaces them all, so resend the ones being kept. The blank
    // entry lets removing every image clear them (like Rails' hidden file field).
    data.append("review[images][]", "")
    keptImages.forEach((image) => data.append("review[images][]", image.signed_id))
    try {
      await api.patch<Review>(`/api/store/reviews/${review.id}`, data)
      navigate(`/store/reviews/${review.id}`)
    } catch (error) {
      if (!(error instanceof ApiError)) throw error
      setErrors(error.errors)
    }
  }

  return (
    <form onSubmit={submit}>
      <Errors errors={errors} />
      <RatingInput name="review[rating]" defaultValue={review.rating} />

      <div>
        <label htmlFor="review_body" style={{ display: "block" }}>Body</label>
        <textarea id="review_body" name="review[body]" required defaultValue={review.body} />
      </div>

      <div>
        <label htmlFor="review_images" style={{ display: "block" }}>Images</label>
        <input type="file" id="review_images" name="review[images][]" multiple accept="image/*" capture="environment" />

        {keptImages.map((image) => (
          <div key={image.signed_id}>
            <img src={image.thumbnail_url} alt="" />
            <button type="button" onClick={() => setKeptImages(keptImages.filter((kept) => kept !== image))}>Remove</button>
          </div>
        ))}
      </div>

      <input type="submit" value="Update Review" />
    </form>
  )
}
