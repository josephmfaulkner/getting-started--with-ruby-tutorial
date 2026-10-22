json.items wishlist.wishlist_products.includes(:product) do |wishlist_product|
  json.id wishlist_product.id
  json.added_on l(wishlist_product.created_at, format: :long)
  json.product do
    json.(wishlist_product.product, :id, :name)
  end
end
