json.partial! "api/products/product", product: @product
json.(@product, :wishlists_count)
json.subscribers_count @product.subscribers.count
# Editable rich text for the Trix editor
json.description_trix_html @product.description&.body&.to_trix_html.to_s
