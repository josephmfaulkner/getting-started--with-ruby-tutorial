import { useState, type FormEvent } from "react"
import { useParams } from "react-router"
import { api, ApiError, formDataFrom } from "../api/client"
import type { NoticePayload } from "../api/types"
import Errors from "../components/Errors"
import RatingInput from "../components/RatingInput"
import { useFlashNavigate } from "../lib/flash"

export default function NewReview() {
  const { id } = useParams()
  const flashNavigate = useFlashNavigate()
  const [errors, setErrors] = useState<string[]>([])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const { notice } = await api.post<NoticePayload>(`/api/products/${id}/reviews`, formDataFrom(event.currentTarget))
      flashNavigate(`/products/${id}`, { notice })
    } catch (error) {
      if (!(error instanceof ApiError)) throw error
      setErrors(error.errors)
    }
  }

  return (
    <>
      <h1>Add a review</h1>

      <form onSubmit={submit}>
        <Errors errors={errors} />
        <RatingInput name="review[rating]" />

        <div>
          <label htmlFor="review_body" style={{ display: "block" }}>Body</label>
          <textarea id="review_body" name="review[body]" required />
        </div>

        <div>
          <label htmlFor="review_images" style={{ display: "block" }}>Images</label>
          <input type="file" id="review_images" name="review[images][]" multiple accept="image/*" capture="environment" />
        </div>

        <input type="submit" value="Create Review" />
      </form>
    </>
  )
}
