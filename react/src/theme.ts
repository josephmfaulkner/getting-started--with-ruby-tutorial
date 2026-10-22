import { createTheme } from "@mui/material/styles"

// Material UI theme for the whole app (applied in App.tsx)
export const theme = createTheme({
  palette: {
    primary: { main: "#4f46e5" },
    secondary: { main: "#db2777" },
    background: { default: "#f6f7fb" }
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 }
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiCard: { defaultProps: { variant: "outlined" } },
    MuiPaper: { defaultProps: { variant: "outlined" } },
    MuiTextField: { defaultProps: { fullWidth: true, margin: "normal" } },
    MuiAppBar: { defaultProps: { elevation: 0, color: "inherit" } }
  }
})
