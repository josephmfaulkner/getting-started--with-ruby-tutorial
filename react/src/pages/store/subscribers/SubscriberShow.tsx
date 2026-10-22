import { useParams } from "react-router"
import { Paper, Typography } from "@mui/material"
import { api } from "../../../api/client"
import type { NoticePayload, Subscriber } from "../../../api/types"
import Loadable from "../../../components/Loadable"
import { AppLink, BackLink, ConfirmButton, PageHeader } from "../../../components/ui"
import { useFlashNavigate } from "../../../lib/flash"
import { useApi } from "../../../lib/useApi"

export default function SubscriberShow() {
  const { id } = useParams()
  const subscriber = useApi<Subscriber>(`/api/store/subscribers/${id}`)
  const flashNavigate = useFlashNavigate()

  async function remove() {
    const { notice } = await api.delete<NoticePayload>(`/api/store/subscribers/${id}`)
    flashNavigate("/store/subscribers", { notice })
  }

  return (
    <Loadable result={subscriber}>
      {(subscriber) => (
        <>
          <BackLink to="/store/subscribers" />
          <PageHeader title={subscriber.email} actions={<ConfirmButton variant="outlined" onConfirm={remove}>Remove</ConfirmButton>} />
          <Paper sx={{ p: 3 }}>
            <Typography>Subscribed to <AppLink to={`/store/products/${subscriber.product.id}`}>{subscriber.product.name}</AppLink> on {subscriber.subscribed_on}</Typography>
          </Paper>
        </>
      )}
    </Loadable>
  )
}
