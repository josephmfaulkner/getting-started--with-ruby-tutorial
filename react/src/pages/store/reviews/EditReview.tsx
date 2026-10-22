import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import { Box, Button, Stack } from "@mui/material"
import { api, formDataFrom } from "../../../api/client"
import type { Review } from "../../../api/types"
import Loadable from "../../../components/Loadable"
import RatingInput from "../../../components/RatingInput"
import { Field, FileField, FormCard, FormErrors, SubmitButton } from "../../../components/ui"
import { useApi } from "../../../lib/useApi"
import { useForm } from "../../../lib/useForm"

export default function EditReview() {
  const { id } = useParams()
  const review = useApi<Review>(`/api/store/reviews/${id}`)

  return (
    <FormCard title="Edit Review">
      <Loadable result={review}>{(review) => <ReviewForm review={review} />}</Loadable>
    </FormCard>
  )
}

function ReviewForm({ review }: { review: Review }) {
  const navigate = useNavigate()
  // Existing images to keep; new uploads are added to these
  const [keptImages, setKeptImages] = useState(review.images)
  const { pending, errors, onSubmit } = useForm(async (form) => {
    const data = formDataFrom(form)
    // Assigning images replaces them all, so resend the ones being kept. The blank
    // entry lets removing every image clear them (like Rails' hidden file field).
    data.append("review[images][]", "")
    keptImages.forEach((image) => data.append("review[images][]", image.signed_id))
    await api.patch<Review>(`/api/store/reviews/${review.id}`, data)
    navigate(`/store/reviews/${review.id}`)
  })

  return (
    <form onSubmit={onSubmit}>
      <FormErrors errors={errors} />
      <RatingInput name="review[rating]" defaultValue={review.rating} />
      <Field id="review_body" name="review[body]" label="Body" required multiline minRows={4} defaultValue={review.body} />
      <FileField id="review_images" name="review[images][]" label="Images" multiple capture="environment" />

      <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
        {keptImages.map((image) => (
          <Stack key={image.signed_id} spacing={0.5} sx={{ alignItems: "center" }}>
            <Box component="img" src={image.thumbnail_url} alt="" sx={{ width: 96, height: 96, objectFit: "cover", borderRadius: 2, border: 1, borderColor: "divider" }} />
            <Button size="small" color="error" onClick={() => setKeptImages(keptImages.filter((kept) => kept !== image))}>Remove</Button>
          </Stack>
        ))}
      </Stack>

      <SubmitButton pending={pending}>Update Review</SubmitButton>
    </form>
  )
}
