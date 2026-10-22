import { Box, FormLabel, Rating } from "@mui/material"

// Star picker; submits its value with the form as `name`
export default function RatingInput({ name, defaultValue }: { name: string; defaultValue?: number }) {
  return (
    <Box component="fieldset" sx={{ border: 0, p: 0, m: 0, mt: 2 }}>
      <FormLabel component="legend" sx={{ mb: 0.5 }}>Rating</FormLabel>
      <Rating name={name} defaultValue={defaultValue} size="large" />
    </Box>
  )
}
