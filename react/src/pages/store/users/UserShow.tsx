import { Link, useParams } from "react-router"
import { Avatar, Button, Chip, Paper, Stack, Typography } from "@mui/material"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import type { User } from "../../../api/types"
import Loadable from "../../../components/Loadable"
import { BackLink } from "../../../components/ui"
import { useApi } from "../../../lib/useApi"

export default function UserShow() {
  const { id } = useParams()
  const user = useApi<User>(`/api/store/users/${id}`)

  return (
    <>
      <BackLink to="/store/users">Back to all users</BackLink>

      <Loadable result={user}>
        {(user) => (
          <Paper sx={{ p: 3 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "center" } }}>
              <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>{user.first_name[0]}{user.last_name[0]}</Avatar>
              <Stack sx={{ flex: 1 }}>
                <Typography variant="h5" component="h1">{user.full_name}</Typography>
                <Typography color="textSecondary">{user.email_address}</Typography>
              </Stack>
              {user.admin && <Chip label="Admin" color="primary" variant="outlined" />}
              <Button component={Link} to={`/store/users/${user.id}/edit`} variant="outlined" startIcon={<EditOutlinedIcon />}>Edit user</Button>
            </Stack>
          </Paper>
        )}
      </Loadable>
    </>
  )
}
