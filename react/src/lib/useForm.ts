import { useState, type FormEvent } from "react"
import { ApiError } from "../api/client"

// Handles a form submission: prevents double submits while it's pending and
// collects Rails validation errors ({ errors: [...] }) for display.
export function useForm(handler: (form: HTMLFormElement) => Promise<void>) {
  const [pending, setPending] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setPending(true)
    try {
      await handler(form)
      setErrors([])
    } catch (error) {
      if (!(error instanceof ApiError)) throw error
      setErrors(error.errors)
    } finally {
      setPending(false)
    }
  }

  return { pending, errors, onSubmit }
}
