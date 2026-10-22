import { Link, useNavigate, useParams } from "react-router"
import { Button } from "@mui/material"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import { api } from "../../../api/client"
import type { Review } from "../../../api/types"
import Loadable from "../../../components/Loadable"
import ReviewCard from "../../../components/ReviewCard"
import { AppLink, BackLink, ConfirmButton, PageHeader } from "../../../components/ui"
import { useApi } from "../../../lib/useApi"

export default function ReviewShow() {
  const { id } = useParams()
  const review = useApi<Review>(`/api/store/reviews/${id}`)
  const navigate = useNavigate()

  return (
    <>
      <BackLink to="/store/reviews">Back to all reviews</BackLink>

      <Loadable result={review}>
        {(review) => (
          <>
            <PageHeader title="Review" actions={
              <>
                <Button component={Link} to={`/store/reviews/${review.id}/edit`} variant="outlined" startIcon={<EditOutlinedIcon />}>Edit</Button>
                <ConfirmButton onConfirm={async () => { await api.delete(`/api/store/reviews/${id}`); navigate("/store/reviews") }}>Delete</ConfirmButton>
              </>
            } />
            <ReviewCard review={review}
              heading={<><AppLink to={`/store/users/${review.user.id}`}>{review.user.full_name}</AppLink> reviewed <AppLink to={`/store/products/${review.product.id}`}>{review.product.name}</AppLink></>} />
          </>
        )}
      </Loadable>
    </>
  )
}
