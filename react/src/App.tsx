import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { theme } from "./theme"
import Layout from "./components/Layout"
import SettingsLayout from "./components/SettingsLayout"
import { RequireAdmin, RequireAuth, RequireGuest } from "./components/guards"
import { AuthProvider } from "./lib/auth"
import NotFound from "./pages/NotFound"
import ProductsIndex from "./pages/ProductsIndex"
import ProductShow from "./pages/ProductShow"
import NewReview from "./pages/NewReview"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import EmailConfirmation from "./pages/EmailConfirmation"
import Unsubscribe from "./pages/Unsubscribe"
import WishlistsIndex from "./pages/wishlists/WishlistsIndex"
import WishlistShow from "./pages/wishlists/WishlistShow"
import { EditWishlist, NewWishlist } from "./pages/wishlists/WishlistForm"
import Profile from "./pages/settings/Profile"
import EmailSettings from "./pages/settings/EmailSettings"
import PasswordSettings from "./pages/settings/PasswordSettings"
import Account from "./pages/settings/Account"
import StoreProductsIndex from "./pages/store/products/ProductsIndex"
import StoreProductShow from "./pages/store/products/ProductShow"
import { EditProduct, NewProduct } from "./pages/store/products/ProductForm"
import StoreReviewsIndex from "./pages/store/reviews/ReviewsIndex"
import StoreReviewShow from "./pages/store/reviews/ReviewShow"
import EditReview from "./pages/store/reviews/EditReview"
import StoreUsersIndex from "./pages/store/users/UsersIndex"
import StoreUserShow from "./pages/store/users/UserShow"
import EditUser from "./pages/store/users/EditUser"
import StoreWishlistsIndex from "./pages/store/wishlists/WishlistsIndex"
import StoreWishlistShow from "./pages/store/wishlists/WishlistShow"
import StoreSubscribersIndex from "./pages/store/subscribers/SubscribersIndex"
import StoreSubscriberShow from "./pages/store/subscribers/SubscriberShow"

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<ProductsIndex />} />
              <Route path="products/:id" element={<ProductShow />} />
              <Route path="products/:id/reviews/new" element={<RequireAuth><NewReview /></RequireAuth>} />
  
              <Route path="session/new" element={<Login />} />
              <Route path="sign_up" element={<RequireGuest><SignUp /></RequireGuest>} />
              <Route path="passwords/new" element={<ForgotPassword />} />
              <Route path="passwords/:token/edit" element={<ResetPassword />} />
              <Route path="email/confirmations/:token" element={<EmailConfirmation />} />
              <Route path="unsubscribe" element={<Unsubscribe />} />
  
              <Route path="wishlists" element={<RequireAuth><WishlistsIndex /></RequireAuth>} />
              <Route path="wishlists/new" element={<RequireAuth><NewWishlist /></RequireAuth>} />
              <Route path="wishlists/:id" element={<WishlistShow />} />
              <Route path="wishlists/:id/edit" element={<RequireAuth><EditWishlist /></RequireAuth>} />
  
              <Route path="settings" element={<RequireAuth><SettingsLayout /></RequireAuth>}>
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<Profile />} />
                <Route path="email" element={<EmailSettings />} />
                <Route path="password" element={<PasswordSettings />} />
                <Route path="user" element={<Account />} />
              </Route>
  
              {/* Admins Only */}
              <Route path="store" element={<RequireAdmin><SettingsLayout /></RequireAdmin>}>
                <Route index element={<Navigate to="products" replace />} />
                <Route path="products" element={<StoreProductsIndex />} />
                <Route path="products/new" element={<NewProduct />} />
                <Route path="products/:id" element={<StoreProductShow />} />
                <Route path="products/:id/edit" element={<EditProduct />} />
                <Route path="reviews" element={<StoreReviewsIndex />} />
                <Route path="reviews/:id" element={<StoreReviewShow />} />
                <Route path="reviews/:id/edit" element={<EditReview />} />
                <Route path="users" element={<StoreUsersIndex />} />
                <Route path="users/:id" element={<StoreUserShow />} />
                <Route path="users/:id/edit" element={<EditUser />} />
                <Route path="wishlists" element={<StoreWishlistsIndex />} />
                <Route path="wishlists/:id" element={<StoreWishlistShow />} />
                <Route path="subscribers" element={<StoreSubscribersIndex />} />
                <Route path="subscribers/:id" element={<StoreSubscriberShow />} />
              </Route>
  
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
