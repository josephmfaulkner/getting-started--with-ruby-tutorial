import type { ReactNode } from "react"
import { Avatar, Card, CardContent, Stack, Typography } from "@mui/material"
import type { Review } from "../api/types"
import ReviewImages from "./ReviewImages"
import Stars from "./Stars"

export default function ReviewCard({ review, heading, footer }: { review: Review; heading?: ReactNode; footer?: ReactNode }) {
  const initials = review.user.full_name.split(" ").map((part) => part[0]).join("").slice(0, 2)

  return (
    <Card id={`review_${review.id}`} className="review" sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1 }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36, fontSize: 15 }}>{initials}</Avatar>
          <Stack>
            <Typography sx={{ fontWeight: 600 }}>{heading ?? review.user.full_name}</Typography>
            <Stars rating={review.rating} />
          </Stack>
        </Stack>
        <Typography sx={{ whiteSpace: "pre-line" }}>{review.body}</Typography>
        <ReviewImages images={review.images} />
        {footer}
      </CardContent>
    </Card>
  )
}
