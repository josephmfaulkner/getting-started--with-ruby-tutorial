import { useId } from "react"
import { Box, FormLabel } from "@mui/material"

// Action Text rich text editor. Trix keeps the hidden input's value in sync, so the
// HTML is submitted with the form like Rails' rich_textarea helper.
export default function TrixEditor({ name, id, label, defaultValue }: { name: string; id: string; label: string; defaultValue?: string }) {
  const inputId = `${id}_${useId().replace(/:/g, "")}`

  return (
    <Box sx={{ my: 2 }}>
      <FormLabel htmlFor={id} sx={{ display: "block", mb: 1 }}>{label}</FormLabel>
      <input type="hidden" id={inputId} name={name} defaultValue={defaultValue} />
      <trix-editor
        id={id}
        input={inputId}
        className="trix-content"
        data-direct-upload-url="/rails/active_storage/direct_uploads"
        data-blob-url-template="/rails/active_storage/blobs/redirect/:signed_id/:filename"
      />
    </Box>
  )
}
