json.(wishlist, :id, :name, :products_count)
json.param wishlist.to_param
json.user do
  json.(wishlist.user, :id, :full_name)
end
