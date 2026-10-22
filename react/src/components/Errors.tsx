// Shows the first validation error, like the Rails forms did
export default function Errors({ errors, prefix = "Error: " }: { errors: string[]; prefix?: string }) {
  if (errors.length === 0) return null
  return <div>{prefix}{errors[0]}</div>
}
