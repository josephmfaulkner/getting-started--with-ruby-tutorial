import { Link, Outlet, useLocation } from "react-router"
import { Box, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material"
import type { ReactNode } from "react"
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined"
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined"
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined"
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined"
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutlined"
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined"
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined"
import { useAuth } from "../lib/auth"

function NavItem({ to, icon, children }: { to: string; icon: ReactNode; children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <ListItemButton component={Link} to={to} selected={pathname.startsWith(to)} sx={{ borderRadius: 2, mx: 1 }}>
      <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
      <ListItemText primary={children} />
    </ListItemButton>
  )
}

// Sidebar layout for account settings and (for admins) the store admin area
export default function SettingsLayout() {
  const { user } = useAuth()

  return (
    <Box className="settings" sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "240px 1fr" }, gap: 3, alignItems: "start" }}>
      <Paper sx={{ py: 1 }}>
        <List component="nav" dense subheader={<ListSubheader component="h4" sx={{ bgcolor: "transparent", lineHeight: "36px" }}>Account Settings</ListSubheader>}>
          <NavItem to="/settings/profile" icon={<PersonOutlineIcon />}>Profile</NavItem>
          <NavItem to="/settings/email" icon={<AlternateEmailIcon />}>Email</NavItem>
          <NavItem to="/settings/password" icon={<KeyOutlinedIcon />}>Password</NavItem>
          <NavItem to="/settings/user" icon={<ManageAccountsOutlinedIcon />}>Account</NavItem>

          {user?.admin && (
            <>
              <ListSubheader component="h4" sx={{ bgcolor: "transparent", lineHeight: "36px", mt: 1 }}>Store Settings</ListSubheader>
              <NavItem to="/store/products" icon={<Inventory2OutlinedIcon />}>Products</NavItem>
              <NavItem to="/store/reviews" icon={<RateReviewOutlinedIcon />}>Reviews</NavItem>
              <NavItem to="/store/users" icon={<PeopleOutlineIcon />}>Users</NavItem>
              <NavItem to="/store/subscribers" icon={<MarkEmailUnreadOutlinedIcon />}>Subscribers</NavItem>
              <NavItem to="/store/wishlists" icon={<FavoriteBorderIcon />}>Wishlists</NavItem>
            </>
          )}
        </List>
      </Paper>

      <Box sx={{ minWidth: 0 }}>
        <Outlet />
      </Box>
    </Box>
  )
}
