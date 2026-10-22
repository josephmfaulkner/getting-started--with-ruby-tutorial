// Shapes of the JSON returned by the Rails API (app/views/api/**/*.json.jbuilder)

export interface User {
  id: number
  first_name: string
  last_name: string
  full_name: string
  email_address: string
  admin: boolean
}

export interface SessionPayload {
  user: User | null
  csrf_token: string
}

export interface NoticePayload {
  notice: string
}

export interface NamedRecord {
  id: number
  name: string
}

export interface ProductSummary {
  id: number
  name: string
  inventory_count: number
  description_excerpt: string | null
  thumbnail_url: string | null
}

export interface Product {
  id: number
  name: string
  inventory_count: number
  reviews_count: number
  rating: number
  description_html: string | null
  image_url: string | null
}

export interface ProductPage {
  product: Product & { rating_breakdown: { stars: number; percentage: number }[] }
  reviews: Review[]
}

export interface StoreProduct extends Product {
  wishlists_count: number
  subscribers_count: number
  description_trix_html: string
}

export interface ReviewImage {
  signed_id: string
  url: string
  thumbnail_url: string
}

export interface Review {
  id: number
  rating: number
  body: string
  user: { id: number; full_name: string }
  product: NamedRecord
  images: ReviewImage[]
}

export interface WishlistRef {
  id: number
  param: string
}

export interface Wishlist extends WishlistRef {
  name: string
  products_count: number
  user: { id: number; full_name: string }
}

export interface WishlistItem {
  id: number
  added_on: string
  product: NamedRecord
}

export interface WishlistDetail extends Wishlist {
  items: WishlistItem[]
  owned?: boolean
  other_wishlists?: NamedRecord[]
}

export interface Subscriber {
  id: number
  email: string
  subscribed_on: string
  product: NamedRecord
}

export interface UserOption {
  id: number
  full_name: string
}
