json.array! @products do |product|
  json.(product, :id, :name, :inventory_count, :reviews_count)
  json.rating product.rating.to_f
end
