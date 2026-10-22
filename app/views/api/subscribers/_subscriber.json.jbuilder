json.(subscriber, :id, :email)
json.subscribed_on l(subscriber.created_at, format: :long)
json.product do
  json.(subscriber.product, :id, :name)
end
