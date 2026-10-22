json.product do
  json.partial! "api/products/product", product: @product
  json.rating_breakdown(5.downto(1).map { { stars: it, percentage: @product.reviews_count.positive? ? @product.rating_percentage(it) : 0 } })
end
json.reviews @reviews, partial: "api/reviews/review", as: :review
