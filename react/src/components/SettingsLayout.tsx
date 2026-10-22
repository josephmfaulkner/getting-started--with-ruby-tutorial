import { Link, Outlet } from "react-router"
import { useAuth } from "../lib/auth"

// Sidebar layout for account settings and (for admins) the store admin area
export default function SettingsLayout() {
  const { user } = useAuth()

  return (
    <section className="settings">
      <nav>
        <h4>Account Settings</h4>
        <Link to="/settings/profile">Profile</Link>
        <Link to="/settings/email">Email</Link>
        <Link to="/settings/password">Password</Link>
        <Link to="/settings/user">Account</Link>

        {user?.admin && (
          <>
            <h4>Store Settings</h4>
            <Link to="/store/products">Products</Link>
            <Link to="/store/reviews">Reviews</Link>
            <Link to="/store/users">Users</Link>
            <Link to="/store/subscribers">Subscribers</Link>
            <Link to="/store/wishlists">Wishlists</Link>
          </>
        )}
      </nav>

      <div>
        <Outlet />
      </div>
    </section>
  )
}
