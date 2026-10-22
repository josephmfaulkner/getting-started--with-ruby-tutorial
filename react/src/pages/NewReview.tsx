import { useParams } from "react-router"
import { api, formDataFrom } from "../api/client"
import type { NoticePayload } from "../api/types"
import RatingInput from "../components/RatingInput"
import { BackLink, Field, FileField, FormCard, FormErrors, SubmitButton } from "../components/ui"
import { useFlashNavigate } from "../lib/flash"
import { useForm } from "../lib/useForm"

export default function NewReview() {
  const { id } = useParams()
  const flashNavigate = useFlashNavigate()
  const { pending, errors, onSubmit } = useForm(async (form) => {
    const { notice } = await api.post<NoticePayload>(`/api/products/${id}/reviews`, formDataFrom(form))
    flashNavigate(`/products/${id}`, { notice })
  })

  return (
    <>
      <BackLink to={`/products/${id}`} />
      <FormCard title="Add a review" centered>
        <form onSubmit={onSubmit}>
          <FormErrors errors={errors} />
          <RatingInput name="review[rating]" />
          <Field id="review_body" name="review[body]" label="Body" required multiline minRows={4} />
          <FileField id="review_images" name="review[images][]" label="Images" multiple capture="environment" />
          <SubmitButton pending={pending} fullWidth>Create Review</SubmitButton>
        </form>
      </FormCard>
    </>
  )
}
