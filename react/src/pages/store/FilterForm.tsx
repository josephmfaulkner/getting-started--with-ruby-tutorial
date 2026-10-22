import type { FormEvent, ReactNode } from "react"
import { useSearchParams } from "react-router"

// GET-style filter form: submitting puts the selected values in the URL's query string
export default function FilterForm({ children }: { children: ReactNode }) {
  const [, setSearchParams] = useSearchParams()

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const params = new URLSearchParams()
    for (const [key, value] of new FormData(event.currentTarget)) {
      if (value !== "") params.set(key, value.toString())
    }
    setSearchParams(params)
  }

  return (
    <form onSubmit={submit}>
      {children}
      <input type="submit" value="Filter" />
    </form>
  )
}

export function FilterSelect({ name, label, blank, options }: { name: string; label: string; blank: string; options: { value: string; label: string }[] }) {
  const [searchParams] = useSearchParams()

  return (
    <select name={name} aria-label={label} defaultValue={searchParams.get(name) ?? ""} key={searchParams.get(name) ?? ""}>
      <option value="">{blank}</option>
      {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  )
}
