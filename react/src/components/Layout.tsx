import { useEffect } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router"
import { Alert, AppBar, Box, Button, Container, Stack, Toolbar, Typography } from "@mui/material"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import LogoutIcon from "@mui/icons-material/Logout"
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"
import StorefrontIcon from "@mui/icons-material/Storefront"
import { api } from "../api/client"
import type { SessionPayload } from "../api/types"
import { useAuth } from "../lib/auth"
import type { Flash } from "../lib/flash"

export default function Layout() {
  const { user, setSession } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const flash = (location.state ?? {}) as Flash

  useEffect(() => { window.scrollTo(0, 0) }, [location.pathname])

  async function logOut() {
    setSession(await api.delete<SessionPayload>("/api/session"))
    navigate("/session/new")
  }

  function dismissFlash() {
    navigate(location.pathname + location.search, { replace: true, state: null })
  }

  return (
    <>
      <AppBar position="sticky" sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters component="nav" sx={{ gap: 1 }}>
            <Box component={Link} to="/" aria-label="Home" sx={{ display: "flex", alignItems: "center", gap: 1, color: "primary.main", textDecoration: "none", mr: "auto" }}>
              <StorefrontIcon />
              <Typography variant="h6" component="span" sx={{ display: { xs: "none", sm: "block" }, color: "text.primary" }}>Store</Typography>
            </Box>

            {user ? (
              <>
                <Button component={Link} to="/wishlists" color="inherit" startIcon={<FavoriteBorderIcon />}>Wishlists</Button>
                <Button component={Link} to="/settings" color="inherit" startIcon={<SettingsOutlinedIcon />}>Settings</Button>
                <Button onClick={logOut} color="inherit" startIcon={<LogoutIcon />}>Log out</Button>
              </>
            ) : (
              <>
                <Button component={Link} to="/session/new" color="inherit">Login</Button>
                <Button component={Link} to="/sign_up" variant="contained">Sign Up</Button>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Container component="main" maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {(flash.notice || flash.alert) && (
          <Stack spacing={1} sx={{ mb: 3 }}>
            {flash.notice && <Alert severity="success" onClose={dismissFlash}>{flash.notice}</Alert>}
            {flash.alert && <Alert severity="error" onClose={dismissFlash}>{flash.alert}</Alert>}
          </Stack>
        )}
        <Outlet />
      </Container>
    </>
  )
}
