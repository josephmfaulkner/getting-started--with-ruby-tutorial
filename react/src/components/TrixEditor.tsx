import { useId } from "react"

// Action Text rich text editor. Trix keeps the hidden input's value in sync, so the
// HTML is submitted with the form like Rails' rich_textarea helper.
export default function TrixEditor({ name, id, defaultValue }: { name: string; id?: string; defaultValue?: string }) {
  const inputId = `${id ?? "trix"}_${useId().replace(/:/g, "")}`

  return (
    <>
      <input type="hidden" id={inputId} name={name} defaultValue={defaultValue} />
      <trix-editor
        id={id}
        input={inputId}
        className="trix-content"
        data-direct-upload-url="/rails/active_storage/direct_uploads"
        data-blob-url-template="/rails/active_storage/blobs/redirect/:signed_id/:filename"
      />
    </>
  )
}
