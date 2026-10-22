import type { ReactNode } from "react"
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"

// Simple table for the admin lists
export default function DataTable<T extends { id: number }>({ rows, columns, empty = "Nothing here yet." }: {
  rows: T[]
  columns: { header: string; cell: (row: T) => ReactNode; align?: "right" }[]
  empty?: string
}) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => <TableCell key={column.header} align={column.align} sx={{ fontWeight: 600 }}>{column.header}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} hover>
              {columns.map((column) => <TableCell key={column.header} align={column.align}>{column.cell(row)}</TableCell>)}
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length}><Typography color="textSecondary">{empty}</Typography></TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
