json.(review, :id, :rating, :body)
json.user do
  json.(review.user, :id, :full_name)
end
json.product do
  json.(review.product, :id, :name)
end
json.images review.images do |image|
  json.signed_id image.signed_id
  json.url url_for(image)
  json.thumbnail_url url_for(image.variant(resize_to_limit: [ 150, 150 ]))
end
