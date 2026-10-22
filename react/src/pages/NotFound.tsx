import { Link } from "react-router"
import { Button, Stack, Typography } from "@mui/material"
import SearchOffIcon from "@mui/icons-material/SearchOff"

export default function NotFound() {
  return (
    <Stack spacing={2} sx={{ alignItems: "center", textAlign: "center", py: 8 }}>
      <SearchOffIcon sx={{ fontSize: 56, color: "text.disabled" }} />
      <Typography variant="h4" component="h1">Not found</Typography>
      <Typography color="textSecondary">The page you were looking for doesn't exist.</Typography>
      <Button component={Link} to="/" variant="contained">Back to the store</Button>
    </Stack>
  )
}
