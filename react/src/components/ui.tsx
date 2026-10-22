// Small Material UI building blocks shared by the pages
import { useState, type ReactNode } from "react"
import { Link } from "react-router"
import {
  Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormLabel, Link as MuiLink,
  Paper, Stack, TextField, Typography, type ButtonProps, type TextFieldProps
} from "@mui/material"
import { styled } from "@mui/material/styles"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

export function PageHeader({ title, subtitle, actions }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3, justifyContent: "space-between", alignItems: { sm: "center" } }}>
      <Box>
        <Typography variant="h4" component="h1">{title}</Typography>
        {subtitle && <Typography color="textSecondary" sx={{ mt: 0.5 }}>{subtitle}</Typography>}
      </Box>
      {actions && <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", alignItems: "center" }}>{actions}</Stack>}
    </Stack>
  )
}

export function BackLink({ to, children = "Back" }: { to: string; children?: ReactNode }) {
  return (
    <Button component={Link} to={to} startIcon={<ArrowBackIcon />} sx={{ mb: 2, ml: -1 }}>
      {children}
    </Button>
  )
}

// A titled card around a form. `centered` is for standalone pages like sign in.
export function FormCard({ title, subtitle, children, centered = false }: { title?: ReactNode; subtitle?: ReactNode; children: ReactNode; centered?: boolean }) {
  return (
    <Paper sx={{ p: { xs: 3, sm: 4 }, ...(centered && { maxWidth: 480, mx: "auto", mt: { sm: 4 } }) }}>
      {title && <Typography variant="h5" component="h1">{title}</Typography>}
      {subtitle && <Typography color="textSecondary" sx={{ mt: 1 }}>{subtitle}</Typography>}
      {children}
    </Paper>
  )
}

// Shows the first error from the API, like the Rails forms did
export function FormErrors({ errors, prefix = "Error: " }: { errors: string[]; prefix?: string }) {
  if (errors.length === 0) return null
  return <Alert severity="error" sx={{ mt: 2 }}>{prefix}{errors[0]}</Alert>
}

export function SubmitButton({ children, pending, ...props }: ButtonProps & { pending?: boolean }) {
  return (
    <Button type="submit" variant="contained" size="large" loading={pending} sx={{ mt: 2 }} {...props}>
      {children}
    </Button>
  )
}

// TextField that marks required inputs without MUI's "*" (so labels read exactly as written)
export function Field({ required, slotProps, ...props }: TextFieldProps) {
  return <TextField {...props} slotProps={{ ...slotProps, htmlInput: { required, ...(slotProps?.htmlInput as object) } }} />
}

// Native <select> styled as a text field (works with keyboards, screen readers, and browser tests)
export function SelectField({ options, blank, ...props }: TextFieldProps & { options: { value: string | number; label: string }[]; blank?: string }) {
  return (
    <TextField select {...props} slotProps={{ select: { native: true }, inputLabel: { shrink: true } }}>
      {blank !== undefined && <option value="">{blank}</option>}
      {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </TextField>
  )
}

const FileInput = styled("input")(({ theme }) => ({
  font: "inherit",
  color: theme.palette.text.secondary,
  "&::file-selector-button": {
    font: "inherit",
    fontWeight: 600,
    marginRight: theme.spacing(2),
    padding: theme.spacing(1, 2),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
    cursor: "pointer"
  }
}))

export function FileField({ id, name, label, multiple, capture }: { id: string; name: string; label: string; multiple?: boolean; capture?: "environment" }) {
  return (
    <Box sx={{ my: 2 }}>
      <FormLabel htmlFor={id} sx={{ display: "block", mb: 1 }}>{label}</FormLabel>
      <FileInput type="file" id={id} name={name} multiple={multiple} accept="image/*" capture={capture} />
    </Box>
  )
}

// A button that asks for confirmation in a dialog before running `onConfirm`
export function ConfirmButton({ message = "Are you sure?", detail, confirmLabel = "Confirm", onConfirm, children, ...props }:
  ButtonProps & { message?: string; detail?: string; confirmLabel?: string; onConfirm: () => Promise<unknown> }) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  async function confirm() {
    setPending(true)
    try {
      await onConfirm()
    } finally {
      setPending(false)
      setOpen(false)
    }
  }

  return (
    <>
      <Button color="error" {...props} onClick={() => setOpen(true)}>{children}</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{message}</DialogTitle>
        {detail && <DialogContent><DialogContentText>{detail}</DialogContentText></DialogContent>}
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" loading={pending} onClick={confirm}>{confirmLabel}</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

// Router link styled like an MUI link
export function AppLink({ to, children }: { to: string; children: ReactNode }) {
  return <MuiLink component={Link} to={to} sx={{ fontWeight: 500 }}>{children}</MuiLink>
}
