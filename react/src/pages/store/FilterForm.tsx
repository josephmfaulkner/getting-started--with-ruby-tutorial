import type { ReactNode } from "react"
import { Button, Paper, Stack } from "@mui/material"
import FilterListIcon from "@mui/icons-material/FilterList"
import { useSearchParams } from "react-router"
import { SelectField } from "../../components/ui"

// GET-style filter form: submitting puts the selected values in the URL's query string
export default function FilterForm({ children }: { children: ReactNode }) {
  const [, setSearchParams] = useSearchParams()

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const params = new URLSearchParams()
    for (const [key, value] of new FormData(event.currentTarget)) {
      if (value !== "") params.set(key, value.toString())
    }
    setSearchParams(params)
  }

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Stack component="form" onSubmit={submit} direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "center" } }}>
        {children}
        <Button type="submit" variant="contained" startIcon={<FilterListIcon />} sx={{ flexShrink: 0 }}>Filter</Button>
      </Stack>
    </Paper>
  )
}

export function FilterSelect({ name, label, blank, options }: { name: string; label: string; blank: string; options: { value: string; label: string }[] }) {
  const [searchParams] = useSearchParams()
  const value = searchParams.get(name) ?? ""

  return <SelectField key={`${value}-${options.length}`} name={name} label={label} blank={blank} options={options} defaultValue={value} size="small" margin="none" />
}
