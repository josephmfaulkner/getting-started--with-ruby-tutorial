import type { DetailedHTMLProps, HTMLAttributes } from "react"

// Packages without TypeScript types, imported for their side effects
declare module "trix"
declare module "@rails/actiontext"

// The <trix-editor> custom element from Trix (used for Action Text rich text)
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "trix-editor": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        input?: string
        "data-direct-upload-url"?: string
        "data-blob-url-template"?: string
      }
    }
  }
}
