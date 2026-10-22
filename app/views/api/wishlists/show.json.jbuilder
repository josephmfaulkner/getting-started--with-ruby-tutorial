json.partial! "api/wishlists/wishlist", wishlist: @wishlist
json.partial! "api/wishlists/items", wishlist: @wishlist
json.owned @owned
# Lists the owner can move products to
json.other_wishlists(@owned ? Current.user.wishlists.excluding(@wishlist).map { { id: it.id, name: it.name } } : [])
