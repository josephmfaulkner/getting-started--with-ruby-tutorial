import { CircularProgress, Stack, Typography } from "@mui/material"

// Shown while a page does its work and then redirects
export default function Working({ children }: { children: string }) {
  return (
    <Stack spacing={2} sx={{ alignItems: "center", py: 8 }}>
      <CircularProgress />
      <Typography color="textSecondary">{children}</Typography>
    </Stack>
  )
}
